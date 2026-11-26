import type Stripe from 'stripe'
import { joinPetNames } from './calendar/layout'
import { sendOrderConfirmation } from './email'
import { loadProjectContext } from './generation'
import { createLuluOrder, isLuluConfigured } from './lulu'
import { buildCoverPdf, buildInteriorPdf } from './print/pdf'
import { fetchStoredImage, uploadPrintFile } from './storage'
import { getStripe } from './stripe'
import { styleById } from './style-meta'
import { createAdminSupabaseClient } from './supabase-admin'
import type { CalendarPage, Order, ShippingAddress } from './types'
import { isUuid } from './validate'

// ---------------------------------------------------------------------------
// Stripe session → order row
// ---------------------------------------------------------------------------

type SessionWithShipping = Stripe.Checkout.Session & {
  // Location of shipping details differs between Stripe API versions.
  shipping_details?: { name?: string | null; address?: Stripe.Address | null } | null
  collected_information?: { shipping_details?: { name?: string | null; address?: Stripe.Address | null } | null } | null
}

function shippingFromSession(session: SessionWithShipping): ShippingAddress | null {
  const details = session.collected_information?.shipping_details ?? session.shipping_details
  const address = details?.address ?? session.customer_details?.address
  if (!address?.line1) return null
  return {
    name: details?.name || session.customer_details?.name || '',
    address1: address.line1,
    address2: address.line2 || undefined,
    city: address.city || '',
    state_code: address.state || '',
    country_code: address.country || 'US',
    zip: address.postal_code || '',
    phone: session.customer_details?.phone || undefined,
  }
}

/**
 * Create the order for a paid Checkout Session, once. Called by the Stripe
 * webhook and (as a fallback if the webhook is slow) by the success page.
 * Returns the order plus whether this call created it.
 */
export async function ensureOrderForSession(sessionId: string): Promise<{ order: Order; created: boolean } | null> {
  const supabase = createAdminSupabaseClient()

  const findExisting = async () => {
    const { data } = await supabase.from('orders').select('*').eq('stripe_checkout_session_id', sessionId).maybeSingle()
    return data as Order | null
  }
  const existing = await findExisting()
  if (existing) return { order: existing, created: false }

  const session = (await getStripe().checkout.sessions.retrieve(sessionId)) as SessionWithShipping
  if (session.payment_status !== 'paid') return null
  const projectId = session.metadata?.project_id
  if (!isUuid(projectId)) return null

  const shipping = shippingFromSession(session)
  const { data: inserted, error } = await supabase
    .from('orders')
    .insert({
      project_id: projectId,
      user_id: null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      status: 'paid',
      shipping_name: shipping?.name || null,
      shipping_address: shipping,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency || 'usd',
      email: session.customer_details?.email || null,
      quantity: Math.max(1, Number(session.metadata?.quantity) || 1),
    })
    .select('*')
    .single()

  if (error || !inserted) {
    // Lost a race with the other caller (unique index on the session id).
    const raced = await findExisting()
    if (raced) return { order: raced, created: false }
    throw new Error(`Failed to create order: ${error?.message}`)
  }

  await supabase.from('projects').update({ status: 'ordered', updated_at: new Date().toISOString() }).eq('id', projectId)
  const order = inserted as Order
  await sendOrderConfirmation(order)
  return { order, created: true }
}

// ---------------------------------------------------------------------------
// Order → print files → printer
// ---------------------------------------------------------------------------

/**
 * Build the print PDFs for a paid order and submit it to Lulu.
 * Safe to call again: it does nothing once the order has a Lulu id, and a
 * failed attempt leaves the order in `paid` with `fulfilment_error` set.
 */
export async function fulfilOrder(orderId: string): Promise<Order> {
  const supabase = createAdminSupabaseClient()
  const now = () => new Date().toISOString()

  const { data: orderRow } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle()
  if (!orderRow) throw new Error('Order not found')
  let order = orderRow as Order
  if (order.lulu_order_id || order.status !== 'paid') return order

  const fail = async (message: string): Promise<never> => {
    await supabase.from('orders').update({ fulfilment_error: message.slice(0, 1000), updated_at: now() }).eq('id', orderId)
    throw new Error(message)
  }

  try {
    if (!order.shipping_address?.address1) await fail('Order has no shipping address')

    let { interior_pdf_url: interiorUrl, cover_pdf_url: coverUrl } = order
    if (!interiorUrl || !coverUrl) {
      const ctx = await loadProjectContext(order.project_id)
      if (!ctx) await fail('Project not found')
      const { project, pets } = ctx!

      const { data: pageRows } = await supabase
        .from('calendar_pages')
        .select('*')
        .eq('project_id', order.project_id)
        .eq('status', 'complete')
      const pages = (pageRows ?? []) as CalendarPage[]
      const cover = pages.find((p) => p.page_type === 'cover' && p.cloudinary_url)
      const months = Array.from({ length: 12 }, (_, i) =>
        pages.find((p) => p.page_type === 'month' && p.month_number === i + 1 && p.cloudinary_url)
      )
      if (!cover || months.some((m) => !m)) await fail('Calendar is missing finished pages')

      const style = styleById(project.style)
      const load = async (page: CalendarPage) => (await fetchStoredImage(page.cloudinary_url!)).data
      const input = {
        petNames: pets.length ? pets.map((p) => p.pet.name) : [project.pet_name || 'Your Pet'],
        styleName: style?.name ?? 'Custom',
        accentColor: style?.accentColor ?? '#86672a',
        year: project.start_year,
        petType: new Set(pets.map((p) => p.pet.pet_type)).size === 1 ? pets[0].pet.pet_type : 'other',
        cover: await load(cover!),
        months: [] as Buffer[],
      }
      for (const page of months) input.months.push(await load(page!))

      // The customer's own photos go on the back cover. Best effort: a missing photo never blocks printing.
      const { data: photoRows } = await supabase
        .from('pet_photos')
        .select('cloudinary_url, created_at')
        .eq('project_id', order.project_id)
        .order('created_at')
        .limit(4)
      const photos: Buffer[] = []
      for (const row of photoRows ?? []) {
        try {
          photos.push((await fetchStoredImage(row.cloudinary_url)).data)
        } catch (error) {
          console.error('[fulfil] could not load a reference photo for the back cover:', error)
        }
      }
      Object.assign(input, { photos })

      const coverPdf = await buildCoverPdf(input)
      const interiorPdf = await buildInteriorPdf(input)
      coverUrl = (await uploadPrintFile(orderId, 'cover', coverPdf)).url
      interiorUrl = (await uploadPrintFile(orderId, 'interior', interiorPdf)).url
      await supabase
        .from('orders')
        .update({ cover_pdf_url: coverUrl, interior_pdf_url: interiorUrl, updated_at: now() })
        .eq('id', orderId)
      console.log(`[fulfil] built print files for ${joinPetNames(input.petNames)} (${orderId})`)
    }

    if (!isLuluConfigured()) {
      await fail('Print files are ready but Lulu is not configured — submit manually or set LULU_CLIENT_KEY / LULU_CLIENT_SECRET.')
    }

    const result = await createLuluOrder(order, interiorUrl!, coverUrl!)
    const { data: updated } = await supabase
      .from('orders')
      .update({
        lulu_order_id: String(result.luluOrderId),
        status: 'submitted_to_lulu',
        fulfilment_error: null,
        updated_at: now(),
      })
      .eq('id', orderId)
      .select('*')
      .single()
    order = (updated as Order) ?? order
    return order
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[fulfil] order ${orderId} failed:`, message)
    await supabase.from('orders').update({ fulfilment_error: message.slice(0, 1000), updated_at: now() }).eq('id', orderId)
    throw error
  }
}

/** Fields that are safe to show on the public order-status page. */
export function publicOrderView(order: Order) {
  return {
    id: order.id,
    status: order.status,
    quantity: order.quantity ?? 1,
    amount_cents: order.amount_cents,
    currency: order.currency,
    created_at: order.created_at,
    tracking_number: order.tracking_number,
    tracking_url: order.tracking_url,
    shipping_city: order.shipping_address?.city ?? null,
    shipping_state: order.shipping_address?.state_code ?? null,
    project_id: order.project_id,
  }
}

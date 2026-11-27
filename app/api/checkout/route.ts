import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { jsonError, readJson } from '@/lib/api'
import { joinPetNames } from '@/lib/calendar/layout'
import { PRICING, SHIPPING, SITE } from '@/lib/config'
import { ordersTableReady } from '@/lib/readiness'
import { getStripe, stripeSecretKey } from '@/lib/stripe'
import { styleById } from '@/lib/style-meta'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isUuid } from '@/lib/validate'

type Country = Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry

// Guest checkout: Stripe collects email, phone and a validated shipping address.
export async function POST(request: Request) {
  try {
    const body = await readJson<{ project_id?: unknown; quantity?: unknown }>(request)
    const projectId = body?.project_id
    if (!isUuid(projectId)) return jsonError('project_id is required.', 400)
    const quantity = Math.max(1, Math.min(PRICING.maxCopies, Math.floor(Number(body?.quantity)) || 1))

    // Never take a payment we could not record or fulfil.
    if (!stripeSecretKey() || !(await ordersTableReady())) {
      console.error('checkout: ordering is not configured (Stripe key or database migration missing)')
      return jsonError('Ordering is not open yet. Your calendar is saved — please check back soon.', 503)
    }

    const supabase = createAdminSupabaseClient()
    const [{ data: project }, { data: pets }, { data: pages }] = await Promise.all([
      supabase.from('projects').select('id, style, start_year, pet_name').eq('id', projectId).maybeSingle(),
      supabase.from('pets').select('name').eq('project_id', projectId).order('sort_order'),
      supabase.from('calendar_pages').select('page_type, month_number, status, cloudinary_url').eq('project_id', projectId),
    ])
    if (!project) return jsonError('Calendar not found.', 404)

    const done = (pages ?? []).filter((p) => p.status === 'complete' && p.cloudinary_url)
    const cover = done.find((p) => p.page_type === 'cover')
    const months = new Set(done.filter((p) => p.page_type === 'month').map((p) => p.month_number))
    if (!cover || months.size < 12) return jsonError('Your calendar still has pages to finish.', 409)

    const names = joinPetNames((pets ?? []).map((p) => p.name).filter(Boolean)) || project.pet_name || 'Your pet'
    const style = styleById(project.style)
    const countries = (process.env.SHIPPING_COUNTRIES || 'US')
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean) as Country[]

    const product = (label: string) => ({
      name: `${names} — ${project.start_year} wall calendar${label}`,
      description: `${style?.name ?? 'Custom'} theme · 11 × 8.5 in, Wire-O bound`,
      images: [cover.cloudinary_url as string],
    })
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { quantity: 1, price_data: { currency: PRICING.currency, unit_amount: PRICING.firstCopyCents, product_data: product('') } },
    ]
    if (quantity > 1) {
      line_items.push({
        quantity: quantity - 1,
        price_data: { currency: PRICING.currency, unit_amount: PRICING.extraCopyCents, product_data: product(' (extra copy)') },
      })
    }

    const taxed = process.env.STRIPE_TAX_ENABLED === 'true'
    // Flat rate per order; the customer picks the speed on Stripe's page.
    const shipping_options = Object.values(SHIPPING).map((option) => ({
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        display_name: `${option.name} shipping`,
        fixed_amount: { amount: option.cents, currency: PRICING.currency },
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: option.minDays },
          maximum: { unit: 'business_day' as const, value: option.maxDays },
        },
        metadata: { method: option.method },
        ...(taxed ? { tax_behavior: 'exclusive' as const } : {}),
      },
    }))

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: countries },
      shipping_options,
      phone_number_collection: { enabled: true },
      // Sales tax: turn on once Stripe Tax is set up in the Stripe dashboard (STRIPE_TAX_ENABLED=true).
      ...(taxed ? { automatic_tax: { enabled: true } } : {}),
      metadata: { project_id: projectId, quantity: String(quantity) },
      payment_intent_data: { metadata: { project_id: projectId } },
      success_url: `${SITE.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/checkout?p=${projectId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('checkout error:', error)
    return jsonError('Could not start checkout. Please try again.', 500)
  }
}

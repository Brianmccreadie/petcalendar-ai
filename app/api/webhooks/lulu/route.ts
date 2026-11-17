import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/api'
import { sendShippedEmail } from '@/lib/email'
import { verifyWebhookSignature } from '@/lib/lulu'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isUuid } from '@/lib/validate'

// Lulu PRINT_JOB_STATUS_CHANGED → order status + tracking.
// CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_DELAYED → PRODUCTION_READY
// → IN_PRODUCTION → SHIPPED, with REJECTED / CANCELED as error states.
const STATUS_MAP: Record<string, string> = {
  CREATED: 'submitted_to_lulu',
  UNPAID: 'submitted_to_lulu',
  PAYMENT_IN_PROGRESS: 'submitted_to_lulu',
  PRODUCTION_DELAYED: 'in_production',
  PRODUCTION_READY: 'in_production',
  IN_PRODUCTION: 'in_production',
  SHIPPED: 'shipped',
  REJECTED: 'failed',
  CANCELED: 'failed',
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature =
      request.headers.get('lulu-hmac-sha256') || request.headers.get('x-lulu-signature') || ''
    // Fail closed: an unsigned request must never be able to change an order.
    if (!verifyWebhookSignature(rawBody, signature)) return jsonError('Invalid signature.', 401)

    let body: { topic?: string; data?: Record<string, unknown> }
    try {
      body = JSON.parse(rawBody)
    } catch {
      return jsonError('Invalid JSON.', 400)
    }
    if (body.topic !== 'PRINT_JOB_STATUS_CHANGED' || !body.data) return NextResponse.json({ received: true })

    const data = body.data as {
      id?: number | string
      external_id?: string
      status?: { name?: string }
      line_items?: Array<{ tracking_id?: string; tracking_urls?: string[] }>
    }
    const supabase = createAdminSupabaseClient()

    let order: { id: string; email: string | null; status: string } | null = null
    if (isUuid(data.external_id)) {
      const { data: found } = await supabase.from('orders').select('id, email, status').eq('id', data.external_id).maybeSingle()
      order = found
    }
    if (!order && data.id !== undefined) {
      const { data: found } = await supabase
        .from('orders')
        .select('id, email, status')
        .eq('lulu_order_id', String(data.id))
        .maybeSingle()
      order = found
    }
    if (!order) {
      console.error('lulu webhook: no order for job', data.id, data.external_id)
      return NextResponse.json({ received: true })
    }

    const luluStatus = data.status?.name ?? ''
    const status = STATUS_MAP[luluStatus]
    if (!status) return NextResponse.json({ received: true })

    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
    if (luluStatus === 'SHIPPED') {
      const item = data.line_items?.[0]
      update.tracking_number = item?.tracking_id ?? null
      update.tracking_url = item?.tracking_urls?.[0] ?? null
    }
    if (status === 'failed') update.fulfilment_error = `Lulu reported ${luluStatus}`
    await supabase.from('orders').update(update).eq('id', order.id)

    if (luluStatus === 'SHIPPED' && order.status !== 'shipped') {
      await sendShippedEmail({
        id: order.id,
        email: order.email,
        tracking_url: update.tracking_url as string | null,
        tracking_number: update.tracking_number as string | null,
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('lulu webhook error:', error)
    return jsonError('Internal error.', 500)
  }
}

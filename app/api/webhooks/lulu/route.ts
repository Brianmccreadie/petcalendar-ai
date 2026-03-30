import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { verifyWebhookSignature } from '@/lib/lulu'

/**
 * Lulu xPress Webhook Handler
 * 
 * Receives PRINT_JOB_STATUS_CHANGED events from Lulu.
 * Updates order status and tracking info in our database.
 * 
 * Lulu status flow:
 * CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_DELAYED → 
 * PRODUCTION_READY → IN_PRODUCTION → SHIPPED
 * 
 * Error states: REJECTED, CANCELED
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // Verify HMAC signature
    const signature = request.headers.get('x-lulu-signature') || ''
    if (process.env.LULU_CLIENT_SECRET && signature) {
      if (!verifyWebhookSignature(rawBody, signature)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const { topic, data } = body

    if (topic !== 'PRINT_JOB_STATUS_CHANGED') {
      return NextResponse.json({ received: true })
    }

    const supabase = await createServerSupabaseClient()

    // Find our order by Lulu print job ID or external_id
    const luluJobId = String(data?.id || data?.print_job_id)
    const externalId = data?.external_id

    let order
    if (externalId) {
      // external_id is our order.id
      const { data: found } = await supabase
        .from('orders')
        .select('id')
        .eq('id', externalId)
        .single()
      order = found
    }

    if (!order && luluJobId) {
      const { data: found } = await supabase
        .from('orders')
        .select('id')
        .eq('lulu_order_id', luluJobId)
        .single()
      order = found
    }

    if (!order) {
      console.error('Order not found for Lulu job:', luluJobId, 'external:', externalId)
      return NextResponse.json({ received: true })
    }

    // Map Lulu statuses to our order statuses
    const luluStatus = data?.status?.name || data?.name
    const statusMap: Record<string, string> = {
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

    const newStatus = statusMap[luluStatus]
    if (newStatus) {
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      // Extract tracking info if shipped
      if (luluStatus === 'SHIPPED') {
        const lineItem = data?.line_item_statuses?.[0]
        if (lineItem?.messages) {
          updateData.tracking_number = lineItem.messages.tracking_id || null
          updateData.tracking_url = lineItem.messages.tracking_urls?.[0] || null
        }
      }

      await supabase.from('orders').update(updateData).eq('id', order.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Lulu webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

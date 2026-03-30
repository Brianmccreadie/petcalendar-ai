import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Verify webhook secret if configured
    const webhookSecret = process.env.PRINTFUL_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = request.headers.get('x-printful-signature')
      if (signature !== webhookSecret) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const { type, data } = body
    const supabase = await createServerSupabaseClient()

    const printfulOrderId = String(data?.order?.id || data?.id)

    // Find our order by Printful order ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('printful_order_id', printfulOrderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found for Printful ID:', printfulOrderId)
      return NextResponse.json({ received: true })
    }

    // Map Printful events to our order statuses
    const statusMap: Record<string, string> = {
      order_created: 'submitted_to_printful',
      order_updated: 'submitted_to_printful',
      order_failed: 'failed',
      order_canceled: 'failed',
      order_put_hold: 'submitted_to_printful',
      order_remove_hold: 'submitted_to_printful',
      package_shipped: 'shipped',
      package_returned: 'failed',
    }

    const newStatus = statusMap[type]
    if (newStatus) {
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      // Extract tracking info if available
      if (type === 'package_shipped' && data?.shipment) {
        updateData.tracking_number = data.shipment.tracking_number || null
        updateData.tracking_url = data.shipment.tracking_url || null
      }

      await supabase.from('orders').update(updateData).eq('id', order.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Printful webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createPrintfulOrder } from '@/lib/printful'

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json()
    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Order must be paid before submission' },
        { status: 400 }
      )
    }

    // Fetch completed calendar pages
    const { data: pages, error: pagesError } = await supabase
      .from('calendar_pages')
      .select('*')
      .eq('project_id', order.project_id)
      .eq('status', 'complete')
      .order('page_type')
      .order('month_number')

    if (pagesError || !pages || pages.length === 0) {
      return NextResponse.json(
        { error: 'No completed calendar pages found' },
        { status: 400 }
      )
    }

    // Submit to Printful
    const result = await createPrintfulOrder(order, pages)

    // Update order with Printful ID
    await supabase
      .from('orders')
      .update({
        printful_order_id: String(result.printfulOrderId),
        status: 'submitted_to_printful',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)

    return NextResponse.json({
      status: 'submitted_to_printful',
      printful_order_id: result.printfulOrderId,
    })
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

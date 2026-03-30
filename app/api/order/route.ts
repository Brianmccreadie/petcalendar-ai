import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createLuluOrder } from '@/lib/lulu'

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

    // For Lulu, we need to compose all pages into a single interior PDF
    // and provide a separate cover PDF. The calendar-renderer handles this.
    // For now, we pass the Cloudinary URLs of the composed PDFs.
    //
    // The calendar-renderer should have already generated:
    // 1. An interior PDF (all 12 month spreads)
    // 2. A cover PDF (front + back cover)
    //
    // These URLs should be stored on the project or generated on-demand.

    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', order.project_id)
      .single()

    // TODO: In production, these would be pre-composed PDF URLs from the calendar renderer
    // For now, we use placeholder logic — the actual PDF composition step
    // (combining individual page images into print-ready PDFs) would happen
    // before this endpoint is called.
    const interiorPdfUrl = project?.interior_pdf_url || pages[0]?.cloudinary_url
    const coverPdfUrl = project?.cover_pdf_url || pages.find((p: { page_type: string }) => p.page_type === 'cover')?.cloudinary_url

    if (!interiorPdfUrl || !coverPdfUrl) {
      return NextResponse.json(
        { error: 'Calendar PDFs not yet generated. Please wait for processing to complete.' },
        { status: 400 }
      )
    }

    // Submit to Lulu
    const result = await createLuluOrder(order, interiorPdfUrl, coverPdfUrl)

    // Update order with Lulu order ID
    await supabase
      .from('orders')
      .update({
        lulu_order_id: String(result.luluOrderId),
        status: 'submitted_to_lulu',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)

    return NextResponse.json({
      status: 'submitted_to_lulu',
      lulu_order_id: result.luluOrderId,
    })
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

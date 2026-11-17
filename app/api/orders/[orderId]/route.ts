import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/api'
import { publicOrderView } from '@/lib/orders'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import type { Order } from '@/lib/types'
import { isUuid } from '@/lib/validate'

// Public order status, addressed by the unguessable order id.
export async function GET(_request: Request, ctx: RouteContext<'/api/orders/[orderId]'>) {
  const { orderId } = await ctx.params
  if (!isUuid(orderId)) return jsonError('Order not found.', 404)
  const { data } = await createAdminSupabaseClient().from('orders').select('*').eq('id', orderId).maybeSingle()
  if (!data) return jsonError('Order not found.', 404)
  return NextResponse.json(publicOrderView(data as Order), { headers: { 'Cache-Control': 'no-store' } })
}

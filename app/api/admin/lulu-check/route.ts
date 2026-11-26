import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { jsonError, readJson } from '@/lib/api'
import { validatePrintFiles } from '@/lib/lulu'
import { fulfilOrder } from '@/lib/orders'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isUuid } from '@/lib/validate'

export const maxDuration = 300

// Ask Lulu to validate the print files already built for an order. Orders nothing.
//   curl -X POST $APP_URL/api/admin/lulu-check -H "Authorization: Bearer $ADMIN_SECRET" \
//        -H "Content-Type: application/json" -d '{"order_id":"…"}'
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const ok = Boolean(secret) && given.length === secret!.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret!))
  if (!ok) return jsonError('Unauthorized.', 401)

  const body = await readJson<{ order_id?: unknown; rebuild?: unknown }>(request)
  if (!isUuid(body?.order_id)) return jsonError('order_id is required.', 400)

  // Optionally rebuild the print files with the current layout first. Nothing is ordered.
  if (body.rebuild === true) {
    try {
      await fulfilOrder(body.order_id, { rebuild: true, prepareOnly: true })
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : 'Could not rebuild the print files.', 500)
    }
  }

  const { data: order } = await createAdminSupabaseClient().from('orders').select('interior_pdf_url, cover_pdf_url').eq('id', body.order_id).maybeSingle()
  if (!order?.interior_pdf_url || !order.cover_pdf_url) return jsonError('This order has no print files yet.', 404)

  try {
    return NextResponse.json(await validatePrintFiles(order.interior_pdf_url, order.cover_pdf_url))
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Lulu check failed.', 500)
  }
}

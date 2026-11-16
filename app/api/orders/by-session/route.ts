import { NextRequest, NextResponse, after } from 'next/server'
import { jsonError } from '@/lib/api'
import { ensureOrderForSession, fulfilOrder, publicOrderView } from '@/lib/orders'

export const maxDuration = 300

// Used by the success page. If the Stripe webhook has not landed yet, this
// creates the order itself (after verifying payment with Stripe).
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id') ?? ''
  if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) return jsonError('Invalid session.', 400)
  try {
    const result = await ensureOrderForSession(sessionId)
    if (!result) return jsonError('Payment not completed.', 402)
    if (result.created) {
      const orderId = result.order.id
      after(async () => {
        try {
          await fulfilOrder(orderId)
        } catch {
          // stored on the order
        }
      })
    }
    return NextResponse.json(publicOrderView(result.order), { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('orders/by-session error:', error)
    return jsonError('Could not load your order.', 500)
  }
}

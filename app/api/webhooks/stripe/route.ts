import { NextResponse, after } from 'next/server'
import type Stripe from 'stripe'
import { jsonError } from '@/lib/api'
import { ensureOrderForSession, fulfilOrder } from '@/lib/orders'
import { getStripe, stripeWebhookSecret } from '@/lib/stripe'

// Building print PDFs happens in after(); give it time.
export const maxDuration = 300

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')
  const secret = stripeWebhookSecret()
  if (!signature || !secret) return jsonError('Missing signature.', 400)

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.error('stripe webhook: bad signature', error)
    return jsonError('Invalid signature.', 400)
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      const result = await ensureOrderForSession(session.id)
      if (result) {
        const orderId = result.order.id
        after(async () => {
          try {
            await fulfilOrder(orderId)
          } catch {
            // Logged and stored on the order; retry via POST /api/admin/fulfil.
          }
        })
      }
    } catch (error) {
      console.error('stripe webhook: order creation failed', error)
      return jsonError('Order creation failed.', 500) // Stripe will retry
    }
  }

  return NextResponse.json({ received: true })
}

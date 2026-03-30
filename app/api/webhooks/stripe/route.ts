import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata || {}

    const supabase = await createServerSupabaseClient()

    // Create order record
    const { error } = await supabase.from('orders').insert({
      project_id: metadata.project_id || null,
      user_id: metadata.user_id,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
      status: 'paid',
      shipping_name: metadata.shipping_name || null,
      shipping_address: {
        name: metadata.shipping_name,
        address1: metadata.shipping_address1,
        address2: metadata.shipping_address2 || undefined,
        city: metadata.shipping_city,
        state_code: metadata.shipping_state,
        country_code: metadata.shipping_country || 'US',
        zip: metadata.shipping_zip,
      },
      amount_cents: session.amount_total ?? 3999,
      currency: session.currency || 'usd',
    })

    if (error) {
      console.error('Failed to create order:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Update project status
    if (metadata.project_id) {
      await supabase
        .from('projects')
        .update({ status: 'ordered', updated_at: new Date().toISOString() })
        .eq('id', metadata.project_id)
    }

    // Trigger Printful submission (fire-and-forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    fetch(`${appUrl}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: metadata.project_id }),
    }).catch((err) => console.error('Printful submission trigger failed:', err))
  }

  return NextResponse.json({ received: true })
}

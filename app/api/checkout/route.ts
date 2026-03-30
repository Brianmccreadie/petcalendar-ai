import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Pet Calendar',
              description:
                '12-month AI-generated pet calendar. Premium matte paper, free shipping.',
            },
            unit_amount: 3999,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        project_id: body.project_id || '',
        shipping_name: body.shipping?.name || '',
        shipping_address1: body.shipping?.address1 || '',
        shipping_address2: body.shipping?.address2 || '',
        shipping_city: body.shipping?.city || '',
        shipping_state: body.shipping?.state_code || '',
        shipping_zip: body.shipping?.zip || '',
        shipping_country: body.shipping?.country_code || 'US',
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import Stripe from 'stripe'

let stripe: Stripe | null = null

/** Lazily created so builds work without the key; throws at request time if it is missing. */
export function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('Stripe is not configured (STRIPE_SECRET_KEY)')
    stripe = new Stripe(key, { typescript: true })
  }
  return stripe
}

import Stripe from 'stripe'

let stripe: Stripe | null = null

/**
 * A secret as pasted into a settings page is often not just the secret: it may
 * carry the variable name ("STRIPE_SECRET_KEY=rk_live_…"), quotes or stray
 * spaces. Keep only the part that is the credential.
 */
function clean(value: string | undefined, pattern: RegExp): string {
  const raw = (value ?? '').trim().replace(/^["']|["']$/g, '')
  return raw.match(pattern)?.[0] ?? raw
}

export function stripeSecretKey(): string {
  return clean(process.env.STRIPE_SECRET_KEY, /(sk|rk)_(live|test)_[A-Za-z0-9]+/)
}

export function stripeWebhookSecret(): string {
  return clean(process.env.STRIPE_WEBHOOK_SECRET, /whsec_[A-Za-z0-9]+/)
}

/** 'live', 'test', or null when the key is missing or not recognisable as a Stripe key. */
export function stripeMode(): 'live' | 'test' | null {
  return (stripeSecretKey().match(/^(?:sk|rk)_(live|test)_/)?.[1] as 'live' | 'test' | undefined) ?? null
}

/** Lazily created so builds work without the key; throws at request time if it is missing. */
export function getStripe(): Stripe {
  if (!stripe) {
    const key = stripeSecretKey()
    if (!key) throw new Error('Stripe is not configured (STRIPE_SECRET_KEY)')
    stripe = new Stripe(key, { typescript: true })
  }
  return stripe
}

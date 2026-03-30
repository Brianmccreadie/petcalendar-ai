import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      typescript: true,
    })
  }
  return _stripe
}

/**
 * Format an amount in cents to a display string.
 */
export function formatAmountForDisplay(
  amountCents: number,
  currency: string = 'usd'
): string {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amountCents / 100)
}

/**
 * Convert a display amount (dollars) to the smallest currency unit (cents).
 */
export function formatAmountForStripe(
  amount: number,
  currency: string = 'usd'
): number {
  const zeroDecimalCurrencies = [
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg',
    'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
  ]
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount)
  }
  return Math.round(amount * 100)
}

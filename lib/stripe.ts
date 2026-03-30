import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-expect-error - Stripe SDK may not have this version type yet
  apiVersion: '2025-12-18.acacia',
  typescript: true,
})

/**
 * Format an amount in cents to a display string.
 * e.g. 3999 → "$39.99"
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
 * e.g. 39.99 → 3999
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

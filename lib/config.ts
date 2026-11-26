// Central product + site configuration. Prices are in cents.

export const SITE = {
  name: 'Epic Pet Calendars',
  /** The brand's own address, used where the name of the site is printed or shown. */
  domain: 'epicpetcalendars.com',
  // Falls back to the Vercel production domain when NEXT_PUBLIC_APP_URL is not set.
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
  supportEmail: 'hello@epicpetcalendars.com',
  /** The legal name and postal address of the business, shown in the footer and legal pages once set. */
  legalName: process.env.NEXT_PUBLIC_BUSINESS_NAME || '',
  legalAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '',
  tagline: 'Your pet, starring in every month of the year.',
  description:
    'Upload a few photos of your pet, pick from dozens of themes, and we turn them into a 12-month wall calendar — printed on heavyweight paper and shipped free.',
}

export const PRICING = {
  firstCopyCents: 3999,
  extraCopyCents: 2999,
  maxCopies: 10,
  currency: 'usd',
}

export const LIMITS = {
  maxPets: 4,
  minPhotosPerPet: 1,
  maxPhotosPerPet: 5,
  maxPhotoBytes: 12 * 1024 * 1024,
  maxPetNameLength: 24,
  /**
   * Customers can redo or revise a page as often as they like. This is only a
   * quiet backstop so a runaway script cannot generate images without end; the
   * interface never mentions a count.
   */
  maxRevisionsPerPage: 40,
  /** Typed note plus any quick fixes the customer ticked. */
  maxInstructionLength: 900,
  /** What a customer can type themselves. */
  maxNoteLength: 400,
  /** New calendars one visitor may start per 24h (cost guard for free previews). */
  maxProjectsPerDay: 5,
  /** A page stuck in "generating" longer than this is treated as failed. */
  staleGenerationMs: 6 * 60 * 1000,
}

export const PRODUCT_SPECS = [
  { label: 'Size', value: '11 × 8.5 in, opens to 11 × 17 in' },
  { label: 'Paper', value: '100# coated, full colour' },
  { label: 'Binding', value: 'Wire-O with hanging hole' },
  { label: 'Pages', value: 'Cover + 12 months' },
  { label: 'Shipping', value: 'Free in the US' },
]

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function orderTotalCents(quantity: number): number {
  const q = Math.max(1, Math.min(PRICING.maxCopies, Math.floor(quantity) || 1))
  return PRICING.firstCopyCents + (q - 1) * PRICING.extraCopyCents
}

/** Calendars made from September onward default to next year. */
export function defaultCalendarYear(now: Date = new Date()): number {
  return now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear()
}

/** The years a calendar can be made for: the coming one and the one after. */
export function calendarYearOptions(now: Date = new Date()): number[] {
  const first = defaultCalendarYear(now)
  return [first, first + 1]
}

import { PRODUCT_SPECS } from '@/lib/config'

const DETAILS = [
  ['Opens to 11 × 17 in', 'Each month is two pages: your artwork on top, the dates underneath.'],
  ['11 × 8.5 in closed', 'US Letter, landscape. Fits a standard envelope-sized mailer.'],
  ['Wire-O binding with a hanging hole', 'Lies flat, flips cleanly and hangs on one nail.'],
  ['100# coated paper, full colour', 'Heavy, smooth stock, the weight of a good art print.'],
  ['28 pages', 'Front cover, twelve artwork pages, twelve date pages, back cover.'],
] as const

/**
 * What the customer is physically buying: a dimensioned drawing of the open
 * calendar and its specs. Shown wherever someone is about to commit.
 */
export default function ProductDetails({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`} aria-label="Product details">
      <h2 className="font-display text-2xl">What you’re getting</h2>
      <p className="mt-1 text-sm text-ink-soft">A printed wire-bound wall calendar, made to order and shipped to you.</p>

      <div className={`mt-5 grid gap-6 ${compact ? '' : 'sm:grid-cols-[9.5rem_1fr]'} sm:items-start`}>
        {/* the open calendar, to scale, with its measurements */}
        <svg viewBox="0 0 190 250" className="mx-auto w-36 shrink-0 sm:w-full" role="img" aria-label="Diagram: the open calendar is 11 inches wide and 17 inches tall; each page is 8.5 inches tall.">
          <g fontFamily="var(--font-sans)" fontSize="9" fontWeight="600" fill="var(--color-ink-soft)">
            <circle cx="80" cy="6" r="2.5" fill="var(--color-ink)" />
            <rect x="25" y="12" width="110" height="85" fill="var(--color-paper-deep)" stroke="var(--color-ink)" strokeWidth="1.2" />
            <text x="80" y="58" textAnchor="middle">Your artwork</text>
            <line x1="25" y1="97" x2="135" y2="97" stroke="var(--color-ink)" strokeWidth="2.4" strokeDasharray="1.5 4" strokeLinecap="round" />
            <rect x="25" y="97" width="110" height="85" fill="#fdfbf6" stroke="var(--color-ink)" strokeWidth="1.2" />
            {Array.from({ length: 5 }, (_, r) => (
              <line key={`r${r}`} x1="32" x2="128" y1={118 + r * 12} y2={118 + r * 12} stroke="var(--color-rule)" strokeWidth="0.8" />
            ))}
            {Array.from({ length: 8 }, (_, c) => (
              <line key={`c${c}`} x1={32 + c * 13.7} x2={32 + c * 13.7} y1="118" y2="166" stroke="var(--color-rule)" strokeWidth="0.8" />
            ))}
            <text x="32" y="112" fontFamily="var(--font-display)" fontSize="11" fontWeight="400" fill="var(--color-ink)">
              Month
            </text>
            {/* width */}
            <line x1="25" y1="196" x2="135" y2="196" stroke="var(--color-ink-soft)" strokeWidth="1" />
            <path d="M25 192v8M135 192v8" stroke="var(--color-ink-soft)" strokeWidth="1" />
            <text x="80" y="210" textAnchor="middle">11 in wide</text>
            {/* height */}
            <line x1="148" y1="12" x2="148" y2="182" stroke="var(--color-ink-soft)" strokeWidth="1" />
            <path d="M144 12h8M144 97h8M144 182h8" stroke="var(--color-ink-soft)" strokeWidth="1" />
            <text x="154" y="58">8.5 in</text>
            <text x="154" y="143">8.5 in</text>
            <text x="80" y="232" textAnchor="middle" fill="var(--color-ink)">17 in tall when open</text>
          </g>
        </svg>

        <dl className="space-y-3">
          {DETAILS.map(([title, body]) => (
            <div key={title}>
              <dt className="font-semibold leading-snug">{title}</dt>
              <dd className="text-sm text-ink-soft">{body}</dd>
            </div>
          ))}
          <div>
            <dt className="font-semibold leading-snug">{PRODUCT_SPECS.find((s) => s.label === 'Shipping')?.value ?? 'US shipping'}</dt>
            <dd className="text-sm text-ink-soft">Printed in 3–5 business days, then shipped with tracking.</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

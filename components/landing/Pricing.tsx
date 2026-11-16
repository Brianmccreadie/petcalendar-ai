import Link from 'next/link'
import { ArrowRight, Check } from '@/components/icons'
import { LIMITS, PRICING, PRODUCT_SPECS, formatPrice } from '@/lib/config'

const included = [
  'Cover + 12 months of custom artwork',
  `Redo or revise any page — ${LIMITS.maxRevisionsPerPage} free rounds each`,
  'Pet name and dates typeset for print',
  'Free US shipping with tracking',
]

export default function Pricing() {
  const [dollars, cents] = formatPrice(PRICING.firstCopyCents).replace('$', '').split('.')
  return (
    <section id="pricing" className="bg-pine text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-32">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-marigold">Pricing</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">One calendar. One price. Nothing to pay until you love it.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-paper/75">
            Creating and previewing is free. You only check out once every page looks right.
          </p>

          <dl className="mt-10 grid max-w-lg grid-cols-1 gap-x-8 sm:grid-cols-2">
            {PRODUCT_SPECS.map((spec) => (
              <div key={spec.label} className="border-t border-paper/20 py-3.5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-paper/55">{spec.label}</dt>
                <dd className="mt-0.5 font-semibold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[1.75rem] bg-paper p-8 text-ink shadow-lift sm:p-10">
          <p className="font-display text-xl font-bold">The wall calendar</p>
          <p className="mt-3 flex items-start">
            <span className="display mt-2 text-3xl">$</span>
            <span className="display text-[5.5rem] leading-none">{dollars}</span>
            <span className="display mt-2 text-3xl">.{cents}</span>
          </p>
          <p className="mt-1 text-ink-soft">
            Shipping included · extra copies {formatPrice(PRICING.extraCopyCents)} each
          </p>

          <ul className="mt-8 space-y-3.5">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 font-semibold">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pine text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/create" className="btn btn-primary btn-lg mt-9 w-full">
            Make my calendar <ArrowRight />
          </Link>
          <p className="mt-4 text-center text-sm text-muted">Takes about five minutes. No account, no card to start.</p>
        </div>
      </div>
    </section>
  )
}

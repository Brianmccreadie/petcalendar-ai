import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { ArrowRight } from '@/components/icons'
import { LIMITS, PRICING, PRODUCT_SPECS, formatPrice } from '@/lib/config'

const included = [
  'Cover and twelve months of custom artwork',
  `Redo or revise any page — ${LIMITS.maxRevisionsPerPage} free rounds each`,
  'Your pet’s name and every date typeset for print',
  'Free US shipping with tracking',
]

export default function Pricing() {
  const [dollars, cents] = formatPrice(PRICING.firstCopyCents).replace('$', '').split('.')
  return (
    <section id="pricing" className="on-dark grain relative">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(50rem 30rem at 50% 0%, rgb(201 164 92 / 0.13), transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-[84rem] px-5 py-28 sm:px-8 lg:py-40">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">Pricing</p>
          <h2 className="display mx-auto mt-6 max-w-3xl text-5xl sm:text-7xl">
            Nothing to pay until you <span className="display-italic text-gold">love</span> it.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-16 grid max-w-5xl overflow-hidden rounded-[1.25rem] border border-ivory/12 bg-night-2 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-between border-b border-ivory/12 p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/45">The wall calendar</p>
                <p className="mt-6 flex items-start font-display leading-none">
                  <span className="mt-3 text-4xl text-ivory/70">$</span>
                  <span className="text-[8rem] tracking-tight sm:text-[9.5rem]">{dollars}</span>
                  <span className="mt-3 text-4xl text-ivory/70">.{cents}</span>
                </p>
                <p className="mt-2 text-ivory/55">Shipping included · extra copies {formatPrice(PRICING.extraCopyCents)} each</p>
              </div>
              <div className="mt-10">
                <Link href="/create" className="btn btn-gold btn-lg w-full">
                  Create your calendar <ArrowRight size={18} />
                </Link>
                <p className="mt-4 text-center text-xs text-ivory/40">No account and no card needed to start.</p>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <ul>
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-4 border-b border-ivory/10 py-4 first:pt-0">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="text-ivory/85">{item}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                {PRODUCT_SPECS.slice(0, 4).map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">{spec.label}</dt>
                    <dd className="mt-1 text-sm text-ivory/85">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

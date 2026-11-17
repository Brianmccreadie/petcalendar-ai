import Link from 'next/link'
import FlipCalendar from '@/components/calendar/FlipCalendar'
import { ArrowRight } from '@/components/icons'
import { PRICING, defaultCalendarYear, formatPrice } from '@/lib/config'
import { SHOWCASE } from '@/lib/showcase'

export default function Hero() {
  const year = defaultCalendarYear()
  return (
    <section className="on-dark grain relative overflow-hidden">
      {/* gallery spotlight behind the calendar */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 40rem at 78% 38%, rgb(201 164 92 / 0.16), transparent 62%), radial-gradient(40rem 30rem at 10% 100%, rgb(201 164 92 / 0.07), transparent 60%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[84rem] items-center gap-16 px-5 pb-24 pt-14 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:pb-20 lg:pt-10">
        <div>
          <p className="eyebrow animate-rise">The {year} edition</p>
          <h1 className="display mt-7 animate-rise text-[3.4rem] [animation-delay:80ms] sm:text-7xl lg:text-[6.2rem]">
            Twelve months of the one you love <span className="display-italic text-gold">most.</span>
          </h1>
          <p className="lede mt-8 max-w-[34rem] animate-rise [animation-delay:160ms]">
            Upload a few photos and choose a world for them to live in. We create twelve scenes that truly look like your
            pet, typeset every name and date, and print it on heavyweight paper.
          </p>

          <div className="mt-10 flex animate-rise flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:240ms]">
            <Link href="/create" className="btn btn-light btn-lg">
              Create your calendar <ArrowRight size={18} />
            </Link>
            <Link href="/#the-year" className="link-line text-sm font-medium text-ivory">
              See a full year
            </Link>
          </div>

          <dl className="mt-14 grid max-w-xl animate-rise grid-cols-3 border-t border-ivory/15 [animation-delay:320ms]">
            {[
              ['Free', 'to create and preview'],
              [formatPrice(PRICING.firstCopyCents), 'printed and delivered'],
              ['5 min', 'from photos to preview'],
            ].map(([value, label]) => (
              <div key={label} className="border-r border-ivory/15 py-5 pr-4 last:border-r-0 [&:not(:first-child)]:pl-5">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="display block text-3xl sm:text-4xl">{value}</span>
                  <span className="mt-1 block text-xs leading-snug text-ivory/50">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-rise pt-8 [animation-delay:200ms] lg:pt-4">
          <FlipCalendar pages={SHOWCASE.months} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} />
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { ArrowRight, Check } from '@/components/icons'
import { PRICING, defaultCalendarYear, formatPrice } from '@/lib/config'
import HeroCalendar from './HeroCalendar'

export default function Hero() {
  const year = defaultCalendarYear()
  return (
    <section className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <div aria-hidden="true" className="grain absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="animate-rise">
          <p className="eyebrow">{year} calendars · made from your photos</p>
          <h1 className="display mt-5 text-[2.9rem] sm:text-6xl lg:text-[4.6rem]">
            Your pet, starring in{' '}
            <span className="display-italic relative whitespace-nowrap text-persimmon">
              every month
              <svg aria-hidden="true" viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-marigold">
                <path d="M2 9c48-7 96-8 148-5s98 5 148-1" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{' '}
            of the year.
          </h1>
          <p className="lede mt-7 max-w-xl">
            Upload a few photos, pick a theme — wizard, astronaut, secret agent, 47 more — and we turn your pet into
            twelve scenes that actually look like them. Printed on heavyweight paper and shipped free.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/create" className="btn btn-primary btn-lg">
              Make my calendar <ArrowRight />
            </Link>
            <Link href="/#themes" className="btn btn-ghost btn-lg">
              Browse 50 themes
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold text-ink-soft">
            {['Preview every page before you pay', `${formatPrice(PRICING.firstCopyCents)}, shipping included`, 'No account needed'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-pine text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-rise pt-6 [animation-delay:120ms]">
          <HeroCalendar year={year} />
        </div>
      </div>
    </section>
  )
}

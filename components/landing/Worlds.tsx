/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import CoverTitle from '@/components/calendar/CoverTitle'
import FlipCalendar from '@/components/calendar/FlipCalendar'
import GridPage from '@/components/calendar/GridPage'
import WallCalendar from '@/components/calendar/WallCalendar'
import Reveal from '@/components/Reveal'
import { ArrowRight, Plus } from '@/components/icons'
import { PRICING, PRODUCT_SPECS, SITE, defaultCalendarYear, formatPrice } from '@/lib/config'
import { SHOWCASE, SHOWCASE_PLACES } from '@/lib/showcase'
import { WORLDS } from '@/lib/worlds'
import { faqs } from './FAQ'
import ThemeExplorer from './ThemeExplorer'
import WorldSection, { Statement } from './WorldSection'

// The landing page is a journey through eight painted worlds, each borrowed
// from a calendar theme and each carrying one part of the story.

export function MuralWorld() {
  return (
    <WorldSection
      world={WORLDS.hero}
      index="01"
      serif="Your pet’s"
      sans="calendar"
      as="h1"
      priority
      underNav
      bannerClassName="h-[100svh] min-h-[36rem] max-h-[70rem]"
    >
      <Reveal>
        <Statement lead="A custom wall calendar">starring your pet, in any world you choose.</Statement>
        <p className="lede mx-auto mt-8 max-w-xl text-center">
          Upload a few photos, choose a world, and we create thirteen scenes that truly look like your pet — typeset,
          printed on heavyweight paper and delivered.
        </p>
        <div className="mt-10 flex flex-col items-center gap-6">
          <Link href="/create" className="btn btn-outline">
            Make your calendar
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ivory/50">
            Free to preview · {formatPrice(PRICING.firstCopyCents)} printed and delivered
          </p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-3 items-start gap-4 sm:gap-10">
          {[0, 5, 9].map((m, i) => (
            <WallCalendar
              key={m}
              imageUrl={SHOWCASE.months[m].src}
              imageAlt={`${SHOWCASE.months[m].name} page of a sample calendar: ${SHOWCASE.petName} in ${SHOWCASE_PLACES[m]}`}
              month={m + 1}
              year={defaultCalendarYear()}
              caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`}
              className={['-rotate-2 sm:mt-8', 'sm:-mt-2', 'rotate-2 sm:mt-8'][i]}
            />
          ))}
        </div>
      </Reveal>
    </WorldSection>
  )
}

export function VoyageWorld() {
  const year = defaultCalendarYear()
  return (
    <WorldSection world={WORLDS.academy} id="the-year" index="02" serif="One dog," sans="a year of magic">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="text-3xl font-bold tracking-tight sm:text-[2.6rem]">This is the real thing.</p>
          <p className="mt-2 font-display text-[2.1rem] leading-[1.08] sm:text-[3.3rem]">
            One photo of {SHOWCASE.petName}, one theme, and a whole year of her — same markings, same blue eyes, twelve
            different scenes.
          </p>
          <div className="mt-9 flex items-center gap-5">
            <Image
              src="/previews/pet-photoshoot-dog.jpg"
              alt={`The single reference photo of ${SHOWCASE.petName}`}
              width={160}
              height={160}
              sizes="80px"
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
            <p className="max-w-xs text-sm text-ink-soft">
              The only thing we started with. Everything else on this page is her finished{' '}
              <strong className="font-semibold text-ink">{SHOWCASE.styleName}</strong> calendar.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <FlipCalendar pages={SHOWCASE.months} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} tone="light" />
        </Reveal>
      </div>

      <ol className="mt-24 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        {SHOWCASE.months.map((page, i) => (
          <li key={page.month}>
            <Reveal delay={(i % 4) * 90}>
              <figure className="group">
                <WallCalendar
                  imageUrl={page.src}
                  imageAlt={`${page.name}: ${SHOWCASE.petName} in ${SHOWCASE_PLACES[i]}`}
                  month={page.month}
                  year={year}
                  caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`}
                  className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                />
                <figcaption className="mt-5 flex items-baseline justify-between">
                  <span className="font-display text-2xl">{page.name}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink/50">{SHOWCASE_PLACES[i]}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ol>
    </WorldSection>
  )
}

const steps = [
  ['Show us who they are', 'Three to five clear photos — face, profile, full body. More than one pet? They can share the year or star together.'],
  ['Choose their world', 'Fifty themes, each with its own scene for every month: a January that feels like January, a December that feels like the holidays.'],
  ['Direct the final cut', 'Review the cover and all twelve months. Redo a page, ask for a change, keep the version you love. Then we print and ship.'],
]

export function CosmosWorld() {
  return (
    <WorldSection world={WORLDS.cosmos} id="how-it-works" index="03" serif="Three" sans="small steps">
      <Reveal>
        <Statement lead="From camera roll">to wall, in about five minutes of your time.</Statement>
      </Reveal>
      <ol className="mx-auto mt-16 max-w-5xl">
        {steps.map(([title, body], i) => (
          <li key={title} className="border-t border-ink/15 last:border-b">
            <Reveal delay={i * 80}>
              <div className="grid gap-4 py-9 md:grid-cols-[7rem_1fr_1.1fr] md:items-baseline md:gap-10 lg:py-11">
                <span className="display-italic text-5xl text-gold-deep lg:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-4xl leading-none lg:text-5xl">{title}</h3>
                <p className="max-w-md text-ink/65">{body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </WorldSection>
  )
}

export function DeepWorld() {
  return (
    <WorldSection world={WORLDS.deep} id="themes" index="04" serif="Fifty" sans="worlds">
      <Reveal>
        <Statement lead="Choose the one">they were always meant to rule.</Statement>
      </Reveal>
      <ThemeExplorer />
    </WorldSection>
  )
}

const craft = [
  ['A likeness, not a lookalike', 'Every page is generated from several of your photos at once, holding markings, colouring and proportions steady from January to December.'],
  ['Words set in real type', 'The artwork is deliberately text-free. Your pet’s name, each month and every date are typeset separately, so nothing is ever misspelled or misnumbered.'],
  ['Dates you can trust', 'The grid is computed for the year you choose, with US holidays and a few pet days marked. What you preview is exactly what goes to press.'],
]

export function AcademyWorld() {
  const year = defaultCalendarYear()
  return (
    <WorldSection world={WORLDS.voyage} index="05" serif="Set in" sans="real type">
      <Reveal>
        <Statement lead="AI paints the picture.">We set the type.</Statement>
      </Reveal>
      <div className="mt-20 grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <div className="relative pb-[16%] pr-[8%]">
            <div className="relative aspect-[11/8.5] overflow-hidden rounded-[2px] shadow-stage">
              <img src={SHOWCASE.cover} alt={`Sample calendar cover: ${SHOWCASE.petName} ${year}`} className="h-full w-full object-cover" loading="lazy" />
              <CoverTitle petNames={[SHOWCASE.petName]} year={year} styleName={SHOWCASE.styleName} petType="dog" />
            </div>
            <div className="absolute bottom-0 right-0 w-[40%] overflow-hidden rounded-[2px] shadow-stage">
              <GridPage month={10} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} />
            </div>
          </div>
        </Reveal>
        <dl>
          {craft.map(([title, body], i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="border-t border-ink/15 py-7">
                <dt className="font-display text-3xl">{title}</dt>
                <dd className="mt-2 max-w-lg text-ink/65">{body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </WorldSection>
  )
}

const included = [
  'Cover and twelve months of custom artwork',
  'Redo or revise any page, as often as you like',
  'Your pet’s name and every date typeset for print',
  'Free US shipping with tracking',
]

export function CourtWorld() {
  const [dollars, cents] = formatPrice(PRICING.firstCopyCents).replace('$', '').split('.')
  return (
    <WorldSection world={WORLDS.court} id="pricing" index="06" serif="A royal" sans="bargain">
      <Reveal>
        <Statement lead="Nothing to pay">until you love every page.</Statement>
      </Reveal>
      <Reveal delay={120}>
        <div className="mx-auto mt-16 grid max-w-5xl overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white shadow-lift lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-between border-b border-ink/12 p-8 sm:p-12 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">The wall calendar</p>
              <p className="mt-6 flex items-start font-display leading-none">
                <span className="mt-3 text-4xl text-ink/70">$</span>
                <span className="text-[8rem] tracking-tight sm:text-[9.5rem]">{dollars}</span>
                <span className="mt-3 text-4xl text-ink/70">.{cents}</span>
              </p>
              <p className="mt-2 text-ink/60">Shipping included · extra copies {formatPrice(PRICING.extraCopyCents)} each</p>
            </div>
            <div className="mt-10">
              <Link href="/create" className="btn btn-primary btn-lg w-full">
                Make your calendar <ArrowRight size={18} />
              </Link>
              <p className="mt-4 text-center text-xs text-ink/45">No account and no card needed to start.</p>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <ul>
              {included.map((item) => (
                <li key={item} className="flex items-start gap-4 border-b border-ink/10 py-4 first:pt-0">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" />
                  <span className="text-ink/85">{item}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {PRODUCT_SPECS.slice(0, 4).map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/45">{spec.label}</dt>
                  <dd className="mt-1 text-sm text-ink/85">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </WorldSection>
  )
}

export function HearthWorld() {
  return (
    <WorldSection world={WORLDS.hearth} id="faq" index="07" serif="Good" sans="to know">
      <div className="mx-auto max-w-3xl">
        <div className="border-t border-ink">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[1.7rem] leading-tight [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/25 transition-all duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-ivory">
                  <Plus size={16} strokeWidth={1.5} />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 leading-relaxed text-ink-soft">{faq.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-ink-soft">
          Something else? Write to{' '}
          <a className="link-line text-ink" href={`mailto:${SITE.supportEmail}`}>
            {SITE.supportEmail}
          </a>
        </p>
      </div>
    </WorldSection>
  )
}

export function HeavensWorld() {
  return (
    <WorldSection world={WORLDS.heavens} index="08" serif="Make it" sans="official">
      <Reveal>
        <Statement lead="They’re already">the star of the house.</Statement>
        <div className="mt-10 flex flex-col items-center gap-6">
          <Link href="/create" className="btn btn-outline">
            Make your calendar
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">About five minutes · free to preview</p>
        </div>
      </Reveal>
    </WorldSection>
  )
}

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
import Cutout from './Cutout'
import { faqs } from './FAQ'
import ThemeExplorer from './ThemeExplorer'
import WorldSection, { Statement } from './WorldSection'

// The homepage is a paper collage: flat grounds of sky blue, white and blush,
// with oil-painted animals cut out of their canvases and pinned around the
// content — standing behind the headline, perched on cards, trotting along
// edges. Positions are percentages and clamps so the cast holds together from
// a phone to a wide desktop; the smallest screens simply get fewer of them.

/** Shared clamp sizes so the cast scales as one troupe. */
const size = {
  xl: 'w-[clamp(11rem,25vw,25rem)]',
  lg: 'w-[clamp(8rem,17vw,17rem)]',
  md: 'w-[clamp(6rem,13vw,13rem)]',
  sm: 'w-[clamp(4.5rem,9vw,9rem)]',
}

export function MuralWorld() {
  const year = defaultCalendarYear()
  return (
    <section className="relative -mt-16 overflow-x-clip bg-gradient-to-b from-[#a9cff0] via-[#d7e9f8] to-white text-ink">
      <div className="relative mx-auto flex min-h-[100svh] max-w-[110rem] flex-col items-center justify-center px-4 pb-[clamp(5rem,12vh,9rem)] pt-24">
        {/* sky */}
        <Cutout name="cloud1" eager className="-left-[8%] top-[9%] w-[46vw] max-w-[44rem] opacity-90" depth={0.12} bob={14} />
        <Cutout name="cloud2" eager className="-right-[10%] top-[34%] w-[52vw] max-w-[50rem] opacity-90" depth={0.18} bob={17} delay={0.2} />
        <Cutout name="cloud2" eager flip className="-left-[14%] bottom-[14%] hidden w-[40vw] max-w-[38rem] opacity-80 md:block" depth={0.1} bob={19} />

        {/* behind the headline */}
        <Cutout name="astronaut" eager className={`left-[2%] top-[13%] ${size.lg} max-sm:w-[34vw]`} depth={0.7} rotate={-9} bob={9} delay={0.15} />
        <Cutout name="cherub" eager className={`right-[5%] top-[12%] ${size.md} max-sm:w-[26vw]`} depth={0.85} rotate={6} bob={6} delay={0.3} />
        <Cutout name="cherub2" eager className={`left-[27%] top-[8%] hidden ${size.sm} sm:block`} depth={0.5} rotate={-4} bob={7} delay={0.45} />
        <Cutout name="corgi" eager className={`right-[22%] top-[17%] hidden ${size.md} md:block`} depth={0.9} rotate={-6} bob={7} delay={0.5} />
        <Cutout
          name="king"
          eager
          className="left-1/2 top-[clamp(4.5rem,9vh,6rem)] -ml-[clamp(5rem,11vw,11rem)] w-[clamp(10rem,22vw,22rem)]"
          depth={0.3}
          bob={0}
          delay={0.05}
        />

        <div className="relative z-10 mt-[clamp(8rem,19vh,12rem)] text-center">
          <h1 className="collage-title drop-shadow-[0_2px_0_rgb(255_255_255/0.35)]">
            <span className="serif">Your pet’s</span>
            <span className="sans">calendar</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
            A custom wall calendar starring your pet, in any world you choose. Upload a few photos and preview the whole
            year for free.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/create" className="btn btn-primary btn-lg">
              Make your calendar <ArrowRight size={18} />
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
              Free to preview · {formatPrice(PRICING.firstCopyCents)} printed and delivered
            </p>
          </div>
        </div>

        {/* in front, flanking the call to action */}
        <Cutout name="pirate" eager className={`bottom-[3%] left-[2%] z-20 ${size.lg} max-sm:w-[30vw]`} depth={0.55} rotate={-3} bob={0} delay={0.35} />
        <Cutout name="wizard" eager className={`bottom-0 left-[14%] z-20 hidden ${size.md} sm:block`} depth={0.75} rotate={4} bob={0} delay={0.5} />
        <Cutout name="bunny" eager className={`-bottom-[1%] left-[25%] z-20 hidden ${size.sm} lg:block`} depth={0.9} rotate={-5} bob={0} delay={0.65} />
        <Cutout name="pig" eager className={`bottom-[1%] right-[22%] z-20 hidden ${size.md} md:block`} depth={0.9} rotate={3} bob={0} delay={0.6} />
        <Cutout name="duchess" eager className={`bottom-[1%] right-[11%] z-20 hidden ${size.md} sm:block`} depth={0.7} rotate={-2} bob={0} delay={0.45} />
        <Cutout name="sheriff" eager flip className={`bottom-[3%] right-[1%] z-20 ${size.lg} max-sm:w-[30vw]`} depth={0.5} rotate={3} bob={0} delay={0.3} />
      </div>

      {/* the product itself, hung right under the headline */}
      <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-8 sm:pt-20 lg:pb-32">
        <Cutout name="musketeer" className={`left-[40%] top-[calc(2.9rem-clamp(6rem,13vw,13rem)*1.08)] z-10 sm:top-[calc(4.9rem-clamp(6rem,13vw,13rem)*1.08)] ${size.md}`} depth={0.15} bob={0} />
        <Cutout name="dachshund" flip className={`-bottom-2 right-[2%] z-10 hidden ${size.md} md:block`} depth={0.4} bob={0} />
        <Reveal>
          <div className="grid grid-cols-3 items-start gap-4 sm:gap-10">
            {[0, 5, 9].map((m, i) => (
              <WallCalendar
                key={m}
                imageUrl={SHOWCASE.months[m].src}
                imageAlt={`${SHOWCASE.months[m].name} page of a sample calendar: ${SHOWCASE.petName} in ${SHOWCASE_PLACES[m]}`}
                month={m + 1}
                year={year}
                caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`}
                className={['-rotate-2 sm:mt-8', 'sm:-mt-2', 'rotate-2 sm:mt-8'][i]}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function VoyageWorld() {
  const year = defaultCalendarYear()
  return (
    <WorldSection
      id="the-year"
      bg="bg-white"
      serif="One dog,"
      sans="twelve looks"
      roomy
      headingCast={<Cutout name="garland" className="bottom-[78%] left-1/2 -ml-[36%] w-[72%]" depth={0.15} bob={10} />}
      cast={
        <>
          <Cutout name="cloud1" className="-right-[12%] top-[2%] w-[38vw] max-w-[34rem] opacity-70" depth={0.15} bob={16} />
          <Cutout name="corgi" flip className={`-left-[2%] top-[46%] hidden ${size.lg} xl:block`} depth={0.8} rotate={8} bob={7} />
          <Cutout name="siamese" className={`-right-[3%] bottom-[4%] hidden ${size.lg} xl:block`} depth={0.6} rotate={-4} bob={0} />
        </>
      }
    >
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="text-3xl font-bold tracking-tight sm:text-[2.6rem]">This is the real thing.</p>
          <p className="mt-2 font-display text-[2.1rem] leading-[1.08] sm:text-[3.3rem]">
            A photo of {SHOWCASE.petName}, one theme, and a whole year of {SHOWCASE.petName} — same curls, same button
            nose, twelve different looks.
          </p>
          <div className="mt-9 flex items-center gap-5">
            <Image
              src={SHOWCASE.reference}
              alt={`The reference photo of ${SHOWCASE.petName}`}
              width={160}
              height={160}
              sizes="80px"
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
            <p className="max-w-xs text-sm text-ink-soft">
              Where it started. This is {SHOWCASE.petName}’s finished{' '}
              <strong className="font-semibold text-ink">{SHOWCASE.styleName}</strong> calendar, made right here.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative">
            <FlipCalendar pages={SHOWCASE.months} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} tone="light" />
            <Cutout name="poodle" className="-left-[4%] bottom-[9%] z-10 hidden w-[30%] sm:block" depth={0.25} bob={0} />
          </div>
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
                <figcaption className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
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
  ['Show us who they are', 'Three to five clear photos — face, profile, full body. More than one pet? They can share the year or star together.', 'dachshund'],
  ['Choose their world', 'Fifty themes, each with its own scene for every month: a January that feels like January, a December that feels like the holidays.', 'wizard'],
  ['Direct the final cut', 'Review the cover and all twelve months. Redo a page, ask for a change, keep the version you love. Then we print and ship.', 'sorceress'],
] as const

export function CosmosWorld() {
  return (
    <WorldSection
      id="how-it-works"
      bg="bg-[#e6f2fc]"
      serif="Three"
      sans="small steps"
      cast={
        <>
          <Cutout name="astronaut" flip className={`-right-[3%] top-[3%] ${size.lg} max-sm:w-[30vw]`} depth={0.8} rotate={10} bob={9} />
          <Cutout name="cloud2" className="-left-[14%] top-[10%] w-[44vw] max-w-[40rem] opacity-80" depth={0.15} bob={18} />
        </>
      }
    >
      <Reveal>
        <Statement lead="From camera roll">to wall, in about five minutes of your time.</Statement>
      </Reveal>
      <ol className="mx-auto mt-36 grid max-w-6xl gap-x-6 gap-y-32 md:mt-44 md:grid-cols-3 lg:gap-x-10">
        {steps.map(([title, body, mascot], i) => (
          <li key={title}>
            <Reveal delay={i * 110}>
              <div className={`relative rounded-[1.5rem] bg-white p-8 pt-12 shadow-lift ${['md:-rotate-1', 'md:mt-10', 'md:rotate-1'][i]}`}>
                {/* each step has someone sitting on it */}
                <Cutout
                  name={mascot}
                  flip={i === 0}
                  className={['bottom-[calc(100%-2.6rem)] right-6 w-[46%]', 'bottom-[calc(100%-2.2rem)] left-1/2 -ml-[19%] w-[38%]', 'bottom-[calc(100%-1.6rem)] left-6 w-[27%]'][i]}
                  depth={0.12}
                  bob={0}
                  delay={i * 0.12}
                />
                <span className="display-italic text-5xl text-gold-deep lg:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-4xl leading-none">{title}</h3>
                <p className="mt-4 text-ink-soft">{body}</p>
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
    <WorldSection
      id="themes"
      bg="bg-[#fdeef3]"
      serif="Fifty"
      sans="worlds"
      cast={
        <>
          <Cutout name="pirate" flip className={`-left-[1%] top-[5%] hidden ${size.lg} lg:block`} depth={0.6} rotate={4} bob={0} />
          <Cutout name="cherub2" flip className={`right-[6%] top-[4%] ${size.md} max-sm:w-[24vw]`} depth={0.9} rotate={8} bob={6} />
          <Cutout name="bunny" className={`-right-[1%] bottom-[3%] hidden ${size.md} lg:block`} depth={0.5} bob={0} />
        </>
      }
    >
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
    <WorldSection
      bg="bg-white"
      serif="Set in"
      sans="real type"
      cast={<Cutout name="cloud1" flip className="-left-[10%] top-[4%] w-[36vw] max-w-[32rem] opacity-70" depth={0.15} bob={15} />}
    >
      <Reveal>
        <Statement lead="AI paints the picture.">We set the type.</Statement>
      </Reveal>
      <div className="mt-24 grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <div className="relative pb-[16%] pr-[8%]">
            {/* a cat that has clearly decided the cover is hers */}
            <Cutout name="siamese" flip className="bottom-[calc(100%-16%-1.4rem)] left-[6%] z-10 w-[42%]" depth={0.1} bob={0} />
            <div className="relative aspect-[11/8.5] overflow-hidden rounded-[2px] shadow-stage">
              <img src={SHOWCASE.cover} alt={`Sample calendar cover: ${SHOWCASE.petName} ${year}`} className="h-full w-full object-cover" loading="lazy" />
              <CoverTitle petNames={[SHOWCASE.petName]} year={year} styleName={SHOWCASE.styleName} petType="dog" />
            </div>
            <div className="absolute bottom-0 right-0 w-[40%] overflow-hidden rounded-[2px] shadow-stage">
              <GridPage month={10} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} />
            </div>
            <Cutout name="bunny" flip className="-bottom-[2%] left-[2%] z-10 w-[20%]" depth={0.3} bob={0} />
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
    <WorldSection
      id="pricing"
      bg="bg-[#e6f2fc]"
      serif="A royal"
      sans="bargain"
      cast={
        <>
          <Cutout name="cherub" flip className={`left-[5%] top-[6%] ${size.md} max-sm:w-[24vw]`} depth={0.9} rotate={-8} bob={6} />
          <Cutout name="cloud1" className="-right-[10%] top-[16%] w-[40vw] max-w-[36rem] opacity-80" depth={0.15} bob={17} />
        </>
      }
    >
      <Reveal>
        <Statement lead="Nothing to pay">until you love every page.</Statement>
      </Reveal>
      <Reveal delay={120}>
        <div className="relative mx-auto mt-32 max-w-5xl">
          {/* the court has gathered on top of the price */}
          <Cutout name="king" className="bottom-[calc(100%-1.4rem)] left-[6%] w-[clamp(7rem,19%,12rem)]" depth={0.1} bob={0} />
          <Cutout name="duchess" className="bottom-[calc(100%-1.2rem)] right-[7%] w-[clamp(6rem,16%,10rem)]" depth={0.1} bob={0} delay={0.15} />
          <Cutout name="pig" flip className={`-bottom-[7%] -left-[5%] z-10 hidden ${size.md} md:block`} depth={0.3} bob={0} delay={0.3} />
          <div className="relative grid overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white shadow-lift lg:grid-cols-[1fr_1.1fr]">
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
        </div>
      </Reveal>
    </WorldSection>
  )
}

export function HearthWorld() {
  return (
    <WorldSection
      id="faq"
      bg="bg-[#fdeef3]"
      serif="Good"
      sans="to know"
      cast={
        <>
          <Cutout name="sheriff" className={`-left-[1%] bottom-[10%] hidden ${size.lg} xl:block`} depth={0.5} rotate={-3} bob={0} />
          <Cutout name="musketeer" flip className={`right-[1%] top-[20%] hidden ${size.lg} xl:block`} depth={0.7} rotate={3} bob={0} />
          <Cutout name="cloud2" flip className="-right-[16%] top-[2%] w-[42vw] max-w-[38rem] opacity-70" depth={0.15} bob={18} />
        </>
      }
    >
      <div className="relative mx-auto max-w-3xl">
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
    <section className="relative overflow-x-clip bg-gradient-to-b from-white via-[#d7e9f8] to-[#a9cff0] text-ink">
      <div className="relative mx-auto flex min-h-[46rem] max-w-[110rem] flex-col items-center justify-center px-4 pb-[clamp(9rem,24vh,16rem)] pt-56 text-center sm:min-h-[56rem] lg:pt-72">
        <Cutout name="cloud1" className="-left-[8%] top-[18%] w-[46vw] max-w-[42rem] opacity-90" depth={0.14} bob={15} />
        <Cutout name="cloud2" className="-right-[12%] top-[40%] w-[50vw] max-w-[46rem] opacity-90" depth={0.2} bob={18} />
        <Cutout name="cherub" className={`left-[8%] top-[12%] ${size.md} max-sm:w-[26vw]`} depth={0.9} rotate={-8} bob={6} />
        <Cutout name="cherub2" className={`right-[9%] top-[9%] ${size.md} max-sm:w-[26vw]`} depth={0.8} rotate={6} bob={7} delay={0.2} />
        <Cutout name="garland" className="left-1/2 top-[3%] -ml-[clamp(7rem,13vw,13rem)] w-[clamp(14rem,26vw,26rem)]" depth={0.2} bob={11} />

        <h2 className="collage-title relative z-10 !text-[clamp(3.2rem,11vw,11rem)]">
          <span className="serif">Make it</span>
          <span className="sans">official</span>
        </h2>
        <p className="relative z-10 mx-auto mt-7 max-w-md text-lg text-ink-soft sm:text-xl">They’re already the star of the house.</p>
        <div className="relative z-10 mt-8 flex flex-col items-center gap-4">
          <Link href="/create" className="btn btn-primary btn-lg">
            Make your calendar <ArrowRight size={18} />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">About five minutes · free to preview</p>
        </div>

        {/* the whole troupe, lined up along the bottom for the curtain call */}
        <Cutout name="pirate" className={`bottom-0 left-[1%] z-20 ${size.md} max-sm:w-[24vw]`} depth={0.4} bob={0} />
        <Cutout name="poodle" className={`bottom-0 left-[12%] z-20 hidden ${size.md} md:block`} depth={0.5} bob={0} delay={0.08} />
        <Cutout name="wizard" className={`bottom-0 left-[24%] z-20 ${size.sm} max-sm:w-[20vw]`} depth={0.6} bob={0} delay={0.16} />
        <Cutout name="sorceress" className={`bottom-0 left-[34%] z-20 hidden ${size.sm} lg:block`} depth={0.7} bob={0} delay={0.24} />
        <Cutout name="king" className={`bottom-0 left-1/2 z-20 -ml-[clamp(3.5rem,7vw,7rem)] w-[clamp(7rem,14vw,14rem)]`} depth={0.5} bob={0} delay={0.3} />
        <Cutout name="pig" className={`bottom-0 right-[30%] z-20 hidden ${size.sm} lg:block`} depth={0.7} bob={0} delay={0.36} />
        <Cutout name="duchess" className={`bottom-0 right-[20%] z-20 ${size.sm} max-sm:w-[20vw]`} depth={0.6} bob={0} delay={0.42} />
        <Cutout name="dachshund" className={`bottom-0 right-[9%] z-20 hidden ${size.md} md:block`} depth={0.5} bob={0} delay={0.5} />
        <Cutout name="sheriff" flip className={`bottom-0 right-0 z-20 ${size.md} max-sm:w-[24vw]`} depth={0.4} bob={0} delay={0.58} />
      </div>
    </section>
  )
}

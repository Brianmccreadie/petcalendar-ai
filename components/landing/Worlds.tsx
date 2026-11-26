import Image from 'next/image'
import Link from 'next/link'
import Art from '@/components/calendar/Art'
import BackCover from '@/components/calendar/BackCover'
import CoverTitle from '@/components/calendar/CoverTitle'
import FlipCalendar from '@/components/calendar/FlipCalendar'
import GridPage from '@/components/calendar/GridPage'
import WallCalendar from '@/components/calendar/WallCalendar'
import Reveal from '@/components/Reveal'
import { ArrowRight, Plus } from '@/components/icons'
import { PRICING, PRODUCT_SPECS, SITE, defaultCalendarYear, formatPrice } from '@/lib/config'
import { SHOWCASE, SHOWCASE_PLACES } from '@/lib/showcase'
import { CALENDAR_STYLES } from '@/lib/types'
import Cutout from './Cutout'
import { faqs } from './FAQ'
import ThemeExplorer from './ThemeExplorer'
import WorldSection, { Backdrop, Seam, Statement } from './WorldSection'

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
    <>
      <section className="relative isolate -mt-16 overflow-x-clip text-ivory">
        {/* the painted world everything else is pinned onto */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-[#27406b]">
          <Image src="/art/panorama.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[50%_60%]" />
          {/* an even dark veil so white type holds everywhere on the painting */}
          <div className="absolute inset-0 bg-[#0b1730]/30" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0f2140]/55 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[110rem] flex-col items-center justify-center px-4 pb-[clamp(8rem,20vh,13rem)] pt-20">
          {/* far away */}
          <Cutout name="saturn" eager className="-left-[3%] top-[6%] w-[clamp(7rem,17vw,17rem)]" depth={0.14} rotate={-8} bob={20} />
          <Cutout name="moon" eager className="left-[19%] top-[30%] hidden w-[clamp(2.5rem,4.5vw,4.5rem)] md:block" depth={0.1} bob={0} />
          <Cutout name="castle" eager className="right-[13%] top-[30%] hidden w-[clamp(7rem,15vw,15rem)] md:block" depth={0.2} bob={16} delay={0.2} />
          <Cutout name="balloon" eager className="right-[2%] top-[26%] hidden w-[clamp(4rem,8vw,8rem)] lg:block" depth={0.3} rotate={4} bob={11} delay={0.4} />
          <Cutout name="galleon" eager className="left-[6%] top-[44%] hidden w-[clamp(7rem,15vw,15rem)] sm:block" depth={0.22} rotate={-2} bob={9} delay={0.3} />
          <Cutout name="cloud1" eager className="-left-[10%] top-[16%] w-[42vw] max-w-[40rem]" depth={0.18} bob={14} />
          <Cutout name="cloud2" eager className="-right-[12%] top-[40%] w-[50vw] max-w-[48rem]" depth={0.24} bob={17} delay={0.2} />

          {/* in the air */}
          <Cutout name="astronaut" eager className={`left-[4%] top-[13%] ${size.lg} max-sm:w-[34vw]`} depth={0.7} rotate={-9} bob={9} delay={0.15} />
          <Cutout name="cherub" eager className={`right-[5%] top-[10%] ${size.md} max-sm:w-[26vw]`} depth={0.85} rotate={6} bob={6} delay={0.3} />
          <Cutout name="cherub2" eager className={`left-[29%] top-[8%] hidden ${size.sm} sm:block`} depth={0.5} rotate={-4} bob={7} delay={0.45} />
          <Cutout name="corgi" eager className={`right-[24%] top-[16%] hidden ${size.md} md:block`} depth={0.9} rotate={-6} bob={7} delay={0.5} />

          {/* behind the headline */}
          <Cutout
            name="king"
            eager
            className="left-1/2 top-[clamp(4.5rem,9vh,6rem)] -ml-[clamp(5rem,11vw,11rem)] w-[clamp(10rem,22vw,22rem)]"
            depth={0.3}
            bob={0}
            delay={0.05}
          />

          <div className="relative z-10 mt-[clamp(8rem,19vh,12rem)] text-center">
            <h1 className="collage-title [text-shadow:0_3px_0_rgb(8_18_40/0.35),0_10px_40px_rgb(8_18_40/0.85)]">
              <span className="serif">Custom pet</span>
              <span className="sans">calendars</span>
            </h1>
            {/* the words that matter sit on their own plaque, never straight on the painting */}
            <div className="mx-auto mt-7 max-w-xl rounded-[1.5rem] bg-[#0b1730]/70 px-6 py-6 shadow-[0_24px_60px_-20px_rgb(8_18_40/0.8)] backdrop-blur-md sm:px-9 sm:py-7">
              <p className="text-lg font-medium leading-snug text-white sm:text-xl">
                Turn photos of your pet into a printed wall calendar. Upload three photos, pick a theme, and preview the
                whole year in minutes.
              </p>
              <div className="mt-5 flex flex-col items-center gap-3">
                <Link href="/create" className="btn btn-light btn-lg">
                  Make your calendar <ArrowRight size={18} />
                </Link>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">Three photos · five minutes · free to preview</p>
              </div>
            </div>
          </div>

          {/* on the ground, flanking the call to action */}
          <Cutout name="pirate" eager className={`bottom-[3%] left-[2%] z-20 ${size.lg} max-sm:w-[30vw]`} depth={0.55} rotate={-3} bob={0} delay={0.35} />
          <Cutout name="wizard" eager className={`bottom-0 left-[14%] z-20 hidden ${size.md} sm:block`} depth={0.75} rotate={4} bob={0} delay={0.5} />
          <Cutout name="bunny" eager className={`-bottom-[1%] left-[25%] z-20 hidden ${size.sm} lg:block`} depth={0.9} rotate={-5} bob={0} delay={0.65} />
          <Cutout name="pig" eager className={`bottom-[1%] right-[22%] z-20 hidden ${size.md} md:block`} depth={0.9} rotate={3} bob={0} delay={0.6} />
          <Cutout name="duchess" eager className={`bottom-[1%] right-[11%] z-20 hidden ${size.md} sm:block`} depth={0.7} rotate={-2} bob={0} delay={0.45} />
          <Cutout name="sheriff" eager flip className={`bottom-[3%] right-[1%] z-20 ${size.lg} max-sm:w-[30vw]`} depth={0.5} rotate={3} bob={0} delay={0.3} />
        </div>
      </section>

      {/* the product itself, hung right under the headline */}
      <section className="relative isolate overflow-x-clip text-ink">
        <Backdrop name="sky-cream" />
        <Seam />
        <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-40 lg:pb-32">
          <Cutout name="musketeer" className={`left-[40%] top-[calc(7rem-clamp(6rem,13vw,13rem)*1.08)] z-20 sm:top-[calc(10rem-clamp(6rem,13vw,13rem)*1.08)] ${size.md}`} depth={0.15} bob={0} />
          <Cutout name="dachshund" flip className={`-bottom-2 right-[2%] z-10 hidden ${size.md} md:block`} depth={0.4} bob={0} />
          <Cutout name="balloon" className="-left-[9%] top-[30%] hidden w-[clamp(5rem,10vw,10rem)] xl:block" depth={0.5} rotate={-5} bob={10} />
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
                  sizes="(max-width: 1024px) 33vw, 320px"
                  className={['-rotate-2 sm:mt-8', 'sm:-mt-2', 'rotate-2 sm:mt-8'][i]}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export function VoyageWorld() {
  const year = defaultCalendarYear()
  return (
    <WorldSection
      id="the-year"
      backdrop="sky-cream"
      serif="One pet,"
      sans="twelve looks"
      roomy
      headingCast={<Cutout name="garland" className="bottom-[78%] left-1/2 -ml-[36%] w-[72%]" depth={0.15} bob={10} />}
      cast={
        <>
          <Cutout name="balloon" className="right-[4%] top-[9%] hidden w-[clamp(5rem,10vw,10rem)] md:block" depth={0.6} rotate={5} bob={10} />
          <Cutout name="temple" className="-left-[4%] bottom-0 hidden w-[clamp(10rem,22vw,22rem)] xl:block" depth={0.2} bob={0} />
          <Cutout name="corgi" flip className={`-left-[2%] top-[46%] hidden ${size.lg} xl:block`} depth={0.8} rotate={8} bob={7} />
          <Cutout name="siamese" className={`-right-[3%] bottom-[4%] hidden ${size.lg} xl:block`} depth={0.6} rotate={-4} bob={0} />
        </>
      }
    >
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="text-3xl font-bold tracking-tight sm:text-[2.6rem]">This is the real thing.</p>
          <p className="mt-2 font-display text-[2.1rem] leading-[1.08] sm:text-[3.3rem]">
            A photo of your pet, one theme, and a whole year of them — same face, same markings, twelve different
            looks.
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
              A real example. This one photo of {SHOWCASE.petName} became the{' '}
              <strong className="font-semibold text-ink">{SHOWCASE.styleName}</strong> calendar below.
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
    </WorldSection>
  )
}

const steps = [
  ['Show us who they are', 'Three to five photos straight from your phone — face, profile, full body. No account, no editing, no skill needed. More than one pet? They can star together.', 'dachshund'],
  ['Choose their world', `${CALENDAR_STYLES.length} themes, each with its own scene for every month: a January that feels like January, a December that feels like the holidays.`, 'wizard'],
  ['Direct the final cut', 'All thirteen pages appear in a few minutes. Redo any of them or ask for a change in plain words, as often as you like. Then we print and ship.', 'sorceress'],
] as const

export function CosmosWorld() {
  return (
    <WorldSection
      id="how-it-works"
      backdrop="sky-blue"
      serif="Three"
      sans="small steps"
      cast={
        <>
          <Cutout name="astronaut" flip className={`-right-[3%] top-[3%] ${size.lg} max-sm:w-[30vw]`} depth={0.8} rotate={10} bob={9} />
          <Cutout name="saturn" className="-left-[5%] top-[14%] hidden w-[clamp(8rem,20vw,20rem)] md:block" depth={0.2} rotate={-10} bob={20} />
          <Cutout name="moon" className="right-[20%] top-[10%] hidden w-[clamp(3rem,6vw,6rem)] md:block" depth={0.3} bob={0} />
          <Cutout name="galleon" flip className="-right-[3%] bottom-[2%] hidden w-[clamp(9rem,18vw,18rem)] lg:block" depth={0.35} rotate={2} bob={9} />
        </>
      }
    >
      <Reveal>
        <Statement lead="It’s honestly this easy.">From camera roll to wall in about five minutes of your time.</Statement>
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
      backdrop="sky-blush"
      serif="Pick their"
      sans="world"
      cast={
        <>
          <Cutout name="pirate" flip className={`-left-[1%] top-[5%] hidden ${size.lg} lg:block`} depth={0.6} rotate={4} bob={0} />
          <Cutout name="cherub2" flip className={`right-[6%] top-[4%] ${size.md} max-sm:w-[24vw]`} depth={0.9} rotate={8} bob={6} />
          <Cutout name="castle" className="right-[16%] top-[7%] hidden w-[clamp(8rem,16vw,16rem)] lg:block" depth={0.25} bob={16} />
          <Cutout name="bunny" className={`-right-[1%] bottom-[3%] hidden ${size.md} lg:block`} depth={0.5} bob={0} />
        </>
      }
    >
      <Reveal>
        <Statement lead={`${CALENDAR_STYLES.length} themes.`}>Find the one they were always meant to rule.</Statement>
      </Reveal>
      <ThemeExplorer />
    </WorldSection>
  )
}

const anatomy = [
  ['11 × 8.5 in closed', 'Opens to 11 × 17 in on the wall.'],
  ['Wire binding, hanging hole', 'Lies flat, flips cleanly, hangs on one nail.'],
  ['Your artwork, full page', 'One finished scene above every month, edge to edge.'],
  ['Real dates you can write in', 'Every day is a box with room for a note. US holidays and a few pet days are marked.'],
  ['Heavy coated paper', '100# stock in full colour, the weight of a good art print.'],
]

export function AcademyWorld() {
  const year = defaultCalendarYear()
  return (
    <WorldSection
      id="what-you-get"
      backdrop="sky-cream"
      serif="No"
      sans="surprises"
      cast={
        <>
          <Cutout name="mesa" className="-right-[6%] bottom-0 hidden w-[clamp(12rem,26vw,26rem)] lg:block" depth={0.15} bob={0} />
          <Cutout name="corgi" className={`right-[7%] top-[12%] hidden ${size.md} md:block`} depth={0.8} rotate={-6} bob={7} />
        </>
      }
    >
      <Reveal>
        <Statement lead="This is exactly what arrives.">A real wall calendar, with real dates, starring your pet.</Statement>
      </Reveal>

      <div className="mt-24 grid items-start gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* the open calendar, large enough to read the dates */}
        <Reveal>
          <div className="relative mx-auto max-w-[34rem]">
            <Cutout name="siamese" flip className="bottom-[calc(100%-1.6rem)] left-[8%] z-10 w-[40%]" depth={0.1} bob={0} />
            <WallCalendar
              imageUrl={SHOWCASE.months[4].src}
              imageAlt={`May page of ${SHOWCASE.petName}’s calendar, open on the wall`}
              month={5}
              year={year}
              caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`}
            />
            <Cutout name="bunny" flip className="-bottom-[3%] -left-[9%] z-10 w-[22%]" depth={0.3} bob={0} />
            <p className="mt-6 text-center text-sm text-ink-soft">Shown open, as it hangs: artwork on top, the month below.</p>
          </div>
        </Reveal>

        <div>
          <dl>
            {anatomy.map(([title, body], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="flex gap-5 border-t border-ink/15 py-6">
                  <span className="display-italic w-9 shrink-0 text-3xl text-gold-deep">{i + 1}</span>
                  <div>
                    <dt className="font-display text-[1.7rem] leading-tight">{title}</dt>
                    <dd className="mt-1 max-w-md text-ink/70">{body}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>

          {/* front, inside, back */}
          <Reveal delay={200}>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <figure>
                <div className="relative aspect-[11/8.5] overflow-hidden rounded-[2px] shadow-lift">
                  <Art src={SHOWCASE.cover} alt={`Front cover: ${SHOWCASE.petName} ${year}`} sizes="(max-width: 768px) 33vw, 200px" />
                  <CoverTitle petNames={[SHOWCASE.petName]} year={year} styleName={SHOWCASE.styleName} petType="dog" />
                </div>
                <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/80">Front cover</figcaption>
              </figure>
              <figure>
                <div className="overflow-hidden rounded-[2px] shadow-lift">
                  <GridPage month={12} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} />
                </div>
                <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/80">Twelve date pages</figcaption>
              </figure>
              <figure>
                <BackCover petNames={[SHOWCASE.petName]} months={SHOWCASE.months.map((m) => m.src)} />
                <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/80">Back cover</figcaption>
              </figure>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-ink-soft">
            The artwork is deliberately text-free: your pet’s name, each month and every date are typeset separately, so
            nothing is ever misspelled or misnumbered. What you preview is what goes to press.
          </p>
        </div>
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
      backdrop="sky-blue"
      serif="A royal"
      sans="bargain"
      cast={
        <>
          <Cutout name="cherub" flip className={`left-[5%] top-[6%] ${size.md} max-sm:w-[24vw]`} depth={0.9} rotate={-8} bob={6} />
          <Cutout name="castle" flip className="-right-[2%] top-[12%] w-[clamp(8rem,18vw,18rem)] max-sm:hidden" depth={0.25} bob={16} />
          <Cutout name="balloon" className="left-[20%] top-[26%] hidden w-[clamp(4rem,7vw,7rem)] lg:block" depth={0.5} rotate={-4} bob={10} />
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
                <p className="mt-2 text-ink/80">Shipping included · extra copies {formatPrice(PRICING.extraCopyCents)} each</p>
              </div>
              <div className="mt-10">
                <Link href="/create" className="btn btn-primary btn-lg w-full">
                  Make your calendar <ArrowRight size={18} />
                </Link>
                <p className="mt-4 text-center text-xs text-ink/70">No account and no card needed to start.</p>
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
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/70">{spec.label}</dt>
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
      backdrop="sky-blush"
      serif="Good"
      sans="to know"
      cast={
        <>
          <Cutout name="sheriff" className={`-left-[1%] bottom-[10%] hidden ${size.lg} xl:block`} depth={0.5} rotate={-3} bob={0} />
          <Cutout name="musketeer" flip className={`right-[1%] top-[20%] hidden ${size.lg} xl:block`} depth={0.7} rotate={3} bob={0} />
          <Cutout name="temple" flip className="-right-[5%] bottom-0 hidden w-[clamp(10rem,20vw,20rem)] lg:block" depth={0.2} bob={0} />
          <Cutout name="galleon" className="-left-[4%] top-[12%] hidden w-[clamp(8rem,15vw,15rem)] lg:block" depth={0.3} rotate={-2} bob={9} />
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
    <section className="relative isolate overflow-x-clip text-ivory">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-[#27406b]">
        <Image src="/art/panorama.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_70%]" />
        <div className="absolute inset-0 bg-[#0b1730]/35" />
      </div>
      <Seam />
      <div className="relative mx-auto flex min-h-[46rem] max-w-[110rem] flex-col items-center justify-center px-4 pb-[clamp(9rem,24vh,16rem)] pt-56 text-center sm:min-h-[56rem] lg:pt-72">
        <Cutout name="castle" className="left-[8%] top-[34%] hidden w-[clamp(8rem,15vw,15rem)] md:block" depth={0.2} bob={16} />
        <Cutout name="balloon" className="right-[12%] top-[30%] hidden w-[clamp(4rem,8vw,8rem)] md:block" depth={0.35} rotate={5} bob={10} />
        <Cutout name="cherub" className={`left-[8%] top-[12%] ${size.md} max-sm:w-[26vw]`} depth={0.9} rotate={-8} bob={6} />
        <Cutout name="cherub2" className={`right-[9%] top-[9%] ${size.md} max-sm:w-[26vw]`} depth={0.8} rotate={6} bob={7} delay={0.2} />

        <h2 className="collage-title relative z-10 !text-[clamp(3.2rem,11vw,11rem)] [text-shadow:0_3px_0_rgb(8_18_40/0.35),0_10px_40px_rgb(8_18_40/0.85)]">
          <span className="serif">Their year</span>
          <span className="sans">starts here</span>
        </h2>
        <p className="relative z-10 mx-auto mt-7 max-w-md rounded-full bg-[#0b1730]/70 px-6 py-3 text-lg font-medium text-white backdrop-blur-md sm:text-xl">Three photos. Five minutes. One very proud pet.</p>
        <div className="relative z-10 mt-8 flex flex-col items-center gap-4">
          <Link href="/create" className="btn btn-light btn-lg shadow-[0_18px_40px_-12px_rgb(8_18_40/0.7)]">
            Make your calendar <ArrowRight size={18} />
          </Link>
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

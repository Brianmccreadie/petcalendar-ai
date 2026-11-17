/* eslint-disable @next/next/no-img-element */
import CoverTitle from '@/components/calendar/CoverTitle'
import GridPage from '@/components/calendar/GridPage'
import Reveal from '@/components/Reveal'
import { coverSubtitle, coverTitle } from '@/lib/calendar/layout'
import { defaultCalendarYear } from '@/lib/config'
import { SHOWCASE } from '@/lib/showcase'

const points = [
  {
    title: 'A likeness, not a lookalike',
    body: 'Every page is generated from several of your photos at once, holding markings, colouring and proportions steady from January to December.',
  },
  {
    title: 'Words set in real type',
    body: 'The artwork is deliberately text-free. Your pet’s name, each month and every date are typeset separately, so nothing is ever misspelled or misnumbered.',
  },
  {
    title: 'Dates you can trust',
    body: 'The grid is computed for the year you choose, with US holidays and a few pet days marked. What you preview is exactly what goes to press.',
  },
]

export default function Craft() {
  const year = defaultCalendarYear()
  return (
    <section className="mx-auto max-w-[84rem] px-5 py-28 sm:px-8 lg:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <div className="relative pb-[16%] pr-[8%]">
            <div className="relative aspect-[11/8.5] overflow-hidden rounded-[2px] shadow-lift">
              <img src={SHOWCASE.cover} alt={`Sample calendar cover: ${SHOWCASE.petName}’s ${year}`} className="h-full w-full object-cover" loading="lazy" />
              <CoverTitle title={coverTitle([SHOWCASE.petName], year)} subtitle={coverSubtitle(SHOWCASE.styleName)} />
            </div>
            <div className="absolute bottom-0 right-0 w-[40%] overflow-hidden rounded-[2px] shadow-lift">
              <GridPage month={10} year={year} caption={`${SHOWCASE.petName} · ${SHOWCASE.styleName}`} />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">The craft</p>
            <h2 className="display mt-6 text-5xl sm:text-7xl">
              AI paints the picture. <span className="display-italic">We set the type.</span>
            </h2>
          </Reveal>
          <dl className="mt-12">
            {points.map((point, i) => (
              <Reveal key={point.title} delay={i * 90}>
                <div className="border-t border-rule py-7">
                  <dt className="font-display text-3xl">{point.title}</dt>
                  <dd className="mt-2 max-w-lg text-ink-soft">{point.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

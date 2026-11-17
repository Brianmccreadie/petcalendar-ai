/* eslint-disable @next/next/no-img-element */
import CoverTitle from '@/components/calendar/CoverTitle'
import GridPage from '@/components/calendar/GridPage'
import { coverSubtitle, coverTitle } from '@/lib/calendar/layout'
import { defaultCalendarYear } from '@/lib/config'

const points = [
  {
    title: 'It has to look like your pet',
    body: 'Every page is generated from several of your photos at once, with their markings, colouring and proportions held constant from January to December.',
  },
  {
    title: 'The words are set in real type',
    body: 'Image models still garble small text. So the artwork is text-free, and your pet’s name, the months and every date are typeset separately — crisp at print size.',
  },
  {
    title: 'Dates you can trust',
    body: 'The grid is computed for the year you choose, with US holidays and a few pet days marked. What you preview is exactly what goes to press.',
  },
]

export default function TypesetSection() {
  const year = defaultCalendarYear()
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-xl pb-24 pr-12 sm:pr-20">
          <div className="relative aspect-[11/8.5] -rotate-2 overflow-hidden rounded-[3px] shadow-lift">
            <img src="/previews/pet-photoshoot-dog.jpg" alt="Sample calendar cover reading Luna’s year" className="h-full w-full object-cover" loading="lazy" />
            <CoverTitle title={coverTitle(['Luna'], year)} subtitle={coverSubtitle('Pet Photoshoot')} />
          </div>
          <div className="absolute bottom-0 right-0 w-[46%] rotate-3 overflow-hidden rounded-[3px] shadow-lift">
            <GridPage month={10} year={year} accent="#c4411c" caption="Luna · Pet Photoshoot" />
          </div>
        </div>

        <div>
          <p className="eyebrow">Made properly</p>
          <h2 className="display mt-4 text-5xl sm:text-6xl">
            AI paints the picture. <span className="display-italic text-ok">We set the type.</span>
          </h2>
          <dl className="mt-10 space-y-8">
            {points.map((point, i) => (
              <div key={point.title} className="flex gap-5">
                <dt className="sr-only">{point.title}</dt>
                <span aria-hidden="true" className="display mt-0.5 text-3xl text-gold-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dd>
                  <h3 className="font-display text-2xl">{point.title}</h3>
                  <p className="mt-1.5 text-ink-soft">{point.body}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

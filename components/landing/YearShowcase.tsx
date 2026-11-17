import Image from 'next/image'
import Reveal from '@/components/Reveal'
import { SHOWCASE, SHOWCASE_PLACES } from '@/lib/showcase'

export default function YearShowcase() {
  return (
    <section id="the-year" className="mx-auto max-w-[84rem] px-5 py-28 sm:px-8 lg:py-40">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <Reveal>
          <p className="eyebrow">One pet · one theme · one year</p>
          <h2 className="display mt-6 text-5xl sm:text-7xl">
            The same dog, <span className="display-italic">everywhere.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex items-start gap-5 lg:justify-end">
            <Image
              src="/previews/pet-photoshoot-dog.jpg"
              alt="The single reference photo of Luna"
              width={160}
              height={160}
              sizes="80px"
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
            <p className="max-w-sm text-ink-soft">
              This is one complete calendar — the <strong className="font-semibold text-ink">{SHOWCASE.styleName}</strong> theme —
              made from this single picture of {SHOWCASE.petName}. Same markings, same blue eyes, twelve different places.
            </p>
          </div>
        </Reveal>
      </div>

      <ol className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
        {SHOWCASE.months.map((page, i) => (
          <li key={page.month}>
            <Reveal delay={(i % 4) * 90}>
              <figure className="group">
                <div className="overflow-hidden rounded-[2px] bg-paper-deep shadow-page">
                  <Image
                    src={page.src}
                    alt={`${page.name}: ${SHOWCASE.petName} in ${SHOWCASE_PLACES[i]}`}
                    width={700}
                    height={525}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between border-t border-rule pt-3">
                  <span className="font-display text-2xl">{page.name}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{SHOWCASE_PLACES[i]}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

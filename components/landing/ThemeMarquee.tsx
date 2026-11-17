import Image from 'next/image'
import { previewSrc, styleById } from '@/lib/style-meta'
import type { PetType } from '@/lib/types'

const rowA: [string, PetType][] = [
  ['superhero-origin', 'dog'], ['wizarding-world', 'cat'], ['tropical-paradise', 'dog'], ['royal-portrait', 'cat'],
  ['pirate-life', 'other'], ['rock-star', 'dog'], ['garden-party', 'cat'], ['wild-west', 'dog'],
]
const rowB: [string, PetType][] = [
  ['secret-agent', 'cat'], ['snow-day', 'dog'], ['cooking-show', 'other'], ['national-park', 'dog'],
  ['high-school-yearbook', 'cat'], ['mythical-quest', 'dog'], ['fashion-week', 'cat'], ['camping-adventures', 'dog'],
]

function Row({ items, reverse }: { items: [string, PetType][]; reverse?: boolean }) {
  // Duplicated once so the -50% translate loops seamlessly.
  const loop = [...items, ...items]
  return (
    <div className={`flex w-max gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
      {loop.map(([id, pet], i) => (
        <figure key={`${id}-${i}`} className="relative w-64 shrink-0 overflow-hidden rounded-[4px] sm:w-80" aria-hidden={i >= items.length}>
          <Image
            src={previewSrc(id, pet)}
            alt={i < items.length ? `${styleById(id)?.name} theme with a ${pet === 'other' ? 'pet' : pet}` : ''}
            width={640}
            height={430}
            sizes="320px"
            className="aspect-[3/2] w-full object-cover"
          />
          <figcaption className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold text-paper backdrop-blur-sm">
            {styleById(id)?.name}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function ThemeMarquee() {
  return (
    <section aria-label="Sample calendar pages" className="space-y-4 overflow-hidden border-y border-rule bg-paper-deep py-6">
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </section>
  )
}

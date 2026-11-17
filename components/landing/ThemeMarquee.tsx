import Image from 'next/image'
import { previewSrc, styleById } from '@/lib/style-meta'
import type { PetType } from '@/lib/types'

const rowA: [string, PetType][] = [
  ['superhero-origin', 'dog'], ['wizarding-world', 'cat'], ['tropical-paradise', 'dog'], ['royal-portrait', 'cat'],
  ['pirate-life', 'other'], ['rock-star', 'dog'], ['garden-party', 'cat'], ['wild-west', 'dog'],
]
const rowB: [string, PetType][] = [
  ['secret-agent', 'cat'], ['snow-day', 'dog'], ['cooking-show', 'other'], ['national-park', 'dog'],
  ['fashion-week', 'cat'], ['mythical-quest', 'dog'], ['underwater-odyssey', 'cat'], ['space-explorer', 'dog'],
]

function Row({ items, reverse }: { items: [string, PetType][]; reverse?: boolean }) {
  // Duplicated once so the -50% translate loops seamlessly.
  const loop = [...items, ...items]
  return (
    <div className={`flex w-max gap-3 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
      {loop.map(([id, pet], i) => (
        <figure key={`${id}-${i}`} className="group relative w-72 shrink-0 overflow-hidden sm:w-[26rem]" aria-hidden={i >= items.length}>
          <Image
            src={previewSrc(id, pet)}
            alt={i < items.length ? `${styleById(id)?.name} theme with a ${pet === 'other' ? 'pet' : pet}` : ''}
            width={832}
            height={624}
            sizes="416px"
            className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent px-4 pb-3 pt-10 font-display text-xl text-ivory">
            {styleById(id)?.name}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function ThemeMarquee() {
  return (
    <section aria-label="Sample calendar pages" className="on-dark space-y-3 overflow-hidden pb-24">
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </section>
  )
}

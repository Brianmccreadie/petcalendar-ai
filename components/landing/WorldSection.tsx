import Image from 'next/image'
import type { ReactNode } from 'react'
import type { World } from '@/lib/worlds'

interface WorldSectionProps {
  world: World
  id?: string
  /** "01" — position of this world on the page. */
  index: string
  total?: string
  /** Light serif line of the title. */
  serif: string
  /** Heavy grotesk line of the title. */
  sans: string
  as?: 'h1' | 'h2'
  priority?: boolean
  /** Pull the painting up underneath the site header (first section only). */
  underNav?: boolean
  /** Extra classes for the painting banner (height etc.). */
  bannerClassName?: string
  children: ReactNode
}

/**
 * One world: a full-bleed painting that dissolves into the world's colour, with
 * the title set across the dissolve so it never covers the animals' faces.
 */
export default function WorldSection({
  world,
  id,
  serif,
  sans,
  as: Heading = 'h2',
  priority,
  underNav,
  bannerClassName = 'h-[92svh] min-h-[34rem] max-h-[64rem]',
  children,
}: WorldSectionProps) {
  const dark = world.tone === 'dark'
  return (
    <section
      id={id}
      className={`relative ${underNav ? '-mt-16' : ''} ${dark ? 'on-dark' : 'world-light text-ink'}`}
      style={{ background: world.color }}
    >
      <div className={`relative overflow-hidden ${bannerClassName}`}>
        <Image
          src={world.art}
          alt={world.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[50%_20%]"
        />
        {/* the painting dissolves into the world's colour */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 46%, ${world.color}b3 72%, ${world.color} 100%)` }}
        />
        {underNav && (
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
        )}
        <div className={`absolute inset-x-0 bottom-[4%] flex flex-col items-center px-4 ${dark ? 'text-ivory' : 'text-ink'}`}>
          <Heading className="world-title drop-shadow-[0_2px_18px_rgb(0_0_0/0.25)]">
            <span className="serif">{serif}</span>
            <span className="sans">{sans}</span>
          </Heading>
          <span aria-hidden="true" className="mt-7 flex flex-col items-center">
            <span className="block h-12 w-px bg-current opacity-80" />
            <span className="-mt-1.5 block h-2 w-2 rotate-45 border-b border-r border-current" />
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[84rem] px-5 pb-28 pt-6 sm:px-8 lg:pb-36">{children}</div>
    </section>
  )
}

/** The big two-voice statement that opens each world's content. */
export function Statement({ lead, children, className = '' }: { lead: string; children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto max-w-3xl text-center ${className}`}>
      <span className="block text-3xl font-bold tracking-tight sm:text-[2.6rem]">{lead}</span>
      <span className="mt-2 block font-display text-[2.1rem] leading-[1.08] sm:text-[3.3rem]">{children}</span>
    </p>
  )
}

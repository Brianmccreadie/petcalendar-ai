import Image from 'next/image'
import type { ReactNode } from 'react'
import type { World } from '@/lib/worlds'

interface WorldSectionProps {
  world: World
  id?: string
  index?: string
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
  const tone = dark ? 'on-dark' : 'world-light text-ink'

  // Every world after the first: the painting sits behind the top of the
  // section and dissolves into its colour, so the content reads inside the scene.
  if (!underNav) {
    return (
      <section id={id} className={`relative overflow-hidden ${tone}`} style={{ background: world.color }}>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[26rem] sm:h-[34rem]">
          <Image src={world.art} alt="" fill sizes="100vw" className="object-cover object-[50%_22%]" />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${world.color}00 0%, ${world.color}8c 45%, ${world.color} 100%)` }}
          />
        </div>
        <div className="relative mx-auto max-w-[84rem] px-5 pb-24 pt-[13rem] sm:px-8 sm:pt-[18rem] lg:pb-32">
          <Heading className={`world-title world-title-sm mb-12 ${dark ? 'text-ivory' : 'text-ink'}`}>
            <span className="serif">{serif}</span>
            <span className="sans">{sans}</span>
          </Heading>
          {children}
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`relative -mt-16 ${tone}`} style={{ background: world.color }}>
      <div className={`relative overflow-hidden ${bannerClassName}`}>
        <Image src={world.art} alt={world.alt} fill priority={priority} sizes="100vw" className="object-cover object-[50%_20%]" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 34%, ${world.color}cc 70%, ${world.color} 100%)` }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
        <div className={`absolute inset-x-0 bottom-[4%] flex flex-col items-center px-4 ${dark ? 'text-ivory' : 'text-ink'}`}>
          <Heading className="world-title drop-shadow-[0_4px_28px_rgb(6_14_32/0.7)]">
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

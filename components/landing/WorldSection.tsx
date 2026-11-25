import type { ReactNode } from 'react'

interface SceneProps {
  id?: string
  /** Background classes for the section, e.g. "bg-white". */
  bg: string
  /** Light serif line of the heading. */
  serif: string
  /** Heavy grotesk line of the heading. */
  sans: string
  /** Cut-outs pinned around this section (positioned against the section itself). */
  cast?: ReactNode
  /** Cut-outs pinned to the heading (positioned against the heading block). */
  headingCast?: ReactNode
  /** Extra space above the heading, for a cut-out that hangs over it. */
  roomy?: boolean
  children: ReactNode
}

/**
 * One scene of the homepage collage: a flat coloured ground, a two-voice
 * heading, and painted cut-outs wandering in around the content.
 */
export default function WorldSection({ id, bg, serif, sans, cast, headingCast, roomy, children }: SceneProps) {
  return (
    <section id={id} className={`paper-grain relative overflow-x-clip text-ink ${bg}`}>
      {cast}
      <div className={`relative mx-auto max-w-[84rem] px-5 pb-24 sm:px-8 lg:pb-36 ${roomy ? 'pt-44 lg:pt-60' : 'pt-24 lg:pt-32'}`}>
        <div className="relative mx-auto mb-14 w-fit">
          {headingCast}
          <h2 className="world-title world-title-sm relative z-10">
            <span className="serif">{serif}</span>
            <span className="sans">{sans}</span>
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}

/** The big two-voice statement that opens each scene's content. */
export function Statement({ lead, children, className = '' }: { lead: string; children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto max-w-3xl text-center ${className}`}>
      <span className="block text-3xl font-bold tracking-tight sm:text-[2.6rem]">{lead}</span>
      <span className="mt-2 block font-display text-[2.1rem] leading-[1.08] sm:text-[3.3rem]">{children}</span>
    </p>
  )
}

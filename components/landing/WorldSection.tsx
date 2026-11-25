import Image from 'next/image'
import type { ReactNode } from 'react'
import Cutout from './Cutout'

interface SceneProps {
  id?: string
  /** Which painted sky the scene is set against. */
  backdrop: 'sky-blue' | 'sky-blush' | 'sky-cream'
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
export default function WorldSection({ id, backdrop, serif, sans, cast, headingCast, roomy, children }: SceneProps) {
  return (
    <section id={id} className="relative isolate overflow-x-clip text-ink">
      <Backdrop name={backdrop} />
      <Seam />
      {cast}
      <div className={`relative mx-auto max-w-[84rem] px-5 pb-24 sm:px-8 lg:pb-36 ${roomy ? 'pt-48 lg:pt-64' : 'pt-32 lg:pt-44'}`}>
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

const FALLBACK = { 'sky-blue': '#dcebf7', 'sky-blush': '#fbe9ee', 'sky-cream': '#f8f3ea' }

/** The painted sky behind a scene: a whole painting, edge to edge, with no fade. */
export function Backdrop({ name }: { name: keyof typeof FALLBACK }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden" style={{ background: FALLBACK[name] }}>
      <Image src={`/art/${name}.jpg`} alt="" fill sizes="100vw" className="object-cover" />
    </div>
  )
}

/** Painted clouds straddling the top edge, so one sky drifts into the next instead of meeting at a line. */
export function Seam() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0">
      {/* each cloud is lifted by most of its own height, so it sits on the seam and barely enters the scene below */}
      <Cutout name="cloud2" className="-left-[8%] top-[calc(clamp(14rem,40vw,34rem)*-0.3)] w-[clamp(14rem,40vw,34rem)]" depth={0.1} bob={0} />
      <Cutout name="cloud1" className="left-[36%] top-[calc(clamp(10rem,26vw,22rem)*-0.5)] w-[clamp(10rem,26vw,22rem)]" depth={0.16} bob={0} />
      <Cutout name="cloud2" flip className="-right-[8%] top-[calc(clamp(14rem,42vw,36rem)*-0.3)] w-[clamp(14rem,42vw,36rem)]" depth={0.12} bob={0} />
    </div>
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

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'

export type CutoutName =
  | 'king' | 'astronaut' | 'pirate' | 'wizard' | 'sheriff' | 'cherub' | 'cherub2'
  | 'duchess' | 'musketeer' | 'sorceress' | 'siamese' | 'pig' | 'bunny'
  | 'dachshund' | 'corgi' | 'poodle' | 'cloud1' | 'cloud2' | 'garland'

interface CutoutProps {
  name: CutoutName
  /** Position and size: Tailwind classes such as "left-[4%] top-10 w-40 lg:w-64". */
  className?: string
  /** 0 = pinned to the page, 1 = nearest the viewer (moves most with pointer and scroll). */
  depth?: number
  /** Resting tilt in degrees. */
  rotate?: number
  /** Mirror the painting so the animal faces the other way. */
  flip?: boolean
  /** Seconds for one slow bob; 0 keeps it still. */
  bob?: number
  /** Stagger for the entrance and the bob, in seconds. */
  delay?: number
  /** Load early (above the fold). */
  eager?: boolean
}

/**
 * One painted animal (or cloud, or garland) cut out of its canvas and pinned to
 * the page like a piece of a paper collage. Purely decorative: positioned by
 * the parent, moved a little by CollageMotion, never in the way of a click.
 */
export default function Cutout({ name, className = '', depth = 0.5, rotate = 0, flip, bob = 8, delay = 0, eager }: CutoutProps) {
  const style = { '--depth': depth, '--rot': `${rotate}deg`, '--bob': `${bob}s`, '--delay': `${delay}s` } as CSSProperties
  return (
    <span aria-hidden="true" data-cutout className={`cutout ${className}`} style={style}>
      <span className="cutout-in">
        <img
          src={`/cutouts/${name}.webp`}
          alt=""
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`cutout-img ${bob ? 'cutout-bob' : ''} ${flip ? '-scale-x-100' : ''}`}
        />
      </span>
    </span>
  )
}

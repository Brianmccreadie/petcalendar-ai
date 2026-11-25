/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'

export type CutoutName =
  | 'king' | 'astronaut' | 'pirate' | 'wizard' | 'sheriff' | 'cherub' | 'cherub2'
  | 'duchess' | 'musketeer' | 'sorceress' | 'siamese' | 'pig' | 'bunny'
  | 'dachshund' | 'corgi' | 'poodle' | 'cloud1' | 'cloud2' | 'garland'
  | 'galleon' | 'saturn' | 'moon' | 'balloon' | 'castle' | 'mesa' | 'temple'

/** Pixel size of each full-size file, so the browser can reserve the space before it loads. */
const SIZE: Record<CutoutName, [number, number]> = {
  astronaut: [880, 674],
  balloon: [493, 880],
  bunny: [523, 880],
  castle: [777, 880],
  cherub: [880, 658],
  cherub2: [880, 668],
  cloud1: [880, 619],
  cloud2: [880, 338],
  corgi: [880, 520],
  dachshund: [880, 662],
  duchess: [834, 880],
  galleon: [880, 726],
  garland: [880, 592],
  king: [752, 880],
  mesa: [880, 535],
  moon: [880, 876],
  musketeer: [752, 880],
  pig: [880, 807],
  pirate: [580, 880],
  poodle: [635, 880],
  saturn: [880, 447],
  sheriff: [626, 880],
  siamese: [880, 529],
  sorceress: [529, 880],
  temple: [880, 862],
  wizard: [691, 880],
}

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
  /** How wide it is drawn, as a `sizes` value, so phones fetch the small file. Defaults to a typical character. */
  sizes?: string
}

/**
 * One painted animal (or cloud, or garland) cut out of its canvas and pinned to
 * the page like a piece of a paper collage. Purely decorative: positioned by
 * the parent, moved a little by CollageMotion, never in the way of a click.
 */
export default function Cutout({ name, className = '', depth = 0.5, rotate = 0, flip, bob = 8, delay = 0, eager, sizes }: CutoutProps) {
  const style = { '--depth': depth, '--rot': `${rotate}deg`, '--bob': `${bob}s`, '--delay': `${delay}s` } as CSSProperties
  return (
    <span aria-hidden="true" data-cutout className={`cutout ${className}`} style={style}>
      <span className="cutout-in">
        <img
          src={`/cutouts/${name}.webp`}
          srcSet={`/cutouts/${name}-sm.webp 440w, /cutouts/${name}.webp 880w`}
          sizes={sizes ?? (name.startsWith('cloud') ? '(max-width: 640px) 60vw, 46vw' : '(max-width: 640px) 34vw, 18vw')}
          width={SIZE[name][0]}
          height={SIZE[name][1]}
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

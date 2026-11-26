import Art from './Art'
import { BACK_COVER as B, MONTH_NAMES, PAGE, backCoverLayout, joinPetNames } from '@/lib/calendar/layout'
import { SITE } from '@/lib/config'

interface BackCoverProps {
  petNames: string[]
  /** Twelve month images in order; missing ones render as blanks. */
  months: (string | null | undefined)[]
  /** The customer's own photos the calendar was made from. */
  photos?: string[]
  year?: number
  styleName?: string
  className?: string
}

const W = PAGE.trimWidth
const H = PAGE.trimHeight
const x = (inches: number) => `${(inches / W) * 100}%`
const y = (inches: number) => `${(inches / H) * 100}%`
/** A length in inches as container-query width units, so type scales with the page. */
const cq = (inches: number) => `${(inches / W) * 100}cqw`
const INK = '#1a1816'
const MUTED = '#6f685e'

/**
 * The printed back cover. Left: the photos it started with, the pet's name and
 * the edition, on a tinted panel. Right: all twelve months. Positions come from
 * backCoverLayout(), the same numbers drawBackCover() in lib/print/pdf.ts uses.
 */
export default function BackCover({ petNames, months, photos = [], year, styleName, className = '' }: BackCoverProps) {
  const L = backCoverLayout(photos.length)
  const name = joinPetNames(petNames)
  // Long names shrink to stay inside the panel, as fitSize() does in print.
  const nameSize = Math.min(B.nameSize, B.panelInner / (Math.max(name.length, 1) * 0.43))
  const edition = [year, styleName ? `${styleName} edition` : null].filter(Boolean).join(' · ')
  const label = { color: MUTED, fontSize: cq(0.105) }

  return (
    <div className={`relative aspect-[11/8.5] overflow-hidden rounded-[3px] bg-[#fdfbf6] shadow-lift [container-type:inline-size] ${className}`} style={{ color: INK }}>
      {/* the story panel */}
      <div className="absolute inset-y-0 left-0" style={{ width: x(B.panelWidth), background: B.panelColor }} />
      {L.photos.length > 0 && (
        <p className="absolute font-semibold uppercase leading-none tracking-[0.14em]" style={{ ...label, left: x(B.panelLeft), top: y(B.labelBaseline - 0.09) }}>
          {L.photos.length === 1 ? 'The photo it started with' : 'The photos it started with'}
        </p>
      )}
      {L.photos.map((box, i) => (
        <div
          key={photos[i]}
          className="absolute bg-white shadow-[0_1px_3px_rgb(26_24_22/0.25)]"
          style={{ left: x(box.x - B.frame), top: y(box.y - B.frame), width: x(box.width + B.frame * 2), height: y(box.height + B.frame * 2), padding: cq(B.frame) }}
        >
          <div className="relative h-full w-full overflow-hidden bg-[#e3dbcb]">
            <Art src={photos[i]} alt="" sizes="(max-width: 768px) 30vw, 240px" />
          </div>
        </div>
      ))}
      <p className="absolute truncate font-display leading-none" style={{ left: x(B.panelLeft), width: x(B.panelInner), top: y(B.nameBaseline - nameSize * 0.78), fontSize: cq(nameSize) }}>
        {name}
      </p>
      {edition && (
        <p className="absolute truncate font-semibold uppercase leading-none tracking-[0.14em]" style={{ ...label, left: x(B.panelLeft), width: x(B.panelInner), top: y(B.editionBaseline - 0.09) }}>
          {edition}
        </p>
      )}
      <p className="absolute font-semibold leading-none" style={{ left: x(B.panelLeft), top: y(B.footerBaseline - 0.1), fontSize: cq(0.115) }}>
        Made with {SITE.name}
      </p>

      {/* the year at a glance */}
      <p className="absolute font-display leading-none" style={{ left: x(B.gridLeft), top: y(B.headingBaseline - B.headingSize * 0.78), fontSize: cq(B.headingSize) }}>
        The year at a glance
      </p>
      {L.months.map((box, i) => (
        <div key={i} className="absolute" style={{ left: x(box.x), top: y(box.y), width: x(box.width) }}>
          <div className="relative overflow-hidden bg-[#ece6da]" style={{ aspectRatio: `${box.width} / ${box.height}` }}>
            {months[i] && <Art src={months[i]!} alt="" sizes="(max-width: 768px) 25vw, 180px" />}
          </div>
          <p className="font-semibold uppercase leading-none tracking-[0.12em]" style={{ ...label, marginTop: cq(B.monthLabelGap - 0.09) }}>
            {MONTH_NAMES[i]}
          </p>
        </div>
      ))}
      <p className="absolute text-right leading-none" style={{ color: MUTED, right: x(W - B.gridRight), top: y(B.footerBaseline - 0.09), fontSize: cq(0.1) }}>
        Artwork created from your photos. Dates typeset for print.
      </p>
    </div>
  )
}

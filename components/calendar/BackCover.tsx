import Art from './Art'
import { BACK_COVER as B, MONTH_NAMES, PAGE, backCoverLayout, joinPetNames } from '@/lib/calendar/layout'
import { SITE } from '@/lib/config'

interface BackCoverProps {
  petNames: string[]
  /** Twelve month images in order; missing ones render as blanks. */
  months: (string | null | undefined)[]
  /** The customer's own photos the calendar was made from. */
  photos?: string[]
  className?: string
}

const W = PAGE.trimWidth
const H = PAGE.trimHeight
const x = (inches: number) => `${(inches / W) * 100}%`
const y = (inches: number) => `${(inches / H) * 100}%`
/** A length in inches as container-query width units, so type scales with the page. */
const cq = (inches: number) => `${(inches / W) * 100}cqw`

/**
 * The printed back cover: an index of the twelve months and, when there are
 * any, the original photos. Positions come from backCoverLayout(), the same
 * numbers drawBackCover() in lib/print/pdf.ts uses.
 */
export default function BackCover({ petNames, months, photos = [], className = '' }: BackCoverProps) {
  const L = backCoverLayout(photos.length)
  const shown = photos.slice(0, L.photos)
  return (
    <div className={`relative aspect-[11/8.5] overflow-hidden rounded-[3px] bg-[#fdfbf6] text-[#1a1816] shadow-lift [container-type:inline-size] ${className}`}>
      <p className="absolute truncate font-display leading-none" style={{ left: x(B.left), right: x(W - B.right), top: y(B.headingBaseline - 0.42), fontSize: cq(0.55) }}>
        Twelve months of {joinPetNames(petNames)}
      </p>

      {Array.from({ length: 12 }, (_, i) => {
        const col = i % L.columns
        const row = Math.floor(i / L.columns)
        const left = B.left + col * (L.thumbW + B.gap)
        const top = B.gridTop + row * L.rowPitch
        return (
          <div key={i} className="absolute" style={{ left: x(left), top: y(top), width: x(L.thumbW) }}>
            <div className="relative aspect-[11/8.5] overflow-hidden bg-[#ece6da]">
              {months[i] && <Art src={months[i]!} alt="" sizes="(max-width: 768px) 25vw, 160px" />}
            </div>
            <p className="font-semibold uppercase leading-none tracking-[0.1em] text-[#6f685e]" style={{ fontSize: cq(0.1), marginTop: cq(0.07) }}>
              {MONTH_NAMES[i]}
            </p>
          </div>
        )
      })}

      {shown.length > 0 && (
        <>
          <p className="absolute font-semibold uppercase leading-none tracking-[0.12em] text-[#6f685e]" style={{ left: x(B.left), top: y(L.photoLabelBaseline - 0.1), fontSize: cq(0.11) }}>
            {shown.length === 1 ? 'The photo it started with' : 'The photos it started with'}
          </p>
          {shown.map((src, i) => (
            <div
              key={src}
              className="absolute overflow-hidden bg-[#ece6da]"
              style={{ left: x(B.left + i * (L.photoSize + L.photoGap)), top: y(L.photoTop), width: x(L.photoSize), aspectRatio: '1' }}
            >
              <Art src={src} alt="" sizes="(max-width: 768px) 25vw, 200px" />
            </div>
          ))}
        </>
      )}

      <p className="absolute font-semibold leading-none" style={{ left: x(B.left), top: y(B.footerBaseline - 0.11), fontSize: cq(0.125) }}>
        Made with {SITE.name}
      </p>
      <p className="absolute text-right leading-none text-[#6f685e]" style={{ right: x(W - B.right), top: y(B.footerBaseline - 0.1), fontSize: cq(0.11) }}>
        Artwork created from your photos. Dates typeset for print.
      </p>
    </div>
  )
}

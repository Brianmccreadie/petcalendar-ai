/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import GridPage from './GridPage'

interface WallCalendarProps {
  /** Art for the top page. Pass `art` instead for custom content (loading states). */
  imageUrl?: string | null
  imageAlt?: string
  art?: ReactNode
  month: number
  year: number
  accent?: string
  caption?: string
  className?: string
  hanging?: boolean
}

/**
 * An open wall calendar as it hangs: art page on top, Wire-O binding, typeset
 * dates page below. Pure HTML/SVG, so the dates are always real and correct.
 */
export default function WallCalendar({
  imageUrl,
  imageAlt = '',
  art,
  month,
  year,
  accent,
  caption,
  className = '',
  hanging = true,
}: WallCalendarProps) {
  return (
    <div className={`relative ${className}`}>
      {hanging && (
        <div aria-hidden="true" className="absolute left-1/2 -top-5 z-10 -translate-x-1/2">
          <div className="mx-auto h-3 w-3 rounded-full bg-ink/80 shadow-[inset_0_-1px_1px_rgb(255_255_255/0.3)]" />
          <div className="mx-auto -mt-0.5 h-4 w-px bg-ink/50" />
        </div>
      )}
      <div className="overflow-hidden rounded-[3px] shadow-lift">
        <div className="relative aspect-[11/8.5] overflow-hidden bg-paper-deep">
          {art ??
            (imageUrl ? (
              <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
            ) : (
              <div className="skeleton h-full w-full" />
            ))}
        </div>
        <div className="wire-o" aria-hidden="true" />
        <GridPage month={month} year={year} accent={accent} caption={caption} />
      </div>
    </div>
  )
}

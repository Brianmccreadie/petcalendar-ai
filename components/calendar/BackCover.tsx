/* eslint-disable @next/next/no-img-element */
import { MONTH_NAMES, joinPetNames } from '@/lib/calendar/layout'
import { SITE } from '@/lib/config'

interface BackCoverProps {
  petNames: string[]
  /** Twelve month images in order; missing ones render as blanks. */
  months: (string | null | undefined)[]
  className?: string
}

/**
 * The printed back cover: an index of the twelve months. Mirrors
 * drawBackCover() in lib/print/pdf.ts, sized in container units so it scales
 * with whatever box it is placed in.
 */
export default function BackCover({ petNames, months, className = '' }: BackCoverProps) {
  return (
    <div
      className={`relative aspect-[11/8.5] overflow-hidden rounded-[3px] bg-[#fdfbf6] text-[#1a1816] shadow-lift [container-type:inline-size] ${className}`}
    >
      <div className="absolute inset-0 flex flex-col px-[4.5cqw] pb-[3.2cqw] pt-[4.6cqw]">
        <p className="truncate font-display leading-none" style={{ fontSize: '4.9cqw' }}>
          Twelve months of {joinPetNames(petNames)}
        </p>
        <ol className="mt-[3cqw] grid flex-1 grid-cols-4 gap-x-[1.8cqw] gap-y-[1.2cqw]">
          {Array.from({ length: 12 }, (_, i) => (
            <li key={i} className="min-h-0">
              <div className="aspect-[11/8.5] overflow-hidden bg-[#ece6da]">
                {months[i] && <img src={months[i]!} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <p className="mt-[0.5cqw] font-semibold uppercase leading-none tracking-[0.1em] text-[#8a8378]" style={{ fontSize: '0.95cqw' }}>
                {MONTH_NAMES[i]}
              </p>
            </li>
          ))}
        </ol>
        <div className="flex items-baseline justify-between">
          <p className="font-semibold leading-none" style={{ fontSize: '1.2cqw' }}>
            Made with {SITE.name}
          </p>
          <p className="leading-none text-[#8a8378]" style={{ fontSize: '1.05cqw' }}>
            Artwork created from your photos. Dates typeset for print.
          </p>
        </div>
      </div>
    </div>
  )
}

import { COVER_PAGE as C, coverText } from '@/lib/calendar/layout'

interface CoverTitleProps {
  petNames: string[]
  year: number
  styleName: string
  petType: string
}

const U = 100

/**
 * Typeset cover text laid over the artwork — an SVG overlay that mirrors the
 * printed cover (lib/print/pdf.ts): name left, year right, caption bottom-right.
 * The artwork underneath never contains text.
 */
export default function CoverTitle({ petNames, year, styleName, petType }: CoverTitleProps) {
  const t = coverText(petNames, year, styleName, petType)
  const face = { fontFamily: 'var(--font-cover)', fontWeight: 800, fontStyle: 'italic' as const }
  const id = `cover-${t.nameLines.join('').length}-${t.year}`

  return (
    <svg viewBox="0 0 1100 850" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${id}-shade`}>
          <stop offset="0" stopColor="#0f0d0a" stopOpacity="0.42" />
          <stop offset="1" stopColor="#0f0d0a" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f0d0a" floodOpacity="0.55" />
        </filter>
      </defs>
      {/* soft shade behind each block of text so white type holds on bright art */}
      <ellipse cx={(C.left + C.zoneWidth / 2) * U} cy={C.centerY * U} rx={C.zoneWidth * 0.75 * U} ry={220} fill={`url(#${id}-shade)`} />
      <ellipse cx={(C.right - C.zoneWidth / 2) * U} cy={C.centerY * U} rx={C.zoneWidth * 0.75 * U} ry={220} fill={`url(#${id}-shade)`} />
      <ellipse cx={(C.right - 1.2) * U} cy={(C.captionBaseline - 0.1) * U} rx={260} ry={90} fill={`url(#${id}-shade)`} />

      <g fill="#fff" filter={`url(#${id}-shadow)`} style={face}>
        {t.nameLines.map((line, i) => (
          <text key={i} x={C.left * U} y={t.nameBaselines[i] * U} fontSize={t.nameSize * U}>
            {line}
          </text>
        ))}
        <text x={C.right * U} y={t.yearBaseline * U} fontSize={t.yearSize * U} textAnchor="end">
          {t.year}
        </text>
        {t.caption.map((line, i) => (
          <text
            key={line}
            x={C.right * U}
            y={(C.captionBaseline + (i - 1) * C.captionSize * C.captionLineHeight) * U}
            fontSize={C.captionSize * U}
            textAnchor="end"
          >
            {line}
          </text>
        ))}
      </g>
    </svg>
  )
}

import { COVER_PAGE as C } from '@/lib/calendar/layout'

interface CoverTitleProps {
  title: string
  subtitle?: string
}

const U = 100

/**
 * Typeset title laid over the cover art — an SVG overlay that mirrors the
 * printed cover (lib/print/pdf.ts). The artwork underneath never contains text.
 */
export default function CoverTitle({ title, subtitle }: CoverTitleProps) {
  // Approximate fit: shrink long titles so they stay inside the safe width.
  const estimated = title.length * C.titleSize * U * C.titleCharWidth
  const fontSize = Math.min(C.titleSize * U, (C.titleSize * U * C.titleMaxWidth * U) / Math.max(estimated, 1))
  const id = `scrim-${title.length}-${fontSize.toFixed(0)}`

  return (
    <svg viewBox="0 0 1100 850" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset={C.scrimTop / 8.5} stopColor="#0f0d0a" stopOpacity="0" />
          <stop offset={C.scrimTop / 8.5 + (1 - C.scrimTop / 8.5) * 0.55} stopColor="#0f0d0a" stopOpacity={C.scrimMaxOpacity * 0.6} />
          <stop offset="1" stopColor="#0f0d0a" stopOpacity={C.scrimMaxOpacity} />
        </linearGradient>
      </defs>
      <rect width="1100" height="850" fill={`url(#${id})`} />
      <text
        x={C.left * U}
        y={C.titleBaseline * U}
        fontSize={fontSize}
        fill="#fff"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
      >
        {title}
      </text>
      {subtitle && (
        <text
          x={C.left * U}
          y={C.subtitleBaseline * U}
          fontSize={C.subtitleSize * U * 0.8}
          fill="#fff"
          fillOpacity="0.85"
          letterSpacing="2.6"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, textTransform: 'uppercase' }}
        >
          {subtitle}
        </text>
      )}
    </svg>
  )
}

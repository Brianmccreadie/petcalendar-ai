import {
  GRID_PAGE as L,
  INK,
  MUTED,
  PAPER,
  RULE,
  WEEKDAY_LABELS,
  buildMonthGrid,
  gridCellRect,
  printableAccent,
} from '@/lib/calendar/layout'

interface GridPageProps {
  month: number
  year: number
  accent?: string
  caption?: string
  className?: string
}

const U = 100 // SVG units per inch

/**
 * The typeset dates page, drawn from the same layout constants as the print PDF
 * (lib/print/pdf.ts) so what customers preview is what gets printed.
 */
export default function GridPage({ month, year, accent: rawAccent, caption, className }: GridPageProps) {
  const accent = printableAccent(rawAccent)
  const grid = buildMonthGrid(month, year)
  const cellWidth = ((L.right - L.left) / 7) * U
  const rowHeight = ((L.gridBottom - L.gridTop) / grid.rows) * U

  return (
    <svg
      viewBox="0 0 1100 850"
      className={className}
      role="img"
      aria-label={`${grid.name} ${year} dates page`}
      style={{ display: 'block', width: '100%', height: 'auto', background: PAPER }}
    >
      <text
        x={L.left * U}
        y={L.titleBaseline * U}
        fontSize={L.titleSize * U}
        fill={INK}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
      >
        {grid.name}
      </text>
      <text
        x={L.right * U}
        y={L.titleBaseline * U}
        fontSize={L.yearSize * U}
        textAnchor="end"
        fill={accent}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
      >
        {year}
      </text>
      {caption && (
        <text
          x={L.right * U}
          y={(L.titleBaseline - L.yearSize - 0.08) * U}
          fontSize={L.captionSize * U}
          textAnchor="end"
          fill={MUTED}
          letterSpacing="1.6"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, textTransform: 'uppercase' }}
        >
          {caption}
        </text>
      )}

      {WEEKDAY_LABELS.map((label, column) => (
        <text
          key={label}
          x={L.left * U + column * cellWidth + L.dayInset * U}
          y={L.weekdayBaseline * U}
          fontSize={L.weekdaySize * U}
          fill={column === 0 || column === 6 ? accent : MUTED}
          letterSpacing="1.4"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, textTransform: 'uppercase' }}
        >
          {label}
        </text>
      ))}

      {Array.from({ length: grid.rows + 1 }, (_, r) => (
        <line
          key={`r${r}`}
          x1={L.left * U}
          x2={L.right * U}
          y1={L.gridTop * U + r * rowHeight}
          y2={L.gridTop * U + r * rowHeight}
          stroke={r === 0 ? INK : RULE}
          strokeWidth={r === 0 ? 1.7 : 0.8}
        />
      ))}
      {Array.from({ length: 6 }, (_, c) => (
        <line
          key={`c${c}`}
          x1={L.left * U + (c + 1) * cellWidth}
          x2={L.left * U + (c + 1) * cellWidth}
          y1={L.gridTop * U}
          y2={L.gridBottom * U}
          stroke={RULE}
          strokeWidth={0.8}
        />
      ))}

      {grid.cells.map((cell) => {
        const rect = gridCellRect(grid, cell.column, cell.row)
        const weekend = cell.column === 0 || cell.column === 6
        return (
          <g key={cell.day}>
            <text
              x={(rect.x + L.dayInset) * U}
              y={(rect.y + L.dayInset + L.daySize * 0.78) * U}
              fontSize={L.daySize * U}
              fill={weekend ? accent : INK}
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
            >
              {cell.day}
            </text>
            {cell.holiday && (
              <text
                x={(rect.x + L.dayInset) * U}
                y={(rect.y + rect.height - L.dayInset) * U}
                fontSize={L.holidaySize * U}
                fill={MUTED}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {cell.holiday}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

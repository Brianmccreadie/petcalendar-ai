// Pure calendar maths shared by the on-screen preview (SVG), the printed PDF
// and the HyperFrames reveal video, so all three always agree.

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface MonthCell {
  day: number
  column: number // 0 = Sunday
  row: number
  holiday?: string
}

export interface MonthGrid {
  month: number // 1-12
  year: number
  name: string
  rows: number
  cells: MonthCell[]
}

function nthWeekday(year: number, month: number, weekday: number, n: number): number {
  const first = new Date(year, month - 1, 1).getDay()
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7
}

function lastWeekday(year: number, month: number, weekday: number): number {
  const days = new Date(year, month, 0).getDate()
  const last = new Date(year, month - 1, days).getDay()
  return days - ((last - weekday + 7) % 7)
}

/** Fixed and floating US holidays, plus a few pet days. Keyed by day of month. */
export function holidaysFor(month: number, year: number): Record<number, string> {
  switch (month) {
    case 1:
      return { 1: "New Year's Day", [nthWeekday(year, 1, 1, 3)]: 'MLK Day' }
    case 2:
      return { 14: "Valentine's Day", 20: 'Love Your Pet Day', [nthWeekday(year, 2, 1, 3)]: "Presidents' Day" }
    case 3:
      return { 17: "St. Patrick's Day", 23: 'National Puppy Day' }
    case 4:
      return { 11: 'National Pet Day', 22: 'Earth Day' }
    case 5:
      return { [nthWeekday(year, 5, 0, 2)]: "Mother's Day", [lastWeekday(year, 5, 1)]: 'Memorial Day' }
    case 6:
      return { 19: 'Juneteenth', [nthWeekday(year, 6, 0, 3)]: "Father's Day" }
    case 7:
      return { 4: 'Independence Day' }
    case 8:
      return { 8: 'International Cat Day', 26: 'National Dog Day' }
    case 9:
      return { [nthWeekday(year, 9, 1, 1)]: 'Labor Day' }
    case 10:
      return { 29: 'National Cat Day', 31: 'Halloween' }
    case 11:
      return { 11: 'Veterans Day', [nthWeekday(year, 11, 4, 4)]: 'Thanksgiving' }
    case 12:
      return { 25: 'Christmas Day', 31: "New Year's Eve" }
    default:
      return {}
  }
}

export function buildMonthGrid(month: number, year: number): MonthGrid {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstColumn = new Date(year, month - 1, 1).getDay()
  const holidays = holidaysFor(month, year)
  const cells: MonthCell[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const index = firstColumn + day - 1
    cells.push({ day, column: index % 7, row: Math.floor(index / 7), holiday: holidays[day] })
  }
  return {
    month,
    year,
    name: MONTH_NAMES[month - 1],
    rows: Math.ceil((firstColumn + daysInMonth) / 7),
    cells,
  }
}

/** "Luna", "Luna & Milo", "Luna, Milo & Bo" */
export function joinPetNames(names: string[]): string {
  const clean = names.map((n) => n.trim()).filter(Boolean)
  if (clean.length === 0) return 'Your Pet'
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} & ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')} & ${clean[clean.length - 1]}`
}

export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`
}

/** Which pet stars in a given month when pets take turns. */
export function petIndexForMonth(month: number, petCount: number): number {
  return petCount > 0 ? (month - 1) % petCount : 0
}

// ---- Physical page geometry (inches) ----
// Trim size 11 × 8.5 in landscape with 0.125 in bleed on every edge.
export const PAGE = {
  trimWidth: 11,
  trimHeight: 8.5,
  bleed: 0.125,
  safe: 0.5,
  /** Wire-O punches along the top (grid page) / bottom (art page) edge. */
  bindingClearance: 0.55,
}

/** Art is generated at 4:3 and cropped to the trim ratio (11.25 : 8.75 with bleed). */
export const ART_ASPECT = 4 / 3

// ---- Typeset page layouts (inches from the top-left trim corner) ----
// Used by components/calendar/* (SVG, 100 units per inch) and lib/print/pdf.ts.

export const INK = '#14120f'
export const PAPER = '#fdfbf6'
export const RULE = '#b9b1a3'
export const MUTED = '#6f685e'

export const GRID_PAGE = {
  left: 0.5,
  right: 10.5,
  titleBaseline: 1.3,
  titleSize: 0.95, // month name font-size in inches (Instrument Serif)
  yearSize: 0.5,
  captionSize: 0.1,
  weekdayBaseline: 1.68,
  weekdaySize: 0.13,
  gridTop: 1.8,
  gridBottom: 8.0,
  dayInset: 0.12,
  // Big enough to read from across a kitchen, with room left to write in each box.
  daySize: 0.3,
  holidaySize: 0.105,
}

// Cover: the pet sits in the middle of the frame, the name to its left and
// the year to its right at mid-height, with a small caption bottom-right.
export const COVER_PAGE = {
  left: 0.5,
  right: 10.5,
  /** Width of the text zone on each side of the pet. */
  zoneWidth: 3.5,
  /** Vertical centre of the name and year, from the top trim edge. */
  centerY: 4.0,
  textSize: 1.08,
  minTextSize: 0.5,
  maxNameLines: 3,
  lineHeight: 1.02,
  /** Average glyph width of the cover face (Nunito ExtraBold Italic, capitals) as a fraction of font size. */
  charWidth: 0.7,
  captionSize: 0.21,
  captionBaseline: 7.98,
  captionLineHeight: 1.2,
}

export interface CoverText {
  nameLines: string[]
  nameSize: number // inches
  /** Baseline of each name line, inches from the top trim edge. */
  nameBaselines: number[]
  year: string
  yearSize: number
  yearBaseline: number
  caption: [string, string]
}

function wrapWords(words: string[], maxChars: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length <= maxChars || !line) line = next
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

/**
 * Lay out the cover text. Short names print large on one line; longer and
 * multi-pet names wrap onto up to three lines and shrink until they fit the
 * left-hand zone.
 */
export function coverText(petNames: string[], year: number, styleName: string, petType: string): CoverText {
  const C = COVER_PAGE
  // Keep "&" with the name that follows it so it never sits on a line alone.
  const words = joinPetNames(petNames)
    .toUpperCase()
    .replace(/& /g, '&\u00a0')
    .split(/ +/)
  let size = C.textSize
  let lines: string[] = [words.join(' ')]
  for (; size >= C.minTextSize; size -= 0.04) {
    const maxChars = Math.floor(C.zoneWidth / (size * C.charWidth))
    lines = wrapWords(words, maxChars)
    const widest = Math.max(...lines.map((l) => l.length))
    if (lines.length <= C.maxNameLines && widest <= maxChars) break
  }
  size = Math.max(size, C.minTextSize)
  // A single very long word can still overflow at the minimum size: scale it to the zone.
  const widest = Math.max(...lines.map((l) => l.length))
  if (widest * size * C.charWidth > C.zoneWidth) size = C.zoneWidth / (widest * C.charWidth)

  const block = (lines.length - 1) * size * C.lineHeight
  const first = C.centerY - block / 2 + size * 0.36
  const kind = petType === 'dog' ? 'Dog' : petType === 'cat' ? 'Cat' : 'Pet'
  return {
    nameLines: lines,
    nameSize: size,
    nameBaselines: lines.map((_, i) => first + i * size * C.lineHeight),
    year: String(year),
    yearSize: C.textSize,
    yearBaseline: C.centerY + C.textSize * 0.36,
    caption: [styleName, `${kind} Calendar`],
  }
}

export function gridCellRect(grid: MonthGrid, column: number, row: number) {
  const width = (GRID_PAGE.right - GRID_PAGE.left) / 7
  const height = (GRID_PAGE.gridBottom - GRID_PAGE.gridTop) / grid.rows
  return { x: GRID_PAGE.left + column * width, y: GRID_PAGE.gridTop + row * height, width, height }
}

export function coverTitle(petNames: string[], year: number): string {
  return `${possessive(joinPetNames(petNames))} ${year}`
}

export function coverSubtitle(styleName: string): string {
  return `The ${styleName} edition · twelve-month wall calendar`
}

/** Darken light accent colours so they stay readable on white paper (screen and print). */
export function printableAccent(color: string | undefined, fallback = '#3f6fa8'): string {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return fallback
  const n = parseInt(color.slice(1), 16)
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
  if (luminance <= 0.42) return color
  const k = 0.42 / luminance
  return '#' + rgb.map((c) => Math.round(c * k).toString(16).padStart(2, '0')).join('')
}

/**
 * Back cover (inches from the trim edge), shared by the on-screen preview and
 * the print file. A tinted panel on the left tells the story — the photos it
 * started with, then the pet's name and the edition — and the twelve months
 * run down the right in three columns, each labelled.
 */
export const BACK_COVER = {
  panelWidth: 3.9,
  panelColor: '#efe7d8',
  panelLeft: 0.5,
  panelInner: 2.9,
  labelBaseline: 0.95,
  photoTop: 1.25,
  photoBottom: 6.35,
  photoGap: 0.36,
  frame: 0.09,
  maxPhotos: 3,
  nameBaseline: 7.15,
  nameSize: 0.6,
  editionBaseline: 7.5,
  footerBaseline: 8.05,
  gridLeft: 4.4,
  gridRight: 10.5,
  gridTop: 1.25,
  gridBottom: 7.72,
  headingBaseline: 0.95,
  headingSize: 0.36,
  columns: 3,
  monthLabelGap: 0.17,
}

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export function backCoverLayout(photoCount: number) {
  const B = BACK_COVER
  const count = Math.min(Math.max(photoCount, 0), B.maxPhotos)
  // Photos: one column of prints, as tall as fits; a single photo is a square.
  const zone = B.photoBottom - B.photoTop
  const height = count ? Math.min(B.panelInner, (zone - B.photoGap * (count - 1)) / count) : 0
  const used = count * height + Math.max(0, count - 1) * B.photoGap
  const start = B.photoTop + (zone - used) / 2
  const photos: Box[] = Array.from({ length: count }, (_, i) => ({ x: B.panelLeft, y: start + i * (height + B.photoGap), width: B.panelInner, height }))

  // Months: three columns, four rows, sized to fill the height.
  const rows = 12 / B.columns
  const rowPitch = (B.gridBottom - B.gridTop) / rows
  const thumbH = rowPitch - 0.32
  const thumbW = thumbH * (PAGE.trimWidth / PAGE.trimHeight)
  const gap = (B.gridRight - B.gridLeft - thumbW * B.columns) / (B.columns - 1)
  const months: Box[] = Array.from({ length: 12 }, (_, i) => ({
    x: B.gridLeft + (i % B.columns) * (thumbW + gap),
    y: B.gridTop + Math.floor(i / B.columns) * rowPitch,
    width: thumbW,
    height: thumbH,
  }))
  return { photos, months }
}

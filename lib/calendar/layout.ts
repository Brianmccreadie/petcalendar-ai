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
export const RULE = '#d9d2c5'
export const MUTED = '#8d867c'

export const GRID_PAGE = {
  left: 0.5,
  right: 10.5,
  titleBaseline: 1.3,
  titleSize: 0.95, // month name font-size in inches (Instrument Serif)
  yearSize: 0.5,
  captionSize: 0.1,
  weekdayBaseline: 1.68,
  weekdaySize: 0.095,
  gridTop: 1.8,
  gridBottom: 8.0,
  dayInset: 0.11,
  daySize: 0.19,
  holidaySize: 0.09,
}

export const COVER_PAGE = {
  /** Scrim starts this far down the page and darkens toward the bottom. */
  scrimTop: 4.0,
  scrimMaxOpacity: 0.8,
  titleBaseline: 7.3,
  titleSize: 1.3,
  titleMaxWidth: 10,
  /** Average glyph width as a fraction of font size, used to fit long titles on screen. */
  titleCharWidth: 0.4,
  subtitleBaseline: 7.78,
  subtitleSize: 0.15,
  left: 0.5,
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
export function printableAccent(color: string | undefined, fallback = '#86672a'): string {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return fallback
  const n = parseInt(color.slice(1), 16)
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
  if (luminance <= 0.42) return color
  const k = 0.42 / luminance
  return '#' + rgb.map((c) => Math.round(c * k).toString(16).padStart(2, '0')).join('')
}

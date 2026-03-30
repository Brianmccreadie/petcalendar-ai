import { v2 as cloudinary } from 'cloudinary'
import { CALENDAR_STYLES, MONTH_THEMES, type StyleId } from './types'

// Ensure Cloudinary is configured (may already be from cloudinary.ts import)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

// Calendar page dimensions (portrait, print-quality)
const PAGE_WIDTH = 3600
const PAGE_HEIGHT = 5400
const IMAGE_HEIGHT = Math.round(PAGE_HEIGHT * 0.7) // Top 70% for the image
const GRID_HEIGHT = PAGE_HEIGHT - IMAGE_HEIGHT       // Bottom 30% for date grid

// Days of the week headers
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Get the number of days in a given month/year.
 */
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Get the day of the week (0 = Sunday) for the first day of a month.
 */
function getFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay()
}

/**
 * Compose a final print-ready calendar page by combining:
 * - The generated pet image (top ~70%)
 * - Month name and year as text overlay
 * - A date grid overlay (bottom ~30%)
 *
 * Returns a Cloudinary URL with all transformations applied.
 */
export function composeCalendarPage(
  imagePublicId: string,
  month: number,
  year: number,
  style: StyleId
): string {
  const monthTheme = MONTH_THEMES.find((m) => m.month === month)!
  const calendarStyle = CALENDAR_STYLES.find((s) => s.id === style)!
  const accentColor = calendarStyle.accentColor.replace('#', '')

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfWeek(month, year)
  const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7)

  // Build transformation chain
  const transformations: string[] = []

  // 1. Base image — crop to fill the top portion
  transformations.push(
    `c_fill,g_auto,w_${PAGE_WIDTH},h_${IMAGE_HEIGHT},q_100`
  )

  // 2. Extend the canvas downward for the date grid area (white background)
  transformations.push(
    `b_white,c_pad,w_${PAGE_WIDTH},h_${PAGE_HEIGHT},g_north`
  )

  // 3. Month name overlay — centered at the boundary between image and grid
  const monthYearText = `${monthTheme.name} ${year}`
  const encodedMonthYear = encodeURIComponent(monthYearText)
  transformations.push(
    `l_text:Playfair%20Display_120_bold:${encodedMonthYear},co_rgb:${accentColor},g_north,y_${IMAGE_HEIGHT - 30}`
  )

  // 4. Day-of-week headers
  const headerY = IMAGE_HEIGHT + 80
  const cellWidth = Math.round(PAGE_WIDTH / 7)
  DAY_HEADERS.forEach((day, index) => {
    const x = Math.round(cellWidth * index + cellWidth / 2 - PAGE_WIDTH / 2)
    const encodedDay = encodeURIComponent(day)
    transformations.push(
      `l_text:Roboto_60_bold:${encodedDay},co_rgb:${accentColor},g_north,x_${x},y_${headerY}`
    )
  })

  // 5. Date numbers in a grid
  const dateStartY = headerY + 100
  const rowHeight = Math.round((GRID_HEIGHT - 200) / totalWeeks)

  let dayCounter = 1
  for (let week = 0; week < totalWeeks; week++) {
    for (let dow = 0; dow < 7; dow++) {
      if ((week === 0 && dow < firstDay) || dayCounter > daysInMonth) {
        continue
      }
      const x = Math.round(cellWidth * dow + cellWidth / 2 - PAGE_WIDTH / 2)
      const y = dateStartY + week * rowHeight

      // Weekends get a slightly lighter shade
      const isWeekend = dow === 0 || dow === 6
      const textColor = isWeekend ? '999999' : '333333'

      transformations.push(
        `l_text:Roboto_54:${dayCounter},co_rgb:${textColor},g_north,x_${x},y_${y}`
      )
      dayCounter++
    }
  }

  // 6. Subtle separator line between image and grid
  transformations.push(
    `l_text:_2:%20,co_rgb:${accentColor},bo_2px_solid_rgb:${accentColor},w_${PAGE_WIDTH - 200},g_north,y_${IMAGE_HEIGHT + 10}`
  )

  const transformationString = transformations.join('/')

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${imagePublicId}`
}

/**
 * Compose the cover page with pet name and year overlay.
 */
export function composeCoverPage(
  imagePublicId: string,
  petName: string,
  year: number,
  style: StyleId
): string {
  const calendarStyle = CALENDAR_STYLES.find((s) => s.id === style)!
  const accentColor = calendarStyle.accentColor.replace('#', '')

  const transformations: string[] = []

  // 1. Full-page image
  transformations.push(
    `c_fill,g_auto,w_${PAGE_WIDTH},h_${PAGE_HEIGHT},q_100`
  )

  // 2. Slight dark gradient overlay at bottom for text readability
  transformations.push(
    `l_fetch:${encodeURIComponent('https://res.cloudinary.com/demo/image/upload/e_gradient_fade:50,b_black,o_60/v1/gradient_overlay')},w_${PAGE_WIDTH},h_${Math.round(PAGE_HEIGHT * 0.3)},g_south`
  )

  // 3. Pet name — large, centered near bottom
  const encodedPetName = encodeURIComponent(petName)
  transformations.push(
    `l_text:Playfair%20Display_200_bold:${encodedPetName},co_white,g_south,y_350`
  )

  // 4. Year below name
  transformations.push(
    `l_text:Playfair%20Display_120:${year},co_rgb:${accentColor},g_south,y_180`
  )

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations.join('/')}/${imagePublicId}`
}

/**
 * Generate composed URLs for all pages of a calendar.
 * Useful for building the Lulu submission or the preview grid.
 */
export function composeAllCalendarPages(
  pages: Array<{ publicId: string; pageType: 'cover' | 'month' | 'back'; monthNumber: number | null }>,
  petName: string,
  startMonth: number,
  startYear: number,
  style: StyleId
): Array<{ pageType: string; monthNumber: number | null; composedUrl: string }> {
  const results: Array<{ pageType: string; monthNumber: number | null; composedUrl: string }> = []

  for (const page of pages) {
    if (page.pageType === 'cover') {
      results.push({
        pageType: 'cover',
        monthNumber: null,
        composedUrl: composeCoverPage(page.publicId, petName, startYear, style),
      })
    } else if (page.pageType === 'month' && page.monthNumber !== null) {
      // Calculate the actual month/year for this calendar page
      const actualMonth = ((startMonth - 1 + (page.monthNumber - 1)) % 12) + 1
      const yearOffset = Math.floor((startMonth - 1 + (page.monthNumber - 1)) / 12)
      const actualYear = startYear + yearOffset

      results.push({
        pageType: 'month',
        monthNumber: page.monthNumber,
        composedUrl: composeCalendarPage(page.publicId, actualMonth, actualYear, style),
      })
    } else if (page.pageType === 'back') {
      // Back page is just the image, full bleed, no date grid
      results.push({
        pageType: 'back',
        monthNumber: null,
        composedUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_auto,w_${PAGE_WIDTH},h_${PAGE_HEIGHT},q_100/${page.publicId}`,
      })
    }
  }

  return results
}

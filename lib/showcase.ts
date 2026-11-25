import { MONTH_NAMES } from './calendar/layout'
import { CALENDAR_STYLES } from './types'

// The showcase calendar on the landing page: a real, complete calendar.
const STYLE_NAME = CALENDAR_STYLES.find((style) => style.id === 'fashion-week')?.name ?? 'Fashion Week'

/** A real customer calendar, made on the site from the photo in `reference`. */
export const SHOWCASE = {
  reference: '/sample-bonnie/reference.jpg',
  petName: 'Bonnie',
  styleId: 'fashion-week',
  styleName: STYLE_NAME,
  cover: '/sample-bonnie/cover.jpg',
  months: MONTH_NAMES.map((name, i) => ({
    month: i + 1,
    name,
    src: `/sample-bonnie/${String(i + 1).padStart(2, '0')}.jpg`,
  })),
}

/** A short label for each month's look. */
export const SHOWCASE_PLACES = [
  'winter couture', 'Valentine red', 'spring florals', 'rain couture', 'the garden party', 'resort wear',
  'red, white and blue', 'rooftop evening wear', 'autumn tailoring', 'Gothic glamour', 'cosy cashmere', 'the holiday gown',
]

import { MONTH_NAMES } from './calendar/layout'

// The showcase calendar on the landing page: a real, complete calendar generated
// from a single reference photo with `npm run sample:year`.
export const SHOWCASE = {
  petName: 'Luna',
  styleId: 'wizarding-world',
  styleName: 'Wizard Academy',
  cover: '/sample-year/cover.jpg',
  months: MONTH_NAMES.map((name, i) => ({
    month: i + 1,
    name,
    src: `/sample-year/${String(i + 1).padStart(2, '0')}.jpg`,
  })),
}

export const SHOWCASE_PLACES = [
  'the Great Hall', 'Potions class', 'the flying pitch', 'the greenhouse', 'the library', 'the great lake',
  'the astronomy tower', 'the enchanted forest', 'the castle gates', 'the Halloween feast', 'the common room', 'the snowy courtyard',
]

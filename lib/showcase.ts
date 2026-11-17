import { MONTH_NAMES } from './calendar/layout'

// The showcase calendar on the landing page: a real, complete calendar generated
// from a single reference photo with `npm run sample:year`.
export const SHOWCASE = {
  petName: 'Luna',
  styleId: 'around-the-world',
  styleName: 'Around the World',
  cover: '/year/cover.jpg',
  months: MONTH_NAMES.map((name, i) => ({
    month: i + 1,
    name,
    src: `/year/${String(i + 1).padStart(2, '0')}.jpg`,
  })),
}

export const SHOWCASE_PLACES = [
  'Paris', 'Agra', 'Tokyo', 'Machu Picchu', 'the Netherlands', 'Santorini',
  'the Great Wall', 'the Serengeti', 'Rome', 'Mexico City', 'Marrakech', 'the Alps',
]

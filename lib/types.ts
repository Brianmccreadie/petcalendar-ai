// ============================================================
// PetCalendar.ai — TypeScript Types & Constants
// ============================================================

// ---- Database row types ----

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type PetType = 'dog' | 'cat' | 'other'
export type ProjectStatus = 'uploading' | 'generating' | 'preview' | 'ordered'
export type CalendarPageType = 'cover' | 'month' | 'back'
export type CalendarPageStatus = 'pending' | 'generating' | 'complete' | 'failed'
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'submitted_to_lulu'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'refunded'

export type StyleId =
  | 'mythical-quest'
  | 'wizarding-world'
  | 'space-explorer'
  | 'secret-agent'
  | 'prehistoric-adventure'
  | 'pirate-life'
  | 'superhero-origin'
  | 'royal-portrait'
  | 'detective-noir'
  | 'wild-west'
  | 'underwater-odyssey'
  | 'high-school-yearbook'
  | 'professional-headshot'
  | 'pet-photoshoot'
  | 'cozy-vibes'
  | 'cooking-show'
  | 'rock-star'
  | 'fashion-week'
  | 'office-life'
  | 'sports-mvp'
  | 'around-the-world'
  | 'fairy-tale'
  | 'zombie-apocalypse'
  | 'renaissance-pet'
  | 'sitcom-star'
  | 'mad-scientist'
  | 'movie-poster'
  | 'baby-photos'
  | 'fitness-journey'
  | 'art-museum'
  | 'holiday-card'
  | 'camping-adventures'
  | 'noir-detective'
  | 'tropical-paradise'
  | 'horror-movie'
  | 'dating-profile'
  | 'true-crime'
  | 'reality-tv'
  | 'influencer'
  | 'nap-champion'
  | 'time-traveler'
  | 'video-game-hero'
  | 'broadway-star'
  | 'garden-party'
  | 'snow-day'
  | 'national-park'
  | 'tiny-human'
  | 'anime-world'
  | 'galactic-emperor'
  | 'cottage-core'

export type MultiPetMode = 'alternate' | 'together'

export interface Project {
  id: string
  user_id: string
  name: string
  pet_name: string | null
  pet_type: PetType
  style: StyleId
  status: ProjectStatus
  multi_pet_mode: MultiPetMode
  start_month: number
  start_year: number
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  project_id: string
  name: string
  pet_type: PetType
  sort_order: number
  created_at: string
}

export interface PetPhoto {
  id: string
  project_id: string
  pet_id: string | null
  cloudinary_url: string
  cloudinary_public_id: string
  original_filename: string | null
  width: number | null
  height: number | null
  created_at: string
}

export interface CalendarPage {
  id: string
  project_id: string
  pet_id: string | null
  page_type: CalendarPageType
  month_number: number | null
  prompt: string | null
  cloudinary_url: string | null
  cloudinary_public_id: string | null
  status: CalendarPageStatus
  generation_attempts: number
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  name: string
  address1: string
  address2?: string
  city: string
  state_code: string
  country_code: string
  zip: string
  phone?: string
}

export interface Order {
  id: string
  project_id: string
  user_id: string
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  lulu_order_id: string | null
  status: OrderStatus
  shipping_name: string | null
  shipping_address: ShippingAddress | null
  shipping_method: string
  amount_cents: number
  currency: string
  tracking_number: string | null
  tracking_url: string | null
  created_at: string
  updated_at: string
}

// ---- Calendar Style definitions ----

export interface CalendarStyle {
  id: StyleId
  name: string
  description: string
  accentColor: string
  preview: string
}

export const CALENDAR_STYLES: CalendarStyle[] = [
  {
    id: 'mythical-quest',
    name: 'Mythical Quest',
    description: 'Epic fantasy hero in cinematic landscapes',
    accentColor: '#8B6914',
    preview: '/previews/mythical-quest-dog.jpg',
  },
  {
    id: 'wizarding-world',
    name: 'Wizarding World',
    description: 'Magical school of witchcraft and wizardry',
    accentColor: '#5856D6',
    preview: '/previews/wizarding-world-dog.jpg',
  },
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'Astronaut exploring alien planets and galaxies',
    accentColor: '#007AFF',
    preview: '/previews/space-explorer-dog.jpg',
  },
  {
    id: 'secret-agent',
    name: 'Secret Agent',
    description: 'Suave spy on international missions',
    accentColor: '#2C2C2E',
    preview: '/previews/secret-agent-dog.jpg',
  },
  {
    id: 'prehistoric-adventure',
    name: 'Prehistoric Adventure',
    description: 'Transported to the age of dinosaurs',
    accentColor: '#34A853',
    preview: '/previews/prehistoric-adventure-dog.jpg',
  },
  {
    id: 'pirate-life',
    name: 'Pirate Life',
    description: 'Swashbuckling pirate captain on the high seas',
    accentColor: '#C0392B',
    preview: '/previews/pirate-life-dog.jpg',
  },
  {
    id: 'superhero-origin',
    name: 'Superhero Origin',
    description: 'Comic-book superhero saving the day',
    accentColor: '#FF2D55',
    preview: '/previews/superhero-origin-dog.jpg',
  },
  {
    id: 'royal-portrait',
    name: 'Royal Portrait',
    description: 'Royalty through different historical eras',
    accentColor: '#DAA520',
    preview: '/previews/royal-portrait-dog.jpg',
  },
  {
    id: 'detective-noir',
    name: 'Detective Noir',
    description: 'Solving mysteries in moody noir settings',
    accentColor: '#4A4A4A',
    preview: '/previews/detective-noir-dog.jpg',
  },
  {
    id: 'wild-west',
    name: 'Wild West',
    description: 'Frontier cowboy with dusty sunsets',
    accentColor: '#D2691E',
    preview: '/previews/wild-west-dog.jpg',
  },
  {
    id: 'underwater-odyssey',
    name: 'Underwater Odyssey',
    description: 'Exploring magical underwater kingdoms',
    accentColor: '#06D6A0',
    preview: '/previews/underwater-odyssey-dog.jpg',
  },
  {
    id: 'high-school-yearbook',
    name: 'High School Yearbook',
    description: 'Prom, class photos, detention, and sports',
    accentColor: '#FF9500',
    preview: '/previews/high-school-yearbook-dog.jpg',
  },
  {
    id: 'professional-headshot',
    name: 'Seasonal Headshot',
    description: 'Studio-quality portraits, magazine-cover energy',
    accentColor: '#1C1C1E',
    preview: '/previews/professional-headshot-dog.jpg',
  },
  {
    id: 'pet-photoshoot',
    name: 'Pet Photoshoot',
    description: 'Lifestyle shoots in parks, studios, and cafes',
    accentColor: '#E8825A',
    preview: '/previews/pet-photoshoot-dog.jpg',
  },
  {
    id: 'cozy-vibes',
    name: 'Cozy Vibes',
    description: 'Warm seasonal scenes, pure comfort vibes',
    accentColor: '#C4956A',
    preview: '/previews/cozy-vibes-dog.jpg',
  },
  {
    id: 'cooking-show',
    name: 'Cooking Show',
    description: 'Celebrity chef with seasonal recipes',
    accentColor: '#FF6B35',
    preview: '/previews/cooking-show-dog.jpg',
  },
  {
    id: 'rock-star',
    name: 'Rock Star',
    description: 'Legendary musician across genres and decades',
    accentColor: '#8B0000',
    preview: '/previews/rock-star-dog.jpg',
  },
  {
    id: 'fashion-week',
    name: 'Fashion Week',
    description: 'Strutting the runway in high fashion',
    accentColor: '#FF69B4',
    preview: '/previews/fashion-week-dog.jpg',
  },
  {
    id: 'office-life',
    name: 'Office Life',
    description: 'Hilarious corporate meetings and casual Fridays',
    accentColor: '#4169E1',
    preview: '/previews/office-life-dog.jpg',
  },
  {
    id: 'sports-mvp',
    name: 'Sports MVP',
    description: 'Dominating a different sport each month',
    accentColor: '#228B22',
    preview: '/previews/sports-mvp-dog.jpg',
  },
  {
    id: 'around-the-world',
    name: 'Around the World',
    description: 'Visiting iconic world landmarks each month',
    accentColor: '#1E90FF',
    preview: '/previews/around-the-world-dog.jpg',
  },
  {
    id: 'fairy-tale',
    name: 'Fairy Tale',
    description: 'Enchanted forests, castles, and magic',
    accentColor: '#9370DB',
    preview: '/previews/fairy-tale-dog.jpg',
  },
  {
    id: 'zombie-apocalypse',
    name: 'Zombie Apocalypse',
    description: 'Surviving the apocalypse and thriving',
    accentColor: '#556B2F',
    preview: '/previews/zombie-apocalypse-dog.jpg',
  },
  {
    id: 'renaissance-pet',
    name: 'Renaissance Pet',
    description: 'Famous Renaissance paintings, recreated',
    accentColor: '#8B6914',
    preview: '/previews/renaissance-pet-dog.jpg',
  },
  {
    id: 'sitcom-star',
    name: 'Sitcom Star',
    description: 'Iconic sitcom scenes and settings',
    accentColor: '#FFD700',
    preview: '/previews/sitcom-star-dog.jpg',
  },
  {
    id: 'mad-scientist',
    name: 'Mad Scientist',
    description: 'Slightly unhinged scientist in a wild lab',
    accentColor: '#00CED1',
    preview: '/previews/mad-scientist-dog.jpg',
  },
  {
    id: 'movie-poster',
    name: 'Movie Poster',
    description: 'A different movie genre poster each month',
    accentColor: '#B22222',
    preview: '/previews/movie-poster-dog.jpg',
  },
  {
    id: 'baby-photos',
    name: 'Baby Photos',
    description: 'Classic baby photo scenarios, adorable',
    accentColor: '#FFB6C1',
    preview: '/previews/baby-photos-dog.jpg',
  },
  {
    id: 'fitness-journey',
    name: 'Fitness Journey',
    description: 'Fitness influencer — yoga, weights, smoothies',
    accentColor: '#32CD32',
    preview: '/previews/fitness-journey-dog.jpg',
  },
  {
    id: 'art-museum',
    name: 'Art Museum',
    description: 'Placed inside famous artworks and movements',
    accentColor: '#DAA520',
    preview: '/previews/art-museum-dog.jpg',
  },
  {
    id: 'holiday-card',
    name: 'Holiday Card',
    description: 'Holiday-themed greeting cards each month',
    accentColor: '#C41E3A',
    preview: '/previews/holiday-card-dog.jpg',
  },
  {
    id: 'camping-adventures',
    name: 'Camping Adventures',
    description: 'Hiking, kayaking, camping, and stargazing',
    accentColor: '#2E8B57',
    preview: '/previews/camping-adventures-dog.jpg',
  },
  {
    id: 'noir-detective',
    name: 'Film Noir',
    description: 'Black and white cinematic noir scenes',
    accentColor: '#2F2F2F',
    preview: '/previews/noir-detective-dog.jpg',
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Living the best life on tropical islands',
    accentColor: '#FF6347',
    preview: '/previews/tropical-paradise-dog.jpg',
  },
  {
    id: 'horror-movie',
    name: 'Horror Movie',
    description: 'Cute-scary Halloween energy all year',
    accentColor: '#800080',
    preview: '/previews/horror-movie-dog.jpg',
  },
  {
    id: 'dating-profile',
    name: 'Dating Profile',
    description: 'Hilariously human dating profile photos',
    accentColor: '#FF4500',
    preview: '/previews/dating-profile-dog.jpg',
  },
  {
    id: 'true-crime',
    name: 'True Crime',
    description: 'Detective investigating mysteries',
    accentColor: '#708090',
    preview: '/previews/true-crime-dog.jpg',
  },
  {
    id: 'reality-tv',
    name: 'Reality TV',
    description: 'Starring in different reality TV shows',
    accentColor: '#FF1493',
    preview: '/previews/reality-tv-dog.jpg',
  },
  {
    id: 'influencer',
    name: 'Pet Influencer',
    description: 'Social media star with aesthetic vibes',
    accentColor: '#E4405F',
    preview: '/previews/influencer-dog.jpg',
  },
  {
    id: 'nap-champion',
    name: 'Nap Champion',
    description: 'Sleeping in elaborate cozy places',
    accentColor: '#B0C4DE',
    preview: '/previews/nap-champion-dog.jpg',
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Visiting different historical eras',
    accentColor: '#CD853F',
    preview: '/previews/time-traveler-dog.jpg',
  },
  {
    id: 'video-game-hero',
    name: 'Video Game Hero',
    description: 'Inside famous video game worlds',
    accentColor: '#7B68EE',
    preview: '/previews/video-game-hero-dog.jpg',
  },
  {
    id: 'broadway-star',
    name: 'Broadway Star',
    description: 'Performing in famous musicals on stage',
    accentColor: '#FFD700',
    preview: '/previews/broadway-star-dog.jpg',
  },
  {
    id: 'garden-party',
    name: 'Garden Party',
    description: 'Elegant parties with seasonal flowers',
    accentColor: '#98FB98',
    preview: '/previews/garden-party-dog.jpg',
  },
  {
    id: 'snow-day',
    name: 'Snow Day',
    description: 'Charming winter snow scenes all year',
    accentColor: '#B0E0E6',
    preview: '/previews/snow-day-dog.jpg',
  },
  {
    id: 'national-park',
    name: 'National Park',
    description: 'A different US National Park each month',
    accentColor: '#228B22',
    preview: '/previews/national-park-dog.jpg',
  },
  {
    id: 'tiny-human',
    name: 'Tiny Human',
    description: 'Doing everyday human things, hilariously',
    accentColor: '#DEB887',
    preview: '/previews/tiny-human-dog.jpg',
  },
  {
    id: 'anime-world',
    name: 'Anime World',
    description: 'Iconic anime settings and moments',
    accentColor: '#FF6B81',
    preview: '/previews/anime-world-dog.jpg',
  },
  {
    id: 'galactic-emperor',
    name: 'Galactic Emperor',
    description: 'Ruling an intergalactic empire from a throne',
    accentColor: '#4B0082',
    preview: '/previews/galactic-emperor-dog.jpg',
  },
  {
    id: 'cottage-core',
    name: 'Cottage Core',
    description: 'Pastoral dream with meadows and cottages',
    accentColor: '#8FBC8F',
    preview: '/previews/cottage-core-dog.jpg',
  },
]

// ---- Month themes ----

export interface MonthTheme {
  month: number
  name: string
  theme: string
}

export const MONTH_THEMES: MonthTheme[] = [
  {
    month: 1,
    name: 'January',
    theme: 'New Year celebration with winter snow, sparklers, and the promise of a fresh start',
  },
  {
    month: 2,
    name: 'February',
    theme: "Valentine's Day romance with hearts, roses, love letters, and cozy warmth",
  },
  {
    month: 3,
    name: 'March',
    theme: 'Early spring blossoms, crocuses pushing through snow, breezy pastel skies',
  },
  {
    month: 4,
    name: 'April',
    theme: 'Spring rain showers, puddle-splashing, Easter eggs hidden among daffodils',
  },
  {
    month: 5,
    name: 'May',
    theme: 'Lush garden in full bloom, butterflies, sunshine, and picnic blankets on green grass',
  },
  {
    month: 6,
    name: 'June',
    theme: 'Summer begins — sandy beaches, ocean waves, seashells, and golden sunlight',
  },
  {
    month: 7,
    name: 'July',
    theme: 'Patriotic celebration with fireworks lighting up the night sky, red-white-and-blue bunting',
  },
  {
    month: 8,
    name: 'August',
    theme: 'Vacation adventure — camping, hiking trails, mountain lakes, and starry nights',
  },
  {
    month: 9,
    name: 'September',
    theme: 'Back to school and the first golden leaves of autumn, crisp morning air',
  },
  {
    month: 10,
    name: 'October',
    theme: 'Halloween night with carved pumpkins, costumes, fall foliage, and moonlit mischief',
  },
  {
    month: 11,
    name: 'November',
    theme: 'Thanksgiving warmth — harvest table, falling leaves, cozy blankets, and gratitude',
  },
  {
    month: 12,
    name: 'December',
    theme: 'Holiday magic with twinkling lights, wrapped gifts, evergreen trees, and fresh snowfall',
  },
]

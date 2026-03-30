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
  | 'watercolor'
  | 'oil-painting'
  | 'pop-art'
  | 'cartoon'
  | 'vintage'
  | 'line-art'
  | 'stained-glass'
  | 'japanese-woodblock'
  | 'botanical'
  | 'cozy-seasons'

export interface Project {
  id: string
  user_id: string
  name: string
  pet_name: string | null
  pet_type: PetType
  style: StyleId
  status: ProjectStatus
  start_month: number
  start_year: number
  created_at: string
  updated_at: string
}

export interface PetPhoto {
  id: string
  project_id: string
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
    id: 'watercolor',
    name: 'Watercolor',
    description:
      'Soft, painterly watercolor illustrations with delicate washes of color, visible brushstrokes, and an ethereal, dreamy quality.',
    accentColor: '#7BAFD4',
    preview: '/previews/watercolor.jpg',
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description:
      'Rich, textured oil painting style inspired by the Old Masters — deep shadows, luminous highlights, and classical composition.',
    accentColor: '#8B6914',
    preview: '/previews/oil-painting.jpg',
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description:
      'Bold, vibrant pop art with halftone dots, thick black outlines, and Warhol-inspired color blocks that leap off the page.',
    accentColor: '#FF2D55',
    preview: '/previews/pop-art.jpg',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description:
      'Fun, expressive Disney/Pixar-style cartoon illustrations with exaggerated features, warm lighting, and playful energy.',
    accentColor: '#FF9500',
    preview: '/previews/cartoon.jpg',
  },
  {
    id: 'vintage',
    name: 'Vintage Illustration',
    description:
      'Retro 1950s–60s magazine illustration with muted palettes, mid-century textures, and nostalgic hand-drawn charm.',
    accentColor: '#C4956A',
    preview: '/previews/vintage.jpg',
  },
  {
    id: 'line-art',
    name: 'Minimalist Line Art',
    description:
      'Clean, elegant continuous line drawings with selective accent color — modern, sophisticated, and beautifully simple.',
    accentColor: '#2C2C2E',
    preview: '/previews/line-art.jpg',
  },
  {
    id: 'stained-glass',
    name: 'Stained Glass',
    description:
      'Ornate stained glass window style with bold lead lines, jewel-toned segments, and light-drenched translucent beauty.',
    accentColor: '#5856D6',
    preview: '/previews/stained-glass.jpg',
  },
  {
    id: 'japanese-woodblock',
    name: 'Japanese Woodblock',
    description:
      'Ukiyo-e inspired artwork with flat color planes, delicate outlines, and the serene elegance of traditional Japanese prints.',
    accentColor: '#C0392B',
    preview: '/previews/japanese-woodblock.jpg',
  },
  {
    id: 'botanical',
    name: 'Botanical',
    description:
      'Lush botanical illustration style with your pet surrounded by seasonal flowers, vines, and foliage in rich natural hues.',
    accentColor: '#34A853',
    preview: '/previews/botanical.jpg',
  },
  {
    id: 'cozy-seasons',
    name: 'Cozy Seasons',
    description:
      'Warm, inviting scenes of your pet in seasonal settings — fireplaces, beaches, autumn leaves, and snowy windowsills.',
    accentColor: '#E8825A',
    preview: '/previews/cozy-seasons.jpg',
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

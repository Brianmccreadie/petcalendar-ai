import { CALENDAR_STYLES, type PetType, type StyleId } from './types'

export type StyleCategory = 'outdoors' | 'adventure' | 'funny' | 'glam' | 'cozy' | 'spooky'

export const STYLE_CATEGORIES: { id: StyleCategory; label: string }[] = [
  { id: 'adventure', label: 'Adventure' },
  { id: 'funny', label: 'Funny' },
  { id: 'glam', label: 'Glam' },
  { id: 'outdoors', label: 'Outdoors & travel' },
  { id: 'cozy', label: 'Cozy & seasonal' },
  { id: 'spooky', label: 'Mystery & spooky' },
]

const META: Record<StyleId, { emoji: string; category: StyleCategory }> = {
  'mythical-quest': { emoji: '⚔️', category: 'adventure' },
  'wizarding-world': { emoji: '🧙', category: 'adventure' },
  'space-explorer': { emoji: '🚀', category: 'adventure' },
  'secret-agent': { emoji: '🕵️', category: 'adventure' },
  'prehistoric-adventure': { emoji: '🦕', category: 'adventure' },
  'pirate-life': { emoji: '🏴‍☠️', category: 'adventure' },
  'superhero-origin': { emoji: '🦸', category: 'adventure' },
  'royal-portrait': { emoji: '👑', category: 'glam' },
  'detective-noir': { emoji: '🔍', category: 'spooky' },
  'wild-west': { emoji: '🤠', category: 'adventure' },
  'underwater-odyssey': { emoji: '🐠', category: 'adventure' },
  'high-school-yearbook': { emoji: '🎓', category: 'funny' },
  'professional-headshot': { emoji: '📸', category: 'glam' },
  'pet-photoshoot': { emoji: '🌟', category: 'glam' },
  'cozy-vibes': { emoji: '☕', category: 'cozy' },
  'cooking-show': { emoji: '👨‍🍳', category: 'funny' },
  'rock-star': { emoji: '🎸', category: 'glam' },
  'fashion-week': { emoji: '👗', category: 'glam' },
  'office-life': { emoji: '💼', category: 'funny' },
  'sports-mvp': { emoji: '🏆', category: 'adventure' },
  'around-the-world': { emoji: '🌍', category: 'outdoors' },
  'fairy-tale': { emoji: '🏰', category: 'adventure' },
  'zombie-apocalypse': { emoji: '🧟', category: 'spooky' },
  'renaissance-pet': { emoji: '🎨', category: 'glam' },
  'sitcom-star': { emoji: '📺', category: 'funny' },
  'mad-scientist': { emoji: '🧪', category: 'spooky' },
  'movie-poster': { emoji: '🎬', category: 'glam' },
  'baby-photos': { emoji: '👶', category: 'funny' },
  'fitness-journey': { emoji: '💪', category: 'funny' },
  'art-museum': { emoji: '🖼️', category: 'glam' },
  'holiday-card': { emoji: '🎄', category: 'cozy' },
  'camping-adventures': { emoji: '⛺', category: 'outdoors' },
  'noir-detective': { emoji: '🎞️', category: 'spooky' },
  'tropical-paradise': { emoji: '🌴', category: 'outdoors' },
  'horror-movie': { emoji: '👻', category: 'spooky' },
  'dating-profile': { emoji: '💘', category: 'funny' },
  'true-crime': { emoji: '🔎', category: 'spooky' },
  'reality-tv': { emoji: '📡', category: 'funny' },
  'influencer': { emoji: '📱', category: 'funny' },
  'nap-champion': { emoji: '😴', category: 'cozy' },
  'time-traveler': { emoji: '⏰', category: 'adventure' },
  'video-game-hero': { emoji: '🎮', category: 'adventure' },
  'broadway-star': { emoji: '🎭', category: 'glam' },
  'garden-party': { emoji: '🌷', category: 'cozy' },
  'snow-day': { emoji: '❄️', category: 'cozy' },
  'national-park': { emoji: '🏔️', category: 'outdoors' },
  'tiny-human': { emoji: '🧑', category: 'funny' },
  'anime-world': { emoji: '🌸', category: 'adventure' },
  'galactic-emperor': { emoji: '👾', category: 'adventure' },
  'cottage-core': { emoji: '🏡', category: 'cozy' },
  'renaissance-royals': { emoji: '👑', category: 'glam' },
}

export function styleMeta(id: StyleId) {
  return META[id]
}

export function styleById(id: string | null | undefined) {
  return CALENDAR_STYLES.find((s) => s.id === id)
}

// Sample images that don't exist for a given pet type fall back to the dog shot.
/** Themes added most recently, flagged in the explorer. */
export function isNewStyle(id: StyleId): boolean {
  return id === 'renaissance-royals'
}

const MISSING_PREVIEWS = new Set(['galactic-emperor-cat'])

export function previewSrc(styleId: string, petType: PetType = 'dog'): string {
  const key = `${styleId}-${petType}`
  return `/previews/${MISSING_PREVIEWS.has(key) ? `${styleId}-dog` : key}.jpg`
}

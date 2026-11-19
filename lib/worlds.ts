// Each section of the landing page is a "world": one of the calendar's themes,
// painted as a classical oil painting (scripts/generate-brand-art.mjs) that
// dissolves into the world's own colour.

export interface World {
  id: string
  art: string
  /** Solid colour the painting dissolves into; the section's background. */
  color: string
  tone: 'dark' | 'light'
  alt: string
}

// Repainted worlds get a new file name so cached copies of the old painting are never served.
const FILES: Record<string, string> = { hero: 'hero-blue', heavens: 'heavens-blue' }

const world = (id: string, color: string, tone: World['tone'], alt: string): World => ({
  id,
  art: `/art/${FILES[id] ?? id}.jpg`,
  color,
  tone,
  alt,
})

export const WORLDS = {
  hero: world('hero', '#16305a', 'dark', 'A classical mural of pets as explorers, pirates, wizards, royalty and sheriffs'),
  voyage: world('voyage', '#ffffff', 'light', 'A painting of a dog as a traveller on the quay of an old port city'),
  cosmos: world('cosmos', '#e6f2fc', 'light', 'A painting of a golden retriever floating among stars and planets'),
  deep: world('deep', '#fdeef3', 'light', 'A painting of a crowned cat enthroned in an underwater kingdom'),
  academy: world('academy', '#ffffff', 'light', 'A painting of a small dog in a wizard’s robe in a candlelit library'),
  court: world('court', '#e6f2fc', 'light', 'A painting of a cat and a dog enthroned in royal robes'),
  hearth: world('hearth', '#fdeef3', 'light', 'A painting of a dog asleep on a window seat in morning light'),
  heavens: world('heavens', '#cfe3f2', 'light', 'A painting of winged puppies tumbling through golden clouds'),
} as const

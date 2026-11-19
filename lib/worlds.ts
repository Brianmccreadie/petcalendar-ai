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

const world = (id: string, color: string, tone: World['tone'], alt: string): World => ({
  id,
  art: `/art/${id}.jpg`,
  color,
  tone,
  alt,
})

export const WORLDS = {
  hero: world('hero', '#3b0d10', 'dark', 'A classical mural of pets as explorers, pirates, wizards, royalty and sheriffs'),
  voyage: world('voyage', '#efe3cc', 'light', 'A painting of a dog as a traveller on the quay of an old port city'),
  cosmos: world('cosmos', '#101536', 'dark', 'A painting of a golden retriever floating among stars and planets'),
  deep: world('deep', '#0b2e33', 'dark', 'A painting of a crowned cat enthroned in an underwater kingdom'),
  academy: world('academy', '#1d1228', 'dark', 'A painting of a small dog in a wizard’s robe in a candlelit library'),
  court: world('court', '#0f2f28', 'dark', 'A painting of a cat and a dog enthroned in royal robes'),
  hearth: world('hearth', '#f3e9d7', 'light', 'A painting of a dog asleep on a window seat in morning light'),
  heavens: world('heavens', '#3b0d10', 'dark', 'A painting of winged puppies tumbling through golden clouds'),
} as const

'use client'

import { CALENDAR_STYLES } from '@/lib/types'

const styleEmojis: Record<string, string> = {
  'mythical-quest': '⚔️',
  'wizarding-world': '🧙',
  'space-explorer': '🚀',
  'secret-agent': '🕵️',
  'prehistoric-adventure': '🦕',
  'pirate-life': '🏴‍☠️',
  'superhero-origin': '🦸',
  'royal-portrait': '👑',
  'detective-noir': '🔍',
  'wild-west': '🤠',
  'underwater-odyssey': '🐠',
  'high-school-yearbook': '🎓',
  'professional-headshot': '📸',
  'pet-photoshoot': '🌟',
  'cozy-vibes': '☕',
  'cooking-show': '👨‍🍳',
  'rock-star': '🎸',
  'fashion-week': '👗',
  'office-life': '💼',
  'sports-mvp': '🏆',
  'around-the-world': '🌍',
  'fairy-tale': '🏰',
  'zombie-apocalypse': '🧟',
  'renaissance-pet': '🎨',
  'sitcom-star': '📺',
  'mad-scientist': '🧪',
  'movie-poster': '🎬',
  'baby-photos': '👶',
  'fitness-journey': '💪',
  'art-museum': '🖼️',
  'holiday-card': '🎄',
  'camping-adventures': '⛺',
  'noir-detective': '🎞️',
  'tropical-paradise': '🌴',
  'horror-movie': '👻',
  'dating-profile': '💘',
  'true-crime': '🔎',
  'reality-tv': '📡',
  'influencer': '📱',
  'nap-champion': '😴',
  'time-traveler': '⏰',
  'video-game-hero': '🎮',
  'broadway-star': '🎭',
  'garden-party': '🌷',
  'snow-day': '❄️',
  'national-park': '🏔️',
  'tiny-human': '🧑',
  'anime-world': '🌸',
  'galactic-emperor': '👾',
  'cottage-core': '🏡',
}

import Image from 'next/image'
import type { PetType } from '@/lib/types'

interface StylePickerProps {
  onSelect?: (style: string) => void
  selectedStyle?: string
  showcase?: boolean
  petType?: PetType
}

export default function StylePicker({
  onSelect,
  selectedStyle,
  showcase = false,
  petType = 'dog',
}: StylePickerProps) {
  const getPreviewSrc = (styleId: string) => {
    return `/previews/${styleId}-${petType}.jpg`
  }
  return (
    <section id="styles" className={showcase ? 'py-20 sm:py-28' : ''}>
      <div className={showcase ? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' : ''}>
        {showcase && (
          <div className="text-center mb-16">
            <h2 className="section-heading mx-auto text-center max-w-[624px]">
              Pick an Art Style Your Pet Would Be Proud Of 😎
            </h2>
            <p className="section-details text-center mx-auto max-w-xl">
              Each style transforms your pet photos into a unique art form
            </p>
          </div>
        )}

        {showcase ? (
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0">
            {CALENDAR_STYLES.map((style) => (
              <div
                key={style.id}
                className="snap-start shrink-0 w-64 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className="h-44 flex flex-col items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${style.accentColor}33, ${style.accentColor}66)`,
                  }}
                >
                  <span className="text-5xl mb-2">{styleEmojis[style.id] ?? '🎨'}</span>
                  <span className="text-7xl opacity-10 absolute bottom-2 right-4">🐾</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[var(--ebony)] text-lg">{style.name}</h3>
                  <p className="mt-1.5 text-sm text-[var(--wenge)] leading-relaxed line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CALENDAR_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelect?.(style.id)}
                  className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'ring-4 ring-[var(--purple)] shadow-xl -translate-y-1'
                      : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-[var(--purple)]/10'
                  }`}
                >
                  {/* Preview image */}
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={getPreviewSrc(style.id)}
                      alt={style.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="300px"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center text-lg shadow-sm">
                      {styleEmojis[style.id] ?? '🎨'}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 rounded-full bg-[var(--green)] px-3 py-1 text-xs font-bold text-white shadow-lg">
                        ✓ Selected!
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4">
                    <h3 className="font-bold text-[var(--ebony)]">{style.name}</h3>
                    <p className="mt-1 text-sm text-[var(--wenge)] leading-relaxed line-clamp-2">
                      {style.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

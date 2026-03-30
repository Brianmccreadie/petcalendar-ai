'use client'

import { CALENDAR_STYLES } from '@/lib/types'

const styleEmojis: Record<string, string> = {
  watercolor: '💧',
  'oil-painting': '🖼️',
  'pop-art': '🎭',
  cartoon: '🎬',
  vintage: '📷',
  'line-art': '✏️',
  'stained-glass': '🪟',
  'japanese-woodblock': '🏯',
  botanical: '🌸',
  'cozy-seasons': '🧣',
}

interface StylePickerProps {
  onSelect?: (style: string) => void
  selectedStyle?: string
  showcase?: boolean
}

export default function StylePicker({
  onSelect,
  selectedStyle,
  showcase = false,
}: StylePickerProps) {
  return (
    <section id="styles" className={showcase ? 'bg-[#FFF8F0] py-20 sm:py-28' : ''}>
      <div className={showcase ? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' : ''}>
        {showcase && (
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              Pick an Art Style Your Pet Would Be Proud Of 😎
            </h2>
            <p className="mt-4 text-lg text-[#2D1B69]/60 max-w-xl mx-auto">
              Each style transforms your pet photos into a unique art form
            </p>
          </div>
        )}

        {/* Horizontal scroll on showcase, grid on picker */}
        {showcase ? (
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0">
            {CALENDAR_STYLES.map((style) => (
              <div
                key={style.id}
                className="snap-start shrink-0 w-64 rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl hover-tilt transition-all duration-300 border border-[#FF6B35]/8"
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
                  <h3 className="font-extrabold text-[#2D1B69] text-lg">{style.name}</h3>
                  <p className="mt-1.5 text-sm text-[#2D1B69]/50 leading-relaxed line-clamp-2">
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
                  className={`group relative text-left rounded-3xl overflow-hidden transition-all duration-300 hover-wiggle ${
                    isSelected
                      ? 'ring-4 ring-[#FF6B35] shadow-xl -translate-y-1'
                      : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-[#FF6B35]/8'
                  }`}
                >
                  {/* Gradient color block */}
                  <div
                    className="h-36 flex flex-col items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${style.accentColor}33, ${style.accentColor}66)`,
                    }}
                  >
                    <span className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300">
                      {styleEmojis[style.id] ?? '🎨'}
                    </span>
                    <span className="text-7xl opacity-10 absolute bottom-2 right-4">🐾</span>
                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 rounded-full bg-[#FF6B35] px-3 py-1 text-xs font-bold text-white shadow-lg">
                        ✓ Selected!
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-white p-4">
                    <h3 className="font-extrabold text-[#2D1B69]">{style.name}</h3>
                    <p className="mt-1 text-sm text-[#2D1B69]/50 leading-relaxed line-clamp-2">
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

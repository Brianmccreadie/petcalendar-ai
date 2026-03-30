'use client'

import { CALENDAR_STYLES } from '@/lib/types'

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
    <section id="styles" className={showcase ? 'bg-gray-50 py-20 sm:py-28' : ''}>
      <div className={showcase ? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' : ''}>
        {showcase && (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Choose Your Style
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Each style transforms your pet photos into a unique art form
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CALENDAR_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id
            return (
              <button
                key={style.id}
                type="button"
                disabled={showcase}
                onClick={() => onSelect?.(style.id)}
                className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                  showcase
                    ? 'cursor-default hover:shadow-lg hover:-translate-y-1'
                    : isSelected
                      ? 'ring-3 ring-[#7C3AED] shadow-xl -translate-y-1'
                      : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                }`}
              >
                {/* Gradient color block */}
                <div
                  className="h-32 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${style.accentColor}CC, ${style.accentColor})`,
                  }}
                >
                  <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    🐾
                  </span>
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="bg-white p-4">
                  <h3 className="font-bold text-gray-900">{style.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

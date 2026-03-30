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
    <section id="styles" className={showcase ? 'bg-[#FFFBF5] py-20 sm:py-28' : ''}>
      <div className={showcase ? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' : ''}>
        {showcase && (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              10 Stunning Art Styles
            </h2>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Each month of your calendar is a unique masterpiece in your chosen style
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CALENDAR_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id
            return (
              <button
                key={style.id}
                type="button"
                disabled={showcase}
                onClick={() => onSelect?.(style.id)}
                className={`group relative text-left rounded-2xl bg-white overflow-hidden border-2 transition-all duration-300 ${
                  showcase
                    ? 'cursor-default border-gray-100 hover:shadow-lg hover:-translate-y-1'
                    : isSelected
                      ? 'border-transparent ring-2 ring-offset-2 shadow-xl -translate-y-1'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                }`}
                style={
                  isSelected
                    ? { boxShadow: `0 0 0 2px ${style.accentColor}, 0 20px 40px -12px ${style.accentColor}33` }
                    : undefined
                }
              >
                {/* Accent bar */}
                <div className="h-1.5" style={{ backgroundColor: style.accentColor }} />

                {/* Selected checkmark */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: style.accentColor }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                )}

                {/* Preview area */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      background: `radial-gradient(circle at 30% 40%, ${style.accentColor}, transparent 70%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform duration-300">
                      🐾
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: style.accentColor }}
                    >
                      Preview
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{style.name}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {style.description}
                  </p>
                </div>

                {/* Selected border overlay */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                    style={{ borderColor: style.accentColor }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFBF5]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50/50 to-orange-50/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-200/20 to-pink-200/20 blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-4 py-1.5 text-sm font-medium text-purple-700 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
              </span>
              AI-Powered Pet Calendars
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Turn Your Pet Into a{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Work of Art
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              AI-powered personalized calendars featuring your furry friend in{' '}
              <strong className="text-gray-800">10 stunning art styles</strong>.
              Upload photos, pick a style, and we&apos;ll create something magical.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Your Calendar
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#styles"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 transition-all duration-300"
              >
                See Styles
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 sm:w-96">
              {/* Calendar mockup */}
              <div className="relative rounded-2xl bg-white shadow-2xl shadow-purple-500/10 overflow-hidden border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-200 via-pink-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl block mb-2">🐾</span>
                    <p className="text-sm font-medium text-purple-600/60">Your pet, reimagined</p>
                  </div>
                </div>
                {/* Calendar strip */}
                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">January 2026</p>
                  <div className="grid grid-cols-7 gap-1 text-xs text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <span key={i} className="text-gray-400 font-medium pb-1">
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => (
                      <span
                        key={i}
                        className={`rounded-full w-6 h-6 flex items-center justify-center mx-auto ${
                          i + 1 === 15
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold'
                            : 'text-gray-600'
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating style badges */}
              <div className="absolute -left-6 top-8 rounded-xl bg-white shadow-lg px-3 py-2 text-sm font-medium text-gray-700 border border-gray-100 -rotate-6 animate-float">
                🎨 Watercolor
              </div>
              <div className="absolute -right-4 bottom-24 rounded-xl bg-white shadow-lg px-3 py-2 text-sm font-medium text-gray-700 border border-gray-100 rotate-3 animate-float-delayed">
                ✨ Pop Art
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {[
            { icon: '🎨', label: '10 Art Styles', desc: 'From watercolor to pop art' },
            { icon: '📦', label: 'Free Shipping', desc: 'Anywhere in the US' },
            { icon: '⭐', label: 'Premium Quality', desc: 'Thick matte paper' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{badge.label}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

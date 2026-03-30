import Link from 'next/link'

const petEmojis = ['🐕', '🐈', '🐾', '🦮', '🐩', '🐱']

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#7C3AED] to-[#6D28D9]">
      {/* Subtle watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[12rem] sm:text-[18rem] font-black text-white/[0.04] tracking-tighter whitespace-nowrap">
          PETS
        </span>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-700/30 blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn Your Pet Photos Into a{' '}
            <span className="text-purple-200">Stunning Calendar</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-purple-100/90 leading-relaxed max-w-2xl mx-auto">
            Upload a few photos. Pick a style. AI creates 12 beautiful monthly
            portraits. Printed and shipped to your door.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-[#7C3AED] shadow-xl hover:bg-purple-50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Create My Calendar →
            </Link>
            <a
              href="#styles"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300"
            >
              See Examples
            </a>
          </div>

          {/* Pet emoji row */}
          <div className="mt-14 flex items-center justify-center gap-4">
            {petEmojis.map((emoji, i) => (
              <div
                key={i}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl sm:text-3xl backdrop-blur-sm border border-white/10"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

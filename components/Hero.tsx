import Link from 'next/link'

const petPills = [
  { emoji: '🐕', label: 'Dogs' },
  { emoji: '🐱', label: 'Cats' },
  { emoji: '🐰', label: 'Rabbits' },
  { emoji: '🐴', label: 'Horses' },
  { emoji: '🦜', label: 'Birds' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFBF5] paw-pattern">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="heading-playful text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D1B69]">
              Your Pet. Every Month.{' '}
              <span className="text-[#FF6B35]">As a Masterpiece.</span>{' '}
              <span className="inline-block animate-bounce-gentle">🎨</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#2D1B69]/70 leading-relaxed max-w-xl">
              Upload a few photos of your furry friend. Our AI turns them into 12 stunning artworks.
              We print it as a gorgeous wall calendar and ship it to your door.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="btn-primary text-center"
              >
                Start Creating — It Takes 5 Minutes →
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#2D1B69]/60">
              <span className="text-[#FFD166]">⭐⭐⭐⭐⭐</span>
              <span className="font-medium">Loved by 2,000+ pet parents</span>
            </div>

            {/* Pet type pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {petPills.map((pet) => (
                <span
                  key={pet.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2D1B69]/70 border border-[#FF6B35]/10 shadow-sm"
                >
                  {pet.emoji} {pet.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Scattered calendar preview cards */}
          <div className="relative h-[400px] sm:h-[480px] hidden lg:block">
            {/* Card 1 - back left, tilted */}
            <div className="absolute top-8 left-4 w-52 h-64 rounded-3xl bg-gradient-to-br from-[#FFD166]/40 to-[#FF6B35]/30 shadow-xl rotate-[-8deg] animate-float overflow-hidden border-4 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-60">🎨</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3">
                <p className="text-xs font-bold text-[#2D1B69]">March — Watercolor</p>
              </div>
            </div>

            {/* Card 2 - center, prominent */}
            <div className="absolute top-16 left-28 w-56 h-72 rounded-3xl bg-gradient-to-br from-[#06D6A0]/30 to-[#FFD166]/30 shadow-2xl rotate-[3deg] animate-float-delayed z-10 overflow-hidden border-4 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-60">🐕</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3">
                <p className="text-xs font-bold text-[#2D1B69]">Cover — Pop Art</p>
              </div>
            </div>

            {/* Card 3 - right, slightly tilted */}
            <div className="absolute top-4 right-4 w-48 h-60 rounded-3xl bg-gradient-to-br from-[#7C3AED]/20 to-[#FF6B35]/20 shadow-xl rotate-[12deg] animate-float overflow-hidden border-4 border-white" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-60">🖼️</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3">
                <p className="text-xs font-bold text-[#2D1B69]">July — Oil Painting</p>
              </div>
            </div>

            {/* Card 4 - small, bottom */}
            <div className="absolute bottom-4 left-16 w-44 h-56 rounded-3xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD166]/30 shadow-lg rotate-[-4deg] animate-float-delayed overflow-hidden border-4 border-white" style={{ animationDelay: '2s' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-60">🐱</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3">
                <p className="text-xs font-bold text-[#2D1B69]">December — Cozy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

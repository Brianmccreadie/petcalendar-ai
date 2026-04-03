import Link from 'next/link'
import Image from 'next/image'

const petPills = [
  { emoji: '🐕', label: 'Dogs' },
  { emoji: '🐱', label: 'Cats' },
  { emoji: '🐰', label: 'Rabbits' },
  { emoji: '🐴', label: 'Horses' },
  { emoji: '🦜', label: 'Birds' },
]

const heroCards = [
  { src: '/previews/hero-1.jpg', label: 'Bonnie is a Wizard! 🧙', rotate: '-rotate-[10deg]', pos: 'top-0 -left-2', size: 'w-44 h-56', z: 'z-[1]', delay: '' },
  { src: '/previews/hero-2.jpg', label: 'Charlie is a Superhero! 🦸', rotate: 'rotate-[2deg]', pos: 'top-6 left-[25%]', size: 'w-52 h-64', z: 'z-[3]', delay: 'animate-float-delayed' },
  { src: '/previews/hero-3.jpg', label: 'Luna Explores Space! 🚀', rotate: 'rotate-[8deg]', pos: '-top-2 right-[15%]', size: 'w-48 h-60', z: 'z-[2]', delay: '' },
  { src: '/previews/hero-4.jpg', label: 'Daisy Loves the Holidays! 🎄', rotate: '-rotate-[5deg]', pos: 'top-[200px] left-6', size: 'w-40 h-52', z: 'z-[2]', delay: 'animate-float-delayed' },
  { src: '/previews/hero-5.jpg', label: 'Captain Kiwi! 🏴‍☠️', rotate: 'rotate-[14deg]', pos: '-top-4 -right-4', size: 'w-36 h-48', z: 'z-[1]', delay: '' },
  { src: '/previews/hero-6.jpg', label: 'Detective Whiskers 🔍', rotate: '-rotate-[3deg]', pos: 'top-[220px] left-[40%]', size: 'w-44 h-56', z: 'z-[4]', delay: '' },
  { src: '/previews/hero-7.jpg', label: 'Professor Nugget! 🎓', rotate: 'rotate-[6deg]', pos: 'top-[180px] right-0', size: 'w-38 h-50', z: 'z-[1]', delay: 'animate-float-delayed' },
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
              Upload a few photos of your furry friend. Pick a fun theme — from Wizarding World to Secret Agent.
              We generate 12 stunning images and print a gorgeous wall calendar shipped to your door.
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

          {/* Right: 7 Floating calendar preview cards */}
          <div className="relative h-[420px] sm:h-[500px] hidden lg:block">
            {heroCards.map((card, i) => (
              <div
                key={i}
                className={`absolute ${card.pos} ${card.size} ${card.rotate} ${card.z} ${card.delay || 'animate-float'} rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-3 py-2">
                  <p className="text-[10px] sm:text-xs font-bold text-[#2D1B69] truncate">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

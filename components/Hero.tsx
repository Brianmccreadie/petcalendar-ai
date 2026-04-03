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

/* ===== Hand-drawn SVG doodles — BLACK, THICK, 100% OPACITY ===== */

function PawDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="3.5" fill="currentColor"/>
      <circle cx="22" cy="6" r="3.5" fill="currentColor"/>
      <circle cx="5" cy="14" r="3" fill="currentColor"/>
      <circle cx="27" cy="14" r="3" fill="currentColor"/>
      <ellipse cx="16" cy="22" rx="7" ry="6" fill="currentColor"/>
    </svg>
  )
}

function BoneDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="24" height="6" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="9" cy="5" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="9" cy="17" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="35" cy="5" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="35" cy="17" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    </svg>
  )
}

function BurstDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="2" x2="15" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="6" x2="20" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="15" y1="28" x2="15" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function DotCluster({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="10" r="2.5" fill="currentColor"/>
      <circle cx="12" cy="5" r="2" fill="currentColor"/>
      <circle cx="16" cy="14" r="2.5" fill="currentColor"/>
    </svg>
  )
}

function SmallPaw({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="4" r="2" fill="currentColor"/>
      <circle cx="14" cy="4" r="2" fill="currentColor"/>
      <circle cx="3" cy="9" r="1.8" fill="currentColor"/>
      <circle cx="17" cy="9" r="1.8" fill="currentColor"/>
      <ellipse cx="10" cy="14" rx="4.5" ry="3.5" fill="currentColor"/>
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5EDE8] paw-pattern">
      {/* Scattered doodle decorations — BLACK, THICK, FULL OPACITY */}
      <PawDoodle className="absolute top-12 left-[8%] text-black w-8 h-8 rotate-[-15deg] animate-doodle" />
      <BoneDoodle className="absolute top-32 right-[5%] text-black w-12 h-6 rotate-[25deg] animate-doodle" />
      <BurstDoodle className="absolute bottom-24 left-[12%] text-black w-7 h-7 animate-doodle" />
      <SmallPaw className="absolute top-20 left-[45%] text-black w-5 h-5 rotate-[10deg] animate-doodle" />
      <DotCluster className="absolute bottom-16 right-[15%] text-black w-5 h-5 animate-doodle" />
      <BurstDoodle className="absolute bottom-40 left-[30%] text-black w-6 h-6 rotate-[45deg]" />
      <PawDoodle className="absolute top-[60%] right-[8%] text-black w-6 h-6 rotate-[30deg] animate-doodle" />
      <DotCluster className="absolute top-8 right-[35%] text-black w-5 h-5 animate-doodle" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="heading-playful text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E]">
              Where Happy Tails{' '}
              <span className="text-[#FF6B35]">Begin</span>{' '}
              <span className="inline-block animate-bounce-gentle">🎨</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#1A1A2E]/70 leading-relaxed max-w-xl">
              Upload a few photos of your furry friend. Pick a fun theme — from Wizarding World to Secret Agent.
              We generate 12 stunning images and print a gorgeous wall calendar shipped to your door.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/create"
                className="btn-sketchy text-center"
              >
                Book a Visit →
              </Link>
              <Link
                href="#how-it-works"
                className="text-[#1A1A2E]/60 font-bold hover:text-[#1A1A2E] transition-colors py-4 px-2"
              >
                See Our Services
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#1A1A2E]/60">
              <span className="text-[#FFD166]">⭐⭐⭐⭐⭐</span>
              <span className="font-medium">Loved by 2,000+ pet parents</span>
            </div>

            {/* Pet type pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {petPills.map((pet) => (
                <span
                  key={pet.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#B8DCEF]/25 px-4 py-2 text-sm font-medium text-[#1A1A2E]/70 border-2 border-[#1A1A2E]/15 shadow-sm"
                >
                  {pet.emoji} {pet.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: 7 Floating calendar preview cards with HAND-DRAWN BLOB */}
          <div className="relative h-[420px] sm:h-[500px] hidden lg:block">
            {/* Sky blue blob shape — OPAQUE fill, THICK WOBBLY BLACK border */}
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: 0}} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M248,18 C290,12 338,28 375,58 C412,88 445,108 462,155 C479,202 488,248 478,298 C468,348 452,382 418,415 C384,448 342,472 295,482 C248,492 198,488 155,468 C112,448 72,418 48,375 C24,332 12,282 18,232 C24,182 52,138 88,102 C124,66 168,32 210,22 C228,18 238,16 248,18 Z"
                fill="#B8DCEF"
                stroke="#1A1A2E"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Doodles around the blob edges — BLACK, THICK */}
            <BurstDoodle className="absolute -top-2 left-[15%] text-black w-7 h-7 animate-doodle" />
            <BoneDoodle className="absolute -top-6 right-[20%] text-black w-10 h-5 rotate-[-20deg] animate-doodle" />
            <SmallPaw className="absolute bottom-4 right-[10%] text-black w-5 h-5 rotate-[15deg] animate-doodle" />
            <BurstDoodle className="absolute top-[45%] -left-4 text-black w-6 h-6 rotate-[30deg] animate-doodle" />
            <DotCluster className="absolute bottom-8 left-[15%] text-black w-5 h-5" />
            <BurstDoodle className="absolute top-[70%] -right-2 text-black w-6 h-6 rotate-[-15deg] animate-doodle" />

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
                  <p className="text-[10px] sm:text-xs font-bold text-[#1A1A2E] truncate">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

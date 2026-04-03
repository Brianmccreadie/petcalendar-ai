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

/* Hand-drawn SVG doodles */
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
    <svg className={className} width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="7" width="24" height="6" rx="3" fill="currentColor"/>
      <circle cx="7" cy="5" r="4" fill="currentColor"/>
      <circle cx="7" cy="15" r="4" fill="currentColor"/>
      <circle cx="33" cy="5" r="4" fill="currentColor"/>
      <circle cx="33" cy="15" r="4" fill="currentColor"/>
    </svg>
  )
}

function SparkDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 9.5L20 12L13.5 14.5L12 22L10.5 14.5L4 12L10.5 9.5L12 2Z" fill="currentColor"/>
    </svg>
  )
}

function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 2 14 2 7.5C2 4 4.5 2 7.5 2C9.5 2 11 3.5 12 4.5C13 3.5 14.5 2 16.5 2C19.5 2 22 4 22 7.5C22 14 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SquigglyDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="80" height="12" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C10 2 14 10 22 6C30 2 34 10 42 6C50 2 54 10 62 6C70 2 74 10 78 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function DotCluster({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="10" r="2.5" fill="currentColor"/>
      <circle cx="12" cy="5" r="2" fill="currentColor"/>
      <circle cx="15" cy="14" r="2.5" fill="currentColor"/>
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFCFA] paw-pattern">
      {/* Scattered doodle decorations */}
      <PawDoodle className="absolute top-12 left-[8%] text-[#2D1B69] opacity-40 animate-doodle w-8 h-8 rotate-[-15deg]" />
      <BoneDoodle className="absolute top-32 right-[5%] text-[#2D1B69] opacity-35 animate-doodle w-10 h-5 rotate-[25deg]" />
      <SparkDoodle className="absolute bottom-24 left-[12%] text-[#2D1B69] opacity-30 animate-doodle w-6 h-6" />
      <HeartDoodle className="absolute top-20 left-[45%] text-[#2D1B69] opacity-35 animate-doodle w-5 h-5 rotate-[10deg]" />
      <DotCluster className="absolute bottom-16 right-[15%] text-[#2D1B69] opacity-40 animate-doodle w-5 h-5" />
      <SquigglyDoodle className="absolute bottom-40 left-[30%] text-[#2D1B69] opacity-35 w-20 h-3" />
      <PawDoodle className="absolute top-[60%] right-[8%] text-[#2D1B69] opacity-30 animate-doodle w-6 h-6 rotate-[30deg]" />
      <SparkDoodle className="absolute top-8 right-[35%] text-[#2D1B69] opacity-40 animate-doodle w-5 h-5" />

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
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#89CFF0]/15 px-4 py-2 text-sm font-medium text-[#2D1B69]/70 border border-[#89CFF0]/25 shadow-sm"
                >
                  {pet.emoji} {pet.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: 7 Floating calendar preview cards */}
          <div className="relative h-[420px] sm:h-[500px] hidden lg:block">
            {/* Sky blue blob shape behind cards */}
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: 0}} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250,20 C350,10 450,80 470,180 C490,280 450,380 380,440 C310,500 200,490 120,430 C40,370 10,260 30,160 C50,60 150,30 250,20 Z" fill="#89CFF0" fillOpacity="0.25" stroke="#2D1B69" strokeWidth="2" strokeOpacity="0.15" strokeDasharray="8 6" />
            </svg>

            {/* Doodles around the cards */}
            <BoneDoodle className="absolute -top-6 left-[20%] text-[#2D1B69] opacity-40 w-8 h-4 rotate-[-20deg] animate-doodle" />
            <PawDoodle className="absolute bottom-4 right-[10%] text-[#2D1B69] opacity-40 w-7 h-7 rotate-[15deg] animate-doodle" />
            <SparkDoodle className="absolute top-[40%] -left-4 text-[#2D1B69] opacity-35 w-5 h-5 animate-doodle" />

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

import Link from 'next/link'
import Image from 'next/image'

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
    <section className="relative overflow-hidden -mt-[96px] pt-[96px]" style={{
      backgroundImage: 'url(/webflow/Hero-Bg-V1.png)',
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <div className="relative z-10 mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
          {/* Left: Content */}
          <div className="max-w-[500px]">
            {/* Top title with bone icon */}
            <div className="flex items-center gap-2 mb-5">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> AI-powered
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.15] text-[var(--ebony)] capitalize mb-5">
              Your Pet. Every Month. As a Masterpiece.
            </h1>

            <p className="text-lg font-medium leading-7 text-[var(--wenge)] mb-8 max-w-[500px]">
              Upload a few photos of your furry friend. Pick a fun theme — from Wizarding World to Secret Agent.
              We generate 12 stunning images and print a gorgeous wall calendar shipped to your door.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/create" className="btn-primary">
                <span className="btn-text">Start Creating</span>
                <span className="btn-arrow">→</span>
                <span className="btn-circle"></span>
              </Link>
              <Link href="/#themes" className="btn-secondary">
                <span className="btn-text">See Themes</span>
                <span className="btn-arrow">→</span>
                <span className="btn-circle"></span>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-2 text-sm text-[var(--wenge)]">
              <span className="text-[var(--yellow)]">⭐⭐⭐⭐⭐</span>
              <span className="font-semibold">Loved by 2,000+ pet parents</span>
            </div>
          </div>

          {/* Right: Floating cards + background blob */}
          <div className="relative h-[420px] sm:h-[500px] w-full max-w-[580px] hidden lg:block">
            {/* Background blob image */}
            <Image
              src="/webflow/Banner-BgV1.png"
              alt=""
              width={813}
              height={700}
              className="absolute top-0 right-0 max-w-[100%] h-full max-h-[91%] object-contain"
              style={{ zIndex: 0 }}
              priority
            />

            {/* Floating calendar cards */}
            {heroCards.map((card, i) => (
              <div
                key={i}
                className={`absolute ${card.pos} ${card.size} ${card.rotate} ${card.z} ${card.delay || 'animate-float'} rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500`}
                style={{ animationDelay: `${i * 0.4}s`, zIndex: card.z === 'z-[4]' ? 4 : card.z === 'z-[3]' ? 3 : card.z === 'z-[2]' ? 2 : 1 }}
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
                  <p className="text-[10px] sm:text-xs font-bold text-[var(--ebony)] truncate">{card.label}</p>
                </div>
              </div>
            ))}

            {/* Comment box badges */}
            <div className="comment-box" style={{ top: '80px', left: '-30px', zIndex: 10 }}>
              <div className="comment-icon">
                <span className="text-white text-xl">⭐</span>
              </div>
              <div className="comment-title">2,000+ Pet Parents</div>
            </div>

            <div className="comment-box" style={{ bottom: '120px', left: '-60px', zIndex: 10 }}>
              <div className="comment-icon">
                <span className="text-white text-xl">🐾</span>
              </div>
              <div className="comment-title">50 Fun Themes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

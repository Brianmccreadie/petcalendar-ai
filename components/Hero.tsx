import Link from 'next/link'
import Image from 'next/image'

const heroCards = [
  { src: '/previews/hero-1.jpg', label: 'Bonnie is a Wizard! 🧙', rotate: '-rotate-[10deg]', pos: 'top-0 left-0', size: 'w-40 h-48', z: 1 },
  { src: '/previews/hero-2.jpg', label: 'Charlie is a Superhero! 🦸', rotate: 'rotate-[3deg]', pos: 'top-4 left-[28%]', size: 'w-48 h-56', z: 3 },
  { src: '/previews/hero-3.jpg', label: 'Luna Explores Space! 🚀', rotate: 'rotate-[8deg]', pos: '-top-2 right-[12%]', size: 'w-44 h-52', z: 2 },
  { src: '/previews/hero-4.jpg', label: 'Daisy Loves the Holidays! 🎄', rotate: '-rotate-[5deg]', pos: 'top-[190px] left-2', size: 'w-36 h-44', z: 2 },
  { src: '/previews/hero-5.jpg', label: 'Captain Kiwi! 🏴‍☠️', rotate: 'rotate-[12deg]', pos: '-top-4 -right-2', size: 'w-32 h-40', z: 1 },
  { src: '/previews/hero-6.jpg', label: 'Detective Whiskers 🔍', rotate: '-rotate-[3deg]', pos: 'top-[210px] left-[38%]', size: 'w-40 h-48', z: 4 },
  { src: '/previews/hero-7.jpg', label: 'Professor Nugget! 🎓', rotate: 'rotate-[6deg]', pos: 'top-[170px] right-0', size: 'w-36 h-44', z: 1 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden -mt-[96px] pt-[96px]" style={{
      backgroundImage: 'url(/webflow/Hero-Bg-V1.png)',
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Top title with bone icon */}
            <div className="flex items-center gap-2 mb-4">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> AI-Powered
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-[var(--ebony)] mb-5">
              Your Pet.<br />
              Every Month.<br />
              <span className="text-[var(--purple)]">As a Masterpiece.</span>
            </h1>

            <p className="text-lg font-medium leading-7 text-[var(--wenge)] mb-8 max-w-[480px]">
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
            <div className="mt-6 flex items-center gap-2 text-sm text-[var(--wenge)]">
              <span className="text-[var(--yellow)]">⭐⭐⭐⭐⭐</span>
              <span className="font-semibold">Loved by 2,000+ pet parents</span>
            </div>
          </div>

          {/* Right: Floating cards */}
          <div className="relative h-[380px] sm:h-[440px] hidden lg:block">
            {/* Background blob */}
            <Image
              src="/webflow/Banner-BgV1.png"
              alt=""
              width={813}
              height={700}
              className="absolute -top-8 -right-8 w-[110%] h-[110%] object-contain"
              style={{ zIndex: 0 }}
              priority
            />

            {/* Floating calendar cards — image only, labels below */}
            {heroCards.map((card, i) => (
              <div
                key={i}
                className={`absolute ${card.pos} ${card.size} ${card.rotate} ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'} flex flex-col`}
                style={{ animationDelay: `${i * 0.4}s`, zIndex: card.z }}
              >
                {/* Image card */}
                <div className="relative w-full flex-1 rounded-xl overflow-hidden border-[3px] border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500">
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                {/* Label BELOW the image */}
                <div className="mt-1 bg-white rounded-lg px-2 py-1 shadow-md">
                  <p className="text-[9px] font-bold text-[var(--ebony)] truncate text-center">{card.label}</p>
                </div>
              </div>
            ))}

            {/* Floating badges */}
            <div className="comment-box" style={{ top: '60px', left: '-40px', zIndex: 10 }}>
              <div className="comment-icon">
                <span className="text-white text-lg">⭐</span>
              </div>
              <div className="comment-title">2,000+ Pet Parents</div>
            </div>

            <div className="comment-box" style={{ bottom: '60px', left: '-50px', zIndex: 10 }}>
              <div className="comment-icon">
                <span className="text-white text-lg">🐾</span>
              </div>
              <div className="comment-title">50 Fun Themes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

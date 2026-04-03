import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import PricingSection from '@/components/PricingSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { CALENDAR_STYLES } from '@/lib/types'

const testimonials = [
  {
    quote: 'My mom cried happy tears when she opened this as a Christmas gift. Buddy as a Space Explorer was INCREDIBLE!',
    name: 'Sarah & Buddy the Golden',
    emoji: '🐕',
  },
  {
    quote: 'I ordered three — one for me, one for my sister, one for my vet. Luna is basically a celebrity now.',
    name: 'Jessica & Luna the Tabby',
    emoji: '🐱',
  },
  {
    quote: 'The pop art style turned my pug into Andy Warhol art. It hangs in my office and everyone asks about it!',
    name: 'Mike & Biscuit the Pug',
    emoji: '🐕',
  },
]

const featuredThemes = [
  { id: 'wizarding-world' as const, emoji: '🧙', pet: 'cat' },
  { id: 'space-explorer' as const, emoji: '🚀', pet: 'dog' },
  { id: 'secret-agent' as const, emoji: '🕵️', pet: 'cat' },
  { id: 'superhero-origin' as const, emoji: '🦸', pet: 'dog' },
  { id: 'pirate-life' as const, emoji: '🏴‍☠️', pet: 'other' },
  { id: 'high-school-yearbook' as const, emoji: '📸', pet: 'cat' },
  { id: 'cozy-vibes' as const, emoji: '☕', pet: 'dog' },
  { id: 'tiny-human' as const, emoji: '🛒', pet: 'other' },
]

const productFeatures = [
  { emoji: '📏', text: '11 x 8.5 inch wall calendar' },
  { emoji: '📄', text: 'Premium 100# glossy paper' },
  { emoji: '🔗', text: 'Wire-O binding (lays flat!)' },
  { emoji: '🎨', text: '12 unique AI artworks of YOUR pet' },
  { emoji: '📅', text: 'Dated monthly grids' },
  { emoji: '📦', text: 'Free shipping' },
  { emoji: '❤️', text: 'Satisfaction guaranteed' },
]

/* Doodle SVG components for section dividers */
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

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Doodle divider */}
      <div className="flex items-center justify-center gap-4 py-2 bg-[#FFFCFA]">
        <PawDoodle className="w-5 h-5 text-[#2D1B69] opacity-40" />
        <SquigglyDoodle className="w-16 h-3 text-[#2D1B69] opacity-40" />
        <SparkDoodle className="w-4 h-4 text-[#2D1B69] opacity-35" />
      </div>

      {/* Featured Themes */}
      <section className="relative bg-[#FFFCFA] py-20 sm:py-28">
        <BoneDoodle className="absolute top-10 left-[6%] text-[#2D1B69] opacity-35 w-9 h-5 rotate-[-15deg] animate-doodle" />
        <SparkDoodle className="absolute bottom-14 right-[8%] text-[#2D1B69] opacity-30 w-5 h-5 animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              50 Themes to Choose From
            </h2>
            <p className="mt-4 text-lg text-[#2D1B69]/60">Here are a few of our favorites</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredThemes.map((theme) => {
              const style = CALENDAR_STYLES.find((s) => s.id === theme.id)
              if (!style) return null
              return (
                <div
                  key={style.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-[#89CFF0]/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[3/2] bg-gradient-to-br from-[#89CFF0]/15 to-[#B8DCEF]/20">
                    <Image
                      src={`/previews/${theme.id}-${theme.pet}.jpg`}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="font-bold text-[#2D1B69] text-sm sm:text-base flex items-center gap-1.5">
                      <span>{theme.emoji}</span>
                      {style.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[#2D1B69]/60 mt-1 line-clamp-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E55A2B] hover:-translate-y-0.5 transition-all duration-300"
            >
              See All 50 Themes →
            </Link>
          </div>
        </div>
      </section>

      {/* Doodle divider */}
      <div className="flex items-center justify-center gap-4 py-2 bg-white">
        <HeartDoodle className="w-4 h-4 text-[#2D1B69] opacity-40" />
        <SquigglyDoodle className="w-16 h-3 text-[#2D1B69] opacity-35" />
        <PawDoodle className="w-5 h-5 text-[#2D1B69] opacity-40" />
      </div>

      {/* Testimonials */}
      <section className="relative bg-white py-20 sm:py-28">
        <PawDoodle className="absolute top-12 right-[10%] text-[#2D1B69] opacity-35 w-7 h-7 rotate-[20deg] animate-doodle" />
        <HeartDoodle className="absolute bottom-16 left-[6%] text-[#2D1B69] opacity-35 w-6 h-5 rotate-[-10deg] animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              Pet Parents Love Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#E8F4FD] p-8 relative border border-[#89CFF0]/20"
              >
                <span className="text-5xl text-[#89CFF0]/30 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-[#2D1B69]/70 leading-relaxed mt-6 mb-6 relative z-10">
                  {t.quote}
                </p>
                <p className="text-sm font-bold text-[#2D1B69] flex items-center gap-2">
                  <span>{t.emoji}</span>
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="relative bg-[#FFFCFA] py-20 sm:py-28">
        <BoneDoodle className="absolute top-8 right-[12%] text-[#2D1B69] opacity-35 w-8 h-4 rotate-[30deg] animate-doodle" />
        <SparkDoodle className="absolute bottom-20 left-[10%] text-[#2D1B69] opacity-30 w-5 h-5 animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              What You Get
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            {/* Tilted calendar mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 h-80 rounded-3xl bg-gradient-to-br from-[#89CFF0]/15 via-[#B8DCEF]/15 to-[#FFD166]/10 border-4 border-white shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                <Image
                  src="/calendar-hero-mockup.png"
                  alt="Pet calendar mockup"
                  fill
                  className="object-contain p-2"
                  sizes="288px"
                />
              </div>
              {/* Shadow card behind */}
              <div className="absolute -bottom-3 -right-3 w-72 h-80 rounded-3xl bg-[#89CFF0]/10 border-4 border-white rotate-[4deg] -z-10" />
            </div>

            {/* Feature list */}
            <div>
              <ul className="space-y-4">
                {productFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-4">
                    <span className="text-2xl">{feature.emoji}</span>
                    <span className="text-lg font-medium text-[#2D1B69]/80">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <FAQ />

      {/* Doodle divider above CTA */}
      <div className="flex items-center justify-center gap-4 py-2 bg-[#FFFCFA]">
        <SparkDoodle className="w-4 h-4 text-[#2D1B69] opacity-45" />
        <BoneDoodle className="w-8 h-4 text-[#2D1B69] opacity-35" />
        <HeartDoodle className="w-4 h-4 text-[#2D1B69] opacity-40" />
      </div>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#FAF0E6] via-[#E8F4FD] to-[#89CFF0] py-16 sm:py-20 text-center relative overflow-hidden">
        {/* Subtle doodles on CTA */}
        <PawDoodle className="absolute top-6 left-[10%] text-white opacity-15 w-8 h-8 rotate-[-15deg]" />
        <BoneDoodle className="absolute bottom-8 right-[8%] text-white opacity-10 w-10 h-5 rotate-[20deg]" />
        <SparkDoodle className="absolute top-10 right-[20%] text-white opacity-15 w-6 h-6" />

        <div className="mx-auto max-w-2xl px-4 relative z-10">
          <h2 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69] mb-4">
            Ready to Make Your Pet a Star?
          </h2>
          <p className="text-[#2D1B69]/60 text-lg mb-8">
            It only takes 5 minutes. Your pet deserves this.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-bold text-white shadow-xl shadow-[#FF6B35]/25 hover:bg-[#E55A2B] hover:-translate-y-1 transition-all duration-300"
          >
            Start Creating Now →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

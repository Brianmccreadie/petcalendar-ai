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

/* Doodle SVG components */
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
    </svg>
  )
}

function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 2 14 2 7.5C2 4 4.5 2 7.5 2C9.5 2 11 3.5 12 4.5C13 3.5 14.5 2 16.5 2C19.5 2 22 4 22 7.5C22 14 12 21 12 21Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SquigglyDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="80" height="12" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C10 2 14 10 22 6C30 2 34 10 42 6C50 2 54 10 62 6C70 2 74 10 78 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Doodle divider */}
      <div className="flex items-center justify-center gap-4 py-2 bg-[#F5EDE8]">
        <PawDoodle className="w-5 h-5 text-black" />
        <SquigglyDoodle className="w-16 h-3 text-black" />
        <BurstDoodle className="w-5 h-5 text-black" />
      </div>

      {/* Featured Themes */}
      <section className="relative bg-[#F5EDE8] py-20 sm:py-28">
        <BoneDoodle className="absolute top-10 left-[6%] text-black w-10 h-5 rotate-[-15deg] animate-doodle" />
        <BurstDoodle className="absolute bottom-14 right-[8%] text-black w-6 h-6 animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#1A1A2E]">
              50 Themes to Choose From
            </h2>
            <p className="mt-4 text-lg text-[#1A1A2E]/60">Here are a few of our favorites</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredThemes.map((theme) => {
              const style = CALENDAR_STYLES.find((s) => s.id === theme.id)
              if (!style) return null
              return (
                <div
                  key={style.id}
                  className="group overflow-hidden sketchy-card"
                >
                  <div className="relative aspect-[3/2] bg-[#B8DCEF]/30">
                    <Image
                      src={`/previews/${theme.id}-${theme.pet}.jpg`}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="font-bold text-[#1A1A2E] text-sm sm:text-base flex items-center gap-1.5">
                      <span>{theme.emoji}</span>
                      {style.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[#1A1A2E]/60 mt-1 line-clamp-1">
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
              className="btn-primary"
            >
              See All 50 Themes →
            </Link>
          </div>
        </div>
      </section>

      {/* Doodle divider */}
      <div className="flex items-center justify-center gap-4 py-2 bg-[#F5EDE8]">
        <HeartDoodle className="w-5 h-5 text-black" />
        <SquigglyDoodle className="w-16 h-3 text-black" />
        <PawDoodle className="w-5 h-5 text-black" />
      </div>

      {/* Testimonials */}
      <section className="relative bg-[#F5EDE8] py-20 sm:py-28">
        <PawDoodle className="absolute top-12 right-[10%] text-black w-7 h-7 rotate-[20deg] animate-doodle" />
        <HeartDoodle className="absolute bottom-16 left-[6%] text-black w-6 h-5 rotate-[-10deg] animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#1A1A2E]">
              Pet Parents Love Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="sketchy-card p-8 relative"
              >
                <span className="text-5xl text-[#A8D4F0]/40 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-[#1A1A2E]/70 leading-relaxed mt-6 mb-6 relative z-10">
                  {t.quote}
                </p>
                <p className="text-sm font-bold text-[#1A1A2E] flex items-center gap-2">
                  <span>{t.emoji}</span>
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="relative bg-[#F5EDE8] py-20 sm:py-28">
        <BoneDoodle className="absolute top-8 right-[12%] text-black w-10 h-5 rotate-[30deg] animate-doodle" />
        <BurstDoodle className="absolute bottom-20 left-[10%] text-black w-6 h-6 animate-doodle" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#1A1A2E]">
              What You Get
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            {/* Tilted calendar mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 h-80 rounded-3xl bg-gradient-to-br from-[#B8DCEF]/30 via-[#A8D4F0]/20 to-[#FFD166]/10 border-4 border-white shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                <Image
                  src="/calendar-hero-mockup.png"
                  alt="Pet calendar mockup"
                  fill
                  className="object-contain p-2"
                  sizes="288px"
                />
              </div>
              {/* Shadow card behind */}
              <div className="absolute -bottom-3 -right-3 w-72 h-80 rounded-3xl bg-[#B8DCEF]/15 border-4 border-white rotate-[4deg] -z-10" />
            </div>

            {/* Feature list */}
            <div>
              <ul className="space-y-4">
                {productFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-4">
                    <span className="text-2xl">{feature.emoji}</span>
                    <span className="text-lg font-medium text-[#1A1A2E]/80">{feature.text}</span>
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
      <div className="flex items-center justify-center gap-4 py-2 bg-[#F5EDE8]">
        <BurstDoodle className="w-5 h-5 text-black" />
        <BoneDoodle className="w-10 h-5 text-black" />
        <HeartDoodle className="w-5 h-5 text-black" />
      </div>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#F0E6E0] via-[#D4E8F7] to-[#A8D4F0] py-16 sm:py-20 text-center relative overflow-hidden">
        {/* Subtle doodles on CTA */}
        <PawDoodle className="absolute top-6 left-[10%] text-[#1A1A2E] opacity-15 w-8 h-8 rotate-[-15deg]" />
        <BoneDoodle className="absolute bottom-8 right-[8%] text-[#1A1A2E] opacity-10 w-12 h-6 rotate-[20deg]" />
        <BurstDoodle className="absolute top-10 right-[20%] text-[#1A1A2E] opacity-15 w-6 h-6" />

        <div className="mx-auto max-w-2xl px-4 relative z-10">
          <h2 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-4">
            Ready to Make Your Pet a Star?
          </h2>
          <p className="text-[#1A1A2E]/60 text-lg mb-8">
            It only takes 5 minutes. Your pet deserves this.
          </p>
          <Link
            href="/create"
            className="btn-primary"
          >
            Start Creating Now →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

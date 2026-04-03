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

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      {/* Featured Themes */}
      <section className="bg-[#FFFBF5] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              50 Themes to Choose From 🎨
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
                  className="group rounded-2xl overflow-hidden bg-white border border-[#FF6B35]/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[3/2] bg-gradient-to-br from-[#FFD166]/20 to-[#FF6B35]/20">
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

      {/* Testimonials */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              Pet Parents Love Us 🐾
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#FFF8F0] p-8 relative border border-[#FF6B35]/8"
              >
                <span className="text-5xl text-[#FF6B35]/20 font-serif absolute top-4 left-6">&ldquo;</span>
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
      <section className="bg-[#FFFBF5] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
              What You Get 📦
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            {/* Tilted calendar mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 h-80 rounded-3xl bg-gradient-to-br from-[#FF6B35]/15 via-[#FFD166]/15 to-[#06D6A0]/15 border-4 border-white shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                <Image
                  src="/calendar-hero-mockup.png"
                  alt="Pet calendar mockup"
                  fill
                  className="object-contain p-2"
                  sizes="288px"
                />
              </div>
              {/* Shadow card behind */}
              <div className="absolute -bottom-3 -right-3 w-72 h-80 rounded-3xl bg-[#FFD166]/10 border-4 border-white rotate-[4deg] -z-10" />
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

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#FF6B35] to-[#FFD166] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Make Your Pet a Star? ⭐
          </h2>
          <p className="text-white/80 text-lg mb-8">
            It only takes 5 minutes. Your pet deserves this.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-bold text-[#FF6B35] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Start Creating Now →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

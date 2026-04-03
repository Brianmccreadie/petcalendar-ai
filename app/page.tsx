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
      <section id="themes" className="section bg-[var(--alabaster)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> themes
              </span>
            </div>
            <h2 className="section-heading mx-auto text-center max-w-[624px]">
              50 Themes to Choose From
            </h2>
            <p className="section-details text-center mx-auto max-w-[500px]">
              Here are a few of our favorites — each one transforms your pet into something extraordinary.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredThemes.map((theme) => {
              const style = CALENDAR_STYLES.find((s) => s.id === theme.id)
              if (!style) return null
              return (
                <div
                  key={style.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400"
                >
                  <div className="relative aspect-[3/2] bg-[var(--alabaster)]">
                    <Image
                      src={`/previews/${theme.id}-${theme.pet}.jpg`}
                      alt={style.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-[var(--ebony)] text-sm sm:text-base flex items-center gap-1.5">
                      <span>{theme.emoji}</span>
                      {style.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--wenge)] mt-1 line-clamp-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/create" className="btn-primary">
              <span className="btn-text">See All 50 Themes</span>
              <span className="btn-arrow">→</span>
              <span className="btn-circle"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> testimonials
              </span>
            </div>
            <h2 className="section-heading mx-auto text-center max-w-[560px]">
              Pet Parents Love Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-zaipet relative"
              >
                <span className="text-5xl text-[var(--purple)]/20 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-[var(--wenge)] leading-relaxed mt-8 mb-6 relative z-10 font-medium">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--green)] flex items-center justify-center text-white text-lg">
                    {t.emoji}
                  </div>
                  <p className="text-sm font-bold text-[var(--ebony)]">
                    {t.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section bg-[var(--alabaster)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> what you get
              </span>
            </div>
            <h2 className="section-heading mx-auto text-center max-w-[560px]">
              What You Get
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">
            {/* Calendar mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 h-80 rounded-3xl bg-white shadow-2xl overflow-hidden relative hover:-translate-y-2 transition-transform duration-500">
                <Image
                  src="/calendar-hero-mockup.png"
                  alt="Pet calendar mockup"
                  fill
                  className="object-contain p-2"
                  sizes="288px"
                />
              </div>
            </div>

            {/* Feature list */}
            <div>
              <ul className="space-y-5">
                {productFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--purple)]/8 flex items-center justify-center shrink-0">
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <span className="text-lg font-semibold text-[var(--ebony)]">{feature.text}</span>
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
      <section className="section bg-[var(--purple)] text-center relative overflow-hidden">
        <div className="mx-auto max-w-2xl px-4 relative z-10">
          <h2 className="text-3xl sm:text-[50px] font-bold leading-tight text-white mb-6 capitalize">
            Ready to Make Your Pet a Star?
          </h2>
          <p className="text-white/70 text-lg font-medium mb-10">
            It only takes 5 minutes. Your pet deserves this.
          </p>
          <Link href="/create" className="btn-secondary">
            <span className="btn-text">Start Creating Now</span>
            <span className="btn-arrow">→</span>
            <span className="btn-circle"></span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

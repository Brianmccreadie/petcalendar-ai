import Link from 'next/link'
import Image from 'next/image'

const features = [
  { emoji: '📏', text: '11 x 8.5 inch wall calendar' },
  { emoji: '📄', text: 'Premium 100# glossy paper' },
  { emoji: '🔗', text: 'Wire-O binding (lays flat!)' },
  { emoji: '🎨', text: '12 unique AI artworks of YOUR pet' },
  { emoji: '📅', text: 'Dated monthly grids' },
  { emoji: '📦', text: 'Free shipping' },
  { emoji: '❤️', text: 'Satisfaction guaranteed' },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
            <span className="top-title">
              <span className="light-color">Pet Calendar</span> pricing
            </span>
          </div>
          <h2 className="section-heading mx-auto text-center max-w-[560px]">
            Simple, Transparent Pricing
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card-zaipet text-center relative overflow-hidden border-2 border-[var(--purple)]/10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--yellow)]/20 px-5 py-2 text-sm font-bold text-[var(--ebony)] mb-8">
              🏷️ Launch Price — Won&apos;t Last!
            </div>

            {/* Price */}
            <div className="mb-3">
              <span className="text-6xl sm:text-7xl font-bold text-[var(--ebony)]">
                $39<span className="text-4xl sm:text-5xl">.99</span>
              </span>
            </div>
            <p className="text-lg text-[var(--wenge)] font-medium mb-10">
              Free shipping included 📦
            </p>

            {/* Features */}
            <ul className="space-y-4 text-left max-w-sm mx-auto mb-10">
              {features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3 text-[var(--ebony)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--green)]/10 flex items-center justify-center shrink-0">
                    <span className="text-base">{feature.emoji}</span>
                  </div>
                  <span className="text-sm font-semibold">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href="/create" className="btn-primary w-full justify-center">
              <span className="btn-text">Create My Calendar</span>
              <span className="btn-arrow">→</span>
              <span className="btn-circle"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

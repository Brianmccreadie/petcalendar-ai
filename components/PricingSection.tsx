import Link from 'next/link'

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
    <section id="pricing" className="bg-gradient-to-br from-[#FFF0E8] to-[#FFF8E8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          {/* Pricing card */}
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#FF6B35]/10 p-10 sm:p-12 text-center relative overflow-hidden">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD166]/20 px-4 py-1.5 text-sm font-bold text-[#2D1B69] mb-6">
              🏷️ Launch Price — Won&apos;t Last!
            </div>

            {/* Price */}
            <div className="mb-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-[#2D1B69]">
                $39<span className="text-4xl sm:text-5xl">.99</span>
              </span>
            </div>
            <p className="text-lg text-[#2D1B69]/60 font-medium mb-8">
              Free shipping included 📦
            </p>

            {/* Features */}
            <ul className="space-y-3.5 text-left max-w-sm mx-auto mb-10">
              {features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3 text-[#2D1B69]/80">
                  <span className="text-lg shrink-0">{feature.emoji}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/create"
              className="btn-primary w-full text-center"
            >
              Create My Calendar →
            </Link>

            {/* Decorative paw prints */}
            <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.04] rotate-12">🐾</div>
            <div className="absolute -top-4 -left-4 text-6xl opacity-[0.04] -rotate-12">🐾</div>
          </div>
        </div>
      </div>
    </section>
  )
}

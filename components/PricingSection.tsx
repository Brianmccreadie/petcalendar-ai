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
    <section id="pricing" className="bg-gradient-to-br from-[#D4E8F7] to-[#F5EDE8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          {/* Pricing card */}
          <div className="sketchy-card bg-white p-10 sm:p-12 text-center relative overflow-hidden">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#B8DCEF]/25 px-4 py-1.5 text-sm font-bold text-[#1A1A2E] mb-6 border-2 border-[#1A1A2E]/20">
              🏷️ Launch Price — Won&apos;t Last!
            </div>

            {/* Price */}
            <div className="mb-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-[#1A1A2E] heading-playful">
                $39<span className="text-4xl sm:text-5xl">.99</span>
              </span>
            </div>
            <p className="text-lg text-[#1A1A2E]/60 font-medium mb-8">
              Free shipping included 📦
            </p>

            {/* Features */}
            <ul className="space-y-3.5 text-left max-w-sm mx-auto mb-10">
              {features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3 text-[#1A1A2E]/80">
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

            {/* Decorative doodle paw prints */}
            <svg className="absolute -bottom-2 -right-2 w-20 h-20 text-[#A8D4F0] opacity-[0.1] rotate-12" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="10" cy="6" r="3.5"/><circle cx="22" cy="6" r="3.5"/><circle cx="5" cy="14" r="3"/><circle cx="27" cy="14" r="3"/><ellipse cx="16" cy="22" rx="7" ry="6"/>
            </svg>
            <svg className="absolute -top-2 -left-2 w-16 h-16 text-[#A8D4F0] opacity-[0.1] -rotate-12" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="10" cy="6" r="3.5"/><circle cx="22" cy="6" r="3.5"/><circle cx="5" cy="14" r="3"/><circle cx="27" cy="14" r="3"/><ellipse cx="16" cy="22" rx="7" ry="6"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

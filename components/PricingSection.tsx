import Link from 'next/link'

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl sm:text-7xl font-extrabold text-white">
              $39<span className="text-4xl sm:text-5xl">.99</span>
            </div>
            <p className="mt-3 text-lg text-purple-200">
              Free shipping included
            </p>
          </div>

          <ul className="space-y-4 text-left max-w-sm mx-auto">
            {[
              'Premium 100# glossy paper',
              'Wire-O binding',
              '11x8.5" wall calendar',
              '12 AI-generated artworks',
              'Cover with your pet\'s name',
              'Preview & regenerate any month',
              'Satisfaction guaranteed',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/90">
                <svg
                  className="w-5 h-5 text-purple-200 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/create"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#F59E0B] px-10 py-4 text-lg font-bold text-gray-900 shadow-xl hover:bg-[#D97706] hover:-translate-y-0.5 transition-all duration-300"
          >
            Create My Calendar
          </Link>
        </div>
      </div>
    </section>
  )
}

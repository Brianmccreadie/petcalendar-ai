import Link from 'next/link'

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Simple Pricing
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            One price, everything included. No hidden fees.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="relative rounded-2xl bg-white border-2 border-purple-200 shadow-xl shadow-purple-500/10 overflow-hidden">
            {/* Top accent */}
            <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />

            <div className="p-8 text-center">
              {/* Badge */}
              <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700 mb-4">
                Most Popular
              </span>

              <div className="mt-2">
                <span className="text-5xl font-extrabold text-gray-900">$39</span>
                <span className="text-2xl font-bold text-gray-900">.99</span>
              </div>
              <p className="mt-2 text-gray-500">per calendar</p>

              {/* Features */}
              <ul className="mt-8 space-y-4 text-left">
                {[
                  '12 AI-generated monthly artworks',
                  'Cover page with your pet\'s name',
                  '10 stunning art styles to choose from',
                  'Premium thick matte paper',
                  'Free shipping in the US',
                  'Preview & regenerate any month',
                  'Ships in 5–7 business days',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-purple-500 mt-0.5 shrink-0"
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
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className="mt-10 block w-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Create Your Calendar
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                Additional copies $29.99 each
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

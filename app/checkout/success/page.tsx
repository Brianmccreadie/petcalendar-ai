import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25 mb-8">
          <svg
            className="w-10 h-10 text-white"
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
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Order Confirmed!
        </h1>

        <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-sm font-semibold text-gray-900">
              PC-2026-DEMO
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-900">$39.99</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-semibold text-gray-900">10–14 business days</span>
          </div>
        </div>

        <p className="mt-6 text-gray-500 text-sm leading-relaxed">
          We&apos;ve sent a confirmation email. You can track your order status
          from your dashboard.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
        >
          Go to Dashboard
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

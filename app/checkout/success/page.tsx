import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25 mb-8">
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
          Your calendar is on its way! 🎉
        </h1>

        <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-100 p-6 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number</span>
            <span className="font-mono text-sm font-semibold text-gray-900">
              PC-2026-DEMO
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-semibold text-gray-900">7-10 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-900">$39.99</span>
          </div>
        </div>

        <p className="mt-6 text-gray-500 text-sm leading-relaxed">
          We&apos;ll email you tracking info when it ships.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#7C3AED] px-6 py-3 text-sm font-semibold text-[#7C3AED] hover:bg-purple-50 transition-colors"
          >
            Create Another Calendar
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors shadow-sm"
          >
            View My Calendars
          </Link>
        </div>
      </div>
    </div>
  )
}

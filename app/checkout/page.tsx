'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const [shippingName, setShippingName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [zip, setZip] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canPay =
    shippingName.trim() &&
    address1.trim() &&
    city.trim() &&
    stateCode.trim() &&
    zip.trim()

  async function handlePay() {
    if (!canPay) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: {
            name: shippingName.trim(),
            address1: address1.trim(),
            address2: address2.trim() || undefined,
            city: city.trim(),
            state_code: stateCode.trim().toUpperCase(),
            country_code: 'US',
            zip: zip.trim(),
          },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-10">
          Order Summary
        </h1>

        <div className="space-y-8">
          {/* Order card */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex items-center gap-6">
            <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0">
              <span className="text-3xl">🐾</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-lg">
                Custom Pet Calendar
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                12 months + cover &middot; Premium matte paper &middot; Free
                shipping
              </p>
              <p className="mt-3 text-2xl font-extrabold text-gray-900">
                $39.99
              </p>
            </div>
          </div>

          {/* Shipping form */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-gray-900 text-lg mb-6">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="addr1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  id="addr1"
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label htmlFor="addr2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                  <span className="text-gray-400 ml-1">(optional)</span>
                </label>
                <input
                  id="addr2"
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                  placeholder="Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                    placeholder="NY"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
                    placeholder="10001"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={!canPay || isSubmitting}
            className={`w-full rounded-full py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 ${
              canPay && !isSubmitting
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Pay $39.99'}
          </button>

          <p className="text-center text-xs text-gray-400">
            Secure checkout powered by Stripe. Free shipping included.
          </p>
        </div>
      </div>
    </div>
  )
}

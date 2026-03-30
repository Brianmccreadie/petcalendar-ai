'use client'

import { useState } from 'react'
import StepProgress from '@/components/StepProgress'

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

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white outline-none transition-all'

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={4} />

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order summary - left on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-3xl">🐾</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Custom Pet Calendar</p>
                  <p className="text-sm text-gray-500 mt-1">12 months + cover</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Calendar</span>
                  <span className="text-gray-900">$39.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>$39.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping form - right on desktop */}
          <div className="lg:col-span-3 order-1 lg:order-2">
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                      className={inputClass}
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
                      className={inputClass}
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
                      className={inputClass}
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
              className={`mt-6 w-full rounded-full py-4 text-lg font-bold text-white transition-all duration-300 ${
                canPay && !isSubmitting
                  ? 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order — $39.99'}
            </button>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-400">
              <span>🔒 Secure Payment</span>
              <span>📦 Free Shipping</span>
              <span>✅ Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

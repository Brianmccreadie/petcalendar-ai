'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Determine if we're in the create flow
  const isInCreateFlow = pathname.startsWith('/create')
  const currentStep = pathname === '/create' ? 1
    : pathname === '/create/style' ? 2
    : pathname === '/create/preview' ? 3
    : 0

  const stepLabels = ['', 'Upload Photos', 'Pick a Theme', 'Preview & Edit']

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#FF6B35]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              🐾
            </span>
            <span className="text-xl font-extrabold text-[#2D1B69] tracking-tight">
              PetCalendar
              <span className="text-[#FF6B35]">.ai</span>
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">
            {isInCreateFlow ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0E8] px-5 py-2.5 text-sm font-bold text-[#FF6B35]">
                Step {currentStep}: {stepLabels[currentStep]} ✨
              </span>
            ) : (
              <Link
                href="/create"
                className="inline-flex items-center rounded-full bg-[#FF6B35] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#E55A2B] hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-[#FF6B35]/20"
              >
                Create Calendar 🎨
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-[#2D1B69] hover:text-[#FF6B35] transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  mobileOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  mobileOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[#FF6B35]/10 bg-[#FFFBF5] px-4 pb-4 pt-3 space-y-2">
          {isInCreateFlow ? (
            <span className="block text-center rounded-xl px-3 py-2.5 text-base font-medium text-[#FF6B35] bg-[#FFF0E8]">
              Step {currentStep}: {stepLabels[currentStep]} ✨
            </span>
          ) : (
            <Link
              href="/create"
              onClick={() => setMobileOpen(false)}
              className="block text-center rounded-full bg-[#FF6B35] px-5 py-2.5 text-base font-bold text-white hover:bg-[#E55A2B] transition-colors"
            >
              🎨 Create Calendar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

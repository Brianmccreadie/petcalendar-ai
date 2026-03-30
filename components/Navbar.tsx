'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
              🐾
            </span>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              PetCalendar
              <span className="text-[#7C3AED]">.ai</span>
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-[#7C3AED] transition-colors duration-200"
            >
              My Calendars
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center rounded-full bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors duration-200 shadow-sm"
            >
              Create Calendar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#7C3AED] transition-colors"
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
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors"
          >
            My Calendars
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileOpen(false)}
            className="block text-center rounded-full bg-[#7C3AED] px-5 py-2.5 text-base font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            Create Calendar
          </Link>
        </div>
      </div>
    </header>
  )
}

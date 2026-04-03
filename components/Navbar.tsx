'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isInCreateFlow = pathname.startsWith('/create')
  const currentStep = pathname === '/create' ? 1
    : pathname === '/create/style' ? 2
    : pathname === '/create/preview' ? 3
    : 0

  const stepLabels = ['', 'Upload Photos', 'Pick a Theme', 'Preview & Edit']

  return (
    <header className="sticky top-0 z-50 bg-transparent" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
              🐾
            </span>
            <span className="text-xl font-bold text-[var(--ebony)] tracking-tight">
              PetCalendar
              <span className="text-[var(--purple)]">.ai</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-[var(--wenge)] font-semibold text-sm hover:text-[var(--ebony)] transition-colors capitalize">
              How It Works
            </Link>
            <Link href="/#themes" className="text-[var(--wenge)] font-semibold text-sm hover:text-[var(--ebony)] transition-colors capitalize">
              Themes
            </Link>
            <Link href="/#pricing" className="text-[var(--wenge)] font-semibold text-sm hover:text-[var(--ebony)] transition-colors capitalize">
              Pricing
            </Link>
            <Link href="/#faq" className="text-[var(--wenge)] font-semibold text-sm hover:text-[var(--ebony)] transition-colors capitalize">
              FAQ
            </Link>
          </div>

          {/* CTA / Step indicator */}
          <div className="hidden md:flex items-center gap-4">
            {isInCreateFlow ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--purple)]/10 px-5 py-2.5 text-sm font-bold text-[var(--purple)]">
                Step {currentStep}: {stepLabels[currentStep]} ✨
              </span>
            ) : (
              <Link href="/create" className="btn-primary">
                <span className="btn-text">Start Creating</span>
                <span className="btn-arrow">→</span>
                <span className="btn-circle"></span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-[var(--ebony)]"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md mx-4 mt-2 rounded-2xl p-4 space-y-3 shadow-lg border border-[var(--purple)]/10">
          <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[var(--wenge)] font-semibold hover:text-[var(--purple)] transition-colors">How It Works</Link>
          <Link href="/#themes" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[var(--wenge)] font-semibold hover:text-[var(--purple)] transition-colors">Themes</Link>
          <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[var(--wenge)] font-semibold hover:text-[var(--purple)] transition-colors">Pricing</Link>
          <Link href="/#faq" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[var(--wenge)] font-semibold hover:text-[var(--purple)] transition-colors">FAQ</Link>
          {isInCreateFlow ? (
            <span className="block text-center rounded-full px-3 py-2.5 text-sm font-bold text-[var(--purple)] bg-[var(--purple)]/10">
              Step {currentStep}: {stepLabels[currentStep]} ✨
            </span>
          ) : (
            <Link href="/create" onClick={() => setMobileOpen(false)} className="block text-center rounded-full bg-[var(--purple)] px-5 py-3 text-base font-bold text-white hover:bg-[var(--purple-dark)] transition-colors">
              🎨 Start Creating
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

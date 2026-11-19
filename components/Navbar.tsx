'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Close } from './icons'

const links = [
  { href: '/#the-year', label: 'The calendar' },
  { href: '/#themes', label: 'Themes' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

/** The mark: a calendar page that is also a dog — floppy ears over the binding, a face where the date would be. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      {/* page */}
      <rect x="11" y="12" width="42" height="44" rx="10" fill="var(--color-ivory)" />
      {/* calendar header */}
      <path d="M11 22a10 10 0 0 1 10-10h22a10 10 0 0 1 10 10v4H11z" fill="var(--color-gold)" />
      {/* binder rings */}
      <rect x="24" y="6" width="4" height="12" rx="2" fill="var(--color-night)" stroke="var(--color-ivory)" strokeWidth="1.5" />
      <rect x="36" y="6" width="4" height="12" rx="2" fill="var(--color-night)" stroke="var(--color-ivory)" strokeWidth="1.5" />
      {/* ears */}
      <path d="M15 13C6 11 2 22 5 31c1 4 5 6 8 4 4-3 6-12 6-19 0-2-2-3-4-3z" fill="var(--color-gold-deep)" />
      <path d="M49 13c9-2 13 9 10 18-1 4-5 6-8 4-4-3-6-12-6-19 0-2 2-3 4-3z" fill="var(--color-gold-deep)" />
      {/* face */}
      <circle cx="24.5" cy="36" r="2.6" fill="var(--color-night)" />
      <circle cx="39.5" cy="36" r="2.6" fill="var(--color-night)" />
      <path d="M28.6 42.2h6.8c.9 0 1.4 1 .8 1.7l-2.9 3.2a1.8 1.8 0 0 1-2.6 0l-2.9-3.2c-.6-.7-.1-1.7.8-1.700z" fill="var(--color-night)" />
      <path d="M26.5 49.500c1.800 2 3.800 2 5.500.2 1.700 1.800 3.700 1.800 5.500-.2" fill="none" stroke="var(--color-night)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Two voices, like the section titles: a light serif "Pet" against a heavy grotesk "CALENDAR". */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="flex items-baseline leading-none">
        <span className="font-display text-[1.7rem] tracking-tight">Pet</span>
        <span className="ml-[0.2em] text-[1.02rem] font-extrabold uppercase tracking-[-0.01em]">Calendar</span>
        <span className="ml-[0.15em] text-[0.8rem] font-semibold text-gold">.ai</span>
      </span>
    </span>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The builder and checkout get a quiet header so nothing competes with the task.
  const focused = pathname.startsWith('/create') || pathname.startsWith('/checkout')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 text-ivory transition-[background-color,border-color] duration-300 ${
        open ? 'border-b border-ivory/10 bg-night' : scrolled ? 'border-b border-ivory/10 bg-night/80 backdrop-blur-xl' : pathname === '/' ? 'border-b border-transparent bg-transparent' : 'border-b border-transparent bg-night'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="PetCalendar.ai home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {focused ? (
          <Link href="/dashboard" className="text-sm font-medium text-ivory/70 transition-colors hover:text-ivory">
            My calendars
          </Link>
        ) : (
          <>
            <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-ivory/85 transition-colors hover:text-ivory">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/dashboard" className="text-sm font-medium text-ivory/85 transition-colors hover:text-ivory">
                My calendars
              </Link>
              <Link href="/create" className="btn btn-light btn-sm">
                Create yours
              </Link>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <Close />
              ) : (
                <span className="flex flex-col items-end gap-[6px]" aria-hidden="true">
                  <span className="block h-px w-6 bg-ivory" />
                  <span className="block h-px w-4 bg-ivory" />
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {!focused && open && (
        <nav id="mobile-menu" className="px-5 pb-8 pt-2 md:hidden" aria-label="Mobile">
          {[...links, { href: '/dashboard', label: 'My calendars' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ivory/10 py-4 font-display text-3xl"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/create" onClick={() => setOpen(false)} className="btn btn-light btn-lg mt-7 w-full">
            Create yours
          </Link>
        </nav>
      )}
    </header>
  )
}

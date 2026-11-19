'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Close, Paw } from './icons'

const links = [
  { href: '/#the-year', label: 'The calendar' },
  { href: '/#themes', label: 'Themes' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/60 text-gold">
        <Paw size={16} />
      </span>
      <span className="font-display text-[1.45rem] leading-none tracking-tight">
        PetCalendar<span className="align-top text-[0.6em] font-sans font-medium uppercase tracking-[0.18em] text-gold"> ai</span>
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

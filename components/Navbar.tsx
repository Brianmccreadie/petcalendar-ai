'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Close, Paw } from './icons'

const links = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#themes', label: 'Themes' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-persimmon text-white">
        <Paw size={20} />
      </span>
      <span className="font-display text-[1.3rem] font-extrabold tracking-tight">
        PetCalendar<span className="text-persimmon">.ai</span>
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
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-200 ${
        scrolled || open ? 'bg-paper/90 shadow-[0_1px_0_var(--color-rule)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="PetCalendar.ai home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {focused ? (
          <Link href="/dashboard" className="btn btn-quiet btn-sm">
            My calendars
          </Link>
        ) : (
          <>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-[0.95rem] font-semibold text-ink-soft transition-colors hover:text-ink">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard" className="btn btn-quiet btn-sm">
                My calendars
              </Link>
              <Link href="/create" className="btn btn-dark btn-sm">
                Make my calendar
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
                <span className="flex flex-col gap-[5px]" aria-hidden="true">
                  <span className="block h-0.5 w-6 bg-ink" />
                  <span className="block h-0.5 w-6 bg-ink" />
                  <span className="block h-0.5 w-4 bg-ink" />
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {!focused && open && (
        <nav id="mobile-menu" className="border-t border-rule px-5 pb-6 pt-2 md:hidden" aria-label="Mobile">
          {[...links, { href: '/dashboard', label: 'My calendars' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-rule py-4 font-display text-2xl font-bold"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/create" onClick={() => setOpen(false)} className="btn btn-primary btn-lg mt-6 w-full">
            Make my calendar
          </Link>
        </nav>
      )}
    </header>
  )
}

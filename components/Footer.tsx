import Link from 'next/link'
import { SITE } from '@/lib/config'
import { Logo } from './Navbar'

export default function Footer() {
  return (
    <footer className="on-dark border-t border-ivory/10">
      <div className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/55">{SITE.description}</p>
          </div>
          <nav aria-label="Footer">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory/40">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link className="text-ivory/75 hover:text-gold" href="/#the-year">The calendar</Link></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/#themes">Themes</Link></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/#pricing">Pricing</Link></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/#faq">FAQ</Link></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/dashboard">My calendars</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory/40">Support</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a className="text-ivory/75 hover:text-gold" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/privacy">Privacy policy</Link></li>
              <li><Link className="text-ivory/75 hover:text-gold" href="/terms">Terms of service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <p>No pets were harmed in the making of this website. Many were spoiled.</p>
        </div>
      </div>
    </footer>
  )
}

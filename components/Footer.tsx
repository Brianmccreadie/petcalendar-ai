import Link from 'next/link'
import { SITE } from '@/lib/config'
import { Logo } from './Navbar'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-paper" />
            <p className="mt-4 max-w-sm text-paper/60">{SITE.description}</p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper/50">Explore</p>
            <ul className="mt-4 space-y-3 font-semibold">
              <li><Link className="hover:text-marigold" href="/#how-it-works">How it works</Link></li>
              <li><Link className="hover:text-marigold" href="/#themes">Themes</Link></li>
              <li><Link className="hover:text-marigold" href="/#pricing">Pricing</Link></li>
              <li><Link className="hover:text-marigold" href="/#faq">FAQ</Link></li>
              <li><Link className="hover:text-marigold" href="/dashboard">My calendars</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper/50">Support</p>
            <ul className="mt-4 space-y-3 font-semibold">
              <li><a className="hover:text-marigold" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></li>
              <li><Link className="hover:text-marigold" href="/privacy">Privacy policy</Link></li>
              <li><Link className="hover:text-marigold" href="/terms">Terms of service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-paper/15 pt-6 text-sm text-paper/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <p>No pets were harmed in the making of this website. Many were spoiled.</p>
        </div>
      </div>
    </footer>
  )
}

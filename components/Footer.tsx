import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--ebony)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold tracking-tight">
                PetCalendar<span className="text-[var(--green)]">.ai</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-[300px]">
              Turn your pet into a work of art. Upload photos, choose a style, and get a stunning personalized calendar delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white capitalize">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/#how-it-works" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">How It Works</Link>
              <Link href="/#themes" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">Themes</Link>
              <Link href="/#pricing" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">Pricing</Link>
              <Link href="/#faq" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white capitalize">Support</h4>
            <div className="space-y-3">
              <a href="mailto:hello@petcalendar.ai" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">hello@petcalendar.ai</a>
              <Link href="/privacy" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-white/50 font-medium hover:text-[var(--green)] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} PetCalendar.ai. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            No pets were harmed in the making of this website. Many were spoiled. 🐾
          </p>
        </div>
      </div>
    </footer>
  )
}

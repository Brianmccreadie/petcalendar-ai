import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1E1B4B] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold tracking-tight">
                PetCalendar<span className="text-purple-300">.ai</span>
              </span>
            </Link>
            <p className="mt-2 text-purple-300/70 text-sm">
              Made with ❤️ for pet lovers
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-purple-300/80">
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a href="mailto:hello@petcalendar.ai" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-purple-900/50 text-center text-xs text-purple-400/60">
          &copy; {new Date().getFullYear()} PetCalendar.ai. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

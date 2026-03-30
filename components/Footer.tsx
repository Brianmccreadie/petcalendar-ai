import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#2D1B69] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-extrabold tracking-tight">
                PetCalendar<span className="text-[#FF6B35]">.ai</span>
              </span>
            </Link>
            <p className="mt-3 text-white/50 text-sm">
              Made with ❤️ and 🐾 for pet lovers everywhere
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <Link href="#faq" className="hover:text-[#FF6B35] transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-[#FF6B35] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FF6B35] transition-colors">
              Terms
            </Link>
            <a href="mailto:hello@petcalendar.ai" className="hover:text-[#FF6B35] transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-center text-xs text-white/30">
            No pets were harmed in the making of this website. Many were spoiled.
          </p>
          <p className="text-center text-xs text-white/20 mt-2">
            &copy; {new Date().getFullYear()} PetCalendar.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

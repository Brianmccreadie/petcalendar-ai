import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { SHOWCASE } from '@/lib/showcase'

export default function FinalCTA() {
  const strip = [...SHOWCASE.months, ...SHOWCASE.months]
  return (
    <section className="on-dark grain relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-45">
        <div className="flex h-full w-max animate-marquee gap-3">
          {strip.map((page, i) => (
            <Image key={i} src={page.src} alt="" width={560} height={420} sizes="280px" className="h-full w-auto max-w-none object-cover" />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(12_11_10/0.6),rgb(12_11_10/0.97)_75%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-36 text-center sm:px-8 lg:py-48">
        <h2 className="display text-6xl sm:text-8xl">
          They’re already the star of the <span className="display-italic text-gold">house.</span>
        </h2>
        <p className="lede mx-auto mt-8 max-w-xl">Make it official. See your pet’s calendar in about five minutes — free to preview.</p>
        <Link href="/create" className="btn btn-light btn-lg mt-11">
          Create your calendar <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

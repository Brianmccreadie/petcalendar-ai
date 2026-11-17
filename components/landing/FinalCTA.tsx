import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'

const tiles = ['rock-star-dog', 'fairy-tale-cat', 'sports-mvp-dog', 'underwater-odyssey-other', 'cottage-core-cat', 'time-traveler-dog']

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-marigold">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 opacity-25 mix-blend-multiply sm:grid-cols-6">
        {tiles.map((tile) => (
          <Image key={tile} src={`/previews/${tile}.jpg`} alt="" width={400} height={600} sizes="17vw" className="h-full w-full object-cover" />
        ))}
      </div>
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <h2 className="display text-5xl sm:text-6xl lg:text-7xl">They’re already the star of the house.</h2>
        <p className="mx-auto mt-6 max-w-xl text-xl font-medium text-ink/80">Make it official. See your pet’s calendar in about five minutes — free to preview.</p>
        <Link href="/create" className="btn btn-dark btn-lg mt-10">
          Make my calendar <ArrowRight />
        </Link>
      </div>
    </section>
  )
}

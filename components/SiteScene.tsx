'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Cutout, { type CutoutName } from '@/components/landing/Cutout'

/** Who keeps you company on each page. First match wins. */
const MASCOTS: [prefix: string, name: CutoutName, flip?: boolean][] = [
  ['/create/style', 'wizard'],
  ['/create/preview', 'sorceress'],
  ['/create', 'dachshund', true],
  ['/checkout', 'king'],
  ['/dashboard', 'sheriff'],
  ['/order', 'pig'],
  ['/share', 'musketeer'],
  ['/reveal', 'cherub'],
  ['/privacy', 'bunny'],
  ['/terms', 'duchess'],
]

/**
 * The homepage's painted world, turned down for the working pages: the same
 * sky behind everything, a couple of clouds at the top, and one character in
 * the corner. Enough to feel like the same place without getting in the way
 * of a form.
 */
export default function SiteScene() {
  const pathname = usePathname()
  if (pathname === '/') return null
  const mascot = MASCOTS.find(([prefix]) => pathname.startsWith(prefix))

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="fixed inset-0 -z-10 bg-[#f8f3ea]">
        <Image src="/art/sky-cream.jpg" alt="" fill sizes="100vw" className="object-cover opacity-45" />
      </div>
      <div key={pathname} className="absolute inset-x-0 top-0 -z-10 h-0">
        <Cutout name="cloud2" className="-left-[12%] top-6 w-[clamp(14rem,34vw,30rem)]" depth={0.15} bob={18} />
        <Cutout name="cloud1" className="-right-[6%] top-10 w-[clamp(9rem,20vw,18rem)]" depth={0.2} bob={15} />
        {mascot && (
          <Cutout
            name={mascot[1]}
            flip={mascot[2]}
            className="right-[max(1rem,calc(50%-46.5rem))] top-24 hidden w-[8rem] min-[1560px]:block"
            depth={0.35}
            bob={0}
            delay={0.15}
          />
        )}
      </div>
    </div>
  )
}

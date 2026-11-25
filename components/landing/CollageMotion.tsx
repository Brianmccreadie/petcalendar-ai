'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Brings the collage to life. One listener set for the whole page:
 *  - the pointer shifts every cut-out a little, nearer pieces more (--mx/--my);
 *  - scrolling slides each piece against the page at its own depth (--sy);
 *  - a piece pops in the first time it comes into view.
 * All of it is CSS variables read by .cutout in globals.css, and all of it is
 * skipped for visitors who ask for reduced motion.
 */
export default function CollageMotion() {
  // Mounted once in the root layout; every navigation brings a new set of pieces to find.
  const pathname = usePathname()
  useEffect(() => {
    const pieces = Array.from(document.querySelectorAll<HTMLElement>('[data-cutout]'))
    if (pieces.length === 0) return
    const root = document.documentElement

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          seen.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    pieces.forEach((p) => seen.observe(p))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => seen.disconnect()

    // Only the pieces near the viewport are worth moving.
    const near = new Set<HTMLElement>()
    const nearby = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? near.add(e.target as HTMLElement) : near.delete(e.target as HTMLElement))),
      { rootMargin: '25% 0px 25% 0px' }
    )
    pieces.forEach((p) => nearby.observe(p))

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const h = window.innerHeight
        near.forEach((piece) => {
          const parent = piece.parentElement
          if (!parent) return
          // Measured from the parent so the piece's own movement does not feed back into it.
          const box = parent.getBoundingClientRect()
          const centre = box.top + piece.offsetTop + piece.offsetHeight / 2
          const offset = Math.max(-1, Math.min(1, (centre - h / 2) / h))
          piece.style.setProperty('--sy', offset.toFixed(3))
        })
      })
    }

    let pointerFrame = 0
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || pointerFrame) return
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0
        root.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        root.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      seen.disconnect()
      nearby.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pointerFrame)
    }
  }, [pathname])

  return null
}

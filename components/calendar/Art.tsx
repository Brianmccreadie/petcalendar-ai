/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'

interface ArtProps {
  src: string
  alt: string
  /** How wide the picture is drawn, as a `sizes` value. */
  sizes?: string
  eager?: boolean
  className?: string
}

/**
 * A calendar picture that fills its (positioned) frame. Pictures that ship with
 * the site go through the image optimiser, so a thumbnail downloads a
 * thumbnail; customers' own pages are served as stored.
 */
export default function Art({ src, alt, sizes = '(max-width: 768px) 50vw, 25vw', eager, className = 'object-cover' }: ArtProps) {
  if (src.startsWith('/')) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={eager} className={className} />
  }
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`absolute inset-0 h-full w-full ${className}`} />
}

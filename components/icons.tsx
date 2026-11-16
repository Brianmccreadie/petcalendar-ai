import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
)
export const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
)
export const Plus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)
export const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
)
export const Refresh = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 11a8 8 0 0 0-14.3-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.5L20 16M20 20v-4h-4" />
  </Base>
)
export const Pencil = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />
  </Base>
)
export const Upload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
  </Base>
)
export const Truck = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </Base>
)
export const Lock = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
  </Base>
)
export const Play = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />
  </Base>
)
export const Chevron = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
)

/** Brand mark: a paw print. */
export function Paw({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <ellipse cx="6.2" cy="10.2" rx="2" ry="2.7" transform="rotate(-18 6.2 10.2)" />
      <ellipse cx="10.1" cy="6.3" rx="2" ry="2.8" transform="rotate(-6 10.1 6.3)" />
      <ellipse cx="14.6" cy="6.5" rx="2" ry="2.8" transform="rotate(8 14.6 6.5)" />
      <ellipse cx="18.2" cy="10.6" rx="2" ry="2.7" transform="rotate(20 18.2 10.6)" />
      <path d="M12.2 11.2c-2.9 0-5.6 3-5.6 5.9 0 1.9 1.4 2.9 3 2.9 1.2 0 1.7-.6 2.6-.6s1.4.6 2.6.6c1.6 0 3-1 3-2.9 0-2.9-2.7-5.9-5.6-5.9z" />
    </svg>
  )
}

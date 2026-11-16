import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Navbar from '@/components/Navbar'
import { SITE } from '@/lib/config'
import './globals.css'

// Self-hosted variable fonts (SIL OFL) — no build-time network dependency.
const fraunces = localFont({
  src: [
    { path: '../public/fonts/fraunces.woff2', style: 'normal' },
    { path: '../public/fonts/fraunces-italic.woff2', style: 'italic' },
  ],
  variable: '--font-fraunces',
  weight: '100 900',
  display: 'swap',
})

const dmSans = localFont({
  src: '../public/fonts/dm-sans.woff2',
  variable: '--font-dm-sans',
  weight: '100 1000',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Custom pet calendars, starring your pet`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Custom pet calendars, starring your pet`,
    description: SITE.description,
    images: [{ url: '/previews/hero-1.jpg', width: 1200, height: 805, alt: 'A golden retriever dressed as a wizard' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#fbf6ec',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}

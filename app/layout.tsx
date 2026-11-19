import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Navbar from '@/components/Navbar'
import { SITE } from '@/lib/config'
import './globals.css'

// Self-hosted fonts (SIL OFL) — no build-time network dependency.
const instrument = localFont({
  src: [
    { path: '../public/fonts/instrument-serif.woff2', style: 'normal', weight: '400' },
    { path: '../public/fonts/instrument-serif-italic.woff2', style: 'italic', weight: '400' },
  ],
  variable: '--font-instrument',
  display: 'swap',
})

const geist = localFont({
  src: '../public/fonts/geist.woff2',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

// Cover lettering for the calendar itself.
const coverFace = localFont({
  src: '../public/fonts/nunito-800-italic.woff2',
  variable: '--font-cover',
  weight: '800',
  style: 'italic',
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
    images: [{ url: '/year/cover.jpg', width: 1400, height: 1050, alt: 'A sample calendar cover starring a dog' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#2a0709',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${geist.variable} ${coverFace.variable} h-full antialiased`}>
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

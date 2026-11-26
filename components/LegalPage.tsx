import type { ReactNode } from 'react'
import Footer from './Footer'

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <article className="mx-auto my-10 max-w-3xl rounded-[1.5rem] bg-white/90 px-6 py-12 shadow-lift backdrop-blur-sm sm:my-16 sm:px-12 sm:py-16">
        <p className="eyebrow">Last updated {updated}</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">{title}</h1>
        <div className="prose-legal mt-10 space-y-4 text-[1.05rem]">{children}</div>
      </article>
      <Footer />
    </>
  )
}

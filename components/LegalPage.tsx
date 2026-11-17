import type { ReactNode } from 'react'
import Footer from './Footer'

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="eyebrow">Last updated {updated}</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">{title}</h1>
        <div className="prose-legal mt-10 space-y-4 text-[1.05rem]">{children}</div>
      </article>
      <Footer />
    </>
  )
}

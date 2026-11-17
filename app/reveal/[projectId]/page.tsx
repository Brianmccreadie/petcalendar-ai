import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RevealPlayer from '@/components/RevealPlayer'
import { ArrowLeft } from '@/components/icons'
import { REVEAL } from '@/lib/reveal/composition'
import { isUuid } from '@/lib/validate'

export const metadata: Metadata = { title: 'Calendar reveal', robots: { index: false } }

export default async function RevealPage(props: PageProps<'/reveal/[projectId]'>) {
  const { projectId } = await props.params
  if (!isUuid(projectId)) notFound()

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href={`/create/preview?p=${projectId}`} className="btn btn-quiet btn-sm -ml-3">
        <ArrowLeft size={16} /> Back to review
      </Link>
      <h1 className="display mt-4 text-5xl sm:text-6xl">The reveal.</h1>
      <p className="lede mt-3 max-w-2xl">A short flip-through of the whole year — every title and month name is real type, animated over your artwork.</p>

      <div className="mt-8 overflow-hidden rounded-[6px] bg-ink shadow-lift">
        <RevealPlayer src={`/reveal/${projectId}/composition`} width={REVEAL.width} height={REVEAL.height} />
      </div>
      <p className="mt-4 text-sm text-muted">Rendered live in your browser with HyperFrames.</p>
    </div>
  )
}

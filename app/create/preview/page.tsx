import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReviewStep from '@/components/create/ReviewStep'

export const metadata: Metadata = { title: 'Review your calendar', robots: { index: false } }

export default function PreviewPage() {
  return (
    <Suspense>
      <ReviewStep />
    </Suspense>
  )
}

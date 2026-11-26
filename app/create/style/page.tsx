import type { Metadata } from 'next'
import { Suspense } from 'react'
import ThemeStep from '@/components/create/ThemeStep'

export const metadata: Metadata = { title: 'Pick a theme', robots: { index: false } }

export default function StylePage() {
  return (
    <Suspense>
      <ThemeStep />
    </Suspense>
  )
}

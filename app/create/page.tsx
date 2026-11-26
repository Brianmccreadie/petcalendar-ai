import type { Metadata } from 'next'
import { Suspense } from 'react'
import UploadStep from '@/components/create/UploadStep'

export const metadata: Metadata = { title: 'Add your pet', alternates: { canonical: '/create' } }

export default function CreatePage() {
  return (
    <Suspense>
      <UploadStep />
    </Suspense>
  )
}

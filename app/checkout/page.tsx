import type { Metadata } from 'next'
import { Suspense } from 'react'
import CheckoutStep from '@/components/create/CheckoutStep'

export const metadata: Metadata = { title: 'Order your calendar', robots: { index: false } }

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutStep />
    </Suspense>
  )
}

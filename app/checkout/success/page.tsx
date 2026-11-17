import type { Metadata } from 'next'
import { Suspense } from 'react'
import OrderConfirmation from '@/components/create/OrderConfirmation'

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false } }

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <OrderConfirmation />
    </Suspense>
  )
}

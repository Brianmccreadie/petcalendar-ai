import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderStatus, { orderNumber } from '@/components/OrderStatus'
import { SITE } from '@/lib/config'
import { publicOrderView } from '@/lib/orders'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import type { Order } from '@/lib/types'
import { isUuid } from '@/lib/validate'

export const metadata: Metadata = { title: 'Your order', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function OrderPage(props: PageProps<'/order/[orderId]'>) {
  const { orderId } = await props.params
  if (!isUuid(orderId)) notFound()

  const { data } = await createAdminSupabaseClient().from('orders').select('*').eq('id', orderId).maybeSingle()
  if (!data) notFound()
  const order = publicOrderView(data as Order)

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="eyebrow">Order {orderNumber(order.id)}</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">Where’s my calendar?</h1>
      <div className="mt-8">
        <OrderStatus order={order} />
      </div>
      <p className="mt-6 text-ink-soft">
        Questions about this order? Write to{' '}
        <a className="font-semibold text-ink underline underline-offset-4" href={`mailto:${SITE.supportEmail}?subject=Order ${orderNumber(order.id)}`}>
          {SITE.supportEmail}
        </a>
        .
      </p>
      <Link href="/" className="btn btn-ghost mt-8">
        Back to home
      </Link>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import OrderStatus, { type PublicOrder } from '@/components/OrderStatus'
import { Check } from '@/components/icons'
import { SITE } from '@/lib/config'

export default function OrderConfirmation() {
  const sessionId = useSearchParams().get('session_id')
  const [order, setOrder] = useState<PublicOrder | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    let attempts = 0
    const load = async () => {
      attempts++
      try {
        const res = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
        if (res.ok) {
          const body = await res.json()
          if (!cancelled) setOrder(body)
          return
        }
      } catch {
        // retry below
      }
      if (cancelled) return
      if (attempts < 6) setTimeout(load, 2500)
      else setFailed(true)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-24">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-ivory">
        <Check size={32} strokeWidth={3} />
      </span>
      <h1 className="display mt-6 text-5xl sm:text-6xl">It’s going to print.</h1>
      <p className="lede mx-auto mt-4 max-w-md">Thank you. A receipt is on its way to your inbox, and you can follow the order here any time.</p>

      <div className="mt-10">
        {order ? (
          <>
            <OrderStatus order={order} />
            <Link href={`/order/${order.id}`} className="mt-4 inline-block text-sm font-bold underline underline-offset-4">
              Bookmark your order page
            </Link>
          </>
        ) : failed || !sessionId ? (
          <p className="card p-6 text-ink-soft">
            Your payment went through, but we couldn’t load the order details just now. Nothing is lost — check your email for the
            receipt, or write to{' '}
            <a className="font-semibold text-ink underline" href={`mailto:${SITE.supportEmail}`}>
              {SITE.supportEmail}
            </a>
            .
          </p>
        ) : (
          <div className="skeleton h-64 rounded-[1.25rem]" role="status" aria-label="Loading your order" />
        )}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/create" className="btn btn-ghost">
          Make another calendar
        </Link>
        <Link href="/dashboard" className="btn btn-dark">
          My calendars
        </Link>
      </div>
    </div>
  )
}

'use client'

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import CoverTitle from '@/components/calendar/CoverTitle'
import { ArrowLeft, Lock, Truck } from '@/components/icons'
import { coverSubtitle, coverTitle, joinPetNames } from '@/lib/calendar/layout'
import { calendarSlots, isCalendarComplete, useCalendar } from '@/lib/client/use-calendar'
import { PRICING, formatPrice, orderTotalCents } from '@/lib/config'
import { styleById } from '@/lib/style-meta'
import MissingProject from './MissingProject'
import StepHeader from './StepHeader'

export default function CheckoutStep() {
  const projectId = useSearchParams().get('p')
  const { data, state } = useCalendar(projectId, 5000)
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (state === 'missing') return <MissingProject />
  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <StepHeader current={4} />
        <div className="skeleton h-80 rounded-3xl" />
      </div>
    )
  }

  const petNames = data.pets.map((p) => p.name)
  const names = joinPetNames(petNames)
  const style = styleById(data.project.style)
  const cover = calendarSlots(data)[0]
  const complete = isCalendarComplete(data)
  const ordered = data.project.status === 'ordered'
  const total = orderTotalCents(quantity)

  async function pay() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, quantity }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body.url) throw new Error(body.error || 'Could not start checkout. Please try again.')
      window.location.assign(body.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      <StepHeader current={4} />
      <h1 className="display text-center text-4xl sm:text-5xl">Send it to print.</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <div className="relative aspect-[11/8.5] overflow-hidden rounded-[3px] shadow-lift">
            {cover.image_url ? (
              <>
                <img src={cover.image_url} alt={`Cover of ${names}’s calendar`} className="h-full w-full object-cover" />
                <CoverTitle title={coverTitle(petNames, data.project.start_year)} subtitle={coverSubtitle(style?.name ?? '')} />
              </>
            ) : (
              <div className="skeleton h-full w-full" />
            )}
          </div>
          <Link href={`/create/preview?p=${projectId}`} className="btn btn-quiet btn-sm mt-4">
            <ArrowLeft size={16} /> Back to review
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">
            {names} — {data.project.start_year}
          </h2>
          <p className="mt-1 text-ink-soft">{style?.name} theme · 11 × 8.5 in wall calendar · cover + 12 months</p>

          <div className="mt-6 flex items-center justify-between border-y border-rule py-4">
            <div>
              <p className="font-bold">Copies</p>
              <p className="text-sm text-ink-soft">Extras are {formatPrice(PRICING.extraCopyCents)} each — good for grandparents.</p>
            </div>
            <div className="flex items-center gap-1 rounded-full border-[1.5px] border-ink p-1">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full text-xl font-bold hover:bg-paper-deep disabled:opacity-30"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Fewer copies"
              >
                −
              </button>
              <span className="w-7 text-center font-bold" aria-live="polite" aria-label={`${quantity} copies`}>
                {quantity}
              </span>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full text-xl font-bold hover:bg-paper-deep disabled:opacity-30"
                onClick={() => setQuantity((q) => Math.min(PRICING.maxCopies, q + 1))}
                disabled={quantity >= PRICING.maxCopies}
                aria-label="More copies"
              >
                +
              </button>
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-[0.95rem]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">First calendar</dt>
              <dd className="font-semibold">{formatPrice(PRICING.firstCopyCents)}</dd>
            </div>
            {quantity > 1 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  {quantity - 1} extra {quantity - 1 === 1 ? 'copy' : 'copies'}
                </dt>
                <dd className="font-semibold">{formatPrice((quantity - 1) * PRICING.extraCopyCents)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="font-semibold text-pine">Free</dd>
            </div>
            <div className="flex justify-between border-t border-rule pt-3 text-lg">
              <dt className="font-bold">Total</dt>
              <dd className="font-display text-2xl font-extrabold">{formatPrice(total)}</dd>
            </div>
          </dl>

          {ordered ? (
            <p className="mt-6 rounded-2xl bg-pine/10 px-4 py-3 font-semibold text-pine">This calendar has already been ordered.</p>
          ) : !complete ? (
            <p className="mt-6 rounded-2xl bg-marigold/25 px-4 py-3 font-semibold">
              A few pages still need to finish.{' '}
              <Link className="underline underline-offset-4" href={`/create/preview?p=${projectId}`}>
                Go back to review
              </Link>
            </p>
          ) : (
            <button type="button" className="btn btn-primary btn-lg mt-6 w-full" onClick={pay} disabled={submitting}>
              <Lock size={18} /> {submitting ? 'Opening secure checkout…' : `Pay ${formatPrice(total)}`}
            </button>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-persimmon-deep">
              {error}
            </p>
          )}

          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Lock size={16} /> Payment and shipping address are handled by Stripe.
            </li>
            <li className="flex items-center gap-2">
              <Truck size={16} /> Printed in 3–5 business days, then shipped with tracking.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

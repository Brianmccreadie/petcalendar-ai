import { Check } from '@/components/icons'
import { formatPrice } from '@/lib/config'

export interface PublicOrder {
  id: string
  status: string
  quantity: number
  amount_cents: number
  created_at: string
  tracking_number: string | null
  tracking_url: string | null
  shipping_city: string | null
  shipping_state: string | null
  project_id: string
}

const stages = [
  { key: 'paid', label: 'Order received', detail: 'Payment confirmed. We’re preparing your print files.' },
  { key: 'submitted_to_lulu', label: 'Sent to the printer', detail: 'Your files are with the print shop.' },
  { key: 'in_production', label: 'Printing', detail: 'Usually 3–5 business days.' },
  { key: 'shipped', label: 'Shipped', detail: 'On its way to you.' },
  { key: 'delivered', label: 'Delivered', detail: 'Hang it somewhere they can admire themselves.' },
]

export function orderNumber(id: string): string {
  return `PC-${id.slice(0, 8).toUpperCase()}`
}

export default function OrderStatus({ order }: { order: PublicOrder }) {
  const problem = order.status === 'failed' || order.status === 'refunded'
  const reached = Math.max(0, stages.findIndex((s) => s.key === order.status))

  return (
    <div className="card p-6 text-left sm:p-8">
      <dl className="grid grid-cols-2 gap-4 border-b border-rule pb-6 sm:grid-cols-4">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Order</dt>
          <dd className="mt-1 font-mono text-sm font-bold">{orderNumber(order.id)}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Placed</dt>
          <dd className="mt-1 font-semibold">
            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Total</dt>
          <dd className="mt-1 font-semibold">
            {formatPrice(order.amount_cents)} · {order.quantity} {order.quantity === 1 ? 'copy' : 'copies'}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Ships to</dt>
          <dd className="mt-1 font-semibold">{[order.shipping_city, order.shipping_state].filter(Boolean).join(', ') || '—'}</dd>
        </div>
      </dl>

      {problem ? (
        <p className="mt-6 rounded-2xl bg-persimmon/10 px-4 py-3 font-semibold text-persimmon-deep">
          {order.status === 'refunded'
            ? 'This order was refunded.'
            : 'There’s a problem with this order. We’ve been notified — reply to your confirmation email and we’ll sort it out.'}
        </p>
      ) : (
        <ol className="mt-6">
          {stages.map((stage, i) => {
            const done = i <= reached
            return (
              <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0" aria-current={i === reached ? 'step' : undefined}>
                {i < stages.length - 1 && (
                  <span aria-hidden="true" className={`absolute left-[0.6875rem] top-6 h-full w-[1.5px] ${i < reached ? 'bg-pine' : 'bg-rule'}`} />
                )}
                <span
                  className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] ${
                    done ? 'border-pine bg-pine text-white' : 'border-rule bg-card'
                  }`}
                >
                  {done && <Check size={13} strokeWidth={3.5} />}
                </span>
                <span>
                  <span className={`block font-bold ${done ? '' : 'text-muted'}`}>{stage.label}</span>
                  {i === reached && <span className="block text-sm text-ink-soft">{stage.detail}</span>}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      {order.tracking_url && /^https:\/\//.test(order.tracking_url) && (
        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-6 w-full">
          Track package{order.tracking_number ? ` · ${order.tracking_number}` : ''}
        </a>
      )}
    </div>
  )
}

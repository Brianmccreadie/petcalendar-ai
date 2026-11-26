import { SITE, formatPrice } from './config'

// Transactional email through Resend's REST API. Entirely optional: without
// RESEND_API_KEY these functions log and return, so nothing else depends on it.

async function send(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || `${SITE.name} <orders@epicpetcalendars.com>`,
        to,
        subject,
        html,
      }),
    })
    if (!response.ok) console.error('[email] send failed:', response.status, await response.text())
  } catch (error) {
    console.error('[email] send failed:', error)
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function layout(heading: string, body: string): string {
  return `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1d1a16">
  <p style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#c2410c;margin:0 0 12px">${SITE.name}</p>
  <h1 style="font-size:26px;line-height:1.2;margin:0 0 16px">${heading}</h1>
  <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a443c">${body}</div>
</div>`
}

export function orderStatusUrl(orderId: string): string {
  return `${SITE.url}/order/${orderId}`
}

export async function sendOrderConfirmation(order: { id: string; email?: string | null; amount_cents: number; quantity?: number }) {
  if (!order.email) return
  const copies = order.quantity && order.quantity > 1 ? `${order.quantity} copies` : '1 copy'
  await send(
    order.email,
    'Your pet calendar is going to print',
    layout(
      'Thank you — your calendar is going to print.',
      `<p>We received your order (${copies}, ${formatPrice(order.amount_cents)}). Printing usually takes 3–5 business days, then it ships.</p>
       <p><a href="${orderStatusUrl(order.id)}" style="color:#c2410c">Track your order</a></p>
       <p>Questions? Just reply to this email.</p>`
    )
  )
}

export async function sendShippedEmail(order: { id: string; email?: string | null; tracking_url?: string | null; tracking_number?: string | null }) {
  if (!order.email) return
  const tracking = order.tracking_url
    ? `<p><a href="${escapeHtml(order.tracking_url)}" style="color:#c2410c">Track the package</a>${order.tracking_number ? ` (${escapeHtml(order.tracking_number)})` : ''}</p>`
    : ''
  await send(
    order.email,
    'Your pet calendar has shipped',
    layout('Your calendar is on its way.', `<p>It has left the printer and is heading to you.</p>${tracking}<p><a href="${orderStatusUrl(order.id)}" style="color:#c2410c">Order details</a></p>`)
  )
}

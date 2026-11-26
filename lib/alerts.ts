import { SITE } from './config'

// Alerts to the shop owner when something needs a human: a sale, a print order
// that failed, a printer rejection, a calendar that would not generate.
//
// Two optional channels, used together when both are set:
//   ALERT_EMAIL        where to email alerts (needs RESEND_API_KEY; defaults to the support address)
//   ALERT_WEBHOOK_URL  a Slack or Discord incoming-webhook URL
//
// Alerts never throw: a failed alert must not break an order.

export interface Alert {
  /** Short and specific: "Print order failed". */
  title: string
  /** Plain-text lines of detail. */
  lines?: (string | null | undefined | false)[]
  /** A link that takes the owner straight to the thing. */
  url?: string
  urgent?: boolean
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function alertChannels(): { email: boolean; webhook: boolean } {
  return { email: Boolean(process.env.RESEND_API_KEY), webhook: /^https:\/\//.test(process.env.ALERT_WEBHOOK_URL ?? '') }
}

export async function alertOwner(alert: Alert): Promise<void> {
  const lines = (alert.lines ?? []).filter(Boolean) as string[]
  const subject = `${alert.urgent ? '[Action needed] ' : ''}${alert.title}`
  // Always in the server log, whether or not a channel is configured.
  console.log(`[alert] ${subject}${lines.length ? ` — ${lines.join(' | ')}` : ''}`)

  const jobs: Promise<unknown>[] = []

  const key = process.env.RESEND_API_KEY
  if (key) {
    const html =
      `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d1a16;max-width:520px">` +
      `<h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(alert.title)}</h1>` +
      lines.map((line) => `<p style="margin:0 0 6px">${escapeHtml(line)}</p>`).join('') +
      (alert.url ? `<p style="margin:14px 0 0"><a href="${escapeHtml(alert.url)}">Open</a></p>` : '') +
      `</div>`
    jobs.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || `${SITE.name} <orders@${SITE.domain}>`,
          to: process.env.ALERT_EMAIL || SITE.supportEmail,
          subject: `${SITE.name}: ${subject}`,
          html,
        }),
      }).then(async (response) => {
        if (!response.ok) console.error('[alert] email failed:', response.status, (await response.text()).slice(0, 300))
      })
    )
  }

  const webhook = process.env.ALERT_WEBHOOK_URL
  if (webhook && /^https:\/\//.test(webhook)) {
    const text = [`*${subject}*`, ...lines, alert.url].filter(Boolean).join('\n')
    // Slack reads `text`, Discord reads `content`; sending both suits either.
    jobs.push(
      fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, content: text }) }).then((response) => {
        if (!response.ok) console.error('[alert] webhook failed:', response.status)
      })
    )
  }

  await Promise.allSettled(jobs)
}

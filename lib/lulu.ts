import { createHmac, timingSafeEqual } from 'crypto'
import type { Order, ShippingAddress } from './types'

// ---------------------------------------------------------------------------
// Lulu xPress Print API Client
// https://api.lulu.com/api-docs/openapi-specs/openapi_public.yml
// ---------------------------------------------------------------------------

const LULU_API_BASE = process.env.LULU_API_ENVIRONMENT === 'sandbox'
  ? 'https://api.sandbox.lulu.com'
  : 'https://api.lulu.com'

const LULU_AUTH_BASE = process.env.LULU_API_ENVIRONMENT === 'sandbox'
  ? 'https://api.sandbox.lulu.com'
  : 'https://api.lulu.com'

// Calendar product, as shown by Lulu's pricing calculator for a 12-month calendar:
// US Letter Landscape 11 x 8.5 in, Calendar Wire-O, Premium Color, 100# White Coated.
// The calculator prints the SKU with dots (1100X0850.FC.PRE.WO.100CW200.GXX); the API takes it without.
const CALENDAR_POD_PACKAGE_ID = (process.env.LULU_CALENDAR_POD_PACKAGE_ID || '1100X0850FCPREWO100CW200GXX').replace(/[.\s]/g, '')

// Print files come from lib/print/pdf.ts: a 2-page cover PDF and a 24-page
// interior PDF, each page 11.25 x 8.75 in (trim + 0.125 in bleed).
// IMPORTANT: place one sandbox order (LULU_API_ENVIRONMENT=sandbox) and check
// Lulu's file validation result before taking live orders — the pod_package_id
// and page count must match the calendar product configured on your account.

export function isLuluConfigured(): boolean {
  return Boolean(process.env.LULU_CLIENT_KEY && process.env.LULU_CLIENT_SECRET)
}

// ---------------------------------------------------------------------------
// Auth — OAuth 2.0 Client Credentials
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token
  }

  const clientKey = process.env.LULU_CLIENT_KEY
  const clientSecret = process.env.LULU_CLIENT_SECRET
  if (!clientKey || !clientSecret) throw new Error('Lulu is not configured (LULU_CLIENT_KEY / LULU_CLIENT_SECRET)')
  const credentials = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64')

  const response = await fetch(
    `${LULU_AUTH_BASE}/auth/realms/glasstree/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Lulu auth failed (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}

async function luluHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface LuluCostResult {
  total_cost_excl_tax: string
  total_cost_incl_tax: string
  shipping_cost: { total_cost_excl_tax: string; total_cost_incl_tax: string }
  line_item_costs: Array<{
    total_cost_excl_tax: string
    total_cost_incl_tax: string
  }>
  currency: string
}

interface LuluPrintJob {
  id: number
  status: {
    name: string
    message: string
    changed: string
  }
  line_items: Array<{
    id: number
    title: string
    status: { name: string }
    tracking_id?: string
    tracking_urls?: string[]
  }>
}

// ---------------------------------------------------------------------------
// Cost Calculation (preview pricing without creating an order)
// ---------------------------------------------------------------------------

export async function calculateCost(
  shippingAddress: ShippingAddress,
  shippingLevel: string = 'MAIL'
): Promise<LuluCostResult> {
  const body = {
    line_items: [
      {
        pod_package_id: CALENDAR_POD_PACKAGE_ID,
        quantity: 1,
      },
    ],
    shipping_address: {
      street1: shippingAddress.address1,
      street2: shippingAddress.address2 || undefined,
      city: shippingAddress.city,
      state_code: shippingAddress.state_code,
      country_code: shippingAddress.country_code,
      postcode: shippingAddress.zip,
      phone_number: shippingAddress.phone || '0000000000',
    },
    shipping_level: shippingLevel,
  }

  const response = await fetch(`${LULU_API_BASE}/print-job-cost-calculations/`, {
    method: 'POST',
    headers: await luluHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Lulu cost calculation failed (${response.status}): ${errorBody}`)
  }

  return response.json()
}

// ---------------------------------------------------------------------------
// Create Print Job (order)
// ---------------------------------------------------------------------------

/**
 * Submit a calendar order to Lulu xPress.
 *
 * Requires:
 * - A publicly accessible URL to the interior PDF (all calendar pages composed into one multi-page PDF)
 * - A publicly accessible URL to the cover PDF
 * - Shipping address with phone number
 */
export async function createLuluOrder(
  order: Order,
  interiorPdfUrl: string,
  coverPdfUrl: string
): Promise<{ luluOrderId: number; status: string }> {
  const address = order.shipping_address!

  const body = {
    contact_email: process.env.LULU_CONTACT_EMAIL || 'orders@epicpetcalendars.com',
    external_id: order.id,
    line_items: [
      {
        title: `Epic Pet Calendars - ${order.id.slice(0, 8)}`,
        pod_package_id: CALENDAR_POD_PACKAGE_ID,
        quantity: Math.max(1, order.quantity ?? 1),
        interior: interiorPdfUrl,
        cover: coverPdfUrl,
      },
    ],
    shipping_address: {
      name: order.shipping_name || address.name,
      street1: address.address1,
      street2: address.address2 || undefined,
      city: address.city,
      state_code: address.state_code,
      country_code: address.country_code,
      postcode: address.zip,
      phone_number: address.phone || '0000000000',
    },
    shipping_level: mapShippingLevel(order.shipping_method),
  }

  const response = await fetch(`${LULU_API_BASE}/print-jobs/`, {
    method: 'POST',
    headers: await luluHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Lulu order creation failed (${response.status}): ${errorBody}`)
  }

  const data: LuluPrintJob = await response.json()
  return {
    luluOrderId: data.id,
    status: data.status.name,
  }
}

// ---------------------------------------------------------------------------
// Get Print Job Status
// ---------------------------------------------------------------------------

export async function getOrderStatus(
  luluOrderId: string | number
): Promise<{
  id: number
  status: string
  message: string
  trackingId: string | null
  trackingUrls: string[]
}> {
  const response = await fetch(`${LULU_API_BASE}/print-jobs/${luluOrderId}/`, {
    method: 'GET',
    headers: await luluHeaders(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Lulu order status failed (${response.status}): ${errorBody}`)
  }

  const data: LuluPrintJob = await response.json()
  const lineItem = data.line_items?.[0]

  return {
    id: data.id,
    status: data.status.name,
    message: data.status.message,
    trackingId: lineItem?.tracking_id || null,
    trackingUrls: lineItem?.tracking_urls || [],
  }
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

/**
 * Subscribe to Lulu webhooks for order status changes.
 * Call this once during setup.
 */
export async function subscribeWebhook(callbackUrl: string): Promise<void> {
  const response = await fetch(`${LULU_API_BASE}/webhooks/`, {
    method: 'POST',
    headers: await luluHeaders(),
    body: JSON.stringify({
      url: callbackUrl,
      topics: ['PRINT_JOB_STATUS_CHANGED'],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Lulu webhook subscription failed (${response.status}): ${errorBody}`)
  }
}

/**
 * Verify a Lulu webhook HMAC (SHA-256 of the raw body, keyed with the API secret).
 * Accepts hex or base64 digests and never throws on malformed input.
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.LULU_CLIENT_SECRET
  if (!secret || !signature) return false
  const digest = createHmac('sha256', secret).update(payload).digest()
  const given = signature.trim()
  for (const encoding of ['hex', 'base64'] as const) {
    const candidate = Buffer.from(given, encoding)
    if (candidate.length === digest.length && timingSafeEqual(candidate, digest)) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapShippingLevel(method: string): string {
  const map: Record<string, string> = {
    STANDARD: 'MAIL',
    PRIORITY: 'PRIORITY_MAIL',
    GROUND: 'GROUND',
    EXPEDITED: 'EXPEDITED',
    EXPRESS: 'EXPRESS',
  }
  return map[method?.toUpperCase()] || 'MAIL'
}

// Re-export types needed by other modules
export type { LuluCostResult }

// ---------------------------------------------------------------------------
// File validation: ask Lulu whether it accepts the print files, without ordering
// ---------------------------------------------------------------------------

async function luluJson(path: string, init?: RequestInit): Promise<{ status: number; body: unknown }> {
  const response = await fetch(`${LULU_API_BASE}${path}`, { ...init, headers: await luluHeaders() })
  const text = await response.text()
  try {
    return { status: response.status, body: JSON.parse(text) }
  } catch {
    return { status: response.status, body: text.slice(0, 600) }
  }
}

/** Poll a validation record until Lulu has finished looking at the file (or we give up). */
async function pollValidation(path: string, id: unknown): Promise<unknown> {
  for (let i = 0; i < 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const { body } = await luluJson(`${path}${id}/`)
    const status = (body as { status?: string })?.status
    if (status && !['NULL', 'VALIDATING', 'NORMALIZING'].includes(status)) return body
  }
  return { status: 'TIMED_OUT' }
}

/**
 * Run Lulu's own checks on a pair of print files: the interior, the cover size
 * it expects for that interior, and the cover. Nothing is ordered or charged.
 */
export async function validatePrintFiles(interiorPdfUrl: string, coverPdfUrl: string) {
  const sku = CALENDAR_POD_PACKAGE_ID
  const started = await luluJson('/validate-interior/', { method: 'POST', body: JSON.stringify({ source_url: interiorPdfUrl, pod_package_id: sku }) })
  const interiorId = (started.body as { id?: unknown })?.id
  const interior = interiorId ? await pollValidation('/validate-interior/', interiorId) : started
  const pageCount = (interior as { page_count?: number })?.page_count

  const coverDimensions = pageCount
    ? await luluJson('/cover-dimensions/', { method: 'POST', body: JSON.stringify({ pod_package_id: sku, interior_page_count: pageCount }) })
    : null
  const coverStarted = pageCount
    ? await luluJson('/validate-cover/', { method: 'POST', body: JSON.stringify({ source_url: coverPdfUrl, pod_package_id: sku, interior_page_count: pageCount }) })
    : null
  const coverId = (coverStarted?.body as { id?: unknown })?.id
  const cover = coverId ? await pollValidation('/validate-cover/', coverId) : coverStarted

  return { environment: LULU_API_BASE, sku, interior, coverDimensions, cover }
}

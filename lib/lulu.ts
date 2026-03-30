import type { CalendarPage, Order, ShippingAddress } from './types'

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

// Calendar product: 11x8.5" Wire-O, full color, premium, 100# coated white, glossy cover
// Generate your exact pod_package_id at https://developers.lulu.com/price-calculator
const CALENDAR_POD_PACKAGE_ID = process.env.LULU_CALENDAR_POD_PACKAGE_ID || '1100X0850FCPREWI100CW444GXX'

// Calendar interior is 28 pages (cover page + 12 months x 2 pages each + back page)
// Lulu Wire-O calendars: cover is a separate file, interior is a multi-page PDF

// ---------------------------------------------------------------------------
// Auth — OAuth 2.0 Client Credentials
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token
  }

  const clientKey = process.env.LULU_CLIENT_KEY!
  const clientSecret = process.env.LULU_CLIENT_SECRET!
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
    contact_email: process.env.LULU_CONTACT_EMAIL || 'orders@petcalendar.ai',
    external_id: order.id,
    line_items: [
      {
        title: `PetCalendar - ${order.id.slice(0, 8)}`,
        pod_package_id: CALENDAR_POD_PACKAGE_ID,
        quantity: 1,
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
 * Verify a Lulu webhook HMAC signature.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
): boolean {
  const crypto = require('crypto')
  const secret = process.env.LULU_CLIENT_SECRET!
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
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

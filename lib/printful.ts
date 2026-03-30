import type { CalendarPage, Order, ShippingAddress } from './types'

const PRINTFUL_API_BASE = 'https://api.printful.com'

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY!}`,
    'Content-Type': 'application/json',
  }
}

// ---------------------------------------------------------------------------
// Types specific to Printful interactions
// ---------------------------------------------------------------------------

interface PrintfulFile {
  type: string
  url: string
}

interface PrintfulShippingRate {
  id: string
  name: string
  rate: string
  currency: string
  minDeliveryDays: number
  maxDeliveryDays: number
}

interface PrintfulOrderStatus {
  id: number
  status: string
  shipping: string
  created: number
  updated: number
  shipments: Array<{
    carrier: string
    service: string
    tracking_number: string
    tracking_url: string
    ship_date: string
  }>
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Submit a calendar order to Printful.
 *
 * Uses the Printful "Wall Calendar (Blank)" product. Each calendar page image
 * is supplied as a print file in the order of: cover, months 1-12, back.
 */
export async function createPrintfulOrder(
  order: Order,
  calendarPages: CalendarPage[]
): Promise<{ printfulOrderId: number; status: string }> {
  // Sort pages: cover first, then months 1–12, then back
  const sorted = [...calendarPages].sort((a, b) => {
    const typeOrder: Record<string, number> = { cover: 0, month: 1, back: 2 }
    const aOrder = typeOrder[a.page_type] ?? 1
    const bOrder = typeOrder[b.page_type] ?? 1
    if (aOrder !== bOrder) return aOrder - bOrder
    return (a.month_number ?? 0) - (b.month_number ?? 0)
  })

  // Build print files array — one file per page
  const files: PrintfulFile[] = sorted.map((page, index) => ({
    type: index === 0 ? 'default' : `inside_${index}`,
    url: page.cloudinary_url!,
  }))

  const address = order.shipping_address!

  const body = {
    recipient: {
      name: order.shipping_name || address.name,
      address1: address.address1,
      address2: address.address2 || undefined,
      city: address.city,
      state_code: address.state_code,
      country_code: address.country_code,
      zip: address.zip,
      phone: address.phone || undefined,
    },
    items: [
      {
        // Printful Wall Calendar (Blank) variant — replace with actual variant ID
        variant_id: 19451,
        quantity: 1,
        files,
      },
    ],
    retail_costs: {
      currency: order.currency.toUpperCase(),
      subtotal: (order.amount_cents / 100).toFixed(2),
      total: (order.amount_cents / 100).toFixed(2),
    },
    shipping: order.shipping_method || 'STANDARD',
    external_id: order.id,
  }

  const response = await fetch(`${PRINTFUL_API_BASE}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Printful order creation failed (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  // Confirm (move from draft to pending) immediately
  const confirmResponse = await fetch(
    `${PRINTFUL_API_BASE}/orders/${data.result.id}/confirm`,
    {
      method: 'POST',
      headers: headers(),
    }
  )

  if (!confirmResponse.ok) {
    const confirmError = await confirmResponse.text()
    throw new Error(`Printful order confirmation failed (${confirmResponse.status}): ${confirmError}`)
  }

  const confirmData = await confirmResponse.json()
  return {
    printfulOrderId: confirmData.result.id,
    status: confirmData.result.status,
  }
}

/**
 * Get shipping rate estimates for a given address.
 */
export async function getShippingRates(
  address: ShippingAddress
): Promise<PrintfulShippingRate[]> {
  const body = {
    recipient: {
      address1: address.address1,
      city: address.city,
      country_code: address.country_code,
      state_code: address.state_code,
      zip: address.zip,
    },
    items: [
      {
        variant_id: 19451,
        quantity: 1,
      },
    ],
  }

  const response = await fetch(`${PRINTFUL_API_BASE}/shipping/rates`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Printful shipping rates failed (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  return data.result.map(
    (rate: {
      id: string
      name: string
      rate: string
      currency: string
      minDeliveryDays: number
      maxDeliveryDays: number
    }) => ({
      id: rate.id,
      name: rate.name,
      rate: rate.rate,
      currency: rate.currency,
      minDeliveryDays: rate.minDeliveryDays,
      maxDeliveryDays: rate.maxDeliveryDays,
    })
  )
}

/**
 * Check the current status of a Printful order.
 */
export async function getOrderStatus(
  printfulOrderId: string
): Promise<PrintfulOrderStatus> {
  const response = await fetch(`${PRINTFUL_API_BASE}/orders/${printfulOrderId}`, {
    method: 'GET',
    headers: headers(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Printful order status failed (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  const result = data.result

  return {
    id: result.id,
    status: result.status,
    shipping: result.shipping,
    created: result.created,
    updated: result.updated,
    shipments: (result.shipments || []).map(
      (s: { carrier: string; service: string; tracking_number: string; tracking_url: string; ship_date: string }) => ({
        carrier: s.carrier,
        service: s.service,
        tracking_number: s.tracking_number,
        tracking_url: s.tracking_url,
        ship_date: s.ship_date,
      })
    ),
  }
}

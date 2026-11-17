import { resolveProviderName, falApiKey, geminiApiKey } from './ai/config'
import { isLuluConfigured } from './lulu'
import { createAdminSupabaseClient } from './supabase-admin'

/** True once the guest-checkout migration has been applied (orders has the new columns). */
export async function ordersTableReady(): Promise<boolean> {
  try {
    const { error } = await createAdminSupabaseClient()
      .from('orders')
      .select('id, email, quantity, cover_pdf_url, interior_pdf_url, fulfilment_error')
      .limit(1)
    return !error
  } catch {
    return false
  }
}

/** What is configured, as booleans only — safe to expose at /api/health. */
export async function readiness() {
  const provider = resolveProviderName()
  const imageKey =
    provider === 'fal' ? Boolean(falApiKey()) : provider === 'openai' ? Boolean(process.env.OPENAI_API_KEY) : provider === 'gemini' ? Boolean(geminiApiKey()) : true

  let database = false
  try {
    const { error } = await createAdminSupabaseClient().from('projects').select('id').limit(1)
    database = !error
  } catch {
    database = false
  }

  const checks = {
    database,
    migration_applied: database ? await ordersTableReady() : false,
    image_provider: provider,
    image_key: imageKey,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    stripe_webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    lulu: isLuluConfigured(),
    email: Boolean(process.env.RESEND_API_KEY),
    app_url: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  }
  return {
    can_generate: checks.database && checks.image_key,
    can_take_orders: checks.database && checks.migration_applied && checks.stripe,
    can_print: checks.lulu,
    checks,
  }
}

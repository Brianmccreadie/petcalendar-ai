import { resolveProviderName, falApiKey, geminiApiKey } from './ai/config'
import { imageProcessingStatus } from './images'
import { isLuluConfigured } from './lulu'
import { BUCKETS } from './storage'
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

type Probe = { ok: boolean; error?: string }

const short = (value: unknown) => (value instanceof Error ? value.message : String(value)).slice(0, 200)

/** Free call to fal: a made-up request id returns 404 when the key is accepted, 401/403 when it is not. */
async function falKeyProbe(): Promise<Probe> {
  const key = falApiKey()
  if (!key) return { ok: false, error: 'no key set' }
  try {
    const res = await fetch('https://queue.fal.run/openai/gpt-image-2.5/requests/00000000-0000-4000-8000-000000000000/status', {
      headers: { Authorization: `Key ${key.trim()}` },
    })
    if (res.status === 404 || res.ok) return { ok: true }
    return { ok: false, error: `fal answered ${res.status}: ${(await res.text()).slice(0, 120)}` }
  } catch (error) {
    return { ok: false, error: short(error) }
  }
}

/** Write a tiny file to each bucket and read it back through its public URL. */
async function storageProbe(): Promise<Probe> {
  try {
    const supabase = createAdminSupabaseClient()
    for (const bucket of Object.values(BUCKETS)) {
      const path = `_health/${Date.now()}.txt`
      const { error } = await supabase.storage.from(bucket).upload(path, Buffer.from('ok'), { contentType: 'text/plain', upsert: true })
      if (error) return { ok: false, error: `${bucket}: upload failed — ${error.message}`.slice(0, 200) }
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`)
      await supabase.storage.from(bucket).remove([path])
      if (!res.ok) return { ok: false, error: `${bucket}: not publicly readable (${res.status})` }
    }
    return { ok: true }
  } catch (error) {
    return { ok: false, error: short(error) }
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

  const imageProcessing = await imageProcessingStatus()
  const [storage, keyProbe] = await Promise.all([
    database ? storageProbe() : Promise.resolve<Probe>({ ok: false, error: 'database unavailable' }),
    provider === 'fal' ? falKeyProbe() : Promise.resolve<Probe>({ ok: imageKey }),
  ])

  const checks = {
    database,
    migration_applied: database ? await ordersTableReady() : false,
    image_provider: provider,
    image_key: imageKey,
    image_key_accepted: keyProbe.ok,
    ...(keyProbe.error ? { image_key_error: keyProbe.error } : {}),
    storage: storage.ok,
    ...(storage.error ? { storage_error: storage.error } : {}),
    // Optional: the site works without it, with slightly larger stored files.
    image_processing: imageProcessing.ok,
    ...(imageProcessing.error ? { image_processing_error: imageProcessing.error } : {}),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    stripe_webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    lulu: isLuluConfigured(),
    email: Boolean(process.env.RESEND_API_KEY),
    app_url: Boolean(process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  }
  return {
    can_generate: checks.database && checks.image_key_accepted && checks.storage,
    can_take_orders: checks.database && checks.migration_applied && checks.stripe,
    can_print: checks.lulu,
    checks,
  }
}

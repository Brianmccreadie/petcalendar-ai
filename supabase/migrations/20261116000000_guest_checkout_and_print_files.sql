-- Guest checkout, print files and abuse guard.
-- Safe to run more than once.

-- Orders are placed without an account.
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS interior_pdf_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cover_pdf_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfilment_error TEXT;

-- One order per Stripe Checkout Session (makes webhook retries idempotent).
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_session_unique
  ON orders(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

-- Anonymous visitor fingerprint (salted hash of IP) used to cap free previews.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_projects_client_hash_created ON projects(client_hash, created_at);

-- Version history is only ever touched by the service role.
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Bucket for print-ready PDFs fetched by the printer.
INSERT INTO storage.buckets (id, name, public)
VALUES ('print-files', 'print-files', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PetCalendar.ai — complete database setup for a NEW Supabase project.
--
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run more than once.
--
-- (The files in supabase/migrations/ are the history of the original
-- project. For a fresh project, use this file instead of those.)
-- ============================================================

-- ---- Calendars ----
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL DEFAULT 'My Pet Calendar',
  pet_name TEXT,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  style TEXT NOT NULL DEFAULT 'mythical-quest',
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'generating', 'preview', 'ordered')),
  multi_pet_mode TEXT NOT NULL DEFAULT 'alternate' CHECK (multi_pet_mode IN ('alternate', 'together')),
  start_month INTEGER NOT NULL DEFAULT 1,
  start_year INTEGER NOT NULL DEFAULT 2027,
  client_hash TEXT, -- salted hash of the visitor's IP, used to cap free previews
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_client_hash_created ON projects(client_hash, created_at);

-- ---- Pets in a calendar ----
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pets_project_id ON pets(project_id);

-- ---- Uploaded reference photos ----
-- (Column names say "cloudinary" for historical reasons; they hold Supabase Storage URLs and paths.)
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  original_filename TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pet_photos_project_id ON pet_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_id ON pet_photos(pet_id);

-- ---- Generated pages (cover + 12 months) ----
CREATE TABLE IF NOT EXISTS calendar_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('cover', 'month', 'back')),
  month_number INTEGER,
  prompt TEXT,
  cloudinary_url TEXT,
  cloudinary_public_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  generation_attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_project_id ON calendar_pages(project_id);

-- ---- Version history for each page ----
CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_page_id UUID NOT NULL REFERENCES calendar_pages(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  custom_instructions TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(calendar_page_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_project_id ON page_versions(project_id);

-- ---- Orders ----
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID,
  email TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  lulu_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'submitted_to_lulu', 'in_production', 'shipped', 'delivered', 'failed', 'refunded')),
  shipping_name TEXT,
  shipping_address JSONB,
  shipping_method TEXT DEFAULT 'STANDARD',
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  tracking_number TEXT,
  tracking_url TEXT,
  interior_pdf_url TEXT,
  cover_pdf_url TEXT,
  fulfilment_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_project_id ON orders(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_lulu_order_id ON orders(lulu_order_id);
-- One order per Stripe Checkout Session (makes webhook retries harmless).
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_session_unique
  ON orders(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

-- ---- Security ----
-- Row Level Security on, with no policies: the browser can read nothing
-- directly. The site talks to the database only from the server, using the
-- service role key, which bypasses RLS.
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ---- File storage ----
-- Public buckets: files are readable by anyone who has the exact URL
-- (the image model, the printer and the customer's browser need that).
-- Only the server can upload.
INSERT INTO storage.buckets (id, name, public) VALUES
  ('pet-photos', 'pet-photos', true),
  ('generated-images', 'generated-images', true),
  ('print-files', 'print-files', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

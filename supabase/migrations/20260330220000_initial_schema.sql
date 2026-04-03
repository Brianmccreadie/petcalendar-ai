-- ============================================================
-- PetCalendar.ai — Full Schema
-- ============================================================

-- ---- Profiles ----
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ---- Projects ----
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Pet Calendar',
  pet_name TEXT,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  style TEXT NOT NULL DEFAULT 'mythical-quest',
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'generating', 'preview', 'ordered')),
  multi_pet_mode TEXT NOT NULL DEFAULT 'alternate' CHECK (multi_pet_mode IN ('alternate', 'together')),
  start_month INTEGER NOT NULL DEFAULT 1,
  start_year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- ---- Pets ----
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets" ON pets FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = pets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own pets" ON pets FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = pets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own pets" ON pets FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = pets.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own pets" ON pets FOR DELETE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = pets.project_id AND projects.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_pets_project_id ON pets(project_id);

-- ---- Pet Photos ----
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  original_filename TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet photos" ON pet_photos FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = pet_photos.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own pet photos" ON pet_photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = pet_photos.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own pet photos" ON pet_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = pet_photos.project_id AND projects.user_id = auth.uid()));

-- ---- Calendar Pages ----
CREATE TABLE IF NOT EXISTS calendar_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id),
  page_type TEXT NOT NULL CHECK (page_type IN ('cover', 'month', 'back')),
  month_number INTEGER,
  prompt TEXT,
  cloudinary_url TEXT,
  cloudinary_public_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  generation_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE calendar_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar pages" ON calendar_pages FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = calendar_pages.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own calendar pages" ON calendar_pages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = calendar_pages.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own calendar pages" ON calendar_pages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = calendar_pages.project_id AND projects.user_id = auth.uid()));

-- ---- Orders ----
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- ---- Indexes ----
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_project_id ON pet_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_project_id ON calendar_pages(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_project_id ON orders(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_lulu_order_id ON orders(lulu_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);

-- ---- Service role bypass for API routes ----
-- The server uses service_role key which bypasses RLS, so these policies
-- only matter for direct client-side Supabase access.

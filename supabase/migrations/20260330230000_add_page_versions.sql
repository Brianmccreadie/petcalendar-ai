CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_page_id UUID REFERENCES calendar_pages(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  custom_instructions TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(calendar_page_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_project_id ON page_versions(project_id);

# Add Version History to Calendar Pages

A new table `page_versions` exists in Supabase:
```sql
page_versions (
  id UUID PRIMARY KEY,
  calendar_page_id UUID REFERENCES calendar_pages(id),
  project_id UUID REFERENCES projects(id),
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  custom_instructions TEXT,
  is_selected BOOLEAN DEFAULT false,
  version_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## Changes needed:

### 1. lib/gemini.ts — Save versions on generation
In `generateAndUpload` and `generateAndUploadMulti`, after successfully uploading an image:
- Insert a row into `page_versions` with `is_selected = true`, the image URL/path, and version_number
- Set all other versions for that page to `is_selected = false`

### 2. app/api/regenerate/route.ts — Save versions on regen/iterate
After successfully generating and uploading a new image:
- Set all existing versions for this page to `is_selected = false`
- Insert a new `page_versions` row with `is_selected = true`
- Include `custom_instructions` if provided
- Calculate `version_number` as max existing version + 1

### 3. New API: app/api/pages/[pageId]/versions/route.ts
- GET: Returns all versions for a calendar page, ordered by version_number
- PATCH: Accepts `{ version_id }` to select a different version — sets that version's `is_selected = true`, all others false, and updates the parent `calendar_pages.cloudinary_url` to match

### 4. app/create/preview/page.tsx — Version carousel on PageCard
Update the PageCard component:
- When a completed image is shown, add small left/right arrow buttons at the bottom if there are multiple versions
- Show "v2 of 3" or similar indicator
- Clicking arrows cycles through versions and calls the PATCH API to select that version
- The currently selected/viewed version is what gets used for the final calendar
- Fetch versions when a card is clicked or when arrows are shown

Keep the UI simple — small prev/next arrows overlaid on the image, and a version counter in the info bar.

### 5. Important
- Use `createAdminSupabaseClient` from `@/lib/supabase-admin` for all server-side DB access
- The `page_versions` table has no RLS — admin client bypasses it
- Run `npx next build` when done

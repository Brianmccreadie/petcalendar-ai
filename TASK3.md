# Wire Up Supabase Persistence — End-to-End

The app currently stores everything in sessionStorage and never writes to Supabase. Fix this so the full pipeline works: upload → create project in DB → generate images → progressive loading.

## What needs to happen:

### 1. Preview page: Create project + pets + upload photos on mount
When the preview page loads and finds sessionStorage data but no `projectId` (or projectId is 'demo'):
1. Create a project in Supabase (use supabase anon client with user auth, or call an API route)
2. Create pet entries in Supabase for each pet
3. Upload each pet's photos to Cloudinary (via `/api/upload` endpoint)
4. Save pet_photos rows in Supabase linking to the pet and project
5. Store the real `projectId` back in sessionStorage
6. Call `/api/generate` with the real project_id to kick off generation
7. The polling will then pick up real updates from Supabase

### 2. API route: `/api/upload` 
Check the existing upload route. It should accept a file upload and:
- Upload to Cloudinary
- Return the cloudinary_url and public_id
- The client will then save the pet_photo row

OR — create a new API route `/api/create-project` that handles everything server-side:
- Accepts: `{ pets: [{name, type, photos: [File]}], style, startYear, multiPetMode }`
- Creates the project
- Creates pets
- Uploads photos to Cloudinary
- Saves pet_photos
- Kicks off generation
- Returns the projectId

This approach is cleaner since it avoids CORS issues with client-side Cloudinary uploads.

### 3. The `/api/create-project` route should:
```
POST /api/create-project
Body (multipart/form-data):
  - projectData: JSON string with { style, startYear, multiPetMode, pets: [{name, type}] }
  - photos: files with naming convention pet-{petIndex}-{photoIndex}

Response: { projectId: string }
```

Steps:
1. Get authenticated user from Supabase auth
2. Create project row
3. For each pet, create pet row
4. For each photo, upload to Cloudinary and create pet_photo row
5. Kick off generateCalendarImages in background
6. Return projectId

### 4. Update `app/create/preview/page.tsx`
On mount, if no real projectId exists:
1. Gather all data from sessionStorage (pets, photos as File objects... wait, File objects can't be stored in sessionStorage)

ACTUALLY — the issue is that sessionStorage can't hold File objects. The photos only exist as blob URLs in memory. So the upload needs to happen BEFORE navigating to the preview page.

### Better approach: Upload on the STYLE page
When the user clicks "Create My Calendar!" on the style page:
1. Show a "Creating your project..." loading state
2. POST to `/api/create-project` with FormData containing all pet info + photo files
3. Store the returned `projectId` in sessionStorage
4. Navigate to `/create/preview`
5. Preview page loads with real projectId, polling picks up generation progress

### 5. But wait — File objects are in the CREATE page, not style page
The photos are uploaded in the create page and stored in state as `{id, file: File, preview: blobURL}`. When navigating to style page, only serializable data goes to sessionStorage (file name, size, preview URL). The actual File objects are lost.

### SOLUTION: Upload photos immediately on the CREATE page
When the user clicks "Continue to Style →":
1. Create the project in Supabase immediately
2. Create pets in Supabase  
3. Upload all photos to Cloudinary and save pet_photos
4. Store the projectId in sessionStorage
5. Navigate to style page

Then when they click "Create My Calendar!" on the style page:
1. Update the project with the chosen style + year
2. Call `/api/generate` to kick off generation
3. Navigate to preview

### Implementation:

#### New API route: `app/api/create-project/route.ts`
- Accepts multipart/form-data
- Creates project, pets, uploads photos, returns projectId

#### Update `app/create/page.tsx`
- On "Continue to Style →", upload everything via the new API
- Show uploading progress
- Store projectId in sessionStorage

#### Update `app/create/style/page.tsx`  
- On "Create My Calendar!", update project style/year and call generate
- Store projectId properly

#### Update `app/create/preview/page.tsx`
- Read projectId from sessionStorage
- Fetch real pages from Supabase via polling
- Remove demo page generation

### Important notes:
- Use the Supabase service role key on server side (already set up in lib/supabase-server.ts)
- The upload needs to handle the actual File binary data via FormData
- Auth: for now, create projects without requiring login (use service role). Auth can be added later.
- Cloudinary upload helper is in `lib/cloudinary.ts` — use it server-side
- The generate function in `lib/gemini.ts` already handles everything once the data is in Supabase
- Make sure the Vercel function timeout covers photo upload time. Multiple photos could take 10-20s.

Run `npx next build` when done.

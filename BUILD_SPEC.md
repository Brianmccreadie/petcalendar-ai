# PetCalendar.ai — Build Specification

## Overview
AI-powered personalized pet photo calendars. Users upload photos of their pet, choose a style, AI generates 12 stylized monthly images, they preview/edit, then order a printed calendar shipped to their door.

## Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (users, projects, generated images, orders)
- **Auth:** Supabase Auth (email + Google OAuth)
- **AI Image Gen:** Google Gemini 2.0 Flash (image-to-image generation)
- **Image Hosting:** Cloudinary (uploaded photos + generated images)
- **Payments:** Stripe Checkout
- **Print Fulfillment:** Printful API (blank wall calendar)
- **Deployment:** Vercel

## Printful Calendar Specs
- **Product:** Wall Calendar (Blank) — full creative control over every page
- **Wholesale:** ~$12.19
- **Pages:** 14 (cover + 12 months + back)
- **Size:** Standard wall calendar format
- **API:** developers.printful.com — order creation, shipping estimates, mockup generation
- **Sandbox:** Available for testing

## Database Schema (Supabase)

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Pet Calendar',
  pet_name TEXT,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  style TEXT NOT NULL DEFAULT 'watercolor',
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'generating', 'preview', 'ordered')),
  start_month INTEGER NOT NULL DEFAULT 1, -- 1-12, which month the calendar starts
  start_year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `pet_photos`
```sql
CREATE TABLE pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  original_filename TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `calendar_pages`
```sql
CREATE TABLE calendar_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('cover', 'month', 'back')),
  month_number INTEGER, -- 1-12 for months, NULL for cover/back
  prompt TEXT, -- the prompt used to generate this image
  cloudinary_url TEXT, -- generated image URL
  cloudinary_public_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  generation_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  printful_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'submitted_to_printful', 'in_production', 'shipped', 'delivered', 'failed', 'refunded')),
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
```

## Calendar Styles (AI Generation)
Each style defines the artistic approach for the 12 monthly images:

1. **Watercolor** — Soft, painterly watercolor illustration
2. **Oil Painting** — Rich, textured oil painting style (Renaissance/classical)
3. **Pop Art** — Bold colors, halftone dots, Warhol-inspired
4. **Cartoon** — Fun, Disney/Pixar-style cartoon illustration
5. **Vintage Illustration** — Retro 1950s-60s magazine illustration
6. **Minimalist Line Art** — Clean, elegant line drawing with selective color
7. **Stained Glass** — Decorative stained glass window style
8. **Japanese Woodblock** — Ukiyo-e inspired artwork
9. **Botanical** — Pet surrounded by seasonal flowers/plants
10. **Cozy Seasons** — Pet in seasonal scenes (fireplace, beach, autumn leaves, etc.)

Each month gets a seasonal theme layered on top of the chosen style:
- January: New Year / Winter
- February: Valentine's / Love
- March: Spring flowers
- April: Rainy day / Easter
- May: Garden / Mother's Day
- June: Summer begins / Beach
- July: Patriotic / Fireworks
- August: Vacation / Adventure
- September: Back to school / Autumn begins
- October: Halloween / Fall colors
- November: Thanksgiving / Cozy
- December: Holiday / Snow

## User Flow

### Step 1: Upload Photos
- Landing page with hero section explaining the product
- "Create Your Calendar" CTA → auth (if not logged in) → upload page
- Upload 3-5 photos of their pet (drag & drop, mobile camera)
- Enter pet name and type (dog/cat/other)
- Photos uploaded to Cloudinary immediately

### Step 2: Choose Style
- Grid of style options with preview thumbnails (show example dog in each style)
- Select one style
- Choose start month/year
- "Generate My Calendar" button

### Step 3: Preview & Edit
- Full calendar preview showing all 12 months + cover
- Each month card shows the generated image
- Click any month to:
  - Regenerate (up to 3 attempts per month)
  - See the image larger
- Overall satisfaction check
- "Order This Calendar" button

### Step 4: Checkout
- Stripe Checkout (hosted checkout page)
- Shipping address collection
- Pricing: $39.99 (or $34.99 early bird)
- After payment: order submitted to Printful API
- Confirmation page with order details + estimated delivery

### Step 5: Order Tracking
- Dashboard showing order status
- Printful webhook updates status automatically
- Email notifications at key stages (paid, in production, shipped)

## Page Structure
```
app/
  page.tsx                    — Landing page (hero, how it works, pricing, FAQ)
  layout.tsx                  — Root layout with nav
  globals.css
  auth/
    callback/route.ts         — Supabase auth callback
  create/
    page.tsx                  — Upload photos step
    style/page.tsx            — Choose style step
    preview/page.tsx          — Preview & edit generated calendar
  checkout/
    page.tsx                  — Pre-checkout summary
    success/page.tsx          — Order confirmation
  dashboard/
    page.tsx                  — User's projects and orders
  api/
    generate/route.ts         — Trigger AI generation for a project
    regenerate/route.ts       — Regenerate single month
    checkout/route.ts         — Create Stripe checkout session
    webhooks/
      stripe/route.ts         — Stripe payment webhook
      printful/route.ts       — Printful order status webhook
    order/route.ts            — Submit order to Printful after payment
    upload/route.ts           — Handle Cloudinary upload signature
components/
  Hero.tsx
  HowItWorks.tsx
  StylePicker.tsx
  PhotoUploader.tsx
  CalendarPreview.tsx
  MonthCard.tsx
  PricingSection.tsx
  FAQ.tsx
  Navbar.tsx
  Footer.tsx
lib/
  supabase.ts               — Browser client
  supabase-server.ts         — Server client
  gemini.ts                  — Gemini image generation
  printful.ts                — Printful API client
  cloudinary.ts              — Cloudinary upload/transform
  stripe.ts                  — Stripe client
  prompts.ts                 — AI generation prompts per style/month
  types.ts                   — TypeScript types
  calendar-renderer.ts       — Compose final calendar page images (dog image + date grid + month name)
```

## AI Generation Pipeline

### For each of the 12 months:
1. Select 1-2 reference photos from the user's uploads (rotate through them)
2. Build prompt: `[style description] portrait of [pet_name] the [pet_type], [monthly theme]. Based on the reference photo.`
3. Send to Gemini 2.0 Flash with the reference photo as input image
4. Receive generated image
5. Upload to Cloudinary at high resolution (at least 3000px wide for print quality)
6. Compose final calendar page: generated image (top 2/3) + date grid (bottom 1/3)
7. Save to calendar_pages table

### Cover page:
- Best/most striking generated image or a special "annual" version
- Pet name + year overlaid

### Image specs for Printful:
- Minimum 300 DPI at print size
- For blank wall calendar: need to check exact pixel dimensions from Printful template

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PRINTFUL_API_KEY=
PRINTFUL_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

## Design Direction
- **Premium but playful** — this is a gift product for pet lovers
- **Warm, inviting colors** — not corporate. Think: soft gradients, rounded corners, warm whites
- **Show the product** — hero section should feature a mockup of an actual calendar with a dog on it
- **Trust signals** — "Printed on premium paper", "Ships in 5-7 days", "Satisfaction guaranteed"
- **Mobile-first** — many users will create from their phone (camera roll access is key)

## Pricing Strategy
- **Standard:** $39.99 per calendar
- **Early Bird / Launch:** $34.99
- Free shipping (bake it into the price)
- Upsell: order additional copies at $29.99 each

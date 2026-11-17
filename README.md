# PetCalendar.ai

Custom wall calendars starring your pet. A visitor uploads a few photos, picks one of 50 themes, reviews
an AI-generated cover + twelve months, and orders a printed 11 × 8.5 in Wire-O calendar.

**Stack:** Next.js 16 (App Router) · Tailwind 4 · Supabase (Postgres + Storage) · GPT Image / Gemini image models ·
Stripe Checkout · Lulu print API · HyperFrames (reveal video).

> `AGENTS.md` matters: this is Next.js 16. Read `node_modules/next/dist/docs/` before changing framework code.

## How it works

```
/create ─► /create/style ─► /create/preview ─► /checkout ─► Stripe ─► /checkout/success ─► /order/[id]
 photos      theme + year     review / revise    quantity                order created       status + tracking
```

No accounts. A project id (UUID) in the URL identifies a calendar; the browser remembers its calendars in
`localStorage` ("My calendars").

| Concern | Where |
| --- | --- |
| Image generation (providers, retries, model fallback) | `lib/ai/` |
| Scene prompts for 50 themes × 12 months | `lib/prompts.ts` |
| Generation pipeline, redo / revise | `lib/generation.ts` |
| Calendar maths + page geometry (shared by screen, print and video) | `lib/calendar/layout.ts` |
| On-screen typeset pages (SVG) | `components/calendar/` |
| Print-ready PDFs | `lib/print/pdf.ts` |
| Reveal film (HyperFrames composition) | `lib/reveal/composition.ts` |
| Orders, fulfilment, Lulu | `lib/orders.ts`, `lib/lulu.ts` |
| Prices, limits, product copy | `lib/config.ts` |

### Artwork has no text — type is typeset

The image model is told never to draw text. The pet's name, month names, dates and holidays are typeset from one
set of layout constants, rendered three ways: SVG in the browser, vector text in the print PDF, and animated type
in the reveal film. What the customer previews is what is printed.

## Setup

```bash
npm install
cp .env.example .env.local     # fill in what you have
npm run dev
```

1. **Supabase** — run the SQL in `supabase/migrations/` in order (the newest one adds guest checkout columns and the
   `print-files` bucket). Create public buckets `pet-photos` and `generated-images` if they don't exist.
2. **Image model** — set `FAL_KEY`, `OPENAI_API_KEY` or `GOOGLE_GEMINI_API_KEY` (see below).
3. **Stripe** — set `STRIPE_SECRET_KEY`; point a webhook at `/api/webhooks/stripe` for `checkout.session.completed`
   and set `STRIPE_WEBHOOK_SECRET`.
4. **Lulu** — set `LULU_CLIENT_KEY` / `LULU_CLIENT_SECRET`, subscribe a webhook to `/api/webhooks/lulu`.
   **Start with `LULU_API_ENVIRONMENT=sandbox` and place a test order** to confirm Lulu accepts the print files and
   `LULU_CALENDAR_POD_PACKAGE_ID` for your calendar product before going live.

`GET /api/health` reports which pieces are configured (booleans only). Checkout stays closed until Stripe is set
and the migration has been applied, so a payment can never be taken without an order being recorded.

To try the whole flow without spending anything, set `IMAGE_PROVIDER=mock` — pages are filled with bundled samples.

## Image models

Configured in `lib/ai/config.ts`, all overridable by env:

| Provider | Default model | Used when |
| --- | --- | --- |
| fal.ai | `openai/gpt-image-2.5/sunburst/edit` (falls back to `fal-ai/nano-banana-2/edit`) | `FAL_KEY` is set, or `IMAGE_PROVIDER=fal` |
| OpenAI | `gpt-image-2.5-sunburst` (falls back to `gpt-image-2`) | `OPENAI_API_KEY` is set, or `IMAGE_PROVIDER=openai` |
| Google | `gemini-3.1-flash-image` (falls back to the `-preview` id) | otherwise, or `IMAGE_PROVIDER=gemini` |

Newer or higher-tier models are a one-line change, e.g. `OPENAI_IMAGE_MODEL=gpt-image-2.6-sunburst` or
`GEMINI_IMAGE_MODEL=gemini-3-pro-image`. Output size is `OPENAI_IMAGE_SIZE` (default `2176x1632`) /
`GEMINI_IMAGE_SIZE` (default `2K`; use `4K` for 300 dpi print at higher cost).

Every page sends up to three reference photos per pet. Transient errors are retried with backoff; if the preferred
model isn't available to the key, the next model in the list is tried.

## Print files

`lib/print/pdf.ts` builds two PDFs per order (pages are 11.25 × 8.75 in: trim + 0.125 in bleed):

- `cover.pdf` — front cover (art + title) and back cover (index of the twelve months)
- `interior.pdf` — 24 pages: art page then dates page for each month

Preview the layout without generating anything:

```bash
npm run sample:print            # → sample-print/cover.pdf, sample-print/interior.pdf
```

If Lulu submission fails, the order stays `paid` with `fulfilment_error` set and the PDFs saved. Retry with:

```bash
curl -X POST $APP_URL/api/admin/fulfil -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" -d '{"order_id":"<uuid>"}'
```

## Reveal film (HyperFrames)

Each finished calendar has a short flip-through film at `/reveal/[projectId]`: an HTML + GSAP composition played by
`<hyperframes-player>`. The same composition renders to MP4 with the HyperFrames CLI (Node 22+, FFmpeg):

```bash
npm run render:reveal -- --sample          # bundled images → reveal-out/sample.mp4
APP_URL=https://… npm run render:reveal -- <projectId>
```

Rendering needs headless Chrome + FFmpeg, so it runs on a workstation or worker, not in a serverless function.

## Scripts

| | |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint, TypeScript |
| `npm run sample:print` | Sample print PDFs |
| `npm run render:reveal` | Render a reveal film |
| `npm run sample:year` | Generate the showcase calendar on the landing page (`public/year`) |
| `npm run previews` | Regenerate the sample images in `public/previews` with the current model and prompts |

## Guard rails

- Uploads are size-capped, type-sniffed and re-encoded server-side; phone photos are downscaled in the browser first.
- Each page gets 3 free revision rounds; one visitor can start 5 calendars per day (`lib/config.ts`).
- Stripe and Lulu webhooks are signature-verified and fail closed. Orders are idempotent per Checkout Session.
- All database access is server-side with the service role key; never import `lib/supabase-admin.ts` in a client component.

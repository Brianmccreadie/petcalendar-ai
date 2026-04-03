# Landing Page Redesign

## 1. Replace StylePicker showcase horizontal scroll with a featured grid
In `app/page.tsx`, replace the `<StylePicker showcase />` component with a custom grid showing 8 featured themes. Use a 2x4 grid on desktop, 2x2 on mobile.

The 8 featured themes to show (with real images at /previews/{id}.jpg):
- wizarding-world
- space-explorer
- secret-agent
- superhero-origin
- pirate-life
- high-school-yearbook
- cozy-vibes
- tiny-human

Each card should show:
- The preview image (landscape, 3:2 aspect ratio)
- Theme name (bold)
- Short description (1 line max, use text-ellipsis/line-clamp-1)
- The theme emoji

Below the grid, add a "See All 50 Themes →" link button that goes to /create.

## 2. Update Hero floating cards to use real images
In `components/Hero.tsx`, update the 4 floating cards to use actual images:
- Card 1: /previews/hero-1.jpg — "March — Wizarding World"
- Card 2: /previews/hero-2.jpg — "Cover — Superhero Origin"
- Card 3: /previews/hero-3.jpg — "July — Space Explorer"
- Card 4: /previews/hero-4.jpg — "December — Cozy Vibes"

Replace the emoji placeholders with actual `<img>` tags. Keep the tilted card layout and animations.

## 3. Remove dashboard link from Navbar
Since we removed save functionality and don't require login, remove the "My Calendars 📁" link from the navbar.

## 4. Shorten theme descriptions in CALENDAR_STYLES
In `lib/types.ts`, shorten all theme descriptions to 60 characters or less so they never get cut off. Keep them punchy and fun.

Run `npx next build` when done.

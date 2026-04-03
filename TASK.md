# PetCalendar.ai Feature Updates

Complete these changes to the petcalendar-ai project. Build and verify after.

## 1. Year-Only Picker (replace month+year with just year)
In `app/create/style/page.tsx`:
- Remove the month dropdown entirely
- Keep only the year dropdown
- Hardcode `startMonth = 1` (always January)
- Update the label to "What year is this calendar for?"
- Update sessionStorage to only store startYear

## 2. Replace Art Styles with Fun Movie-Style Themes
In `lib/types.ts`, replace `CALENDAR_STYLES` and `StyleId` with these new themes. Keep the same interface structure (`CalendarStyle` with id, name, description, accentColor, preview):

New themes (replace ALL existing ones):
1. `mythical-quest` — "Mythical Quest" — Your pet as a fantasy hero in epic Lord of the Rings-style landscapes. Realistic style with cinematic lighting. Accent: #8B6914
2. `wizarding-world` — "Wizarding World" — Your pet attending a magical school of witchcraft and wizardry. Realistic with magical glowing effects. Accent: #5856D6
3. `space-explorer` — "Space Explorer" — Your pet as an astronaut exploring alien planets and galaxies. Realistic sci-fi with dramatic lighting. Accent: #007AFF
4. `secret-agent` — "Secret Agent" — Your pet as a suave spy on international missions. Realistic James Bond-style cinematography. Accent: #2C2C2E
5. `prehistoric-adventure` — "Prehistoric Adventure" — Your pet transported to the age of dinosaurs. Realistic Jurassic Park-style scenes. Accent: #34A853
6. `pirate-life` — "Pirate Life" — Your pet as a swashbuckling pirate captain on the high seas. Realistic Pirates of the Caribbean vibes. Accent: #C0392B
7. `superhero-origin` — "Superhero Origin" — Your pet as a comic-book superhero saving the day. Realistic but with dramatic superhero movie aesthetics. Accent: #FF2D55
8. `royal-portrait` — "Royal Portrait" — Your pet as royalty through different historical eras. Realistic historical painting meets cinematic drama. Accent: #DAA520
9. `detective-noir` — "Detective Noir" — Your pet solving mysteries in moody noir settings. Realistic with dramatic shadows and rain-slicked streets. Accent: #4A4A4A
10. `wild-west` — "Wild West" — Your pet as a frontier cowboy/cowgirl. Realistic western movie cinematography with dusty sunsets. Accent: #D2691E
11. `underwater-odyssey` — "Underwater Odyssey" — Your pet exploring magical underwater kingdoms. Realistic with bioluminescent deep-sea lighting. Accent: #06D6A0
12. `high-school-yearbook` — "High School Yearbook" — Your pet in hilarious high school scenarios — prom, class photos, detention, sports. Realistic photography style, genuinely funny. Accent: #FF9500

Update the `StyleId` type union to match these new IDs.

## 3. Update Prompts for New Themes
In `lib/prompts.ts`, completely rewrite `STYLE_DESCRIPTIONS` and `STYLE_MONTH_SCENES` for the 12 new themes. Each theme should have:
- A base style description emphasizing REALISTIC imagery (not illustration/painting) with cinematic quality
- 12 monthly scenes that fit the theme AND incorporate the seasonal/monthly theme from MONTH_THEMES
- All prompts should be fun, cute, and creative — the pet is the star in these movie-world scenarios
- IMPORTANT: Every prompt must reinforce "realistic, photographic quality" — NOT illustration or cartoon

Also rewrite `coverScenes` for each new theme.

Also update the StylePicker emoji map in `components/StylePicker.tsx` for the new theme IDs:
- mythical-quest: ⚔️
- wizarding-world: 🧙
- space-explorer: 🚀
- secret-agent: 🕵️
- prehistoric-adventure: 🦕
- pirate-life: 🏴‍☠️
- superhero-origin: 🦸
- royal-portrait: 👑
- detective-noir: 🔍
- wild-west: 🤠
- underwater-odyssey: 🐠
- high-school-yearbook: 🎓

## 4. Multi-Pet Support
### Database changes needed (update `supabase-schema.sql` only as reference — do NOT run migrations):
Add a `pets` table:
```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL DEFAULT 'dog' CHECK (pet_type IN ('dog', 'cat', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Add `pet_id` column to `pet_photos`:
```sql
ALTER TABLE pet_photos ADD COLUMN pet_id UUID REFERENCES pets(id) ON DELETE CASCADE;
```

Add `pet_id` column to `calendar_pages`:
```sql
ALTER TABLE calendar_pages ADD COLUMN pet_id UUID REFERENCES pets(id);
```

### UI Changes (`app/create/page.tsx`):
- Replace single pet name + type with multi-pet support
- "Add Another Pet" button that creates a new pet section
- Each pet section has: name input, type selector (dog/cat/other), photo uploader (3-5 photos per pet)
- Minimum 1 pet, no max
- Store pets array in sessionStorage: `[{name, type, photos}]`
- Remove the single `petName` and `petType` fields

### Generation changes (`lib/gemini.ts`, `app/api/generate/route.ts`):
- When generating, alternate pets across months (pet 1 → month 1, pet 2 → month 2, pet 1 → month 3, etc.)
- Cover uses the first pet
- Pass the correct pet's reference photo and name to each month's generation

## 5. Drag-and-Drop Pet Assignment to Months
In `app/create/preview/page.tsx`:
- Add ability to reassign which pet appears on which month
- Show a small pet avatar/name tag on each month card
- Clicking the pet tag cycles through available pets for that month
- When pet assignment changes, regenerate that month with the new pet's photo

## 6. Save & Resume
The project is already saved to Supabase (projects table + calendar_pages). Make sure:
- `app/create/page.tsx`: After uploading, create the project in Supabase immediately (don't wait for generation)
- `app/create/style/page.tsx`: Save style choice to the project
- `app/dashboard/page.tsx`: Show existing projects with "Continue" button
- Projects in "uploading", "generating", or "preview" status can be resumed

## Important Notes
- ALL generated images must be REALISTIC/PHOTOGRAPHIC style — no illustrations, paintings, or cartoons
- NO text of any kind in generated images
- The fun comes from the scenarios and themes, not from art style
- Make the prompts detailed and cinematic — think movie stills
- After all changes, run `npx next build` to verify no errors


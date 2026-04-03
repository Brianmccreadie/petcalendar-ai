# Add 38 More Themes (Total 50)

We currently have 12 themes in lib/types.ts. Add 38 MORE themes to bring the total to 50.

## New themes to add (append to existing CALENDAR_STYLES array and StyleId union):

13. `professional-headshot` — "Professional Headshot" — Studio-quality pet portraits with perfect lighting, clean backgrounds, and magazine-cover energy. Think Vanity Fair pet edition. Accent: #1C1C1E
14. `pet-photoshoot` — "Pet Photoshoot" — Fun lifestyle photoshoot in different settings each month — parks, studios, cafes, beds. Natural light, lifestyle photography. Accent: #E8825A
15. `cozy-vibes` — "Cozy Vibes" — Simple, warm, seasonal scenes. Your pet in everyday cozy moments — no costumes or fantasy. Just pure comfort. Accent: #C4956A
16. `cooking-show` — "Cooking Show" — Your pet as a celebrity chef hosting their own cooking show each month, with seasonal recipes. Accent: #FF6B35
17. `rock-star` — "Rock Star" — Your pet as a legendary musician across different genres and decades. Accent: #8B0000
18. `fashion-week` — "Fashion Week" — Your pet strutting the runway in high fashion each month. Different designers and styles. Accent: #FF69B4
19. `office-life` — "Office Life" — Your pet in hilarious corporate settings — meetings, presentations, water cooler talk, casual Friday. Accent: #4169E1
20. `sports-mvp` — "Sports MVP" — Your pet dominating a different sport each month. Realistic sports photography. Accent: #228B22
21. `around-the-world` — "Around the World" — Your pet visiting a different iconic world landmark each month. Travel photography style. Accent: #1E90FF
22. `fairy-tale` — "Fairy Tale" — Your pet in classic fairy tale scenes — enchanted forests, castles, magical creatures. Realistic with magical atmosphere. Accent: #9370DB
23. `zombie-apocalypse` — "Zombie Apocalypse" — Your pet surviving a Walking Dead-style apocalypse. Dramatic, gritty, but your pet is clearly thriving. Accent: #556B2F
24. `renaissance-pet` — "Renaissance Pet" — Your pet as the subject of famous Renaissance paintings recreated as photos. Accent: #8B6914
25. `sitcom-star` — "Sitcom Star" — Your pet in iconic sitcom scenes and settings — the couch, the coffee shop, the apartment. Accent: #FFD700
26. `mad-scientist` — "Mad Scientist" — Your pet as a brilliant (slightly unhinged) scientist in a wild laboratory. Different experiments each month. Accent: #00CED1
27. `movie-poster` — "Movie Poster" — Each month is a different movie genre poster featuring your pet as the lead — action, romance, horror, comedy. Realistic cinematic poster style. Accent: #B22222
28. `baby-photos` — "Baby Photos" — Your pet recreating classic human baby photo scenarios — in a basket, wrapped in a blanket, first bath, cake smash. Adorable and heartwarming. Accent: #FFB6C1
29. `fitness-journey` — "Fitness Journey" — Your pet as a fitness influencer — yoga, weightlifting, running, smoothie prep. Motivational and hilarious. Accent: #32CD32
30. `art-museum` — "Art Museum" — Your pet photoshopped into famous artworks and art movements — Mona Lisa, Starry Night, etc. Realistic photo of pet in a museum-quality recreation. Accent: #DAA520
31. `holiday-card` — "Holiday Card" — Each month is a different holiday-themed photo card — like professional holiday greeting cards. Warm, family-portrait style. Accent: #C41E3A
32. `camping-adventures` — "Camping Adventures" — Your pet on outdoor adventures — hiking, kayaking, camping, fishing, stargazing. Nature photography style. Accent: #2E8B57
33. `noir-detective` — "Film Noir" — Black and white cinematic noir scenes with your pet as the mysterious lead. Moody, dramatic lighting. Accent: #2F2F2F  
34. `tropical-paradise` — "Tropical Paradise" — Your pet living their best life on tropical islands, beaches, and resorts. Vacation photography. Accent: #FF6347
35. `horror-movie` — "Horror Movie" — Your pet as the star of different horror movie scenarios (cute-scary, not actually scary). Think funny Halloween energy all year. Accent: #800080
36. `dating-profile` — "Dating Profile" — Your pet's dating profile photos — trying to look their best, candid laughing shots, hobbies showcase. Hilariously human. Accent: #FF4500
37. `true-crime` — "True Crime" — Your pet as the detective (never the criminal!) investigating mysteries. Crime scene tape, magnifying glasses, case boards. Accent: #708090
38. `reality-tv` — "Reality TV" — Your pet starring in different reality TV shows — cooking competition, survival show, dating show, talent show. Accent: #FF1493
39. `influencer` — "Pet Influencer" — Your pet as a social media influencer — flat lays, aesthetic coffee shots, mirror selfies, sponsored content vibes. Accent: #E4405F
40. `nap-champion` — "Nap Champion" — Your pet sleeping in increasingly elaborate and cozy places each month. Pure relaxation energy. Accent: #B0C4DE
41. `time-traveler` — "Time Traveler" — Your pet visiting different historical eras — Ancient Egypt, Medieval times, 1920s, 1980s, the future. Accent: #CD853F
42. `video-game-hero` — "Video Game Hero" — Your pet in realistic scenes inspired by famous video game worlds — open world RPGs, racing games, puzzle worlds. Accent: #7B68EE
43. `broadway-star` — "Broadway Star" — Your pet performing in different famous musicals and theatrical productions. Spotlight, stage, costumes. Accent: #FFD700
44. `garden-party` — "Garden Party" — Your pet hosting elegant garden parties each month with seasonal flowers, tea sets, and pastoral settings. Accent: #98FB98
45. `snow-day` — "Snow Day" — Your pet in charming winter/snow scenes all year round — because some pets (and people) wish it was always snowy. Accent: #B0E0E6
46. `national-park` — "National Park" — Your pet visiting a different US National Park each month. Epic landscape photography. Accent: #228B22
47. `tiny-human` — "Tiny Human" — Your pet doing everyday human things — grocery shopping, commuting, reading the paper, doing taxes. Realistic and hilarious. Accent: #DEB887
48. `anime-world` — "Anime World" — Your pet in realistic scenes inspired by iconic anime settings and moments. Cherry blossoms, ramen shops, train stations. Accent: #FF6B81
49. `galactic-emperor` — "Galactic Emperor" — Your pet ruling an intergalactic empire from a massive space throne. Star Wars meets your living room. Accent: #4B0082
50. `cottage-core` — "Cottage Core" — Your pet living the pastoral dream — wildflower meadows, rustic kitchens, homemade bread, cozy cottages. Accent: #8FBC8F

## Instructions:
1. Add all 38 new IDs to the `StyleId` union in `lib/types.ts`
2. Add all 38 new entries to the `CALENDAR_STYLES` array in `lib/types.ts`
3. Add all 38 new base descriptions to `STYLE_DESCRIPTIONS` in `lib/prompts.ts` — emphasize realistic/photographic/cinematic quality
4. Add all 38 new month scene sets (12 months each) to `STYLE_MONTH_SCENES` in `lib/prompts.ts` — incorporate seasonal themes from MONTH_THEMES
5. Add all 38 new cover scenes to `coverScenes` in `lib/prompts.ts`
6. Add all 38 new emoji mappings in `components/StylePicker.tsx`
7. After all changes, run `npx next build` and verify it passes

NEW emoji mappings:
- professional-headshot: 📸
- pet-photoshoot: 🌟
- cozy-vibes: ☕
- cooking-show: 👨‍🍳
- rock-star: 🎸
- fashion-week: 👗
- office-life: 💼
- sports-mvp: 🏆
- around-the-world: 🌍
- fairy-tale: 🏰
- zombie-apocalypse: 🧟
- renaissance-pet: 🎨
- sitcom-star: 📺
- mad-scientist: 🧪
- movie-poster: 🎬
- baby-photos: 👶
- fitness-journey: 💪
- art-museum: 🖼️
- holiday-card: 🎄
- camping-adventures: ⛺
- noir-detective: 🎞️
- tropical-paradise: 🌴
- horror-movie: 👻
- dating-profile: 💘
- true-crime: 🔎
- reality-tv: 📡
- influencer: 📱
- nap-champion: 😴
- time-traveler: ⏰
- video-game-hero: 🎮
- broadway-star: 🎭
- garden-party: 🌷
- snow-day: ❄️
- national-park: 🏔️
- tiny-human: 🧑
- anime-world: 🌸
- galactic-emperor: 👾
- cottage-core: 🏡

IMPORTANT: Every prompt must emphasize REALISTIC/PHOTOGRAPHIC quality. No illustrations. No text in images. The fun comes from the scenarios.

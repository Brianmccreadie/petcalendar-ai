import { MONTH_THEMES, type StyleId } from './types'

// ============================================================
// Style base descriptions — used as the foundation for every prompt
// ============================================================

const STYLE_DESCRIPTIONS: Record<StyleId, string> = {
  'mythical-quest':
    'A stunning, realistic photograph with cinematic lighting and epic scale. The scene resembles a big-budget fantasy film — lush, sweeping landscapes, dramatic skies, and golden-hour light. Photographic quality, sharp focus, rich color grading.',

  'wizarding-world':
    'A realistic, cinematic photograph set in a magical school environment — stone corridors, floating candles, enchanted libraries, and glowing spell effects. Photographic quality with warm, moody lighting and magical atmospheric haze.',

  'space-explorer':
    'A photorealistic sci-fi scene with dramatic cosmic lighting — alien skies, nebulae, futuristic spacecraft interiors, and strange new worlds. Cinematic quality resembling a big-budget space film. Sharp focus, rich color grading, realistic textures.',

  'secret-agent':
    'A sleek, photorealistic cinematic scene with James Bond-style cinematography — dramatic lighting, exotic international locations, high-tech gadgetry, and sophisticated atmosphere. Cool color grading, sharp focus, glamorous production design.',

  'prehistoric-adventure':
    'A photorealistic scene reminiscent of a Jurassic Park film — lush prehistoric jungles, towering dinosaurs, volcanic landscapes, and dramatic natural lighting. Cinematic quality with rich greens, warm earth tones, and a sense of epic adventure.',

  'pirate-life':
    'A photorealistic cinematic scene with Pirates of the Caribbean vibes — weathered wooden ships, turquoise Caribbean seas, tropical islands, and dramatic storm lighting. Rich, saturated colors with golden-hour warmth and adventurous atmosphere.',

  'superhero-origin':
    'A photorealistic superhero movie scene with dramatic lighting, dynamic composition, and epic scale. Think Marvel/DC film stills — city skylines, dramatic capes, lens flares, and heroic poses. Cinematic color grading and sharp detail.',

  'royal-portrait':
    'A photorealistic cinematic portrait with historical grandeur — ornate palaces, rich fabrics, golden crowns, and dramatic Rembrandt-style lighting. Resembles a high-end period drama. Sharp detail, rich color, and regal atmosphere.',

  'detective-noir':
    'A photorealistic noir scene with dramatic shadows, rain-slicked streets, neon reflections, and moody atmospheric lighting. Think classic detective film — trench coats, fog, venetian blind shadows, and a mysterious atmosphere. Cinematic quality.',

  'wild-west':
    'A photorealistic western movie scene — dusty frontier towns, sweeping desert landscapes, dramatic sunsets, and rugged authenticity. Cinematic quality resembling classic westerns with warm, dusty color grading and golden light.',

  'underwater-odyssey':
    'A photorealistic underwater scene with bioluminescent lighting, crystal-clear water, coral kingdoms, and magical deep-sea atmosphere. Cinematic quality with rich blues, teals, and glowing aquatic light. Sharp detail and dreamlike beauty.',

  'high-school-yearbook':
    'A photorealistic, genuinely funny scene set in a classic American high school — lockers, gyms, cafeterias, and classrooms. Bright, warm lighting with a comedic, nostalgic quality. Think a teen comedy film still — sharp focus, vivid colors, hilarious scenarios.',

  'professional-headshot':
    'A stunning, studio-quality photographic portrait with perfect three-point lighting, a clean seamless background, and crisp editorial sharpness. The look evokes a Vanity Fair cover shoot or high-end corporate headshot session — polished, sophisticated, and utterly flattering. Photographic quality only, no illustration or painterly effects.',

  'pet-photoshoot':
    'A natural-light lifestyle photography session with authentic, candid energy — the kind of images shot by a talented pet photographer on location. Warm tones, shallow depth of field, and magazine-quality composition. Think editorial pet photography for a glossy lifestyle publication.',

  'cozy-vibes':
    'A warm, intimate documentary-style photograph that feels like it was taken in the moment — golden hour window light, soft shadows, and rich earthy tones. The aesthetic is hygge-inspired home photography: authentic, unhurried, and beautifully ordinary. Realistic and photographic, never staged or illustrated.',

  'cooking-show':
    'A vibrant, professional food-television photography style — bright studio lighting, commercial kitchen or set design, and dynamic composition that captures action and personality. Think a cross between a Food Network set and a glossy cookbook shoot. Realistic and photographic, with rich, saturated food-friendly colors.',

  'rock-star':
    'A dramatic, high-contrast concert and music photography style — stage lighting, atmospheric smoke, lens flares, and the raw energy of a sold-out arena. Each month captures a different genre and era through authentic photographic treatment: moody grunge, glitzy glam rock, neon-lit pop. Realistic photographic quality throughout.',

  'fashion-week':
    'A high-fashion editorial and runway photography style — stark white or dramatic backstage settings, stark directional lighting, and the clean aesthetic of Vogue or Harper\'s Bazaar. Each scene captures the precise moment a look is at its most striking. Photographic quality, no illustration, no text.',

  'office-life':
    'A photorealistic corporate office photography style with the visual sensibility of a stock photo agency that actually has a sense of humor — fluorescent-lit conference rooms, open-plan desks, and breakroom settings shot with sharp detail and deadpan realism. Think The Office meets a professional business headshot photographer.',

  'sports-mvp':
    'A high-octane sports photography style — fast shutter speeds that freeze peak action, dramatic stadium lighting, shallow depth of field, and the visceral energy of Getty Sports imagery. Every month is a different sport captured at the defining moment of victory. Realistic and photographic throughout.',

  'around-the-world':
    'A travel editorial photography style — the kind of images that appear in National Geographic Traveler or Conde Nast Traveler. Iconic landmarks photographed in beautiful ambient light with authentic sense of place. Wide establishing shots, warm golden-hour tones, and genuine wonder. Realistic photographic quality only.',

  'fairy-tale':
    'A cinematic photographic style that recalls the visual language of a prestige fairy-tale film — enchanted forests lit with dappled magic light, misty castle courtyards, and sun-drenched meadows that feel genuinely otherworldly. Think Pan\'s Labyrinth meets A Midsummer Night\'s Dream with photorealistic detail and rich, saturated color grading.',

  'zombie-apocalypse':
    'Cinematic, gritty photorealistic style inspired by prestige post-apocalyptic television. Dramatic low-key lighting, desaturated color grading with warm amber and cool shadow tones, shallow depth of field with environmental storytelling in the background. No text, no illustrations — every image looks like a production still from an award-winning survival drama.',

  'renaissance-pet':
    'Photorealistic recreation of Old Master Renaissance paintings — rich chiaroscuro lighting, deep jewel-toned fabrics, and the warm amber glow of candlelight or soft window light. Every image is composed and lit to match the specific painting being referenced, with period-accurate props, draped textiles, and gilded frames implied by the framing. No text, no illustrations.',

  'sitcom-star':
    'Warm, colorful multi-camera sitcom aesthetic rendered as hyper-realistic photography. Bright, even studio lighting with slightly saturated colors, cozy interior sets packed with recognizable props and set dressing. No text, no illustrations — every image feels like a behind-the-scenes production photo from a beloved network comedy.',

  'mad-scientist':
    'Dramatic, cinematic photorealistic style set inside a gloriously chaotic Victorian-meets-modern laboratory. High-contrast lighting with practical light sources — bubbling beakers, glowing screens, crackling electricity — casting dynamic shadows. No text, no illustrations — every image feels like a still from a science-fiction blockbuster.',

  'movie-poster':
    'Photorealistic, high-production-value imagery styled to match the visual language of a specific film genre each month — noir shadows, action-movie explosions, rom-com soft light, horror chiaroscuro. Cinematic aspect ratio composition, dramatic lighting, and genre-appropriate color grading. No text, no illustrations.',

  'baby-photos':
    'Soft, warm, dreamlike photorealistic style inspired by professional newborn and milestone photography studios. Gentle diffused window light or pastel-gelled studio strobes, plush fabrics, knit wraps, and whimsical props. No text, no illustrations — every image looks like a precious heirloom portrait from a boutique baby photography studio.',

  'fitness-journey':
    'High-energy, aspirational photorealistic style drawn from professional fitness and wellness brand photography. Clean bright backgrounds, dynamic motion-freeze action shots, dewy morning light for outdoor scenes, and bold studio light for gym settings. No text, no illustrations — every image looks like it belongs in a premium athletic apparel campaign.',

  'art-museum':
    'Photorealistic museum-quality recreation of iconic artworks and art movements, with the pet physically inhabiting the scene. Lighting meticulously matched to the referenced work — Impressionist dappled outdoor light, Expressionist dramatic color, Surrealist dreamlike clarity. No text, no illustrations — every image looks like a stunning conceptual fine-art photograph.',

  'holiday-card':
    'Warm, polished, photorealistic family-portrait studio style with holiday-specific set dressing, soft bokeh backgrounds, and generous use of seasonal color palettes. Professional portrait lighting — large softboxes, warm rim light — creating that timeless, send-to-grandma quality. No text, no illustrations.',

  'camping-adventures':
    'Vivid, adventurous photorealistic outdoor photography in the style of a premium gear brand or national park campaign. Golden hour and blue hour natural light, wide dramatic landscapes juxtaposed with intimate close-up moments, rich greens and earth tones. No text, no illustrations.',

  'noir-detective':
    'Ultra-realistic black and white cinematic photography with dramatic film noir lighting — deep shadows, stark contrast, and moody atmosphere inspired by 1940s detective films. Every shot feels like a still from a classic mystery movie, with carefully composed chiaroscuro lighting and authentic period details rendered in stunning photographic detail.',

  'tropical-paradise':
    'Vibrant, sun-drenched photorealistic travel photography capturing lush tropical destinations — turquoise waters, white sand beaches, swaying palms, and colorful resort life. Rich saturated colors and golden hour lighting make every scene look like a professional travel magazine spread.',

  'horror-movie':
    'Hyper-realistic cinematic horror movie photography with dramatic theatrical lighting — fog machines, eerie colored gels, and classic horror movie staging that is spooky and fun rather than frightening. Every shot captures the playful energy of a beloved horror film still, complete with genre-accurate costumes and atmospheric settings.',

  'dating-profile':
    'Warm, flattering lifestyle photography styled like premium dating app profile pictures — natural light portraits, candid laughing shots, and carefully composed hobby showcases. The lighting is soft and golden, the backgrounds are tastefully blurred, and every image radiates approachable charm and personality.',

  'true-crime':
    'Gritty, atmospheric photojournalistic photography styled like documentary true crime footage — dramatic overhead evidence shots, moody interrogation room lighting, and serious detective work captured with unflinching photographic realism. Every image has the weight and texture of authentic investigative photography.',

  'reality-tv':
    'Polished, high-production photorealistic photography styled like behind-the-scenes stills from premium reality television — dramatic competition lighting, confessional booth setups, and perfectly staged production environments. Each shot captures the heightened, theatrical energy of reality TV with professional broadcast-quality photography.',

  'influencer':
    'Meticulously styled photorealistic lifestyle photography in the aesthetic of top-tier social media influencers — perfect flat lays, carefully curated color palettes, golden hour portraits, and aspirational lifestyle moments. Every image has intentional composition, impeccable styling, and the polished look of professionally shot branded content.',

  'nap-champion':
    'Cozy, intimate photorealistic photography capturing supremely comfortable sleeping scenarios — warm ambient lighting, luxurious textures, soft focus backgrounds, and an overall atmosphere of pure, blissful relaxation. Each image is composed like a lifestyle photograph for a high-end bedding or home goods brand, emphasizing comfort and coziness above all.',

  'time-traveler':
    'Photorealistic historical recreation photography with meticulous period-accurate costuming, architecture, and atmospheric details — every era rendered with the authenticity of a professional film production still. Lighting, color grading, and composition shift to match each historical period, from ancient world naturalism to retro-futuristic neon.',

  'video-game-hero':
    'Photorealistic cinematic photography inspired by iconic video game worlds — dramatic in-engine-quality lighting, detailed fantasy and sci-fi environments, and heroic compositions that feel ripped from a next-generation game cinematics reel. Each scene is rendered with the hyper-detailed, richly atmospheric quality of a AAA game trailer screenshot translated into real-world photography.',

  'broadway-star':
    'A photorealistic, cinematic scene set on a grand theatrical stage — dramatic spotlights, rich velvet curtains, elaborate period costumes, and the glowing magic of live performance. Photographic quality resembling a professional stage production photograph with saturated color, perfect lighting, and theatrical grandeur.',

  'garden-party':
    'A photorealistic lifestyle photograph with the warmth and elegance of a luxury editorial shoot — soft natural light, lush botanical backdrops, fine china, and impeccably arranged seasonal florals. Crisp detail, warm golden tones, and the airy pastoral beauty of an English countryside garden in peak bloom.',

  'snow-day':
    'A photorealistic winter scene with the cozy, cinematic quality of a holiday greeting card or a Hallmark film still — pristine snow, warm lamplight, woolen textures, and the quiet magic of a world blanketed in white. Rich cool tones offset by warm amber glows, sharp focus, and dreamlike wintry atmosphere.',

  'national-park':
    'A photorealistic landscape photograph in the tradition of iconic National Geographic and Ansel Adams-inspired imagery — vast epic vistas, dramatic natural light, and the overwhelming scale of America\'s most breathtaking wilderness. Sharp focus, rich natural color grading, and a cinematic sense of awe and adventure.',

  'tiny-human':
    'A photorealistic, genuinely funny scene showing a pet performing completely ordinary human tasks with total seriousness — commuting, shopping, filing paperwork. Shot in the style of a candid lifestyle photograph or a clever commercial ad — bright, natural light, realistic settings, and deadpan comedy.',

  'anime-world':
    'A photorealistic scene set in richly detailed environments inspired by beloved anime aesthetics — neon-lit Tokyo streets, serene mountain shrines, cozy ramen bars, and cherry blossom parks. Cinematic quality with warm, evocative lighting, fine architectural detail, and a lush atmospheric depth reminiscent of a Makoto Shinkai film.',

  'galactic-emperor':
    'A photorealistic, cinematic sci-fi scene combining the epic grandeur of Star Wars with the absurd comedy of a pet in an enormous space throne room — dramatic backlighting, vast galactic vistas through towering windows, ornate imperial architecture, and the unmistakable weight of absolute intergalactic power. Rich dark tones, lens flares, and theatrical scale.',

  'cottage-core':
    'A photorealistic scene with the warm, romantic quality of a lifestyle editorial set in the English countryside — golden afternoon light, wildflower meadows, rough-hewn wooden surfaces, fresh-baked goods, and overflowing herb gardens. Soft natural tones, rich botanical textures, and the deeply cozy atmosphere of a beloved storybook cottage.',
}

// ============================================================
// Month-specific scene descriptions per style
// ============================================================

type MonthScenes = Record<number, string>

const STYLE_MONTH_SCENES: Record<StyleId, MonthScenes> = {
  'mythical-quest': {
    1: 'wearing a fur-lined cloak and tiny crown, standing atop a snowy mountain pass with a frozen kingdom stretching below. Northern lights dance across the sky. A magical ice sword glows at their side. New Year quest beginning.',
    2: 'in an enchanted rose garden within a hidden elven valley, wearing a delicate flower crown. Heart-shaped gemstones glow among the blooming vines. Valentine magic fills the misty air.',
    3: 'crossing a stone bridge over a rushing spring river, carrying a tiny enchanted staff. Cherry blossoms drift through the air as a mystical tower rises in the distance through morning mist.',
    4: 'sheltering in a mossy hobbit-hole doorway during a magical rain, wearing a green adventurer cloak. Glowing mushrooms and spring wildflowers surround the round door. Rain creates rainbow prisms.',
    5: 'riding through a sunlit meadow of wildflowers on the back of a friendly miniature dragon. Butterflies and golden pollen fill the warm spring air. A castle gleams on a distant hilltop.',
    6: 'wading through a shallow crystal-clear river in an ancient forest, wearing a leather adventurer vest. Sunbeams pierce the emerald canopy. Fireflies drift in the warm summer air.',
    7: 'standing victorious atop a castle battlement during a fireworks celebration, wearing gleaming miniature armor. Banners flutter as colorful explosions light the night sky over the kingdom.',
    8: 'exploring a vast cave filled with glittering treasure and ancient artifacts, a tiny torch held aloft. Golden coins, jeweled chalices, and a sleeping dragon visible in the background.',
    9: 'walking through an ancient autumn forest where the golden leaves fall like magic. A wise owl companion perches nearby. Mysterious ruins peek through the amber foliage.',
    10: 'in a spooky enchanted forest on Halloween night, wearing a wizard costume with a glowing jack-o-lantern staff. Friendly ghosts and bat companions swirl through moonlit mist.',
    11: 'at a grand feast in a medieval great hall, sitting at the head of a long harvest table. Candles flicker, a roaring fireplace glows, and platters of food surround a grateful adventurer.',
    12: 'in a snow-covered fairy-tale village at Christmas, wearing a red velvet cloak trimmed with white fur. Twinkling lights adorn tiny cottages. A magical star shines above.',
  },

  'wizarding-world': {
    1: 'in the great hall of a magical school during a New Year feast, wearing wizard robes and a tiny pointed hat. Floating candles illuminate the enchanted ceiling showing a snowy night sky.',
    2: 'in a potions classroom brewing a love potion, pink steam rising in heart shapes. Glass jars of colorful ingredients line the shelves. Valentine cards flutter magically through the air.',
    3: 'on the school grounds during spring, chasing a golden winged ball through blooming cherry trees. Wearing quidditch robes, zooming on a tiny broomstick just above the flower-covered pitch.',
    4: 'in the magical greenhouse during a spring rain, surrounded by fantastical plants that move and glow. Raindrops create musical sounds on the glass roof. Enchanted watering cans float nearby.',
    5: 'studying in the school library with towering bookshelves, enchanted books floating and opening by themselves. Warm sunlight streams through stained glass windows onto a cozy reading nook.',
    6: 'at the edge of the great lake on a warm summer day, dangling paws in the water while a friendly giant squid waves a tentacle. The castle shimmers in the summer haze behind.',
    7: 'watching a magical fireworks display from the astronomy tower, wearing star-patterned wizard robes. Enchanted fireworks form animal shapes — dragons, phoenixes — in the night sky.',
    8: 'exploring the forbidden forest with a lantern, encountering friendly magical creatures — a unicorn, a baby phoenix. Dappled summer moonlight filters through ancient trees.',
    9: 'arriving at the magical school on the first day, wearing brand new wizard robes and carrying a tiny trunk. The enchanted castle looms magnificently in golden September light.',
    10: 'at a Halloween feast in the great hall, carved floating pumpkins everywhere, wearing a vampire costume over wizard robes. Bats swoop playfully and ghosts drift through walls.',
    11: 'curled up in the cozy common room by a roaring fireplace, wearing a house scarf. A thankful feast of magical treats on the table. Rain patters on ancient windows.',
    12: 'in a snow-covered castle courtyard at Christmas, wearing a wizard hat with a Santa brim. Enchanted snowmen sing carols, gifts wrapped in magical paper float by, and fairy lights sparkle.',
  },

  'space-explorer': {
    1: 'inside a spacecraft cockpit during a New Year countdown, wearing a tiny spacesuit. Stars and distant galaxies visible through the viewport. Countdown numbers glow on the dashboard.',
    2: 'on a pink-hued alien planet with heart-shaped crystal formations, wearing a spacesuit with a red heart patch. Two moons create a romantic glow in the alien sky.',
    3: 'exploring a lush alien jungle planet where bioluminescent flowers bloom in spring. Wearing an explorer suit with a scanner device. Strange beautiful plants tower overhead.',
    4: 'on a rainy planet where the drops are iridescent, wearing a clear-dome helmet. Alien flowers open in the rainbow rain. A spacecraft sits on a landing pad behind.',
    5: 'in a space station greenhouse tending alien plants in bloom, wearing a science officer uniform. Earth visible through the observation window. Butterflies from the bio-dome float past.',
    6: 'relaxing on the beach of an alien ocean world with turquoise waves and twin suns setting. Wearing a casual space explorer outfit. Strange but beautiful seashells dot the purple sand.',
    7: 'watching a spectacular nebula light show from a space station observation deck, wearing a dress uniform. The cosmic display resembles fireworks — reds, whites, and blues swirling.',
    8: 'on the surface of a mountainous alien moon, planting a flag at the summit. A giant ringed planet dominates the sky. The spacesuit visor reflects the stunning vista.',
    9: 'at a space academy orientation, wearing a fresh cadet uniform, other alien pet cadets visible. The futuristic campus gleams under an autumn-colored alien sky.',
    10: 'on a spooky alien planet with jack-o-lantern-like glowing rock formations, wearing a spacesuit decorated for Halloween. Alien creatures that look like friendly ghosts float past.',
    11: 'in the space station mess hall for a zero-gravity Thanksgiving feast, food floating comically. Wearing a casual uniform, surrounded by crew. Earth glows warmly through the window.',
    12: 'decorating the spacecraft for the holidays with twinkling lights and tiny ornaments. Wearing a Santa hat over the spacesuit. A small Christmas tree floats in zero gravity. Stars twinkle outside.',
  },

  'secret-agent': {
    1: 'at a glamorous New Year gala in a penthouse overlooking a glittering city skyline, wearing a tiny tuxedo/cocktail dress. Champagne, confetti, and sophisticated party-goers surround the suave pet spy.',
    2: 'at a candlelit dinner in a Venetian palazzo, wearing an elegant outfit with a hidden earpiece. Gondolas visible through arched windows. A mysterious valentine card contains a coded message.',
    3: 'parachuting over a blooming spring countryside, wearing a sleek tactical suit. Cherry blossoms swirl around the deployed chute. A hidden base is visible below in the rolling green hills.',
    4: 'racing through rain-slicked London streets in a tiny Aston Martin-style car, wearing driving gloves and a determined expression. Big Ben and the Thames glow through the rainy night.',
    5: 'at an outdoor cafe on the French Riviera in May sunshine, wearing designer sunglasses and a linen suit. Yachts in the harbor, flowers on the table, secretly photographing a target across the street.',
    6: 'scuba diving near a villain\'s underwater lair, wearing a sleek black wetsuit with gadgets. Tropical fish swim past as a secret submarine base glows in the deep blue water.',
    7: 'on a rooftop in Washington D.C. during a Fourth of July fireworks display, wearing a tactical outfit with night vision goggles pushed up. The Monument and Capitol glow below.',
    8: 'in a high-speed chase through a mountain road in the Alps, driving a convertible sports car. Dramatic summer scenery with sharp cliffs, tunnels, and a helicopter in pursuit.',
    9: 'infiltrating a fancy prep school as a new student, wearing a blazer and tie. Autumn leaves fall on the prestigious campus. A spy gadget disguised as a pen peeks from the pocket.',
    10: 'at a masquerade ball in a gothic mansion on Halloween, wearing an elaborate mask and formal attire. Candelabras, mysterious guests, and a secret document hidden behind a painting.',
    11: 'in a cozy safe house reviewing intel around a fireplace, wearing a cable-knit sweater. Maps and photographs pinned to a board. Autumn rain outside. A Thanksgiving meal on the table.',
    12: 'skiing down a snowy Alpine slope escaping pursuers, wearing a sleek ski suit. A chateau with twinkling Christmas lights visible below. Dramatic mountain scenery and fresh powder.',
  },

  'prehistoric-adventure': {
    1: 'emerging from a time portal into a snowy prehistoric tundra, wearing a tiny fur-lined explorer vest. Woolly mammoths roam in the background. A new year in a new era begins under aurora borealis.',
    2: 'in a warm volcanic spring surrounded by lush prehistoric ferns, friendly baby dinosaurs nuzzling close. Heart-shaped tropical flowers bloom nearby. Valentine warmth in the prehistoric jungle.',
    3: 'riding on the back of a gentle triceratops through a prehistoric meadow filled with the first spring blooms. Giant dragonflies zip past. Volcanic mountains steam peacefully in the distance.',
    4: 'sheltering under a massive fern leaf during a warm prehistoric rain, tiny dinosaur friends huddled alongside. Raindrops splash in puddles where trilobites swim. Everything lush and green.',
    5: 'in a sunlit clearing filled with giant prehistoric flowers, butterflies with enormous wingspans fluttering about. A friendly long-necked dinosaur munches on treetops in the background.',
    6: 'playing on a prehistoric beach where a pterodactyl soars overhead, waves lapping at volcanic black sand. A baby plesiosaur playfully peeks from the warm turquoise water.',
    7: 'watching a spectacular volcanic eruption lighting up the night sky from a safe hilltop, firework-like lava streams arching through the air. Friendly dinosaur companions watch in awe.',
    8: 'exploring a prehistoric cave filled with glowing crystals and ancient paintings, wearing an explorer hat with a tiny headlamp. Dinosaur footprints lead deeper into the adventure.',
    9: 'at a prehistoric version of school — learning from a wise old tortoise among autumn-colored ancient trees. Baby dinosaurs sit in a circle. Golden prehistoric ferns drift down.',
    10: 'in a spooky prehistoric swamp on a misty night, jack-o-lantern-like bioluminescent fungi glowing. A friendly velociraptor in a ghost costume. Moonlit mist over the dark water.',
    11: 'at a prehistoric feast gathered around a campfire with dinosaur friends, roasted prehistoric fruits and nuts piled high. A grateful gathering in a cozy cave shelter as autumn leaves blow in.',
    12: 'in a snowy prehistoric forest decorated with natural ornaments — icicles, red berries, and pinecones. Baby dinosaurs wearing tiny scarves. A warm cave shelter glows behind with holiday cheer.',
  },

  'pirate-life': {
    1: 'at the helm of a magnificent pirate ship during a New Year voyage under starry skies, wearing a captain hat and coat. Fireworks explode over a tropical harbor in the distance.',
    2: 'on a tropical island finding a heart-shaped treasure chest filled with rubies and love letters, wearing a pirate bandana. Palm trees and Valentine sunset create a romantic setting.',
    3: 'sailing through a spring storm with waves crashing dramatically, wearing a rain-soaked captain\'s coat. Lightning illuminates the ship. Cherry blossoms blow from a nearby island.',
    4: 'on deck during a tropical rain shower, wearing a tricorn hat and boots. Rainbow arcs over the mast. Friendly parrots shelter under the sails. Treasure map spread on a barrel.',
    5: 'exploring a lush jungle island searching for buried treasure, wearing explorer gear with a compass. Parrots, monkeys, and tropical flowers surround the adventurer. Map in hand.',
    6: 'swimming in a crystal-clear Caribbean cove beside the anchored ship, wearing a bandana. Tropical fish, a friendly sea turtle, and sunken treasure visible in the clear water.',
    7: 'leading a cannon salute celebration from the ship deck, fireworks bursting over a colonial port town. Wearing a formal captain\'s uniform with medals. Red, white, and blue bunting on the ship.',
    8: 'navigating through a sea cave filled with glowing treasure and ancient pirate relics, holding a lantern. Gold coins glitter in the torchlight. Adventure and discovery await.',
    9: 'arriving at port for supplies, walking through an autumn market town wearing a captain\'s coat. Merchants, barrels of goods, and golden leaves blowing through cobblestone streets.',
    10: 'on a ghost ship on Halloween night, wearing a skeleton pirate costume. Ghostly crew members, spooky fog, and a full moon reflecting on dark waters. Jack-o-lanterns on the bow.',
    11: 'at a grand pirate feast in the captain\'s quarters, a table laden with harvest food and grog. Grateful crew gathered around. Candles flicker as autumn wind blows through the porthole.',
    12: 'in a snow-dusted port town decorated for the holidays, the ship adorned with twinkling lights and garlands. Wearing a Santa-red captain\'s coat. Gift-wrapped treasure chests on the dock.',
  },

  'superhero-origin': {
    1: 'standing on a snowy rooftop overlooking the city on New Year\'s Eve, wearing a sleek superhero suit with a flowing cape. Fireworks explode behind. A heroic pose signals a new beginning.',
    2: 'rescuing heart-shaped balloons floating away over the city on Valentine\'s Day, flying through pink-tinged skies. Wearing a hero suit with a heart emblem. Citizens wave and cheer below.',
    3: 'soaring through a spring rainstorm, lightning crackling around a superhero suit. Cherry blossoms swirl in the wake. The city skyline glistens with fresh rain below.',
    4: 'saving people from a spring flood, heroically carrying citizens to safety in the rain. Wearing a rain-drenched super suit. Rainbow breaks through storm clouds behind the hero.',
    5: 'training at a secret mountain headquarters on a beautiful spring day, practicing flight moves above a blooming meadow. Sunlight glints off the suit. A mentor figure watches proudly.',
    6: 'at the beach in civilian clothes but with the suit peeking out underneath, building sandcastles while secretly keeping watch. Sunglasses, summer vibes, but always ready to save the day.',
    7: 'flying alongside fireworks on the Fourth of July, trailing red, white, and blue smoke. A massive crowd cheers from below. The hero suit gleams under the firework explosions.',
    8: 'battling a friendly giant robot in a dramatic summer showdown, dramatic poses and energy blasts. The city skyline behind, citizens watching from safe distance. Epic action movie moment.',
    9: 'at a school for young superheroes on the first day, wearing a uniform with a cape. Autumn leaves fall in the courtyard. Other young hero pets visible. Nervous but determined expression.',
    10: 'in a Halloween-themed battle against a comically spooky villain, jack-o-lantern themed. Full moon, gothic rooftops, and dramatic superhero poses amid falling autumn leaves.',
    11: 'at a Thanksgiving parade as the guest of honor, waving from a float while wearing the hero suit. Grateful citizens, autumn decorations, and giant character balloons in the background.',
    12: 'delivering presents to children across the snowy city on Christmas Eve, flying through snowfall with a sack of gifts. Twinkling city lights below. A superhero Santa hat on top of the mask.',
  },

  'royal-portrait': {
    1: 'as a Renaissance monarch seated on a gilded throne in a grand palace, wearing a velvet robe and golden crown. Winter sunlight streams through tall windows. A New Year decree scroll in paw.',
    2: 'as a romantic Regency-era aristocrat in a rose garden, wearing an elegant outfit with lace and pearls. A Valentine love letter sealed with wax. Soft pink light and scattered petals.',
    3: 'as a French monarch strolling through the gardens of Versailles in spring, wearing an ornate silk outfit. Fountains spray, flowers bloom, and courtiers bow in the background.',
    4: 'as a Victorian-era royal under an ornate umbrella during a spring shower, wearing a fine tailored coat. A palace garden with blooming daffodils and a horse-drawn carriage waiting.',
    5: 'as an Elizabethan monarch in a lush palace garden in full bloom, wearing an elaborate ruffled collar and jeweled crown. Roses climb the palace walls. Servants tend the royal flowers.',
    6: 'as a Mediterranean king/queen on a palatial seaside terrace overlooking turquoise waters, wearing flowing royal summer garments. A golden crown catches the sunlight. Sailboats dot the horizon.',
    7: 'as a noble leading a grand independence celebration from a palace balcony, wearing a ceremonial military uniform with medals. Fireworks and flags below. Patriotic grandeur.',
    8: 'as a royal explorer on a grand expedition, wearing a pith helmet and decorated explorer\'s jacket. A world map, compass, and exotic artifacts surround the adventurous monarch.',
    9: 'as a scholarly monarch in a vast royal library, wearing academic robes and reading spectacles. Autumn light streams through arched windows onto towers of leather-bound books.',
    10: 'as a Gothic monarch hosting a Halloween masquerade ball in a candlelit castle, wearing a dramatic dark crown and cape. Carved pumpkins, masks, and mysterious fog fill the grand ballroom.',
    11: 'as a king/queen presiding over a magnificent harvest banquet in a great hall, wearing a crown of autumn leaves and gold. A long table laden with food. Tapestries and candlelight.',
    12: 'as a beloved monarch at a royal Christmas celebration, wearing a red and white fur-trimmed robe and crown. A towering decorated tree, gifts, and joyful courtiers in a grand palace hall.',
  },

  'detective-noir': {
    1: 'in a dimly lit office on New Year\'s Eve, wearing a fedora and trench coat, silhouetted against a window showing fireworks over rain-slicked city streets. A case file open on the desk.',
    2: 'at a shadowy jazz club on Valentine\'s night, wearing a sharp suit, investigating a mysterious love letter left on a red velvet seat. Saxophone player in the smoky background.',
    3: 'walking down a rainy spring alley following clues, wearing a trench coat with collar turned up. Neon signs reflect in puddles. Cherry blossom petals drift through the lamplight.',
    4: 'examining evidence in a rain-drenched crime scene, wearing a detective hat and magnifying glass. Yellow police tape, spring rain, and foggy streetlights create a moody atmosphere.',
    5: 'on a stakeout in a parked car on a warm spring night, binoculars ready, coffee cup steaming. The suspect\'s building glows across the street. Flowers in a nearby window box.',
    6: 'at the docks on a foggy summer night, wearing a lightweight linen suit and fedora. A mysterious ship has just arrived. Warehouse lights and water reflections create dramatic shadows.',
    7: 'watching Fourth of July fireworks from a fire escape, taking a rare night off. Wearing a Hawaiian shirt over the detective holster. The city celebrates below but a new case folder sits nearby.',
    8: 'chasing a suspect through a late-summer carnival at night, cotton candy stands and ferris wheel lights blurring past. Wearing a rumpled suit. The investigation intensifies.',
    9: 'in a classic detective office with autumn light filtering through venetian blinds, casting striped shadows. A new case has arrived — photographs and clues pinned to a corkboard.',
    10: 'investigating a haunted mansion on Halloween night, flashlight cutting through fog. Wearing a trench coat, creaking floorboards underfoot. Jack-o-lanterns and cobwebs. Classic mystery atmosphere.',
    11: 'in a cozy diner late at night during November, reading a case file over coffee and pie. Rain streaks the window. A grateful moment of quiet in the detective\'s busy life.',
    12: 'walking through a snowy city street at Christmas, holiday lights reflecting in wet pavement. Wearing a wool overcoat and scarf. Delivering a wrapped gift to an old friend. Redemptive warmth.',
  },

  'wild-west': {
    1: 'riding into a frontier town on a horse under a cold New Year sky, wearing a cowboy hat, duster coat, and boots. Snow dusts the wooden buildings. A "Happy New Year" banner hangs over the saloon.',
    2: 'at a frontier dance hall on Valentine\'s night, wearing a fancy western outfit with bolo tie and boots. Roses on the tables, fiddle music playing, a special someone across the dance floor.',
    3: 'herding cattle across a vast prairie with spring wildflowers blooming, wearing chaps and a cowboy hat. Mountains rise in the distance. A trusty horse companion. Warm golden light.',
    4: 'sheltering on a ranch porch watching a spring thunderstorm roll across the plains, wearing a poncho. Rain hammers the dusty ground. Horses in the corral. Lightning in the distance.',
    5: 'panning for gold in a clear mountain stream surrounded by spring greenery, wearing a prospector vest and hat. A mule loaded with gear. Wildflowers line the banks.',
    6: 'at a frontier rodeo in summer, riding a bucking bronco with the crowd cheering. Wearing full cowboy gear with a competition number. Dust flies, hats wave, excitement fills the arena.',
    7: 'leading a Fourth of July parade down a frontier town\'s main street on horseback, wearing a decorated saddle and patriotic bandana. Bunting on buildings, fireworks planned for dusk.',
    8: 'camping under a vast western sky full of stars, a campfire crackling. Wearing a bedroll and cowboy hat. A guitar leans against a saddle. Coyotes howl at the enormous moon.',
    9: 'arriving at a one-room frontier schoolhouse with autumn leaves falling, wearing a new cowboy hat and carrying a lunch pail. A schoolmarm rings the bell. Golden cottonwood trees.',
    10: 'in a ghost town on Halloween night, wearing a sheriff badge and hat. Tumbleweeds roll past, saloon doors creak, and a jack-o-lantern glows on the abandoned general store porch.',
    11: 'at a ranch Thanksgiving feast with cowboys and ranch hands gathered around an outdoor table, wearing a clean western shirt and hat. A roasted turkey, cornbread, and autumn sky.',
    12: 'in a snowy frontier town at Christmas, the general store decorated with garlands and candles. Wearing a warm sheepskin coat and cowboy hat. A horse with jingle bells. Fresh snow everywhere.',
  },

  'underwater-odyssey': {
    1: 'in a bioluminescent underwater palace celebrating New Year, wearing a pearl-studded crown. Glowing jellyfish form firework-like patterns above. Schools of colorful fish swirl in celebration.',
    2: 'in a coral garden shaped like hearts, surrounded by pink and red tropical fish. Wearing a pearl necklace. Sea anemones bloom in Valentine colors. Bioluminescent love fills the water.',
    3: 'swimming through a spring kelp forest where new growth spirals upward, wearing an explorer harness. Sunlight filters through the surface, creating green-gold underwater rays. Sea otters play nearby.',
    4: 'in an underwater rain — a freshwater river meeting the ocean, creating shimmering curtains of light. Spring fish migrate in massive colorful schools. Wearing dive gear and exploring the spectacle.',
    5: 'in a sunlit shallow reef bursting with spring color, coral polyps blooming like flowers. Wearing a tiny snorkel mask. Sea turtles, clownfish, and starfish surround the explorer. Warm, bright water.',
    6: 'exploring a sunken pirate ship covered in coral and tropical fish, wearing an adventure belt. Treasure chests spill gold coins into the sand. Summer sunlight pierces the clear blue water above.',
    7: 'at an underwater kingdom celebration with bioluminescent displays mimicking fireworks — red, white, and blue deep-sea creatures glowing brilliantly. Wearing a decorated shell crown. An oceanic Fourth of July.',
    8: 'diving into a deep-sea volcanic vent surrounded by bizarre and beautiful creatures, wearing a deep-dive suit. Glowing magma illuminates strange life forms. The ultimate underwater adventure.',
    9: 'arriving at an underwater academy built into a massive coral formation, wearing a new student satchel. Other sea-creature students swim to class. Bioluminescent signs mark the entrance.',
    10: 'in a spooky deep-sea trench on Halloween, surrounded by anglerfish lanterns and ghost-white octopuses. Wearing a sea-witch costume. Eerie but beautiful bioluminescent fog drifts through.',
    11: 'at a grateful underwater harvest feast in a coral dining hall, surrounded by sea friends. Tables of kelp and sea-fruit delicacies. Warm bioluminescent amber lighting. A thankful gathering.',
    12: 'in an underwater village decorated for the holidays, coral draped in bioluminescent lights. Wearing a Santa shell-hat. Gift-wrapped treasures under a decorated sea-tree. Snow-like marine particles drift.',
  },

  'high-school-yearbook': {
    1: 'at the school New Year\'s party in the decorated gymnasium, wearing a sparkly outfit and "2026" novelty glasses. Balloons, streamers, and awkward slow-dancing classmates in the background.',
    2: 'delivering valentines to lockers wearing a comically oversized cupid costume, blushing furiously. Heart-shaped candy and cards everywhere. Other students pointing and laughing affectionately.',
    3: 'trying out for the spring musical on stage, wearing a dramatic costume and singing passionately with eyes closed. The drama teacher and other students watch from the auditorium seats.',
    4: 'caught in the rain running between buildings without an umbrella, backpack over head, laughing. Spring puddles everywhere, classmates with umbrellas, the school building in the background.',
    5: 'as prom royalty wearing a crown and sash with a hilariously oversized corsage/boutonniere. Standing under a balloon arch, photographer snapping pictures. Peak high school glamour.',
    6: 'as a lifeguard at the school pool, sitting in the tall chair wearing sunglasses and a whistle. Summer school students splashing around. A comedically serious expression.',
    7: 'at a Fourth of July pool party hosted by a classmate, wearing patriotic swim trunks/swimsuit and holding a sparkler. BBQ smoke, pool floats shaped like eagles, red-white-blue everything.',
    8: 'at summer sports camp wearing mismatched athletic gear, attempting an impossible obstacle course. Sweat, determination, and comedy. Other campers cheering and cringing simultaneously.',
    9: 'classic first-day-of-school photo in front of the building, wearing a brand new outfit with a too-big backpack. A parent embarrassingly taking photos. Other students streaming past.',
    10: 'at the Halloween school dance in an elaborate costume that keeps falling apart, dancing enthusiastically anyway. Gym decorated with cobwebs and orange lights. Other costumed students around.',
    11: 'in the cafeteria at a Thanksgiving potluck, wearing a paper pilgrim hat, presenting a hilariously bad homemade dish. The lunch lady looks horrified. Other students laughing.',
    12: 'at the school holiday talent show wearing a ridiculous holiday sweater, performing with maximum enthusiasm and minimum talent. Tinsel, lights, and a cheering audience. Pure joy.',
  },

  'professional-headshot': {
    1: 'in a classic studio with a seamless white backdrop, wearing a crisp dark turtleneck. Soft three-point lighting highlights every detail of the face. Clean, polished New Year energy.',
    2: 'against a warm-toned studio backdrop, wearing a velvet blazer. Soft pink fill light adds a subtle Valentine glow. Perfectly groomed and camera-ready.',
    3: 'in a bright natural-light studio with floor-to-ceiling windows, wearing a light linen shirt. Spring sunshine pours in, creating soft catchlights.',
    4: 'against a soft grey backdrop with gentle studio rain projected behind glass, wearing a tailored trench coat. Moody, editorial spring atmosphere.',
    5: 'outdoors in a garden studio setting with blooming flowers softly blurred behind, wearing a pastel blazer. Golden-hour warmth and magazine-cover poise.',
    6: 'in a sun-drenched rooftop studio, wearing sunglasses pushed up and a linen suit. Bright summer light, blue sky reflected in the eyes.',
    7: 'against a patriotic red-white-blue draped backdrop, wearing a smart navy blazer. Studio lighting with warm rim light. Confident summer portrait.',
    8: 'in an outdoor location shoot at golden hour, wearing a casual button-down with rolled sleeves. Warm backlight creating a halo effect. Relaxed summer confidence.',
    9: 'in a wood-paneled library studio, wearing a tweed jacket and glasses. Warm autumn tones, soft directional lighting. Scholarly and distinguished.',
    10: 'in a dramatic low-key studio setup, wearing all black against a dark backdrop. A single dramatic light creates sculptural shadows. Bold and mysterious.',
    11: 'in a warm-toned studio with amber gels, wearing a cozy cashmere sweater. Soft, grateful, warm Thanksgiving-season portrait.',
    12: 'in a festive studio with twinkling fairy lights softly bokeh-blurred in the background, wearing a red sweater. Warm holiday portrait lighting.',
  },

  'pet-photoshoot': {
    1: 'curled up on a white fluffy rug by a fireplace, soft winter light from a nearby window. A cozy New Year morning lifestyle shot.',
    2: 'sitting among scattered rose petals on a bed with white linens, soft pink light filtering through curtains. A Valentine lifestyle portrait.',
    3: 'playing in a field of early spring wildflowers, natural sunlight and shallow depth of field. Joyful and carefree.',
    4: 'splashing in a shallow puddle on a rainy spring day, wearing a tiny yellow raincoat. Playful and candid.',
    5: 'lounging on a picnic blanket in a sun-dappled park, surrounded by fresh fruit and flowers. Warm, editorial lifestyle.',
    6: 'at the beach with waves gently lapping, golden hour light catching wet fur. Summery and free-spirited.',
    7: 'in a backyard with patriotic bunting, sitting on a striped blanket with sparklers nearby. Festive summer energy.',
    8: 'hiking on a forest trail, backlit by dappled summer sunlight. Adventure and joy in the great outdoors.',
    9: 'sitting on the front steps of a house surrounded by fallen autumn leaves. Warm, nostalgic back-to-school season.',
    10: 'in a pumpkin patch at golden hour, surrounded by orange pumpkins and autumn foliage. Cozy Halloween vibes.',
    11: 'snuggled in a chunky knit blanket on a sofa, a mug of cocoa on the side table. Thanksgiving coziness.',
    12: 'next to a Christmas tree with twinkling lights, wearing a festive bandana. Warm holiday portrait.',
  },

  'cozy-vibes': {
    1: 'curled up by a crackling fireplace on a snowy evening, wrapped in a chunky knit blanket. Warm golden light, a mug of hot cocoa nearby.',
    2: 'nestled on a window seat watching snow fall, a heart-shaped pillow and soft candlelight creating Valentine warmth.',
    3: 'napping in a sunbeam on a cushioned bench, spring blossoms visible through an open window. Gentle breeze ruffles soft fur.',
    4: 'sitting in an armchair listening to rain patter against the window, a book open nearby. Soft lamp light and a rainy spring afternoon.',
    5: 'on a porch swing surrounded by blooming wisteria, a lemonade glass on the railing. Warm May afternoon light.',
    6: 'lounging in a hammock in the backyard, dappled shade from a big tree. Lazy summer afternoon perfection.',
    7: 'on a patio at dusk watching distant fireworks, a citronella candle flickering. Warm summer night comfort.',
    8: 'stretched out on a dock by a calm lake at sunset, the water reflecting golden and pink sky.',
    9: 'curled up in a reading nook with autumn leaves outside the window, wearing a tiny scarf. A stack of books and warm tea.',
    10: 'burrowed into a pile of soft blankets surrounded by pumpkins and candles. Cozy Halloween-season evening.',
    11: 'sleeping by the fireplace after a big meal, autumn light and the remnants of Thanksgiving dinner in the background.',
    12: 'under a Christmas tree among wrapped presents, fairy lights twinkling softly. The coziest night of the year.',
  },

  'cooking-show': {
    1: 'in a bright TV kitchen wearing a chef hat, preparing a New Year brunch spread. Champagne flutes and fresh pastries on the counter.',
    2: 'decorating heart-shaped cookies with pink icing, wearing a red apron. Valentine treats cover the kitchen counter.',
    3: 'tossing a fresh spring salad in a sunny kitchen, wearing a linen apron. Herbs and vegetables from the garden on the counter.',
    4: 'making soup in a big pot on a rainy spring day, steam rising dramatically. Wearing a chef coat and tasting with a tiny spoon.',
    5: 'grilling outdoors on a beautiful day, wearing a "Kiss the Cook" apron. Fresh vegetables and marinades on the prep table.',
    6: 'making fresh ice cream in a colorful summer kitchen, tasting from the churner. Fruits and toppings everywhere.',
    7: 'at a Fourth of July BBQ show setup, flipping burgers and hot dogs on a big grill. Red-white-blue tablecloth, patriotic decor.',
    8: 'preparing a beach picnic basket in a bright kitchen, wearing a Hawaiian shirt-apron. Sandwiches, fruit, and lemonade.',
    9: 'baking apple pie in an autumn-decorated kitchen, flour on the nose. Cinnamon sticks and fresh apples on the counter.',
    10: 'carving a pumpkin in the kitchen and making pumpkin soup, wearing a Halloween apron. Seeds and spooky cookie cutters around.',
    11: 'preparing a massive Thanksgiving turkey in a warm kitchen, wearing a chef hat. Stuffing, cranberries, and sides fill every surface.',
    12: 'decorating a gingerbread house in a festive kitchen, wearing a Santa hat. Holiday cookies cool on racks. Candy and frosting everywhere.',
  },

  'rock-star': {
    1: 'on a dark stage under a single spotlight, wearing a leather jacket and holding a guitar. New Year confetti falls. Smoke machine haze.',
    2: 'performing a power ballad on a rose-petal-covered stage, wearing a sequined jacket. Heart-shaped spotlight. Valentine concert energy.',
    3: 'smashing a guitar on stage in a punk rock outfit, spring rain pouring through an open-air venue. Raw energy and rebellion.',
    4: 'at a rainy outdoor festival, drenched and singing into a vintage microphone. Mud, crowd with umbrellas, and pure rock spirit.',
    5: 'in a sunny outdoor amphitheater, wearing a floral rock outfit. Acoustic set with wildflowers on the stage. Spring concert vibes.',
    6: 'performing at a massive beach concert at sunset, wearing swim trunks and an open Hawaiian shirt with a guitar. Crowd surfing energy.',
    7: 'headlining a Fourth of July stadium show, fireworks exploding behind the stage. Red-white-blue pyrotechnics and electric guitar solo.',
    8: 'in a recording studio during a summer session, headphones on, laying down tracks. Mixing board glowing, vintage microphone.',
    9: 'at a back-to-school concert in a gymnasium, wearing a varsity jacket and rocking out. Students moshing. Nostalgic rock energy.',
    10: 'performing in a haunted-mansion-themed Halloween concert, wearing skeleton face paint and a cape. Fog, strobe lights, and gothic stage design.',
    11: 'in an intimate acoustic set by a fireplace, wearing a cozy flannel. Thanksgiving warmth, small audience, stripped-down performance.',
    12: 'at a holiday charity concert wearing a sparkly holiday outfit, snow falling on an outdoor stage. Twinkling lights and festive crowd.',
  },

  'fashion-week': {
    1: 'strutting a winter runway in a dramatic fur-trimmed haute couture coat and statement sunglasses. Flashbulbs pop. Stark white catwalk.',
    2: 'on a Valentine-themed runway in a flowing red gown with heart motifs, rose petals scattered on the catwalk. High fashion romance.',
    3: 'in a pastel spring collection, wearing a flowing floral ensemble. Cherry blossoms projected on the backdrop. Fresh and editorial.',
    4: 'modeling a chic rain-inspired collection — transparent raincoat couture with iridescent accessories. Puddle reflections on the runway.',
    5: 'in a garden-party-inspired couture look with a massive floral headpiece, walking through a runway lined with fresh flowers.',
    6: 'on a resort-wear runway in a stunning summer outfit — wide-brimmed hat, flowing fabrics, and sunglasses. Beach-backdrop set design.',
    7: 'in a patriotic-themed avant-garde look — red, white, and blue sculptural fashion. Bold, artistic, statement piece on the runway.',
    8: 'in a daring summer evening-wear look on an outdoor rooftop runway, city skyline behind. Dramatic wind-blown fabric and golden light.',
    9: 'opening fall fashion week in a tailored plaid suit with statement boots. Autumn leaves scattered on the runway. Sharp and sophisticated.',
    10: 'in a dramatic Halloween-inspired Gothic couture look — black lace, dramatic collar, dark glamour. Moody runway lighting.',
    11: 'in a cozy-luxe fall collection — oversized cashmere, rich earth tones, and layered textures. Warm runway lighting, harvest-inspired backdrop.',
    12: 'closing the season in a show-stopping holiday gown covered in crystals and sparkle. Snow-effect machines, twinkling lights, grand finale energy.',
  },

  'office-life': {
    1: 'at a desk on the first working day of the year, wearing a fresh suit and looking motivated. A "New Year New Me" sticky note on the monitor.',
    2: 'delivering Valentine cards to coworkers in a cubicle farm, wearing business casual with a heart pin. Awkward office romance energy.',
    3: 'giving a spring quarterly presentation, pointing at a chart with a laser pointer. Conference room with spring flowers on the table.',
    4: 'staring out the office window at spring rain, coffee in hand, clearly daydreaming about being outside. Fluorescent lights, gray cubicle.',
    5: 'at a company picnic in the parking lot, wearing a polo with the company logo. Paper plates, a folding table, and forced fun.',
    6: 'on the last day before summer vacation, feet on desk, Hawaiian shirt on, out-of-office already set. Colleagues still working.',
    7: 'at the office Fourth of July party in the break room, wearing a patriotic tie. Sad store-bought cake, plastic cups, motivational posters.',
    8: 'in a team-building exercise outdoors, wearing khakis and looking confused while holding a rope. Trust falls and obstacle courses.',
    9: 'on the first day back from summer, at a desk piled with emails. Wearing a new fall outfit, looking overwhelmed but determined.',
    10: 'at the office Halloween costume contest, wearing an elaborate costume while coworkers in minimal costumes judge. Break room decorations.',
    11: 'at a Thanksgiving office potluck, proudly presenting a dish. Paper turkeys on the walls, plastic tablecloths, coworker camaraderie.',
    12: 'at the office holiday party wearing an ugly Christmas sweater, posing by the photocopier with a party hat. Secret Santa gifts exchanged.',
  },

  'sports-mvp': {
    1: 'on a snowy ski slope mid-jump, wearing ski gear and goggles. Mountains behind, fresh powder spraying. Winter sports champion.',
    2: 'figure skating on an ice rink, wearing a sparkly skating outfit. Heart-shaped spotlight on the ice. Valentine exhibition performance.',
    3: 'on a basketball court mid-dunk, wearing a jersey. March Madness energy, packed arena, dramatic freeze-frame action.',
    4: 'swinging a baseball bat at a spring training game, cherry blossoms beyond the outfield fence. Opening day energy.',
    5: 'crossing a marathon finish line with arms raised, wearing a race bib. Cheering crowd, spring sunshine, victory moment.',
    6: 'surfing a massive wave, wearing board shorts and a rash guard. Summer ocean, blue sky, athletic grace frozen in time.',
    7: 'swimming in an Olympic-style pool, mid-stroke, water splashing dramatically. Lane markers, starting blocks, summer competition.',
    8: 'at a tennis match mid-serve on a pristine court, wearing whites. Summer tournament, packed stands, athletic intensity.',
    9: 'on a football field catching a perfect spiral, wearing a full uniform. Friday night lights, autumn atmosphere, crowd roaring.',
    10: 'in a boxing ring under dramatic lights, wearing gloves and a robe. Halloween fight night energy, fog machine, dramatic entrance.',
    11: 'scoring a touchdown at a Thanksgiving Day football game, spiking the ball. Turkey leg trophy, autumn stadium, classic holiday tradition.',
    12: 'lifting a championship trophy in a snowy stadium, wearing a winter sports uniform. Confetti, fireworks, year-end victory celebration.',
  },

  'around-the-world': {
    1: 'at the Eiffel Tower in winter, wearing a beret and scarf. Snow dusts the iron lattice, twinkling lights, Parisian charm.',
    2: 'at the Taj Mahal at sunrise, the white marble glowing pink and gold. Wearing a light scarf. Romantic Valentine-worthy destination.',
    3: 'at the cherry blossom-lined canals of Tokyo in spring, wearing a light jacket. Pink petals float on the water.',
    4: 'at Machu Picchu in misty morning light, wearing an explorer hat. Ancient stone terraces emerge from the clouds.',
    5: 'at the tulip fields of the Netherlands, endless rows of colorful flowers stretching to the horizon. Windmills in the background.',
    6: 'on a Greek island with white-washed buildings and blue domes, turquoise sea below. Wearing a linen outfit in summer sunshine.',
    7: 'at the Great Wall of China at golden hour, the wall snaking over green mountain ridges. Wearing a sun hat, taking in the view.',
    8: 'on an African safari, a jeep in the background and a giraffe nearby. Golden savanna, acacia trees, warm summer light.',
    9: 'at the Colosseum in Rome in warm autumn light, wearing a stylish jacket. Ancient arches and golden Italian sunshine.',
    10: 'in the streets of Mexico City during Día de los Muertos, surrounded by marigolds and painted skulls. Festive and colorful.',
    11: 'at a Moroccan souk, surrounded by spices, lanterns, and colorful textiles. Warm golden light filters through the market canopy.',
    12: 'in front of a snow-covered Swiss chalet in the Alps, wearing a cozy winter outfit. Mountains, pine trees, and holiday lights.',
  },

  'fairy-tale': {
    1: 'in an ice palace with crystalline walls and frozen chandeliers, wearing a shimmering winter gown. A magical snow globe radiates warmth.',
    2: 'in an enchanted rose garden where every bloom glows softly, wearing a flowing red cape. A enchanted mirror shows a Valentine message.',
    3: 'crossing a mossy stone bridge over a babbling brook in a spring forest, accompanied by woodland creatures. Soft dappled light.',
    4: 'sheltering under a giant mushroom during a magical spring rain, tiny fairies dancing in the raindrops. Rainbow forming above.',
    5: 'in a sunlit meadow having tea with friendly forest animals, wearing a flower crown. A magical cottage visible through the trees.',
    6: 'riding in a giant seashell boat across a sparkling summer lake, water lilies and dragonflies everywhere. Castle on the far shore.',
    7: 'at a midsummer fairy festival with lanterns strung between trees, tiny winged creatures dancing. Firework-like magic sparkles in the sky.',
    8: 'exploring a magical cave filled with gems and a sleeping friendly dragon, carrying a tiny lantern. Golden treasure glows.',
    9: 'walking through an enchanted autumn forest where leaves turn to gold coins as they fall. A wise owl guides the way.',
    10: 'at a witch\'s cottage on Halloween, the friendly witch offering candy. Pumpkins, black cats, and a cauldron bubbling with sparkles.',
    11: 'at a woodland harvest feast with fairy-tale creatures, a long table of magical food in a golden autumn clearing.',
    12: 'in a snow-covered fairy-tale village at Christmas, gingerbread houses with candy decorations. A magical sleigh waits by the door.',
  },

  'zombie-apocalypse': {
    1: 'in a fortified safe house on New Year\'s, wearing tactical gear. A hand-painted "Happy New Year" sign. Canned food celebration.',
    2: 'finding a Valentine card in an abandoned store, wearing a leather jacket and backpack. A sweet moment amid the apocalypse.',
    3: 'in a reclaimed rooftop garden in spring, plants growing through concrete. Wearing survivalist gear, tending new growth. Hope blooms.',
    4: 'moving through a rain-soaked abandoned city street, wearing a hooded poncho. Spring weeds reclaiming the asphalt. Moody and atmospheric.',
    5: 'in a survivor camp in a blooming meadow, flowers growing through an abandoned car. Wearing tactical vest, enjoying a peaceful spring moment.',
    6: 'at a makeshift beach camp, surfboard repurposed as a barricade. Summer sun, zombie-free zone flag. Relaxed but alert.',
    7: 'setting off old fireworks found in a warehouse, lighting up the post-apocalyptic night sky. Wearing combat boots and a tank top.',
    8: 'exploring an overgrown abandoned mall, flashlight beam cutting through dusty summer light. Vines and nature reclaiming the stores.',
    9: 'at a survivor school teaching younger pets survival skills, wearing a utility vest. Chalkboard with "Rule #1: Cardio" written on it.',
    10: 'in a genuinely spooky abandoned amusement park on Halloween, zombie scarecrows and fog. Wearing tactical gear with a jack-o-lantern helmet.',
    11: 'at a survivor Thanksgiving feast in a fortified farmhouse, canned cranberry sauce and foraged vegetables. Grateful to be alive.',
    12: 'in a snowy abandoned town decorated with scavenged Christmas lights, wearing a warm coat. A small decorated tree by a campfire. Quiet hope.',
  },

  'renaissance-pet': {
    1: 'posed like Botticelli\'s Birth of Venus but in a winter scene, draped in rich blue velvet with a gold-leaf background.',
    2: 'in the style of a Raphael Madonna, holding a heart-shaped locket. Rich reds, soft sfumato lighting. Valentine Renaissance.',
    3: 'as Botticelli\'s Primavera, surrounded by spring flowers and classical figures. Flowing robes, dappled garden light.',
    4: 'in the style of Vermeer\'s Girl with a Pearl Earring, looking over a shoulder with a single pearl. Soft window light, blue headwrap.',
    5: 'in a Caravaggio-style scene, dramatic chiaroscuro lighting illuminating a basket of spring fruit and flowers.',
    6: 'posed as a Venetian doge on a gondola, wearing ornate robes. Summer canal scene in the style of Canaletto.',
    7: 'in the style of Delacroix\'s Liberty Leading the People, holding a flag triumphantly. Dramatic July revolution energy.',
    8: 'as a Renaissance explorer with maps and a globe, in the style of Holbein\'s The Ambassadors. Rich detail and symbolism.',
    9: 'as a scholar in Rembrandt\'s style, reading by candlelight in a dark study. Autumn tones, dramatic chiaroscuro.',
    10: 'in a Hieronymus Bosch-inspired Halloween scene, fantastical creatures and surreal jack-o-lanterns. Dark, detailed, whimsical.',
    11: 'at a Renaissance feast in the style of Veronese\'s Wedding at Cana. Long banquet table, rich fabrics, harvest abundance.',
    12: 'in a Nativity scene rendered in the style of Leonardo da Vinci, warm golden light, soft sfumato. Holiday reverence.',
  },

  'sitcom-star': {
    1: 'on a sitcom living room set during a New Year party episode, wearing a sparkly outfit. Confetti, funny hats, and the whole cast.',
    2: 'in a Valentine\'s Day episode, holding flowers at the apartment door with a nervous expression. Laugh-track-worthy romantic comedy.',
    3: 'at the coffee shop set in spring, sitting on the iconic couch with a latte. Sunshine through the window, friends arriving.',
    4: 'stuck in the apartment during a rainy episode, wearing pajamas and watching TV. Classic bottle episode vibes.',
    5: 'at a neighborhood block party episode, grilling with neighbors. Sunny sitcom outdoor set, bunting and lawn chairs.',
    6: 'in a summer vacation episode at a cheesy resort, wearing a Hawaiian shirt. Pool, buffet, and fish-out-of-water comedy.',
    7: 'at a Fourth of July BBQ episode in the backyard, fumbling with fireworks. The whole sitcom gang gathered around.',
    8: 'in a road trip episode, head out the car window, passing summer scenery. Packed car, map arguments, classic comedy.',
    9: 'in a back-to-school episode, wearing a new outfit and carrying a lunchbox. The set dressed in autumn colors.',
    10: 'in the annual Halloween episode, wearing an overly ambitious costume. The apartment decorated spooky, candy everywhere.',
    11: 'in the Thanksgiving episode, pulling a turkey from the oven (slightly burnt). Chaotic kitchen, family gathering, warm chaos.',
    12: 'in the holiday special, decorating a too-big Christmas tree in the small apartment. Presents, lights tangled, heartwarming finale.',
  },

  'mad-scientist': {
    1: 'in a laboratory at midnight on New Year, a bubbling experiment counting down to zero. Sparks, glowing liquids, and a tiny lab coat.',
    2: 'brewing a love potion that produces pink heart-shaped smoke, wearing goggles and a lab coat. Beakers of red and pink chemicals.',
    3: 'growing giant spring flowers with an experimental growth serum, the plants bursting through the lab ceiling. Excited scientist face.',
    4: 'building a weather machine during a spring storm, lightning channeling through copper coils. Wild hair, goggles, and maniacal glee.',
    5: 'in a greenhouse lab, cross-breeding glowing plants. Bioluminescent flowers and buzzing robotic bees. Spring science gone wonderfully wrong.',
    6: 'testing a shrink ray on a watermelon in a summer lab, wearing shorts and a lab coat. The watermelon is tiny. The scientist is delighted.',
    7: 'launching homemade fireworks from the lab rooftop, wearing a singed lab coat. Colorful explosions and a proud, slightly scorched expression.',
    8: 'building a robot companion in a summer workshop, parts and tools scattered everywhere. The robot is coming to life with glowing eyes.',
    9: 'at a science fair presenting a volcano that actually erupts with real tiny lava. Other contestants backing away. Judges impressed and terrified.',
    10: 'in a spooky lab on Halloween, reanimating a friendly pumpkin monster. Tesla coils spark, green fog rolls, and the creation lives!',
    11: 'in the lab cooking Thanksgiving dinner using only science equipment — beakers of gravy, Bunsen-burner turkey. Surprisingly it works.',
    12: 'building an elaborate Rube Goldberg machine to light the Christmas tree. Dominoes, pulleys, and a final spark that illuminates the lab.',
  },

  'movie-poster': {
    1: 'in an action-movie pose on a snowy rooftop, explosions behind, wearing a tactical outfit. New Year blockbuster energy.',
    2: 'in a romantic comedy poster pose, holding flowers and looking charmingly confused. Pink sunset backdrop. Valentine rom-com.',
    3: 'in a spring thriller — running through cherry blossoms in a trench coat, looking over a shoulder. Suspenseful and cinematic.',
    4: 'in a rainy mystery-drama pose, standing under a streetlamp with an umbrella. Noir spring atmosphere, detective film energy.',
    5: 'in a feel-good summer indie film pose, sitting on a porch in golden light. Warm, hopeful, coming-of-age vibes.',
    6: 'in a summer blockbuster pose — emerging from ocean water, sunglasses on, explosion behind. Action-hero beach movie.',
    7: 'in a patriotic war drama pose, saluting in front of a flag with fireworks. Heroic, dramatic, July release energy.',
    8: 'in a summer adventure-film pose, hanging from a cliff edge with a sunset behind. Indiana Jones meets summer blockbuster.',
    9: 'in a coming-of-age film pose, walking down a tree-lined autumn road with a backpack. Nostalgic, warm September drama.',
    10: 'in a horror-movie poster pose, looking scared in a haunted hallway. Jack-o-lantern light, Halloween slasher film energy.',
    11: 'in a family drama poster pose, at a dinner table with warm Thanksgiving light. Emotional, Oscar-season prestige film.',
    12: 'in a holiday film poster pose, standing in falling snow with arms wide. Twinkling lights, feel-good December release.',
  },

  'baby-photos': {
    1: 'wrapped in a white knit blanket in a basket, wearing a tiny "New Year Baby" headband. Soft studio light, milestone-style portrait.',
    2: 'surrounded by plush hearts and roses on a fluffy pink backdrop, wearing a tiny cupid headband. Valentine baby portrait.',
    3: 'in a spring-themed setup with pastel eggs and flowers, wearing a bunny-ear headband. Soft natural light, Easter-baby energy.',
    4: 'in a tiny raincoat and boots sitting in a staged rain puddle, rubber ducky nearby. Studio spring-rain setup.',
    5: 'in a flower-crown and tutu on a blanket in a sunlit meadow, butterflies around. Classic outdoor baby portrait.',
    6: 'in a tiny swimsuit in a mini inflatable pool, splashing and laughing. Summer baby photo, bright studio light.',
    7: 'in a red-white-blue onesie on a patriotic blanket with tiny flags. Fourth of July baby portrait setup.',
    8: 'in a tiny explorer outfit sitting in a miniature vintage suitcase, maps as backdrop. Adventure baby portrait.',
    9: 'at a tiny school desk wearing a miniature cap and gown, holding a diploma. Back-to-school baby milestone.',
    10: 'in a pumpkin with just the head peeking out, wearing a witch hat. Classic Halloween baby photo, autumn backdrop.',
    11: 'sleeping in a cornucopia-style basket with autumn leaves and tiny pumpkins around. Thanksgiving baby portrait.',
    12: 'in a stocking hanging from a fireplace mantle, wearing a Santa hat. Christmas baby portrait, twinkling lights.',
  },

  'fitness-journey': {
    1: 'doing a New Year resolution workout in a gym, wearing brand-new athletic gear. Motivational poster in the background. Fresh start energy.',
    2: 'in a couples yoga pose (with a stuffed animal partner), wearing pink workout gear. Heart-rate monitor showing heart shapes.',
    3: 'jogging through a park with spring blossoms, wearing running shoes and a headband. Determined face, morning mist.',
    4: 'doing rain yoga under a covered patio, puddles reflecting the pose. Wearing moisture-wicking gear. Zen spring energy.',
    5: 'lifting tiny dumbbells in a sunny outdoor gym, wearing a muscle tank. Flowers blooming around the equipment.',
    6: 'doing beach sprints on wet sand at sunrise, wearing athletic shorts. Ocean waves, dramatic athletic photography.',
    7: 'at an outdoor fitness boot camp, doing burpees with a flag bandana. Summer heat, sweat, determination. Patriotic fitness.',
    8: 'swimming laps in an outdoor pool, goggles on, perfect form. Summer sun, lane markers, competitive energy.',
    9: 'doing a fall trail run through colorful autumn forest, wearing layers. Crunching leaves, morning fog, runner\'s high.',
    10: 'in a Halloween-themed obstacle race, covered in colored powder, climbing over hay bales. Spooky-fun fitness.',
    11: 'doing a Turkey Trot 5K, wearing a race bib and a turkey headband. Autumn morning, crowd of runners, finish line energy.',
    12: 'in a cozy home gym doing a December workout, holiday lights in the background. Wearing a Santa hat and gym clothes.',
  },

  'art-museum': {
    1: 'standing in front of Monet\'s water lilies, the painting coming to life with real water and lilies around. Winter museum visit, warm gallery light.',
    2: 'inside Klimt\'s "The Kiss," gold leaf patterns surrounding a Valentine embrace. Rich museum lighting.',
    3: 'in Van Gogh\'s "Almond Blossoms," spring branches blooming around in 3D. Soft gallery spotlight.',
    4: 'walking into Hokusai\'s "The Great Wave," spray and foam becoming real. Dramatic gallery installation.',
    5: 'in Renoir\'s "Dance at Le Moulin de la Galette," a sunlit spring garden party. Impressionist dappled light.',
    6: 'lounging inside Hockney\'s "A Bigger Splash," poolside summer sunshine. Bold colors, clean gallery presentation.',
    7: 'in Leutze\'s "Washington Crossing the Delaware," standing heroically in the boat. Patriotic July tribute.',
    8: 'inside a Rousseau jungle painting, tropical plants towering overhead. Summer heat, naive art come to life.',
    9: 'in Seurat\'s "A Sunday Afternoon on the Island of La Grande Jatte," pointillist autumn light. Parasols and park.',
    10: 'in Munch\'s "The Scream," but with a comedic Halloween expression. Swirling orange and red sky.',
    11: 'in Rockwell\'s "Freedom from Want," at the Thanksgiving table. Classic American art, warm tones.',
    12: 'in a Rockwell holiday scene, decorating a Christmas tree in a cozy American living room. Nostalgic and warm.',
  },

  'holiday-card': {
    1: 'in a sparkly "Happy New Year" family portrait setup, wearing a bow tie and party hat. Balloon backdrop, confetti.',
    2: 'in a Valentine card setup, surrounded by paper hearts and roses, wearing a red outfit. Studio portrait, pink backdrop.',
    3: 'in an Easter card photo, sitting in a basket with pastel eggs, wearing bunny ears. Spring flowers, soft backdrop.',
    4: 'in a spring-themed portrait with an umbrella and rain boots, paper raindrops as props. Cheerful, bright studio.',
    5: 'in a Mother\'s/Father\'s Day card setup with flowers, wearing a nice outfit. "World\'s Best" mug as a prop.',
    6: 'in a summer vacation card photo, wearing sunglasses and a lei. Beach-themed backdrop, sandcastle props.',
    7: 'in a Fourth of July card, wearing red-white-blue, holding a tiny flag. Patriotic backdrop, sparkler props.',
    8: 'in a "Summer Greetings" card, posed with a watermelon slice and picnic setup. Bright, cheerful studio.',
    9: 'in a back-to-school card photo, wearing a backpack and carrying an apple. Chalkboard backdrop.',
    10: 'in a Halloween card portrait, wearing a costume in front of a spooky-cute backdrop. Pumpkins and candy.',
    11: 'in a Thanksgiving card, wearing a tiny pilgrim or turkey outfit. Autumn leaves and harvest props.',
    12: 'in a Christmas card portrait, wearing a holiday sweater by a decorated tree. Warm studio lights, classic holiday.',
  },

  'camping-adventures': {
    1: 'snowshoeing through a frozen forest at dawn, wearing a puffy vest. Fresh tracks in pristine snow, breath visible in cold air.',
    2: 'in a cozy winter tent for two, lantern glowing inside. Snow outside, heart drawn in the frost on the tent window.',
    3: 'hiking through a muddy spring trail, boots caked in mud, wildflowers emerging on the path. Backpack and trekking poles.',
    4: 'fishing in a mountain lake in spring rain, wearing a rain jacket. Mist rising from the water, peaks reflected.',
    5: 'setting up camp in a wildflower meadow, tent half-assembled, excited expression. Mountains behind, blue sky above.',
    6: 'kayaking on a crystal-clear lake on a summer day, mountains reflected in the water. Paddle mid-stroke.',
    7: 'roasting marshmallows over a campfire under a starry Fourth of July sky, sparklers stuck in the ground nearby.',
    8: 'at a cliffside overlook at sunset, sitting on a rock with legs dangling. Vast canyon view, golden summer light.',
    9: 'hiking through an autumn forest trail, leaves in every shade of gold and red. Wearing flannel and a beanie.',
    10: 'telling ghost stories around a campfire on Halloween, flashlight under chin. Dark forest, full moon, spooky fun.',
    11: 'at a lakeside camp with autumn foliage, cooking a Thanksgiving meal over an open fire. Grateful outdoor feast.',
    12: 'in a snow-covered campsite with a warm fire, wearing a winter hat. Pine trees dusted with snow, holiday tranquility.',
  },

  'noir-detective': {
    1: 'in a stark black-and-white office on New Year\'s night, fedora on the desk, cigarette smoke curling. City lights through venetian blinds.',
    2: 'meeting a mysterious contact at a shadowy jazz bar on Valentine\'s night. Black-and-white, dramatic shadows, smoky atmosphere.',
    3: 'following a suspect through rain-slicked spring streets, trench coat collar up. Neon signs reflected in puddles, black and white.',
    4: 'examining a clue under a desk lamp, magnifying glass in hand. Spring rain on the window, dramatic shadows on the wall.',
    5: 'on a stakeout in a parked car, binoculars focused. A blooming tree outside the window, black and white with dramatic contrast.',
    6: 'at the waterfront docks at night, ship lights in the fog. Wearing a light suit and fedora. Classic summer noir atmosphere.',
    7: 'watching fireworks from a rooftop, a brief moment of light in the dark city. Black and white with firework highlights.',
    8: 'chasing a lead through a late-summer night carnival, ferris wheel lights blurring. Dramatic motion, noir shadows.',
    9: 'in a dusty office as autumn light slants through the blinds, a new case file on the desk. Noir classic composition.',
    10: 'investigating a creepy mansion on Halloween, flashlight in the fog. Black and white, maximum atmospheric tension.',
    11: 'in a late-night diner, pie and coffee, alone with thoughts. Rain on the window, noir isolation. A grateful quiet moment.',
    12: 'walking through snowy streets past holiday decorations, a wrapped gift in hand. Black-and-white winter noir, surprisingly tender.',
  },

  'tropical-paradise': {
    1: 'on a white sand beach at a New Year sunrise, wearing a lei and sunglasses. Calm turquoise water, palm trees, fresh-start energy.',
    2: 'in a hammock for two between palm trees, sunset turning the sky pink. Tropical flowers, Valentine paradise.',
    3: 'snorkeling in a coral reef, colorful fish everywhere. Crystal-clear tropical water, spring break vibes.',
    4: 'under a waterfall in a lush tropical forest, mist catching rainbows. Wearing a swimsuit, tropical spring shower.',
    5: 'at a tiki bar by the pool, wearing a Hawaiian shirt, sipping from a coconut. Plumeria flowers, tropical May afternoon.',
    6: 'paddleboarding on calm turquoise water at sunset, a tropical island silhouetted behind. Summer perfection.',
    7: 'at a beach luau with tiki torches, roasting a pig, tropical fireworks over the ocean. Festive island celebration.',
    8: 'exploring a volcanic tropical island, lush jungle and a smoking crater in the distance. Adventure-paradise August.',
    9: 'at a beachside cafe reading a book, tropical breeze, palm shade. A quieter, reflective September island moment.',
    10: 'at a tropical Halloween party on the beach, jack-o-lanterns made from coconuts. Tiki masks and torch-lit spooky fun.',
    11: 'at a beach Thanksgiving feast — grilled fish and tropical fruit on a long table. Sunset, sand, grateful island vibes.',
    12: 'at a tropical Christmas celebration, a palm tree decorated with lights and ornaments. Sandy "snow," warm holiday magic.',
  },

  'horror-movie': {
    1: 'in a spooky mansion on New Year\'s, mysterious countdown clock, wearing a vampire cape. Cobwebs and candelabras. Cute-spooky.',
    2: 'as a vampire host at a Valentine\'s dinner, red roses and goblets. Gothic romance, dramatic candlelight.',
    3: 'in a haunted greenhouse with moving vines and glowing flowers, wearing a lab coat. Spring horror-botany gone wrong.',
    4: 'in a haunted house during a thunderstorm, rain lashing windows. Wearing a raincoat, flashlight cutting through darkness.',
    5: 'in a creepy circus tent, wearing a ringmaster outfit. Fog, striped tent, mysterious performers. Spring horror-carnival.',
    6: 'at a haunted summer camp by a lake, wearing a camp counselor shirt. Fog over the water, mysterious figure in the distance.',
    7: 'at a spooky Fourth of July, fireworks illuminating a haunted fairground. Cotton candy, creepy clown booth, fun-scary.',
    8: 'exploring a haunted ship in summer moonlight, wearing a captain\'s hat. Ghostly crew, barnacled decks, nautical horror.',
    9: 'at a haunted school on the first day, locker doors slamming by themselves. Wearing a backpack, looking around nervously.',
    10: 'the ultimate Halloween scene — in a haunted house surrounded by every classic monster as friends. Costumes, candy, full moon.',
    11: 'at a haunted Thanksgiving dinner where the food comes alive, turkey walking off the table. Comedic horror, candlelit chaos.',
    12: 'in a haunted holiday scene — possessed Christmas ornaments, a ghost in a Santa hat. Spooky-cute holiday horror.',
  },

  'dating-profile': {
    1: 'in a New Year\'s party outfit, holding champagne and looking into the camera with a charming smile. "Looking for someone to kiss at midnight."',
    2: 'in a candlelit restaurant, looking across the table with warm eyes. Red rose, Valentine ambiance. The perfect date photo.',
    3: 'at a farmers market in spring, holding flowers and looking effortlessly charming. Casual-cute lifestyle photo.',
    4: 'sharing an umbrella on a rainy spring day, laughing at the camera. Spontaneous, genuine, candid charm.',
    5: 'at an outdoor cafe in May sunshine, wearing a nice outfit, latte art visible. "I know all the best coffee spots."',
    6: 'on a paddleboard at a lake, wearing sunglasses and looking athletic. Summer adventure profile shot.',
    7: 'at a rooftop party watching fireworks, looking back at the camera with a grin. Summer night, great energy.',
    8: 'hiking at a scenic viewpoint, backpack on, panoramic view behind. "Adventure buddy wanted" energy.',
    9: 'at a bookstore holding a stack of books, wearing glasses and a cozy sweater. Intellectual autumn charm.',
    10: 'in a clever Halloween costume, confident pose. "I win the costume contest every year" energy.',
    11: 'cooking in a warm kitchen, wearing an apron, holding out a taste on a spoon. "I\'ll cook for you" vibes.',
    12: 'by a Christmas tree in a cozy sweater, holding a mug. "Seeking someone for holiday movie marathons."',
  },

  'true-crime': {
    1: 'at a crime board on New Year\'s Day, pinning up a new case. Red string, pushpins, evidence photos. Fresh investigation energy.',
    2: 'examining a mysterious Valentine card left at a crime scene, wearing gloves. Evidence markers and forensic lighting.',
    3: 'surveilling a suspect\'s house from a parked car in spring rain, binoculars and a notepad. Stakeout concentration.',
    4: 'at a rainy crime scene in an alley, yellow tape fluttering. Wearing a detective raincoat, examining footprints.',
    5: 'reviewing cold case files at a desk covered in paperwork, spring sunlight through the window. Detective determination.',
    6: 'at a dock investigating a smuggling case, summer night, warehouse lights. Wearing a bulletproof vest under a jacket.',
    7: 'at a forensics lab analyzing evidence under UV light, wearing safety goggles. Dramatic blue-lit science.',
    8: 'interrogating a suspect across a metal table, dramatic overhead light. Summer sweat, tension, and determination.',
    9: 'giving a press conference about a solved case, microphones and cameras. Autumn backdrop, professional detective moment.',
    10: 'investigating a spooky abandoned building on Halloween, flashlight and evidence kit. Cobwebs and forensic markers.',
    11: 'cracking the case over Thanksgiving, evidence spread across a dining table. Turkey getting cold, but the breakthrough is worth it.',
    12: 'at a department holiday party receiving a commendation, wearing dress uniform. Solved cases on the wall, holiday decorations.',
  },

  'reality-tv': {
    1: 'in a confessional booth on New Year\'s, looking into the camera and making predictions. Reality TV makeup and lighting.',
    2: 'on a dating show, receiving a rose on Valentine\'s Day. Dramatic lighting, cocktail party set, rose ceremony energy.',
    3: 'in a cooking competition plating a spring dish with seconds left on the clock. Judges watching, pressure mounting.',
    4: 'on a home renovation show, holding a sledgehammer in a rain-damaged room. Hard hat, before-and-after energy.',
    5: 'in a talent show audition, center stage with a spotlight. Judges at their table, golden buzzer within reach.',
    6: 'on a survival show on a tropical island, building a shelter from bamboo. Summer sun, tribe flag, competition gear.',
    7: 'hosting a Fourth of July backyard competition episode, patriotic decorations. Obstacle course, cheering neighbors.',
    8: 'on a travel show exploring a new city in summer, GoPro and a map. Street food, hidden gems, adventure content.',
    9: 'in a fashion competition, sewing frantically at a workstation. Fabric, mannequins, and a ticking clock.',
    10: 'on a paranormal investigation show on Halloween, night vision camera. Creepy location, electromagnetic detector.',
    11: 'in a Thanksgiving baking competition, decorating a pie with elaborate lattice. Flour-dusted and focused.',
    12: 'in a holiday special finale, being crowned the winner with confetti. Trophy, dramatic lighting, end-of-season celebration.',
  },

  'influencer': {
    1: 'in a perfectly styled New Year flat lay — planner, coffee, candles, gold accents. Shot from above, aesthetic perfection.',
    2: 'holding a heart-shaped latte in a cute cafe, Valentine aesthetic. Pink tones, bokeh lights, candid-but-staged.',
    3: 'in a cherry blossom mirror selfie, spring outfit perfectly coordinated. Ring light reflection, aesthetic street style.',
    4: 'in a cozy rain-day content creation setup — laptop, candles, rain on the window. "Content creator aesthetic" energy.',
    5: 'at a brunch table with an elaborate spread, taking a photo of the food before eating. Spring flowers, perfect lighting.',
    6: 'poolside summer content — floating tray, sunglasses, matching towel and swimsuit. Drone shot angle, vacation goals.',
    7: 'at a rooftop Fourth of July party, sparklers and sunset. Patriotic outfit, perfectly timed photo, social-media-ready.',
    8: 'in a "pack with me" travel setup, suitcase perfectly organized. Passport, tickets, summer destination mood board.',
    9: 'in a fall fashion haul, trying on cozy sweaters in a bedroom. Autumn leaves visible outside, pumpkin spice latte on the desk.',
    10: 'in a Halloween costume reveal, dramatic transformation. Before-and-after energy, ring light, engagement bait.',
    11: 'in a "what I\'m grateful for" aesthetic post, cozy setting with autumn decor. Journaling, candles, warm tones.',
    12: 'in a holiday gift guide flat lay, wrapped presents and decorations. Fairy lights, branded content energy, festive aesthetic.',
  },

  'nap-champion': {
    1: 'curled up in a pile of blankets by the fireplace on New Year\'s Day, confetti still in fur. Post-celebration nap perfection.',
    2: 'sleeping on a heart-shaped pillow surrounded by Valentine chocolates, wearing a tiny silk eye mask. Romantic slumber.',
    3: 'napping in a sunbeam on a window seat, spring blossoms visible outside. The warmest, most peaceful spring nap.',
    4: 'sleeping in a cozy tent made of blankets during a rainy afternoon, rain sounds as a lullaby. Pure spring comfort.',
    5: 'dozing in a hammock in a blooming garden, a book open on the chest. Dappled spring sunshine, bees buzzing gently.',
    6: 'sleeping on a beach towel under an umbrella, waves lapping softly. Summer beach nap, sunglasses askew.',
    7: 'napping in a lawn chair after a Fourth of July BBQ, a tiny flag in hand. Summer afternoon food-coma bliss.',
    8: 'sleeping in a canoe drifting on a calm lake, fishing rod propped up. Lazy summer afternoon, mountains reflected.',
    9: 'curled up on a pile of autumn leaves in a park, wearing a scarf. Golden afternoon light filtering through trees.',
    10: 'sleeping in a pumpkin patch, using a pumpkin as a pillow. Autumn afternoon, Halloween-season drowsiness.',
    11: 'passed out on the couch after Thanksgiving dinner, a plate balanced on the belly. Turkey-coma champion.',
    12: 'sleeping under the Christmas tree among the presents, fairy lights as a nightlight. The most magical nap of the year.',
  },

  'time-traveler': {
    1: 'in Ancient Egypt at New Year, wearing pharaoh attire beside a pyramid. Torchlit celebration, hieroglyphic decorations.',
    2: 'at a 1920s Valentine\'s speakeasy, wearing a flapper/dapper outfit. Jazz band, art deco decor, secret password.',
    3: 'in feudal Japan during cherry blossom season, wearing a kimono. Temple gardens, koi ponds, peaceful spring.',
    4: 'in Victorian London in the rain, wearing a top hat and coat. Gas lamps, cobblestones, horse-drawn carriages.',
    5: 'in a 1960s flower-power scene, wearing tie-dye and peace signs. VW van, Woodstock energy, spring love.',
    6: 'in Ancient Greece at the original Olympics, wearing a toga. Marble columns, olive wreath, Mediterranean summer.',
    7: 'at the first Fourth of July in 1776, wearing colonial attire. Founding-era celebration, historical fireworks.',
    8: 'in the 1980s, wearing neon and leg warmers. Arcade, boombox, roller rink. Synthwave summer.',
    9: 'in Medieval times as a student at a monastery school, wearing a monk\'s robe. Autumn courtyard, illuminated manuscripts.',
    10: 'in a 1950s drive-in on Halloween, wearing a classic costume in a vintage convertible. Monster movie on screen.',
    11: 'at the first Thanksgiving with Pilgrims and Wampanoag, period attire. Harvest feast, historical gratitude.',
    12: 'in a futuristic holiday celebration, holographic tree and floating presents. Sleek jumpsuit, neon lights, 2200s Christmas.',
  },

  'video-game-hero': {
    1: 'at a snowy RPG starting village on New Year, wearing beginner armor. Quest marker floating above. "A new adventure begins."',
    2: 'in a Valentine-themed dating sim scene, hearts floating, dialogue options visible. Charming and pixel-perfect.',
    3: 'in a lush open-world spring forest, wearing adventurer gear. Wildflowers, quest marker, and a treasure chest ahead.',
    4: 'in a rain level of a platformer, jumping between floating platforms. Waterfalls, mushroom platforms, and spring rain.',
    5: 'in a sun-drenched farming simulation, watering spring crops. Cozy farmhouse, tool belt, pixel-perfect countryside.',
    6: 'in a tropical racing game, driving a kart on a beach track. Palm trees, boost pads, summer racing action.',
    7: 'in a patriotic-themed battle royale, wearing red-white-blue armor. Firework power-ups, dramatic arena, July showdown.',
    8: 'in a space RPG cockpit, piloting through an asteroid field. Dramatic HUD display, summer space adventure.',
    9: 'in a school-themed RPG, wearing a uniform with stat screens visible. Autumn campus, "New Semester" quest starting.',
    10: 'in a horror-survival game level on Halloween, flashlight in hand. Spooky mansion, health bar low, but thriving.',
    11: 'in a cozy life-sim game, hosting a harvest festival. NPC friends gathered, cornucopia, warm autumn tones.',
    12: 'in a holiday event level, wearing festive armor. Snow, presents as loot drops, boss wearing a Santa hat.',
  },

  'broadway-star': {
    1: 'in an Auld Lang Syne finale number, wearing a tuxedo on a grand stage. Confetti, spotlight, full orchestra, New Year showstopper.',
    2: 'in a romantic duet scene, spotlight on two, Valentine roses covering the stage. Musical romance at its finest.',
    3: 'in a spring musical number, dancing through a stage set of cherry blossoms and park benches. Ensemble in the background.',
    4: 'in a dramatic rain scene, standing under a stage rain effect, singing arms wide. Emotional spring ballad.',
    5: 'in a joyful garden-party musical number, wearing a bright costume. Dancers with parasols, flowers on the set. May Day energy.',
    6: 'in a beach-musical number, wearing a sailor costume. Ensemble doing synchronized choreography. Summer show energy.',
    7: 'in a patriotic production number, wearing a star-spangled costume. High kicks, flags, and a rousing July anthem.',
    8: 'in a summer-stock outdoor theater, performing under the stars. Simple stage, passionate performance, crickets and spotlights.',
    9: 'in a back-to-school musical number, wearing a letterman jacket. Cafeteria choreography, autumn set dressing.',
    10: 'in a spooky Halloween musical number, vampire cape flowing. Fog machine, dramatic lighting, ensemble in monster costumes.',
    11: 'in a heartfelt Thanksgiving ballad, standing alone on a dimly lit stage. Emotional, grateful, single spotlight.',
    12: 'in a grand holiday finale, wearing a sparkling costume. The full cast on stage, snow falling, curtain-call bows.',
  },

  'garden-party': {
    1: 'at a winter garden party in a heated greenhouse, wearing a warm coat. White roses and evergreen centerpieces. Champagne toast.',
    2: 'at a Valentine garden tea, wearing a red outfit among rose bushes. Heart-shaped petit fours on tiered trays.',
    3: 'at a spring garden party under wisteria arbors, wearing a floral outfit. Pastel macarons and tea on a linen-draped table.',
    4: 'hosting a rainy-day garden party under a canopy tent, wearing wellies. Spring rain on the canvas, flowers in mason jars.',
    5: 'at a grand May garden party in a rose garden in full bloom, wearing a wide-brimmed hat. Croquet, cucumber sandwiches, elegance.',
    6: 'at a midsummer garden soirée as the sun sets, lanterns glowing among the hydrangeas. Wearing a summer-weight linen outfit.',
    7: 'at a Fourth of July garden party, patriotic bunting on white picket fences. Strawberry shortcake, lemonade, sparklers.',
    8: 'at a late-summer garden party among sunflowers and dahlias, wearing a straw hat. Lemonade, croquet, golden afternoon light.',
    9: 'at an autumn garden harvest party, wearing layers. Chrysanthemums and asters, apple cider, rustic farm table.',
    10: 'at a Halloween garden party among jack-o-lanterns and autumn flowers, wearing a festive costume. Candlelit pumpkins, mulled cider.',
    11: 'at a harvest Thanksgiving garden party, long table under bare trees strung with lights. Rich autumn flowers, grateful gathering.',
    12: 'at a winter holiday garden party in a snow-dusted garden, fairy lights in the bare branches. Hot chocolate, evergreen garlands.',
  },

  'snow-day': {
    1: 'building a snowman on New Year\'s Day, wearing a scarf and mittens. Fresh snowfall, neighborhood decorated with lights.',
    2: 'making a snow heart and snow angel on Valentine\'s Day, wearing a pink parka. Rosy cheeks, snowy meadow.',
    3: 'playing in the last snowfall of the season, catching snowflakes on tongue. Spring snow mix, melting icicles.',
    4: 'in a freak April snowstorm, looking delighted while neighbors look confused. Flowers poking through snow. Best surprise ever.',
    5: 'daydreaming about snow while looking at a snow globe, summer clothes on but imagining flurries outside. May wishes.',
    6: 'at an indoor snow park in summer, wearing winter gear indoors. Artificial snow, slides, and happy confusion.',
    7: 'watching Fourth of July fireworks in a surprise snow flurry, wearing a parka over a patriotic shirt. Magical and rare.',
    8: 'visiting a glacier in summer, wearing hiking gear on an ice field. Summer sun on ancient snow. Alpine wonder.',
    9: 'in the first September frost, breath visible, wearing a cozy sweater. The promise of snow season beginning.',
    10: 'in the first snowfall of the season on Halloween, trick-or-treat costume with a winter coat over it. Snow on pumpkins.',
    11: 'in a Thanksgiving blizzard, nose pressed to a frosted window. Turkey inside, snowdrifts outside. Grateful and cozy.',
    12: 'in a full-on Christmas snow day, sledding down a big hill. Scarf flying, perfect powder, pure winter joy.',
  },

  'national-park': {
    1: 'at Yellowstone in winter, geysers steaming in the snowy landscape. Wearing a park ranger-style outfit. Bison in the distance.',
    2: 'at Death Valley under a dramatic sunset sky, the salt flats reflecting pink and gold. Wide-open Valentine wilderness.',
    3: 'at the Great Smoky Mountains with spring wildflowers and misty ridges. Wearing a light jacket on a scenic overlook trail.',
    4: 'at Olympic National Park in spring rain, standing in the Hoh Rainforest. Moss-covered trees, ferns, misty green cathedral.',
    5: 'at Yosemite with waterfalls at peak spring flow, Half Dome in the background. Wearing hiking gear, wildflowers at the trailhead.',
    6: 'at Glacier National Park on a summer hike, alpine lakes and mountain goats. Dramatic peaks, wildflower meadows.',
    7: 'at the Grand Canyon at sunrise, sitting on the rim with legs dangling. Layers of red and gold, vast and awe-inspiring.',
    8: 'at Acadia National Park in summer, perched on rocky Atlantic coastline. Crashing waves, lighthouse in the distance.',
    9: 'at Zion National Park in autumn, red canyon walls and cottonwood trees turning gold. Hiking the narrows, ankle-deep in water.',
    10: 'at Bryce Canyon among the hoodoos in October, orange spires and early snow. Dramatic natural amphitheater, fall color.',
    11: 'at Shenandoah on Skyline Drive in peak fall foliage, panoramic ridge views. Golden and red canopy stretching to the horizon.',
    12: 'at Rocky Mountain National Park in winter, snow-capped peaks and frozen alpine lakes. Elk in a snowy meadow, holiday serenity.',
  },

  'tiny-human': {
    1: 'at a desk writing New Year\'s resolutions with a tiny pen, wearing reading glasses. A planner, coffee mug, and a determined look.',
    2: 'on a Valentine\'s date at a tiny restaurant table, wearing a blazer. Candles, wine glasses, and an adorably nervous expression.',
    3: 'doing spring cleaning with a tiny mop and bucket, wearing overalls. Shelves being organized, "to do" list on the fridge.',
    4: 'running for the bus in the rain with a tiny umbrella and briefcase, looking frantic. Monday morning commute energy.',
    5: 'mowing the lawn with a tiny lawnmower, wearing a polo and dad hat. Suburban Saturday, freshly mowed stripes.',
    6: 'at a tiny backyard BBQ, wearing an apron and flipping tiny burgers. Lawn chairs, cooler, and summer vibes.',
    7: 'setting off fireworks in the backyard on the Fourth of July, wearing a patriotic shirt. Lighter in hand, running away dramatically.',
    8: 'on summer vacation, pulling a tiny rolling suitcase through an airport. Tourist outfit, neck pillow, overpacked.',
    9: 'dropping kids off at school (baby animal plushies in a tiny car), waving from the driver seat. Back-to-school-parent energy.',
    10: 'carving a pumpkin at the kitchen table, wearing a flannel. Seeds everywhere, questionable design skills, pure effort.',
    11: 'hosting Thanksgiving dinner, carrying a turkey platter from the kitchen. Apron on, table set for the whole family.',
    12: 'wrapping Christmas presents badly, tape stuck to fur, paper crumpled. Surrounded by gift wrap carnage, but trying hard.',
  },

  'anime-world': {
    1: 'at a Japanese New Year shrine visit, wearing a kimono. Snow falling on red torii gates, warm lantern light.',
    2: 'in a Valentine chocolatier scene, making honmei-choco in a pastel kitchen. Heart-shaped molds, determined expression.',
    3: 'under a canopy of cherry blossoms in a Tokyo park, wearing a school uniform. Petals falling like pink snow.',
    4: 'at a rainy train station, holding a transparent umbrella. Neon reflections in puddles, contemplative mood.',
    5: 'in a cozy ramen shop at a counter stool, wearing casual clothes. Steam rising from a perfect bowl, warm golden light.',
    6: 'at a summer matsuri festival, wearing a yukata. Paper lanterns, festival games, fireworks about to start.',
    7: 'on a rooftop watching fireworks over a cityscape, wind in hair. Dramatic anime sunset colors, emotional summer scene.',
    8: 'at the beach with friends, watermelon splitting game. Sparkling ocean, blue sky, classic anime summer episode.',
    9: 'walking to school on the first autumn day, falling leaves and golden light. New semester, new backpack, determined expression.',
    10: 'at a Halloween cosplay event in Akihabara, wearing an elaborate anime costume. Neon lights, other cosplayers, vibrant energy.',
    11: 'in a warm kotatsu with mandarins and tea, autumn rain outside. Cozy, grateful, perfectly comfortable.',
    12: 'at a Christmas illumination display in Tokyo, twinkling lights reflecting everywhere. Wearing a winter coat and scarf, awestruck.',
  },

  'galactic-emperor': {
    1: 'on a massive space throne receiving New Year tributes from alien ambassadors. Wearing imperial robes, a crown of stars, and an imperious expression.',
    2: 'at a Valentine\'s gala on a space station, wearing ornate imperial formalwear. Alien dignitaries, cosmic decorations, galactic romance.',
    3: 'reviewing the imperial fleet from a throne room window, spring nebula visible outside. Wearing command armor, star maps holographic.',
    4: 'conquering a rainy planet, standing in imperial armor on a cliff as storms rage. Lightning, troops below, dramatic power.',
    5: 'in the imperial gardens on a space station, alien flowers in bloom. Wearing flowing robes, surveying the botanical collection.',
    6: 'at the helm of the imperial flagship, navigating through a summer-gold nebula. Crown gleaming, vast space visible through the bridge.',
    7: 'at an imperial celebration with firework-like plasma displays across the fleet. Wearing ceremonial armor, fleet in formation.',
    8: 'exploring a conquered planet, wearing expedition armor. Strange landscapes, alien ruins, imperial banner planted.',
    9: 'at the imperial academy, inspecting cadets in formation. Wearing dress uniform, autumn-colored planet visible through windows.',
    10: 'in a spooky sector of space on Halloween, the throne room lit by a dying star. Wearing dark ceremonial robes, space jack-o-lanterns.',
    11: 'at an imperial harvest feast, alien delicacies on a massive table. Dignitaries from across the galaxy gathered in gratitude.',
    12: 'on the throne during a galactic holiday celebration, the space station decorated with lights. Wearing red-and-gold imperial robes.',
  },

  'cottage-core': {
    1: 'in a cozy cottage kitchen baking bread on a snowy morning, wearing a linen apron. Flour-dusted counter, warm oven glow, frost on the windowpane.',
    2: 'pressing wildflowers into a Valentine journal by candlelight, wearing a knit shawl. Dried roses, a love letter, and a warm hearth.',
    3: 'in a garden planting spring seeds, wearing overalls and muddy boots. Robin on the fence, crocuses blooming, morning dew.',
    4: 'gathering herbs in a kitchen garden during a gentle spring rain, wearing a rain cloak. Basket of rosemary and lavender.',
    5: 'in a wildflower meadow making a flower crown, wearing a flowing linen dress. Bees, butterflies, and warm golden May light.',
    6: 'picking strawberries in a sun-dappled patch, wearing a straw hat. Basket overflowing, summer warmth, pastoral perfection.',
    7: 'at a country fair with a homemade pie entry, wearing a gingham outfit. Bunting, farm animals, blue-ribbon hopes.',
    8: 'reading in a hammock between apple trees, a cat curled nearby. Summer afternoon, buzzing bees, orchard shade.',
    9: 'foraging mushrooms in an autumn forest, wearing a knit sweater and carrying a basket. Golden leaves, damp earth, misty trees.',
    10: 'carving turnip lanterns in a candlelit cottage on Halloween, wearing a woolen cape. Harvest herbs drying on the beams.',
    11: 'at a rustic cottage Thanksgiving, a table set with homegrown food. Candles, autumn leaves, linen napkins, heartfelt gratitude.',
    12: 'in a snow-dusted cottage decorating with holly and evergreen, wearing a warm cardigan. Mulled cider on the stove, fireplace crackling.',
  },
}

// ============================================================
// Public API
// ============================================================

/**
 * Build a detailed image-generation prompt for a given month.
 */
export function getPromptForMonth(
  style: StyleId,
  monthNumber: number,
  petName: string,
  petType: string
): string {
  const baseDescription = STYLE_DESCRIPTIONS[style]
  const monthTheme = MONTH_THEMES.find((m) => m.month === monthNumber)!
  const sceneDetail = STYLE_MONTH_SCENES[style][monthNumber]

  return [
    `${baseDescription}`,
    `Create a realistic, photographic-quality portrait of ${petName} the ${petType} ${sceneDetail}`,
    `Monthly theme: ${monthTheme.theme}.`,
    'IMPORTANT: The image must be realistic and photographic — NOT an illustration, painting, or cartoon. Think cinematic movie still.',
  ].join('\n\n')
}

/**
 * Build a prompt for the calendar cover page.
 */
export function getCoverPrompt(
  style: StyleId,
  petName: string,
  petType: string
): string {
  const baseDescription = STYLE_DESCRIPTIONS[style]

  const coverScenes: Record<StyleId, string> = {
    'mythical-quest': `A stunning hero portrait of ${petName} the ${petType}, wearing epic fantasy armor and a flowing cloak, standing on a cliff overlooking a vast magical kingdom. Golden hour light, dramatic clouds, and a glowing enchanted sword. Cinematic, realistic, photographic quality.`,

    'wizarding-world': `A magical portrait of ${petName} the ${petType} in full wizard regalia — pointed hat, flowing robes, and a glowing wand — standing in the entrance hall of a magnificent magical school. Floating candles, moving staircases, and enchanted light. Cinematic, realistic, photographic quality.`,

    'space-explorer': `An epic portrait of ${petName} the ${petType} in a sleek astronaut suit, standing on an alien world with a stunning nebula filling the sky. A spacecraft landed behind them. Dramatic cosmic lighting, photographic realism, cinematic scale.`,

    'secret-agent': `A suave, cinematic portrait of ${petName} the ${petType} in a tailored tuxedo/evening gown, leaning against a luxury sports car in front of a glamorous casino at night. City lights, neon reflections, and sophisticated atmosphere. Photographic quality, Bond-style cinematography.`,

    'prehistoric-adventure': `An adventurous portrait of ${petName} the ${petType} wearing an explorer hat and vest, standing beside a friendly baby T-Rex in a lush prehistoric jungle. Volcanic mountains in the distance, pterodactyls soaring overhead. Cinematic, realistic, Jurassic Park vibes.`,

    'pirate-life': `A swashbuckling portrait of ${petName} the ${petType} as a pirate captain at the wheel of a magnificent ship, wearing a tricorn hat and captain's coat. Caribbean sunset, billowing sails, and adventure on the horizon. Cinematic, realistic, photographic quality.`,

    'superhero-origin': `A dramatic superhero portrait of ${petName} the ${petType} in a custom super suit with a flowing cape, standing on a rooftop overlooking a glittering city at night. Wind in the cape, city lights below, heroic pose. Cinematic, realistic, photographic quality.`,

    'royal-portrait': `A regal, cinematic portrait of ${petName} the ${petType} seated on an ornate golden throne, wearing a jeweled crown and royal robes. A grand palace hall with chandeliers, tapestries, and warm candlelight. Photographic quality with historical grandeur.`,

    'detective-noir': `A moody noir portrait of ${petName} the ${petType} in a fedora and trench coat, silhouetted in a rain-slicked alley under a single streetlamp. Fog, neon reflections, and city shadows. Cinematic, realistic, classic detective film atmosphere.`,

    'wild-west': `A heroic western portrait of ${petName} the ${petType} as a frontier sheriff, standing in the main street of a dusty frontier town at golden hour. Cowboy hat, sheriff badge, boots, and a dramatic western sky. Cinematic, realistic, photographic quality.`,

    'underwater-odyssey': `A breathtaking underwater portrait of ${petName} the ${petType} wearing a pearl crown, surrounded by a coral kingdom glowing with bioluminescent light. Schools of colorful fish, ancient ruins, and magical deep-sea atmosphere. Cinematic, realistic, photographic quality.`,

    'high-school-yearbook': `A hilarious, classic yearbook photo of ${petName} the ${petType} — perfectly posed against the classic blue-grey gradient backdrop, wearing a slightly too-big blazer and a goofy-charming smile. Laser background option visible. Photographic quality, genuinely funny, peak yearbook energy.`,

    'professional-headshot': `A stunning, magazine-cover-quality studio portrait of ${petName} the ${petType} with perfect three-point lighting, a clean seamless backdrop, and editorial sharpness. Polished, sophisticated, and utterly flattering. Photographic quality, Vanity Fair energy.`,

    'pet-photoshoot': `A gorgeous lifestyle portrait of ${petName} the ${petType} in a sun-drenched natural setting — warm golden-hour light, shallow depth of field, and candid charm. The kind of image a talented pet photographer captures on the perfect afternoon. Photographic quality.`,

    'cozy-vibes': `A warm, intimate portrait of ${petName} the ${petType} curled up in the coziest spot imaginable — golden window light, soft blankets, and the quiet beauty of a perfect ordinary moment. Hygge perfection. Photographic quality.`,

    'cooking-show': `A vibrant portrait of ${petName} the ${petType} as a celebrity chef in a gleaming kitchen, wearing a chef hat and apron, surrounded by beautiful ingredients and copper pots. Food Network energy. Photographic quality.`,

    'rock-star': `A dramatic concert portrait of ${petName} the ${petType} on a massive stage, guitar in paw, spotlight blazing, smoke machine haze, and a sold-out arena crowd. Rock legend energy. Photographic quality.`,

    'fashion-week': `A high-fashion editorial portrait of ${petName} the ${petType} on a stark white runway in a stunning haute couture outfit, flashbulbs popping, Vogue energy. Photographic quality, no text.`,

    'office-life': `A deadpan corporate portrait of ${petName} the ${petType} seated at a desk with a nameplate and a coffee mug, wearing a business suit. Motivational poster on the wall. The Office energy. Photographic quality.`,

    'sports-mvp': `A triumphant sports portrait of ${petName} the ${petType} holding a championship trophy overhead in a packed stadium, confetti raining down, wearing a team jersey. Peak athletic glory. Photographic quality.`,

    'around-the-world': `A stunning travel portrait of ${petName} the ${petType} at a breathtaking world landmark, wearing a sun hat and a look of wonder. Golden-hour light, epic scenery, National Geographic energy. Photographic quality.`,

    'fairy-tale': `A magical portrait of ${petName} the ${petType} in an enchanted forest clearing, wearing a flowing cape, surrounded by dappled magical light, woodland creatures, and an ancient castle in the background. Cinematic fairy-tale beauty. Photographic quality.`,

    'zombie-apocalypse': `A gritty, cinematic portrait of ${petName} the ${petType} standing atop an abandoned car in a post-apocalyptic cityscape, wearing tactical survival gear and looking fearlessly into the distance. Dramatic lighting, photographic quality.`,

    'renaissance-pet': `A sumptuous Renaissance portrait of ${petName} the ${petType} in the style of a Flemish Old Master — rich velvet robes, a jeweled collar, warm candlelight, and a gilded frame implied by the composition. Photographic quality.`,

    'sitcom-star': `A warm, colorful portrait of ${petName} the ${petType} on an iconic sitcom living room set, sitting on the famous couch with the whole cast implied. Bright studio lighting, laugh-track energy. Photographic quality.`,

    'mad-scientist': `A dramatic portrait of ${petName} the ${petType} in a wild laboratory, wearing a lab coat and goggles, a bubbling experiment casting eerie glow across the scene. Tesla coils spark in the background. Photographic quality.`,

    'movie-poster': `A cinematic portrait of ${petName} the ${petType} in a dramatic action-movie pose — lens flare, epic background, and the unmistakable energy of a Hollywood blockbuster one-sheet. Photographic quality, no text.`,

    'baby-photos': `An adorable newborn-style portrait of ${petName} the ${petType} wrapped in a soft knit blanket in a woven basket, surrounded by plush toys and soft studio light. Precious, heartwarming, boutique baby photography quality.`,

    'fitness-journey': `A dynamic fitness portrait of ${petName} the ${petType} mid-workout in a sunlit gym, wearing athletic gear, muscles engaged, determination on the face. Premium athletic brand campaign energy. Photographic quality.`,

    'art-museum': `A stunning conceptual portrait of ${petName} the ${petType} standing inside a famous painting that has come to life around them — museum-quality lighting, fine-art atmosphere. Photographic quality.`,

    'holiday-card': `A polished family-portrait-style photo of ${petName} the ${petType} in a warm, perfectly lit studio setup with festive decorations, wearing a charming outfit. Send-to-grandma quality. Photographic quality.`,

    'camping-adventures': `An adventurous portrait of ${petName} the ${petType} at a scenic campsite — tent pitched, campfire glowing, mountains behind, and a sky full of stars. Golden-hour outdoor photography quality.`,

    'noir-detective': `A moody black-and-white portrait of ${petName} the ${petType} in a fedora and trench coat, standing in a rain-slicked alley under a single streetlamp. Deep shadows, stark contrast, classic 1940s noir atmosphere. Photographic quality.`,

    'tropical-paradise': `A sun-drenched portrait of ${petName} the ${petType} lounging on a white sand beach, turquoise water stretching to the horizon, a coconut drink nearby. Vibrant tropical paradise, travel-magazine quality.`,

    'horror-movie': `A fun, spooky-cute portrait of ${petName} the ${petType} in a classic horror movie setting — fog, candlelight, vampire cape, and a playful grin. Halloween energy all year. Photographic quality.`,

    'dating-profile': `A warm, flattering portrait of ${petName} the ${petType} looking charming and approachable — golden-hour light, natural smile, the kind of photo that gets all the right swipes. Lifestyle photography quality.`,

    'true-crime': `A dramatic portrait of ${petName} the ${petType} as a determined detective, standing before a case board covered in evidence photos and red string. Moody interrogation-room lighting. Photographic quality.`,

    'reality-tv': `A polished portrait of ${petName} the ${petType} in a reality TV confessional booth, dramatic lighting, looking directly at the camera with main-character energy. Broadcast production quality.`,

    'influencer': `A meticulously styled portrait of ${petName} the ${petType} in a perfectly curated lifestyle setting — aesthetic coffee, golden-hour light, immaculate outfit coordination. Top-tier social media influencer energy. Photographic quality.`,

    'nap-champion': `A blissful portrait of ${petName} the ${petType} in the most supremely comfortable sleeping position imaginable — luxurious blankets, perfect lighting, and an expression of pure, uninterrupted peace. Photographic quality.`,

    'time-traveler': `A cinematic portrait of ${petName} the ${petType} stepping through a glowing time portal, one foot in the past and one in the future. Historical and futuristic elements collide. Photographic quality.`,

    'video-game-hero': `An epic portrait of ${petName} the ${petType} in detailed fantasy armor, standing in a richly atmospheric video-game world — dramatic lighting, heroic pose, and next-gen cinematic quality. Photographic realism.`,

    'broadway-star': `A theatrical portrait of ${petName} the ${petType} center stage under a dramatic spotlight, arms outstretched in a showstopping finale pose. Velvet curtains, orchestra pit, standing ovation energy. Photographic quality.`,

    'garden-party': `An elegant portrait of ${petName} the ${petType} at a beautiful garden party — floral arrangements, fine china, dappled sunlight through a canopy of blooms. English countryside garden elegance. Photographic quality.`,

    'snow-day': `A charming winter portrait of ${petName} the ${petType} playing in fresh snowfall — rosy cheeks, scarf flying, snowflakes in the air, and the quiet magic of a perfect snow day. Photographic quality.`,

    'national-park': `An epic landscape portrait of ${petName} the ${petType} at the edge of a breathtaking national park vista — dramatic natural light, vast wilderness, and a sense of awe. Ansel Adams meets pet photography. Photographic quality.`,

    'tiny-human': `A hilarious, photorealistic portrait of ${petName} the ${petType} doing a completely ordinary human task — sitting at a desk, reading a newspaper, commuting — with total seriousness. Candid lifestyle comedy. Photographic quality.`,

    'anime-world': `A cinematic portrait of ${petName} the ${petType} on a Tokyo street at golden hour, cherry blossoms falling, neon signs glowing in the background. Makoto Shinkai atmosphere, photographic quality.`,

    'galactic-emperor': `An epic portrait of ${petName} the ${petType} seated on a massive space throne in an imperial throne room, wearing a crown of stars and imperial robes. Vast galactic vista through towering windows. Photographic quality.`,

    'cottage-core': `A warm, pastoral portrait of ${petName} the ${petType} in a wildflower meadow beside a rustic cottage, wearing a linen outfit. Golden afternoon light, bees and butterflies, fresh-baked bread visible through the open door. Photographic quality.`,
  }

  return [
    baseDescription,
    coverScenes[style],
    'IMPORTANT: The image must be realistic and photographic — NOT an illustration, painting, or cartoon. Think cinematic movie still.',
  ].join('\n\n')
}

import { MONTH_THEMES, type StyleId } from './types'

// ============================================================
// Style base descriptions — used as the foundation for every prompt
// ============================================================

const STYLE_DESCRIPTIONS: Record<StyleId, string> = {
  watercolor:
    'A soft, luminous watercolor painting with visible wet-on-wet blending, delicate pigment granulation, transparent layered washes, and gentle bleeding edges where colors meet. The background should feel airy and light.',

  'oil-painting':
    'A rich, classical oil painting in the tradition of the Old Masters — thick impasto highlights, velvety glazed shadows, warm golden undertones, and visible canvas texture. Dramatic chiaroscuro lighting.',

  'pop-art':
    'A bold, eye-catching pop art piece inspired by Warhol and Lichtenstein — bright saturated color blocks, prominent Ben-Day halftone dots, thick black outlines, and a flat graphic composition with high contrast.',

  cartoon:
    'A charming, high-quality cartoon illustration in a modern Disney/Pixar style — slightly exaggerated proportions, large expressive eyes, smooth cel-shading, warm rim lighting, and a whimsical, inviting atmosphere.',

  vintage:
    'A nostalgic retro illustration in the style of 1950s–60s magazine ads — muted but warm color palette, visible halftone grain, slightly desaturated tones, hand-lettered sensibility, and a cozy mid-century aesthetic.',

  'line-art':
    'An elegant minimalist line drawing using clean, confident continuous strokes on a white background. The lines should be black ink with one selective accent color for emphasis. Sophisticated negative space.',

  'stained-glass':
    'An ornate stained glass window composition — bold black lead lines separating jewel-toned translucent segments of ruby red, sapphire blue, emerald green, and amber gold. Light appears to glow through the glass.',

  'japanese-woodblock':
    'A traditional Japanese ukiyo-e woodblock print — flat color planes, delicate black outlines, subtle woodgrain texture, muted natural palette with occasional vivid accents, asymmetric composition, and serene elegance.',

  botanical:
    'A detailed botanical illustration style — the pet is framed by lush, intricately rendered seasonal flowers, trailing vines, and foliage. Rich natural greens, soft petal colors, fine stippled shadows, scientific illustration precision.',

  'cozy-seasons':
    'A warm, inviting illustrated scene with rich textures and soft lighting — the pet is placed in a cozy, relatable seasonal setting. Slightly stylised but realistic proportions, visible brushwork, and a heartwarming atmosphere.',
}

// ============================================================
// Month-specific scene descriptions per style
// ============================================================

type MonthScenes = Record<number, string>

const STYLE_MONTH_SCENES: Record<StyleId, MonthScenes> = {
  watercolor: {
    1: 'wearing a tiny glittering party hat, surrounded by sparklers and confetti against a snowy winter backdrop. Icy blue and silver washes bleed softly together, with splattered white gouache snowflakes.',
    2: 'nestled among scattered rose petals and heart-shaped valentines, a soft pink and crimson palette bleeding at the edges. A delicate lace doily texture beneath, warm candlelight reflecting in the pet\'s eyes.',
    3: 'sitting in a meadow of early spring crocuses and snowdrops, pale lavender and soft yellow washes creating a gentle morning mist. Cherry blossom petals drift on a watercolor breeze.',
    4: 'splashing happily in a rain puddle, wearing tiny rain boots, surrounded by daffodils and scattered Easter eggs. Rain streaks rendered as long wet drips down the paper.',
    5: 'lounging on a picnic blanket in a sunlit garden bursting with peonies, tulips, and lilacs. Warm golden light filters through, with butterflies painted in loose, translucent washes.',
    6: 'playing on a sandy beach at golden hour, waves lapping at the shore. The ocean is painted in sweeping blue-green washes, with wet sand glistening and seashells scattered about.',
    7: 'gazing up at a spectacular fireworks display against a deep indigo night sky. Red, white, and blue bursts rendered as explosive wet-on-wet blooms of color.',
    8: 'perched on a rock beside a crystal mountain lake, surrounded by pine trees and wildflowers. Cool blues and greens blend with warm afternoon sunlight in fluid washes.',
    9: 'sitting on a front porch step surrounded by the first golden and amber leaves of autumn. A school backpack nearby, morning light casting long watercolor shadows.',
    10: 'peeking out from behind a carved jack-o-lantern, wearing a witch hat, autumn leaves swirling. Orange, purple, and black washes with a glowing candlelit warmth from within the pumpkin.',
    11: 'curled up on a plaid blanket beside a harvest table with pumpkins, gourds, and autumn branches. Warm amber and russet tones, soft and inviting, with steam rising from a mug.',
    12: 'sitting under a twinkling Christmas tree, surrounded by wrapped presents and soft snow falling outside the window. Pine green and ruby red washes with sparkling white highlights.',
  },

  'oil-painting': {
    1: 'posed regally before a frost-covered window, wearing a velvet New Year ribbon. Crystalline ice patterns catch cold winter light, rendered in thick impasto whites and glacial blues.',
    2: 'reclining on a plush burgundy cushion amid scattered red roses and gilt-framed valentines. Rich Renaissance-style drapery in deep crimson and gold, candlelight creating warm skin-tone glazes.',
    3: 'standing in a Dutch Golden Age garden scene with early tulips and budding branches. Soft pearlescent spring light, reminiscent of Vermeer, illuminates the pet against a moody sky.',
    4: 'sheltering beneath a blossoming tree during a gentle spring rain, droplets clinging to fur. Deep greens and fresh yellow-greens, a winding path with puddles reflecting the overcast sky.',
    5: 'resting in a lush Impressionist garden filled with roses and wisteria, dappled sunlight and thick brushstrokes creating a Monet-like atmosphere. Vibrant greens, pinks, and lavender.',
    6: 'standing on a sunlit coastal cliff overlooking a turquoise sea, wind ruffling fur. A Turner-esque luminous sky in molten golds and cerulean blues with dramatic cloud formations.',
    7: 'posed nobly with patriotic bunting draped behind, fireworks reflected in their eyes. Deep navy sky with bursts of cadmium red and titanium white, thick impasto texture in the explosions.',
    8: 'exploring a mountain trail through golden afternoon light, wildflowers lining the path. Hudson River School-inspired landscape with majestic peaks, warm earth tones, and crisp atmospheric perspective.',
    9: 'sitting beneath a grand oak tree shedding its first autumn leaves, golden hour light streaming through the canopy. Rich sienna, burnt orange, and deep forest greens layered in translucent glazes.',
    10: 'draped in a dark cloak beside a glowing carved pumpkin in a candlelit scene. Dramatic Caravaggio-style chiaroscuro — deep blacks, fiery oranges, and mysterious violet shadows.',
    11: 'resting beside a roaring stone fireplace, a Thanksgiving feast visible in the background. Warm Rembrandt-lighting in amber and ochre, the comfort of home rendered in rich, buttery paint.',
    12: 'surrounded by evergreen boughs and golden ornaments, soft snowfall visible through a window. Flemish still-life richness — deep hunter green, ruby, gold leaf accents, and velvety shadows.',
  },

  'pop-art': {
    1: 'wearing oversized novelty "2026" glasses with confetti exploding in every direction. Neon pink, electric blue, and acid yellow color blocks with giant halftone dot patterns and "HAPPY NEW YEAR!" energy.',
    2: 'surrounded by oversized candy hearts and bold graphic roses on a hot pink background. Comic-book speech bubble with hearts, thick black outlines, bright red and magenta color blocks.',
    3: 'with a giant daisy tucked behind one ear against a lime green and sky blue split background. Bold flower motifs, Haring-style movement lines, and a fresh spring color palette.',
    4: 'holding a polka-dot umbrella with giant stylised raindrops falling in a pattern. Bright yellow raincoat, cyan blue background, bold graphic Easter eggs scattered in a repeating pattern.',
    5: 'posed heroically atop a giant flower like a comic book cover, bees and butterflies in bold graphic style. Vivid greens, sunny yellows, and hot pinks with "POW!" energy rays.',
    6: 'wearing oversized star-shaped sunglasses on a neon beach scene. Flat graphic waves in electric blue, a hot pink sunset, bold palm tree silhouettes, and a striped beach towel.',
    7: 'wearing a star-spangled bandana with massive graphic firework bursts behind. Red, white, and blue in maximum saturation, explosive Lichtenstein-style halftone firework patterns.',
    8: 'wearing a tiny explorer hat with a bold graphic map and compass. Bright orange, teal, and yellow adventure palette, comic-style movement lines suggesting excitement and discovery.',
    9: 'wearing a preppy bow tie surrounded by oversized graphic pencils, rulers, and apples. Bright school-bus yellow, red, and blue with a halftone notebook-paper background.',
    10: 'in a dramatic Halloween costume surrounded by bold graphic jack-o-lanterns and bats. High-contrast black and neon orange, purple and green, with thick comic outlines and "BOO!" text effects.',
    11: 'surrounded by a graphic cornucopia bursting with oversized stylised autumn produce. Warm orange, mustard, and brown in bold flat planes with thick outlines and gratitude energy.',
    12: 'tangled in a string of oversized, brightly colored Christmas lights on a bold red background. Electric green tree silhouette, bright gift box graphics, and a huge yellow star topper.',
  },

  cartoon: {
    1: 'at a festive New Year countdown party, wearing a sparkly bow tie, surrounded by cartoon confetti and balloons. A big clock strikes midnight behind them, eyes wide with excitement and joy.',
    2: 'delivering cartoon valentines with a tiny mailbag, blushing cheeks, hearts floating above their head. A cute, warm pink neighborhood scene with heart-shaped bushes and love letters fluttering.',
    3: 'chasing a playful cartoon butterfly through a field of oversized spring flowers. Big expressive eyes, bouncy movement, petals swirling in a gentle breeze, with a rainbow in the distance.',
    4: 'dancing in cartoon rain puddles wearing bright yellow galoshes and holding a frog friend. Oversized raindrops, a cheerful rainbow emerging, Easter eggs hidden among cartoon tulips.',
    5: 'helping in a whimsical cartoon garden, wearing a tiny sun hat, surrounded by singing birds and dancing flowers. A cheerful sun with a smiley face beams down warmly.',
    6: 'building an elaborate cartoon sandcastle at the beach with crab and starfish friends. Crystal-clear cartoon water, a grinning sun, colorful beach umbrellas, and ice cream cones.',
    7: 'watching cartoon fireworks from a rooftop, wrapped in a patriotic blanket, mouth open in an adorable "oooh!" expression. Sparkly trails and starbursts fill the animated night sky.',
    8: 'on a cartoon camping adventure, wearing a tiny backpack and ranger hat. A friendly deer and bunny companion, a cozy campfire, mountains in the background, and a tent pitched among trees.',
    9: 'wearing an oversized cartoon backpack on the first day of school, looking simultaneously nervous and excited. A big red schoolhouse, yellow bus, falling leaves, and a lunch box.',
    10: 'in the world\'s cutest vampire costume, trick-or-treating at a cartoon haunted house. Friendly cartoon ghosts, smiling jack-o-lanterns, a big full moon, and a bag overflowing with candy.',
    11: 'napping on a cartoon armchair beside a crackling fireplace, a tiny thankful thought bubble above. Turkey and pie on a table, autumn leaves visible through the window.',
    12: 'excitedly unwrapping a gift under a towering, brilliantly decorated cartoon Christmas tree. Ornaments, tinsel, twinkling lights, a roaring fireplace, and snow gently falling outside.',
  },

  vintage: {
    1: 'at a glamorous mid-century New Year\'s Eve soiree, wearing a tiny bowtie. Champagne glasses and streamers in a muted gold and teal palette, slightly faded and warm grain texture.',
    2: 'posed on a retro red velvet settee surrounded by vintage Valentine cards and a box of chocolates. Soft rose and cream palette with visible halftone printing grain and rounded serif typography feel.',
    3: 'in a 1950s-style garden scene with pastel tulips and a white picket fence. Soft mint green, pale pink, and butter yellow tones with a slightly sun-faded quality.',
    4: 'under a striped retro umbrella in a charming rain shower, wearing a yellow slicker. Vintage postcard aesthetic with muted blues, creams, and a gentle aqua wash.',
    5: 'in a retro suburban backyard garden scene with a vintage watering can and climbing roses. Warm earth tones, soft greens, and the golden haze of a 1960s magazine illustration.',
    6: 'at a vintage beach scene with a classic wooden surfboard and striped cabana. Faded turquoise and coral palette, retro swimwear vibes, and a mid-century travel poster aesthetic.',
    7: 'at a retro Fourth of July picnic with checkered tablecloth, pie, and sparklers. Faded red, cream, and navy palette with star-spangled bunting and a nostalgic Americana feel.',
    8: 'posed beside a vintage Airstream trailer in a scenic campground. Warm copper and forest green palette, retro travel stickers, and a golden-hour glow with pine trees.',
    9: 'with a vintage leather satchel and apple, walking down a tree-lined lane with falling leaves. Warm amber, rust, and olive tones with a soft-focus nostalgic quality.',
    10: 'peering around a vintage jack-o-lantern on a wooden porch, autumn wreath on the door. Deep orange, burgundy, and brown with a warm candlelit glow and retro grain.',
    11: 'at a Norman Rockwell-style Thanksgiving dinner table, wearing a tiny pilgrim hat. Warm sepia, amber, and cream tones with a homey, hand-illustrated quality.',
    12: 'beside a vintage aluminum Christmas tree with color-wheel spotlight, retro ornaments and tinsel. Silver, red, and green in a classic 1960s holiday palette with gentle grain.',
  },

  'line-art': {
    1: 'surrounded by elegant line-drawn snowflakes and sparklers, a single accent color of icy blue highlighting the party hat and a few select snowflakes. Clean white space, minimal strokes.',
    2: 'with flowing line-drawn roses and trailing ribbons, selective red accent on heart shapes and rose petals. Graceful continuous contour lines, romantic negative space.',
    3: 'among delicate line-drawn cherry blossoms and butterflies, selective soft pink accent on petals. Branches rendered in single flowing strokes, airy spring composition.',
    4: 'beneath a line-drawn umbrella with rain rendered as fine parallel lines, selective yellow accent on rain boots and a single daffodil. Peaceful, meditative minimalism.',
    5: 'in a line-drawn garden of wildflowers and trailing ivy, selective green accent on leaves and stems. Intricate botanical detail, elegant pen-and-ink quality.',
    6: 'on a line-drawn beach with waves rendered as flowing curves, selective turquoise accent on the ocean and a single seashell. Serene, breath-like line quality.',
    7: 'with line-drawn firework bursts radiating outward, selective red-and-blue accent on alternating starbursts. Geometric precision, celebratory energy in minimal strokes.',
    8: 'on a line-drawn mountain trail with sweeping landscape, selective warm orange accent on the setting sun and wildflowers. Confident, adventurous contour lines.',
    9: 'surrounded by line-drawn falling leaves in various shapes, selective amber accent on select leaves. Elegant dance of organic forms, gentle autumn movement.',
    10: 'with an intricately line-drawn jack-o-lantern and swirling bats, selective orange accent on the pumpkin\'s glow. Gothic elegance, playful darkness.',
    11: 'curled up in a line-drawn blanket beside a simple fireplace, selective warm amber accent on the flames. Cozy intimacy, sparse and tender.',
    12: 'beneath a line-drawn Christmas tree with ornament details, selective red and gold accent on select ornaments and a star topper. Festive precision, joyful restraint.',
  },

  'stained-glass': {
    1: 'framed in an arched window composition with snowflake rosette patterns, icy sapphire and crystal-white glass segments catching winter light. Lead lines form geometric frost patterns.',
    2: 'centered in a Gothic arch of ruby and rose glass, surrounded by heart-shaped medallions and intertwined rose vines. Warm candlelight appears to glow through crimson and pink segments.',
    3: 'in a nature-panel composition with budding branches and glass tulips in lavender, pale green, and soft gold. Art Nouveau-style organic lead lines flowing like growing vines.',
    4: 'beneath an arch of glass raindrops in aquamarine and silver, with daffodil and Easter lily panels in gold and white. Jewel-toned springtime radiance.',
    5: 'surrounded by a rose window of blooming flowers — glass peonies in fuchsia, irises in purple, and leaves in emerald. Radiant garden light streaming through layered color.',
    6: 'in a seascape panel with oceanic glass in turquoise, teal, and deep blue, golden sand at the bottom. A luminous amber sun radiates geometric rays through the glass.',
    7: 'at the center of a patriotic star-burst rosette in ruby red, cobalt blue, and brilliant white glass, with firework-like radial patterns in gold and silver leading.',
    8: 'in a landscape panel of mountain peaks in amethyst and grey glass, pine forests in deep emerald, and a sunset sky in amber and rose. Adventure rendered in sacred geometry.',
    9: 'framed by an arch of autumn leaves in amber, burnt sienna, and gold glass segments, with an oak tree rendered in deep brown and green leaded panels.',
    10: 'in a dramatic Gothic panel with jack-o-lanterns in fiery orange glass, bats in deep purple, and a full moon in pale silver-white. Spooky beauty in sacred form.',
    11: 'in a warm harvest panel with cornucopia motifs in amber, pumpkin glass in deep orange, wheat sheaves in gold, and grape vines in purple. Warm hearth-light glow.',
    12: 'at the center of a magnificent holiday rosette with evergreen glass in deep emerald, ornaments in ruby and gold, a star in brilliant topaz, and snowflakes in frost-white.',
  },

  'japanese-woodblock': {
    1: 'in a snowy Edo-period garden, delicate snowflakes falling against a soft grey sky. Plum blossoms on bare branches, traditional wooden architecture in the background. Mt. Fuji visible in the distance.',
    2: 'among red and white plum blossoms with a traditional fan motif, soft pink clouds in the background. Elegant calligraphic-style composition with a scattering of heart-shaped ume petals.',
    3: 'beneath weeping cherry trees in full bloom, petals drifting on a gentle breeze over a curved wooden bridge. Pale pink and soft green palette with traditional cloud patterns.',
    4: 'sheltering under a traditional wagasa umbrella during a spring rain, irises blooming beside a pond. Fine rain lines in the classic Hiroshige style, deep indigo and green tones.',
    5: 'in a traditional Japanese garden with wisteria cascading over a wooden arbor, koi swimming below. Rich purple, soft green, and warm earth tones with flat color planes.',
    6: 'on a shoreline with crashing Hokusai-style waves, a summer sky above. Bold blues and whites in dynamic wave patterns, the pet gazing serenely at the great ocean.',
    7: 'watching festival fireworks (hanabi) reflected in a river, paper lanterns lining the bank. Bursts of red, gold, and silver against a deep indigo night sky.',
    8: 'on a mountain path through a bamboo forest, cicadas singing in the summer heat. Deep greens, warm golds, and dappled light filtering through the swaying bamboo.',
    9: 'beside a traditional moon-viewing (tsukimi) arrangement with pampas grass and dango, a huge harvest moon rising. Silver, deep blue, and warm gold palette.',
    10: 'among vivid autumn maple trees (momiji) at a shrine, leaves drifting onto stone steps. Brilliant vermillion, amber, and gold against deep forest green.',
    11: 'beside a steaming outdoor onsen surrounded by autumn foliage and smooth rocks. Warm mist rising, russet and amber leaves, a peaceful and contemplative scene.',
    12: 'in a snowy temple scene with a torii gate, stone lanterns topped with snow, and a single camellia bloom. Serene whites, greys, and a vivid red accent.',
  },

  botanical: {
    1: 'framed by a circular wreath of winter botanicals — frosted pine branches, holly with bright red berries, white hellebores, and silver-dusted eucalyptus. Snowflakes interspersed among the foliage.',
    2: 'surrounded by an archway of red roses, pink camellias, and trailing jasmine. Delicate fern fronds and baby\'s breath fill the gaps, with tiny hearts woven among the stems.',
    3: 'nestled among the first spring bulbs — purple crocuses, white snowdrops, yellow daffodils, and pale blue grape hyacinths. Fresh green shoots and unfurling fern fiddleheads.',
    4: 'framed by draping wisteria, Dutch irises, and lily of the valley, with rain droplets clinging to petals and leaves. Fresh, dewy greens and soft purples.',
    5: 'at the center of a lush arrangement of garden peonies, ranunculus, sweet peas, and climbing roses in full bloom. Rich pinks, corals, and creams with abundant foliage.',
    6: 'surrounded by summer wildflowers — sunflowers, black-eyed Susans, lavender stalks, and Queen Anne\'s lace. Warm golden light, buzzing bees, and trailing morning glory vines.',
    7: 'framed by an arch of red poppies, blue delphiniums, and white daisies. Stars-and-stripes bunting woven through a garland of summer blooms and greenery.',
    8: 'among mountain wildflowers — purple lupines, Indian paintbrush, columbine, and alpine asters. Pine needles and pinecones scattered about, fresh mountain air rendered in cool greens and warm violets.',
    9: 'surrounded by early autumn botanicals — asters, chrysanthemums, goldenrod, and turning maple leaves. Rich golds, russets, and the first hints of crimson.',
    10: 'framed by a dramatic Halloween arrangement — deep purple dahlias, black roses, orange marigolds, twisted grapevine, and scattered autumn leaves. A single carved pumpkin nestled among the flora.',
    11: 'surrounded by a Thanksgiving harvest wreath of wheat sheaves, dried hydrangea, bittersweet berries, oak leaves in amber, and small ornamental gourds. Warm, abundant, and textural.',
    12: 'at the center of a holiday botanical arrangement — evergreen boughs, red winterberry, pinecones, white amaryllis, and frosted rosemary. Silver and gold accents among deep greens.',
  },

  'cozy-seasons': {
    1: 'curled up on a fuzzy blanket by a roaring fireplace, watching snowflakes through a frosted window. A steaming mug of hot cocoa nearby, fairy lights twinkling on the mantel. Warm golden light, deeply inviting.',
    2: 'on a plush sofa surrounded by heart-shaped pillows and a box of chocolates, a romantic movie playing on TV in the background. Soft pink lamplight, rose petals on the rug.',
    3: 'peeking out of an open window as the first warm breeze of spring blows in, a bird nesting on the windowsill. Fresh green buds on the tree outside, gentle morning sunshine.',
    4: 'snuggled inside on a rainy afternoon, watching raindrops race down the window, a stack of books and a cozy throw blanket. Soft grey light with warm interior glow.',
    5: 'relaxing in a sunlit backyard garden, stretched out on warm patio stones beside blooming flower beds. A garden hose and watering can nearby, bees buzzing lazily.',
    6: 'at the beach with a colorful towel, sunglasses, and a beach umbrella, waves lapping at the shore. Building sandcastles, seagulls overhead, warm golden sunshine.',
    7: 'at a backyard barbecue with patriotic decorations, sparklers glowing in the twilight. Picnic table laden with summer treats, friends and family visible in the warm evening light.',
    8: 'on a lakeside dock at sunset, a canoe tied nearby, a campfire visible on the shore. Pine trees silhouetted against a watercolor sky of orange, pink, and purple.',
    9: 'walking through a park covered in early autumn leaves, wearing a tiny plaid scarf. Acorns and conkers on the path, golden afternoon light filtering through amber-tinted trees.',
    10: 'on a porch decorated for Halloween — carved pumpkins glowing, cobweb decorations, a candy bowl, and autumn wreaths. Warm porch light against a dusky purple evening sky.',
    11: 'asleep by the fireplace after Thanksgiving dinner, a crumb-covered plate nearby, the warmth of family. Autumn garland on the mantel, candles flickering, pure contentment.',
    12: 'under the Christmas tree amid piles of wrapping paper and ribbons, a new toy in paw, twinkling tree lights reflected in happy eyes. Snow gently falling outside, holiday magic.',
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
    `Create a portrait of ${petName} the ${petType} ${sceneDetail}`,
    `Monthly theme: ${monthTheme.theme}.`,
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
    watercolor: `A stunning hero portrait of ${petName} the ${petType}, centered and majestic, surrounded by a soft wreath of watercolor seasonal motifs — snowflakes, blossoms, sunflowers, and autumn leaves blending together in a gorgeous chromatic circle. Splashes and drips of every season's palette merge harmoniously.`,

    'oil-painting': `A grand, regal portrait of ${petName} the ${petType} in classical oil painting style, posed nobly against a rich dark background with a golden frame-like border of painted seasonal garlands — winter holly, spring roses, summer wheat, and autumn grapes. Dramatic Rembrandt lighting.`,

    'pop-art': `An iconic, larger-than-life pop art portrait of ${petName} the ${petType} in a bold four-quadrant Warhol-style layout — each quadrant a different vibrant color scheme representing a season. Massive halftone dots, thick outlines, maximum impact, and superstar energy.`,

    cartoon: `An adorable, show-stopping cartoon portrait of ${petName} the ${petType} bursting through a calendar page with confetti and streamers, wearing a crown, surrounded by tiny seasonal icons floating in a circle. Big sparkly eyes, joyful expression, pure animated charisma.`,

    vintage: `A charming retro magazine cover portrait of ${petName} the ${petType}, styled as a 1950s "Pet of the Year" with vintage typography borders, mid-century geometric patterns, and a warm nostalgic palette of teal, coral, and gold.`,

    'line-art': `A breathtaking minimalist line portrait of ${petName} the ${petType} rendered in flowing continuous black ink strokes, with four small seasonal vignettes in the corners — each with a single accent color. Elegant, gallery-worthy, with masterful use of negative space.`,

    'stained-glass': `A magnificent central rosette window composition featuring ${petName} the ${petType} at the center, surrounded by twelve small medallion panels representing each month. Jewel tones — ruby, sapphire, emerald, topaz — radiating outward in a sacred geometric pattern.`,

    'japanese-woodblock': `A striking ukiyo-e portrait of ${petName} the ${petType} in the style of a bijin-ga (beauty print), surrounded by the four seasonal symbols — pine for winter, cherry for spring, wave for summer, maple for autumn. Traditional cartouche and seal marks.`,

    botanical: `A spectacular botanical frame surrounding a central portrait of ${petName} the ${petType} — twelve seasonal flowers arranged in a circular garland, each representing a month. Scientifically precise petals, leaves, and stems in a naturalist's masterpiece.`,

    'cozy-seasons': `A heartwarming portrait of ${petName} the ${petType} in four cozy quadrants — snuggled by a fireplace (winter), playing in a garden (spring), lounging at the beach (summer), and nestled in autumn leaves (fall). Each scene radiates warmth and comfort.`,
  }

  return [baseDescription, coverScenes[style]].join('\n\n')
}

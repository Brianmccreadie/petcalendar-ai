// Generate the site's brand artwork: classical oil paintings starring pets.
//
//   npm run brand:art -- hero            one piece (see ART below for names)
//   npm run brand:art -- hero --take=b   write public/art/hero-b.jpg (to compare takes)
//
// Needs an image key (FAL_KEY etc.). Output goes to public/art/.
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { createJiti } from 'jiti'
import sharp from 'sharp'

const jiti = createJiti(import.meta.url)
const ai = await jiti.import('../lib/ai/index.ts')

const refs = {
  aussie: ['public/previews/pet-photoshoot-dog.jpg', 'an Australian shepherd with a blue-merle coat and blue eyes'],
  cat: ['public/previews/royal-portrait-cat.jpg', 'a grey British shorthair cat with amber eyes (ignore its costume)'],
  golden: ['public/previews/mythical-quest-dog.jpg', 'a golden retriever (ignore its costume)'],
  pom: ['public/previews/superhero-origin-dog.jpg', 'a small orange Pomeranian (ignore its costume)'],
  doodle: ['public/sample-bonnie/reference.jpg', 'a small cream-coloured goldendoodle with a curly coat, dark button eyes and a black nose'],
}

const PAINT =
  'A grand classical oil painting in the manner of a 17th-century Italian mythological scene: visible confident brushwork, glazed shadows, soft sfumato edges, a rich but slightly muted palette. It must read as a real painting on canvas, not a photograph and not a cartoon. The animals are painted naturalistically, with real anatomy and fur. No text, letters, numbers, signature, watermark, border or frame anywhere.'

const ART = {
  hero: {
    size: '2560x1440',
    refs: ['aussie', 'golden', 'pom', 'cat'],
    prompt: `${PAINT}

Subject: one sweeping mural in which many pets act out different adventures side by side, like a grand allegorical fresco — mostly dogs, with a few other household pets. Only pet animals appear: no people and no wild animals. From left to right, flowing into one another without hard borders:
- far left, under a starry indigo sky: the golden retriever from image 2 as an explorer of the heavens, in an ornate brass-and-glass helmet, drifting among painted planets;
- left of centre: a beagle as a swashbuckling sea captain in a tricorn hat at a ship's wheel, with a green pet parrot on the rail, surf breaking behind;
- centre, slightly raised on a rock and the focus of the whole mural: the Australian shepherd from image 1, crowned, with a long vermilion silk drape billowing in the wind;
- right of centre: the Pomeranian from image 3 as a little wizard in a star-scattered robe and pointed hat, books and floating candles around it;
- far right, in warm desert light: a border collie as a frontier sheriff in a hat and neckerchief, and the grey cat from image 4 lounging regally on a velvet cushion, unimpressed;
- small supporting pets tucked in among them: a lop-eared rabbit, a hamster, a goldfish in a glass bowl, a tabby kitten;
- in the sky, two winged puppy cherubs.
Each animal is painted naturalistically, with correct anatomy, and the costumes are generic and original.

Palette: ochre, umber, sea green, cream and smoky rose, with vermilion and gold accents; the different worlds are unified by one warm evening light.

Composition: very wide and balanced, like a frieze. All of the animals sit in the lower half of the canvas, their heads no higher than the middle; the whole upper 45% is open, calm evening sky with only soft cloud and the two small puppy cherubs near the top corners — a very large title will be set across that sky. No human figures anywhere, including the cherubs: they are puppies with wings. The lower third of the canvas dissolves into heavy billowing twilight clouds in dusky blue and indigo, growing darker toward the bottom edge until the bottom is an almost solid deep twilight blue (#16305a). No red or burgundy in the lower clouds.`,
  },
  runway: {
    size: '2560x1440',
    refs: ['doodle'],
    prompt: `${PAINT}

Subject: a couture show staged in a baroque palace gallery. The cream goldendoodle from image 1 walks a long marble catwalk on all four legs toward the left, mid-stride, wearing a pale rose silk cape that trails behind and a small collar of pearls. Tall mirrors, swags of blush and ivory drapery, great urns of peonies and roses, crystal chandeliers, soft daylight from high windows. The only living creature is the dog: no people, no audience, no other animals, no statues of people. Palette: ivory, blush pink, pale gold and soft sky blue.

Composition: very wide. The dog is in the left third of the canvas with its head no higher than the middle; keep the upper-middle of the canvas calm and open. The lower third of the canvas dissolves into soft pale mist that thins toward the bottom edge until the bottom is an almost solid white (#ffffff).`,
  },
  voyage: {
    size: '2560x1440',
    refs: ['aussie'],
    prompt: `${PAINT}

Subject: the harbour of an old port city on a bright morning. The Australian shepherd from image 1 stands on the stone quay as a seasoned traveller, a leather satchel across its chest, beside stacked trunks and a half-unrolled map. Tall sailing ships at anchor; domes, towers and a lighthouse in the hazy distance. Palette: antique-map sepia and parchment, soft teal sea, touches of coral.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into pale warm sea-mist and soft cloud that thickens toward the bottom edge until the bottom is an almost solid light parchment (#efe3cc).`,
  },
  cosmos: {
    size: '2560x1440',
    refs: ['golden'],
    prompt: `${PAINT}

Subject: a celestial allegory. The golden retriever from image 1 floats among the stars in an ornate brass-and-leather explorer's suit with a glass globe helmet, like a 17th-century vision of a voyage to the moon. Planets hang like painted orbs, a comet crosses the sky, and a small winged puppy at upper left peers through a brass telescope. No human figures. Palette: deep indigo and ultramarine with gold leaf highlights.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into dark indigo clouds scattered with faint stars that thickens toward the bottom edge until the bottom is an almost solid deep indigo (#101536).`,
  },
  deep: {
    size: '2560x1440',
    refs: ['cat'],
    prompt: `${PAINT}

Subject: an underwater kingdom. The grey cat from image 1, wearing a small crown of pearls, sits enthroned on a giant scallop shell among sunken marble ruins and coral. Schools of goldfish sweep past. The only creatures are the cat and goldfish: no turtles, no sharks, no dolphins, no wild sea animals; shafts of pale light fall from the surface far above. Palette: teal and emerald with coral and pearl accents.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into dark swirling water and kelp shadow that thickens toward the bottom edge until the bottom is an almost solid deep teal (#0b2e33).`,
  },
  academy: {
    size: '2560x1440',
    refs: ['pom'],
    prompt: `${PAINT}

Subject: a vast candlelit gothic library at night. The Pomeranian from image 1, in a midnight-blue robe scattered with gold stars and a pointed hat, stands on a stack of enormous leather books, one paw on an open tome. Candles float in the air, a black cat watches from a shelf, a brass orrery glints. The only living creatures are the dog and the cat: no owls, no birds, no statues or busts of people, no skulls. Palette: midnight violet and umber with warm candle gold.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into drifting violet smoke and shadow that thickens toward the bottom edge until the bottom is an almost solid dark aubergine (#1d1228).`,
  },
  court: {
    size: '2560x1440',
    refs: ['cat', 'golden'],
    prompt: `${PAINT}

Subject: a state portrait in a palace hall. The grey cat from image 1 and the golden retriever from image 2 sit side by side on a gilded double throne, in ermine-trimmed robes and small crowns, utterly dignified. Heavy emerald velvet drapes, a marble column, a distant chandelier. Palette: deep emerald and bottle green with burnished gold and ivory.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into dark emerald velvet shadow and soft mist that thickens toward the bottom edge until the bottom is an almost solid deep emerald (#0f2f28).`,
  },
  hearth: {
    size: '2560x1440',
    refs: ['aussie'],
    prompt: `${PAINT}

Subject: a quiet Dutch interior on a winter morning, in the spirit of Vermeer. The Australian shepherd from image 1 dozes curled on a window seat piled with woollen blankets; a cup of tea steams on the sill; pale light falls through leaded glass onto a tiled floor. Palette: warm cream, honey and soft sage.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into soft pale steam and morning light that thickens toward the bottom edge until the bottom is an almost solid warm cream (#f3e9d7).`,
  },
  heavens: {
    size: '2560x1440',
    refs: ['pom', 'golden', 'cat'],
    prompt: `${PAINT}

Subject: a baroque ceiling fresco of the heavens. The Pomeranian from image 1 and the golden retriever from image 2, each with small feathered cherub wings, tumble joyfully through cream and pale-gold clouds in a clear light-blue sky; the grey cat from image 3 reclines on a cloud at lower right, unimpressed. Shafts of warm light break through from a glowing opening in the centre. Every figure is a pet animal: there are no human figures, no human babies and no human cherubs anywhere in the painting — the only cherubs are the winged dogs.

Composition: very wide. Keep the upper-middle of the canvas calm and open — a large title will sit there. The lower third of the canvas dissolves into soft pale clouds that thin toward the bottom edge until the bottom is an almost solid pale sky blue (#cfe3f2).`,
  },
}

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))
const take = args.find((a) => a.startsWith('--take='))?.slice(7)
const piece = ART[name]
if (!piece) {
  console.error(`Usage: npm run brand:art -- <${Object.keys(ART).join('|')}> [--take=x]`)
  process.exit(1)
}

process.env.OPENAI_IMAGE_SIZE = piece.size
const references = await Promise.all(
  piece.refs.map(async (key) => ({ data: await readFile(refs[key][0]), mimeType: 'image/jpeg', label: refs[key][1] }))
)
const image = await ai.generateImage({ prompt: piece.prompt, references })
await mkdir('public/art', { recursive: true })
const out = path.join('public/art', `${name}${take ? `-${take}` : ''}.jpg`)
await writeFile(out, await sharp(image.data).jpeg({ quality: 84, mozjpeg: true }).toBuffer())
console.log('wrote', out)

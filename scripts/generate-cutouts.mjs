// Painted cut-out characters for the site collage: one animal per image, on a
// transparent background, in the same classical oil-painting manner as the
// murals in public/art.
//
//   npm run brand:cutouts                 every character that is missing
//   npm run brand:cutouts -- pig bunny    just these (always regenerated)
//
// Each character is painted on a flat backdrop, then cut out with a
// background-removal model, trimmed and saved as WebP with alpha in
// public/cutouts/. Needs FAL_KEY.

import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const QUEUE = 'https://queue.fal.run'
const PAINT_MODEL = process.env.FAL_IMAGE_MODEL || 'openai/gpt-image-2.5/sunburst/edit'
const CUT_MODEL = 'fal-ai/birefnet/v2'
const OUT = 'public/cutouts'
const STYLE_REF = 'public/art/court.jpg'

const key = (process.env.FAL_KEY || '').trim()
if (!key) throw new Error('FAL_KEY is not set')
const headers = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' }

const STYLE =
  'Paint a single figure as a grand classical oil painting in the manner of a 17th-century Italian master, matching the brushwork, glazing and slightly muted, warm palette of image 1 (use image 1 for painting style only, not its subject). Visible confident brushwork; naturalistic animal anatomy and fur; soft warm light from the upper left.'
const ISOLATE =
  'Isolation: the figure is completely alone, shown whole with nothing cropped, centred with generous empty margin on every side, on a perfectly flat, plain, evenly lit light grey studio backdrop. No scenery, no floor, no ground shadow, no frame, no border, no vignette, no text. Only this one pet animal: no people and no other creatures. The animal keeps its real four-legged body: no human arms or hands.'

/** [file name, aspect, description] */
const CHARACTERS = {
  king: ['4:5', 'An Australian shepherd with a blue-merle coat and blue eyes, standing proudly in three-quarter view facing right, wearing a small gold crown and a long vermilion silk cape that billows out behind it in the wind.'],
  astronaut: ['1:1', 'A golden retriever floating weightlessly as if swimming through the air toward the right, paws paddling, tongue out with joy, wearing an ornate brass-and-glass antique diving-style space helmet and a quilted cream explorer suit with brass fittings.'],
  pirate: ['4:5', 'A beagle sitting upright on its haunches like a dog, in three-quarter view facing left, wearing a black tricorn hat with a white feather and a navy captain’s coat with gold braid draped over its back, a red neckerchief at its throat.'],
  wizard: ['4:5', 'A small fluffy orange Pomeranian sitting and looking up to the right with bright eyes, wearing a midnight-blue robe scattered with gold stars and a pointed wizard hat with a crescent moon; a few tiny golden sparks drift near its nose.'],
  sheriff: ['4:5', 'A black-and-white border collie sitting in profile facing left, alert and noble, wearing a brown wide-brimmed hat with a gold star and a red paisley bandana.'],
  cherub: ['1:1', 'A golden retriever puppy with small white feathered wings, flying toward the right and carrying a garland of roses and laurel in its mouth, a ribbon of rose silk trailing behind.'],
  cherub2: ['1:1', 'A spaniel puppy with brown ears and small white feathered wings, tumbling playfully through the air toward the left, paws out, a ribbon of pale blue silk trailing behind.'],
  duchess: ['4:5', 'A grey British shorthair cat with amber eyes sitting very upright and dignified like a cat, facing slightly right, wearing a white ermine-trimmed crimson mantle over its back and a small pearl coronet.'],
  musketeer: ['4:5', 'A ginger tabby cat mid-stride on all four paws, walking toward the left with its tail high, wearing a wide plumed cavalier hat with a white ostrich feather and a short blue silk cape with a lace collar.'],
  sorceress: ['4:5', 'A sleek black cat with green eyes sitting on a stack of two old leather books, tail curled around its paws, wearing a starched white lace ruff collar and a tiny gold earring-like charm on a ribbon; it looks straight at the viewer.'],
  siamese: ['5:4', 'A Siamese cat lying stretched out on its side like a reclining odalisque on a tasselled velvet cushion, head raised and turned to the viewer, wearing a single strand of pearls.'],
  pig: ['5:4', 'A small pink pet pig trotting toward the right on its four trotters, snout lifted happily, wearing a white lace ruff collar, a tiny feathered velvet beret and a ribbon sash of sky-blue silk.'],
  bunny: ['4:5', 'A lop-eared rabbit with a cream and fawn coat sitting up on its hind legs the way rabbits naturally do, nose twitching, wearing a crown of spring flowers and a small moss-green velvet cloak fastened with a gold clasp.'],
  dachshund: ['5:4', 'A long red dachshund walking briskly toward the left on its four short legs, wearing a tiny plumed explorer’s hat and a leather satchel strapped across its back with a rolled map sticking out.'],
  corgi: ['1:1', 'A Pembroke Welsh corgi leaping through the air toward the right with all four legs stretched out, ears back, grinning, wearing a small blue-and-gold jester collar with tiny bells.'],
  poodle: ['4:5', 'A white standard poodle standing elegantly in profile facing right, head held high, wearing a powdered-wig-like topknot with a pink silk bow, a pearl choker and a short rose brocade coat over its back.'],
  cloud1: ['5:4', 'A single large billowing cumulus cloud painted in cream, pale gold and soft rose, with a blue-grey shadowed underside. No animal in this one: only the cloud.'],
  cloud2: ['5:4', 'A single long, low drift of soft cloud painted in white and pale sky blue with a warm peach highlight along the top edge. No animal in this one: only the cloud.'],
  garland: ['5:4', 'A swag of roses, peonies and laurel leaves tied with trailing rose-pink silk ribbons, hanging in a gentle curve as if suspended from its two ends. No animal in this one: only the garland.'],
}

const SIZES = { '1:1': [1536, 1536], '4:5': [1536, 1920], '5:4': [1920, 1536] }

async function run(model, input) {
  const submit = await fetch(`${QUEUE}/${model}`, { method: 'POST', headers, body: JSON.stringify(input) })
  if (!submit.ok) throw new Error(`${model} ${submit.status}: ${(await submit.text()).slice(0, 300)}`)
  const job = await submit.json()
  for (let i = 0; i < 240; i++) {
    await new Promise((r) => setTimeout(r, 2500))
    const status = await (await fetch(job.status_url, { headers })).json()
    if (status.status === 'COMPLETED') break
    if (status.status === 'FAILED' || status.status === 'ERROR') throw new Error(`${model} failed: ${JSON.stringify(status).slice(0, 300)}`)
  }
  const result = await fetch(job.response_url, { headers })
  if (!result.ok) throw new Error(`${model} result ${result.status}: ${(await result.text()).slice(0, 300)}`)
  return result.json()
}

const styleRef = `data:image/jpeg;base64,${(await sharp(await readFile(STYLE_REF)).resize(1280).jpeg({ quality: 80 }).toBuffer()).toString('base64')}`

async function make(name) {
  const [aspect, description] = CHARACTERS[name]
  const [width, height] = SIZES[aspect]
  const painted = await run(PAINT_MODEL, {
    prompt: `Image 1: a painting, for style reference only.\n\n${STYLE}\n\nSubject: ${description}\n\n${ISOLATE}`,
    image_urls: [styleRef],
    num_images: 1,
    output_format: 'png',
    image_size: { width, height },
    quality: 'high',
  })
  const paintedUrl = painted.images?.[0]?.url
  if (!paintedUrl) throw new Error(`no image for ${name}`)

  const cut = await run(CUT_MODEL, { image_url: paintedUrl, model: 'General Use (Heavy)', operating_resolution: '2048x2048', output_format: 'png', refine_foreground: true })
  const cutUrl = cut.image?.url
  if (!cutUrl) throw new Error(`no cut-out for ${name}`)

  const png = Buffer.from(await (await fetch(cutUrl)).arrayBuffer())
  const trimmed = await sharp(png).trim({ threshold: 8 }).resize({ width: 1100, height: 1100, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86, alphaQuality: 90 }).toBuffer()
  await writeFile(path.join(OUT, `${name}.webp`), trimmed)
  const meta = await sharp(trimmed).metadata()
  console.log(`done ${name} ${meta.width}x${meta.height} ${(trimmed.length / 1024).toFixed(0)}KB`)
}

await mkdir(OUT, { recursive: true })
const asked = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const names = asked.length ? asked : Object.keys(CHARACTERS).filter((n) => !existsSync(path.join(OUT, `${n}.webp`)))
for (const n of names) if (!CHARACTERS[n]) throw new Error(`Unknown character "${n}". Options: ${Object.keys(CHARACTERS).join(', ')}`)

let failed = 0
const queue = [...names]
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const name = queue.shift()
      try {
        await make(name)
      } catch (error) {
        failed++
        console.error(`FAILED ${name}: ${error.message}`)
      }
    }
  })
)
if (failed) process.exitCode = 1

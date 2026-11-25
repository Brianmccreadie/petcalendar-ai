// Regenerate the site's sample images (public/previews) with the current
// prompts and image model, so they match what customers actually get — and
// carry the same no-text, no-logo rules.
//
// Each sample keeps its animal: the existing image is used as the identity
// reference and the theme's cover scene is generated around it.
//
//   npm run previews                      everything not yet done
//   npm run previews -- space-explorer    one theme (all three pet types)
//   npm run previews -- --force           redo images already regenerated
//
// Needs an image key (FAL_KEY, OPENAI_API_KEY or GOOGLE_GEMINI_API_KEY).
// Progress is tracked in scripts/.previews-done.json so a run can be resumed.
import { readFile, writeFile } from 'fs/promises'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { createJiti } from 'jiti'
import sharp from 'sharp'

// Smaller than print size: these are web thumbnails.
process.env.OPENAI_IMAGE_SIZE ||= '1536x1152'
process.env.GEMINI_IMAGE_SIZE ||= '1K'

const jiti = createJiti(import.meta.url)
const ai = await jiti.import('../lib/ai/index.ts')
const { getCoverPrompt, describeSubjects } = await jiti.import('../lib/prompts.ts')
const { CALENDAR_STYLES } = await jiti.import('../lib/types.ts')

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))
const concurrency = Number(process.env.PREVIEW_CONCURRENCY) || 5
const dir = path.resolve('public/previews')
const manifestPath = path.resolve('scripts/.previews-done.json')
const done = new Set(existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [])

const names = { dog: 'Buddy', cat: 'Luna', other: 'Kiwi' }
const jobs = []
for (const style of CALENDAR_STYLES) {
  if (only.length && !only.includes(style.id)) continue
  for (const petType of ['dog', 'cat', 'other']) {
    const file = `${style.id}-${petType}.jpg`
    if (done.has(file) && !force) continue
    jobs.push({ style: style.id, petType, file })
  }
}
// The hero image is the wizard sample used for social previews.
if ((!only.length || only.includes('hero')) && (force || !done.has('hero-1.jpg'))) {
  jobs.push({ style: 'wizarding-world', petType: 'dog', file: 'hero-1.jpg' })
}

console.log(`${jobs.length} images to generate with ${JSON.stringify(ai.describeImageConfig())}, ${concurrency} at a time`)
let finished = 0
const failures = []

async function run(job) {
  const subject = { name: names[job.petType], petType: job.petType }
  // A theme with no sample yet borrows the standard model pet of that kind as its reference.
  const own = path.join(dir, job.file)
  // Art-style themes always start from the photographic model pet, so an earlier render's style cannot leak in.
  const painted = Boolean(CALENDAR_STYLES.find((style) => style.id === job.style)?.medium)
  const reference = await readFile(existsSync(own) && !painted ? own : path.join(dir, `pet-photoshoot-${job.petType}.jpg`))
  const scene = getCoverPrompt(job.style, describeSubjects([subject]))
  const prompt =
    ai.buildScenePrompt(scene, [subject], undefined, job.style) +
    '\n\nThe reference shows the animal to depict. Keep that exact animal (species, breed, colouring, markings) but ignore the costume, props, signs and background in the reference — build the scene fresh from the brief above.'
  const image = await ai.generateImage({ prompt, references: [ai.petReference(subject, reference, 'image/jpeg')] })
  const out = await sharp(image.data).resize({ width: 1200 }).jpeg({ quality: 78, mozjpeg: true }).toBuffer()
  await writeFile(path.join(dir, job.file), out)
  done.add(job.file)
  await writeFile(manifestPath, JSON.stringify([...done].sort(), null, 1))
}

let cursor = 0
await Promise.all(
  Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++]
      try {
        await run(job)
        console.log(`[${++finished}/${jobs.length}] ${job.file}`)
      } catch (error) {
        failures.push(job.file)
        console.log(`[${++finished}/${jobs.length}] FAILED ${job.file}: ${error?.kind ?? ''} ${String(error?.message ?? error).slice(0, 160)}`)
      }
    }
  })
)
console.log(failures.length ? `Done with ${failures.length} failures: ${failures.join(', ')}` : 'Done.')

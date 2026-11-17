// Generate the showcase calendar used on the landing page: one pet, one theme,
// cover + twelve months — exactly what a customer receives.
//
//   npm run sample:year -- [styleId] [referenceImage] [name] [petType]
//   → public/year/cover.jpg, public/year/01.jpg … 12.jpg
import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { createJiti } from 'jiti'
import sharp from 'sharp'

process.env.OPENAI_IMAGE_SIZE ||= '1536x1152'
const jiti = createJiti(import.meta.url)
const ai = await jiti.import('../lib/ai/index.ts')
const { getCoverPrompt, getPromptForMonth, describeSubjects } = await jiti.import('../lib/prompts.ts')

const [style = 'around-the-world', ref = 'public/previews/pet-photoshoot-dog.jpg', name = 'Luna', petType = 'dog'] = process.argv
  .slice(2)
  .filter((a) => !a.startsWith('--'))
const force = process.argv.includes('--force')
const subject = { name, petType }
const reference = ai.petReference(subject, await readFile(ref), 'image/jpeg')
const dir = path.resolve('public/year')
await mkdir(dir, { recursive: true })

const pages = [{ file: 'cover.jpg', scene: getCoverPrompt(style, describeSubjects([subject])) }]
for (let m = 1; m <= 12; m++) {
  pages.push({ file: `${String(m).padStart(2, '0')}.jpg`, scene: getPromptForMonth(style, m, describeSubjects([subject])) })
}

let cursor = 0
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (cursor < pages.length) {
      const page = pages[cursor++]
      const out = path.join(dir, page.file)
      if (existsSync(out) && !force) continue
      try {
        const image = await ai.generateImage({ prompt: ai.buildScenePrompt(page.scene, [subject]), references: [reference] })
        await writeFile(out, await sharp(image.data).resize({ width: 1400 }).jpeg({ quality: 80, mozjpeg: true }).toBuffer())
        console.log('done', page.file)
      } catch (error) {
        console.log('FAILED', page.file, String(error?.message ?? error).slice(0, 160))
      }
    }
  })
)

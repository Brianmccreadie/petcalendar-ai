// Build sample print PDFs from the bundled preview images, so the layout can be
// checked (or uploaded to the printer's file validator) without generating anything.
//
//   npm run sample:print            → ./sample-print/{cover,interior}.pdf
//   npm run sample:print -- cat 2028 "Luna,Milo"
import { mkdir, readFile, writeFile } from 'fs/promises'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const { buildCoverPdf, buildInteriorPdf } = await jiti.import('../lib/print/pdf.ts')

const [petType = 'dog', year = String(new Date().getFullYear() + 1), names = 'Luna'] = process.argv.slice(2)
const styles = [
  'space-explorer', 'cozy-vibes', 'wizarding-world', 'garden-party', 'pet-photoshoot', 'tropical-paradise',
  'superhero-origin', 'camping-adventures', 'high-school-yearbook', 'horror-movie', 'royal-portrait', 'snow-day',
]
const read = (id) => readFile(new URL(`../public/previews/${id}-${petType}.jpg`, import.meta.url))

const input = {
  petNames: names.split(',').map((n) => n.trim()),
  styleName: 'Sampler',
  accentColor: '#c2410c',
  year: Number(year),
  cover: await read('pet-photoshoot'),
  months: await Promise.all(styles.map(read)),
}

await mkdir('sample-print', { recursive: true })
await writeFile('sample-print/cover.pdf', await buildCoverPdf(input))
await writeFile('sample-print/interior.pdf', await buildInteriorPdf(input))
console.log('Wrote sample-print/cover.pdf and sample-print/interior.pdf')

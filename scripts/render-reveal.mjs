// Render a calendar reveal film to MP4 with HyperFrames (HTML → video).
// Requires Node 22+ and FFmpeg; HyperFrames manages its own headless Chrome.
//
//   npm run render:reveal -- --sample                 bundled sample images
//   npm run render:reveal -- <projectId>              a real calendar (needs APP_URL)
//   npm run render:reveal -- --sample --project-only  write the project, skip rendering
//
// Output: ./reveal-out/<name>/index.html and ./reveal-out/<name>.mp4
import { execFileSync } from 'child_process'
import { copyFile, mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const { buildRevealComposition } = await jiti.import('../lib/reveal/composition.ts')

const args = process.argv.slice(2)
const sample = args.includes('--sample')
const projectOnly = args.includes('--project-only')
const projectId = args.find((a) => !a.startsWith('--'))
if (!sample && !projectId) {
  console.error('Usage: npm run render:reveal -- --sample | <projectId>')
  process.exit(1)
}

const name = sample ? 'sample' : projectId
const dir = path.resolve('reveal-out', name)
await mkdir(path.join(dir, 'assets'), { recursive: true })
for (const font of ['fraunces.woff2', 'dm-sans.woff2']) {
  await copyFile(path.resolve('public/fonts', font), path.join(dir, 'assets', font))
}
await copyFile(path.resolve('public/vendor/gsap.min.js'), path.join(dir, 'assets', 'gsap.min.js'))

let input
if (sample) {
  const ids = [
    'space-explorer', 'cozy-vibes', 'wizarding-world', 'garden-party', 'pet-photoshoot', 'tropical-paradise',
    'superhero-origin', 'camping-adventures', 'high-school-yearbook', 'horror-movie', 'royal-portrait', 'snow-day',
  ]
  for (const id of [...ids, 'mythical-quest']) {
    await copyFile(path.resolve(`public/previews/${id}-dog.jpg`), path.join(dir, 'assets', `${id}.jpg`))
  }
  input = {
    title: 'Luna’s ' + (new Date().getFullYear() + 1),
    subtitle: 'The Sampler edition',
    year: new Date().getFullYear() + 1,
    accent: '#e2512a',
    coverUrl: 'assets/mythical-quest.jpg',
    monthUrls: ids.map((id) => `assets/${id}.jpg`),
    fontBase: 'assets',
    gsapUrl: 'assets/gsap.min.js',
  }
} else {
  const base = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/reveal/${projectId}/composition?fonts=assets`)
  if (!res.ok) {
    console.error(`Could not load composition for ${projectId}: ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  await writeFile(path.join(dir, 'index.html'), await res.text())
}
if (input) await writeFile(path.join(dir, 'index.html'), buildRevealComposition(input))
console.log(`Wrote ${path.join(dir, 'index.html')}`)

if (!projectOnly) {
  const output = path.resolve('reveal-out', `${name}.mp4`)
  execFileSync('npx', ['--yes', 'hyperframes@0.9.58', 'render', dir, '-o', output, '-q', 'standard'], { stdio: 'inherit' })
  console.log(`Rendered ${output}`)
}

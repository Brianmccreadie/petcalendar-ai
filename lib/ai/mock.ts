import { readFile, readdir } from 'fs/promises'
import path from 'path'
import type { ImageProvider } from './types'

// IMAGE_PROVIDER=mock — returns bundled sample images instead of calling a model.
// For local development and end-to-end tests only: lets you run the whole flow
// (upload → generate → revise → checkout → print files) without spending anything.

let counter = 0

export const mockProvider: ImageProvider = {
  name: 'mock',
  models: ['mock-sample-images'],

  async generate(request) {
    const dir = path.join(process.cwd(), 'public', 'previews')
    const files = (await readdir(dir)).filter((f) => f.endsWith('-dog.jpg')).sort()
    await new Promise((resolve) => setTimeout(resolve, Number(process.env.MOCK_IMAGE_DELAY_MS) || 400))
    if (/MOCK_FAIL/.test(request.prompt)) throw new Error('mock failure requested')
    const file = files[counter++ % files.length]
    return { data: await readFile(path.join(dir, file)), mimeType: 'image/jpeg' }
  },
}

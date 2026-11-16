import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/create`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}

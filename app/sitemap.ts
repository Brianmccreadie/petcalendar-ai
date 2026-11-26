import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/config'

// Only the pages meant to be found in search. Calendars, orders and share
// links are personal and are kept out (see robots.ts and each page's metadata).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: SITE.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/create`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}

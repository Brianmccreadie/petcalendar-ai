import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: 'PetCalendar',
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f3ea',
    theme_color: '#0f2140',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}

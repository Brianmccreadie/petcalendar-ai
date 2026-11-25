import Footer from '@/components/Footer'
import CollageMotion from '@/components/landing/CollageMotion'
import { faqs } from '@/components/landing/FAQ'
import {
  AcademyWorld,
  CosmosWorld,
  CourtWorld,
  DeepWorld,
  HearthWorld,
  HeavensWorld,
  MuralWorld,
  VoyageWorld,
} from '@/components/landing/Worlds'
import { PRICING, SITE } from '@/lib/config'

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom pet wall calendar',
    description: SITE.description,
    image: `${SITE.url}/sample-bonnie/cover.jpg`,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      price: (PRICING.firstCopyCents / 100).toFixed(2),
      priceCurrency: PRICING.currency.toUpperCase(),
      availability: 'https://schema.org/InStock',
      url: `${SITE.url}/create`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <MuralWorld />
      <VoyageWorld />
      <CosmosWorld />
      <DeepWorld />
      <AcademyWorld />
      <CourtWorld />
      <HearthWorld />
      <HeavensWorld />
      <Footer />
      <CollageMotion />
    </>
  )
}

import Footer from '@/components/Footer'
import FAQ, { faqs } from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import ThemeGallery from '@/components/landing/ThemeGallery'
import ThemeMarquee from '@/components/landing/ThemeMarquee'
import TypesetSection from '@/components/landing/TypesetSection'
import { PRICING, SITE } from '@/lib/config'

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom pet wall calendar',
    description: SITE.description,
    image: `${SITE.url}/previews/hero-1.jpg`,
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
      <Hero />
      <ThemeMarquee />
      <HowItWorks />
      <ThemeGallery />
      <TypesetSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}

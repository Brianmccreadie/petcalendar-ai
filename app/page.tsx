import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import StylePicker from '@/components/StylePicker'
import PricingSection from '@/components/PricingSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <StylePicker showcase />
      <PricingSection />
      <FAQ />
      <Footer />
    </>
  )
}

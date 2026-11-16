import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="April 2026">
      <h2>Information We Collect</h2>
      <p>When you use PetCalendar.ai, we collect the photos you upload of your pets, your email address, and payment information necessary to process your order. We do not sell your personal information to third parties.</p>
      <h2>How We Use Your Information</h2>
      <p>Your photos are used solely to generate your personalized calendar images using AI. Payment information is processed securely through Stripe. We may use your email to send order updates and, with your consent, occasional product updates.</p>
      <h2>Photo Storage</h2>
      <p>Your uploaded photos and generated calendar images are stored securely in the cloud. You may request deletion of your data at any time by contacting us at hello@petcalendar.ai.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies to maintain your session during the calendar creation process. We do not use tracking cookies for advertising purposes.</p>
      <h2>Contact</h2>
      <p>If you have questions about this privacy policy, please contact us at <a href="mailto:hello@petcalendar.ai">hello@petcalendar.ai</a>.</p>
    </LegalPage>
  )
}

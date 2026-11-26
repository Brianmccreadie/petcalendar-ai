import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Terms of Service', alternates: { canonical: '/terms' } }

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="April 2026">
      <h2>Acceptance of Terms</h2>
      <p>By using PetCalendar.ai, you agree to these terms of service. If you do not agree, please do not use our service.</p>
      <h2>Service Description</h2>
      <p>PetCalendar.ai uses AI to generate personalized pet calendar images based on photos you upload. We print and ship physical calendars to your specified address.</p>
      <h2>Your Content</h2>
      <p>You retain ownership of photos you upload. By uploading photos, you grant us a limited license to process them through our AI system for the sole purpose of creating your calendar. You represent that you have the right to upload any photos you submit.</p>
      <h2>Payments & Refunds</h2>
      <p>All payments are processed securely through Stripe. If you are not satisfied with your calendar, please contact us within 30 days of delivery and we will work to make it right.</p>
      <h2>AI-Generated Content</h2>
      <p>AI-generated images may not be perfect representations of your pet. You have the ability to regenerate images before ordering. Once an order is placed and printing begins, modifications cannot be made.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Contact us at <a href="mailto:hello@petcalendar.ai">hello@petcalendar.ai</a>.</p>
    </LegalPage>
  )
}

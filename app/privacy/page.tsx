import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <div className="min-h-screen bg-[var(--alabaster)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ebony)] mb-8 capitalize">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none text-[var(--wenge)] space-y-6">
            <p className="font-medium">Last updated: April 2026</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Information We Collect</h2>
            <p>When you use PetCalendar.ai, we collect the photos you upload of your pets, your email address, and payment information necessary to process your order. We do not sell your personal information to third parties.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">How We Use Your Information</h2>
            <p>Your photos are used solely to generate your personalized calendar images using AI. Payment information is processed securely through Stripe. We may use your email to send order updates and, with your consent, occasional product updates.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Photo Storage</h2>
            <p>Your uploaded photos and generated calendar images are stored securely in the cloud. You may request deletion of your data at any time by contacting us at hello@petcalendar.ai.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Cookies</h2>
            <p>We use essential cookies to maintain your session during the calendar creation process. We do not use tracking cookies for advertising purposes.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Contact</h2>
            <p>If you have questions about this privacy policy, please contact us at <a href="mailto:hello@petcalendar.ai" className="text-[var(--purple)] font-semibold hover:underline">hello@petcalendar.ai</a>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

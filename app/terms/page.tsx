import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-[var(--alabaster)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ebony)] mb-8 capitalize">
            Terms of Service
          </h1>
          <div className="prose prose-lg max-w-none text-[var(--wenge)] space-y-6">
            <p className="font-medium">Last updated: April 2026</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Acceptance of Terms</h2>
            <p>By using PetCalendar.ai, you agree to these terms of service. If you do not agree, please do not use our service.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Service Description</h2>
            <p>PetCalendar.ai uses AI to generate personalized pet calendar images based on photos you upload. We print and ship physical calendars to your specified address.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Your Content</h2>
            <p>You retain ownership of photos you upload. By uploading photos, you grant us a limited license to process them through our AI system for the sole purpose of creating your calendar. You represent that you have the right to upload any photos you submit.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Payments & Refunds</h2>
            <p>All payments are processed securely through Stripe. If you are not satisfied with your calendar, please contact us within 30 days of delivery and we will work to make it right.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">AI-Generated Content</h2>
            <p>AI-generated images may not be perfect representations of your pet. You have the ability to regenerate images before ordering. Once an order is placed and printing begins, modifications cannot be made.</p>

            <h2 className="text-xl font-bold text-[var(--ebony)] mt-8">Contact</h2>
            <p>Questions about these terms? Contact us at <a href="mailto:hello@petcalendar.ai" className="text-[var(--purple)] font-semibold hover:underline">hello@petcalendar.ai</a>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

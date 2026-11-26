import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { SITE } from '@/lib/config'

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } }

export default function PrivacyPage() {
  const email = <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
  return (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <p>
        This policy explains what {SITE.name} collects when you make a calendar, who we share it with, and the choices you have.
        {SITE.legalName && <> {SITE.name} is operated by {SITE.legalName}{SITE.legalAddress && <>, {SITE.legalAddress}</>}.</>}
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Photos you upload</strong> of your pets, and the pet names and kind of pet you enter.</li>
        <li><strong>The artwork we make for you</strong>, including earlier versions of a page and any change notes you type.</li>
        <li><strong>Order details</strong> when you buy: your name, email address, shipping address and phone number. These are entered on Stripe’s checkout page.</li>
        <li><strong>Basic technical data</strong> such as your IP address and browser type, which our hosting provider logs to run and protect the site. We keep a scrambled (hashed) form of your IP address to limit how many calendars can be started in a day.</li>
      </ul>
      <p>We never see or store your card number. Payment is handled entirely by Stripe.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To create your calendar artwork from your photos.</li>
        <li>To print and deliver your order and send you order and shipping updates.</li>
        <li>To answer your questions and fix problems.</li>
        <li>To prevent abuse of the free preview.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use your photos to advertise to you. We do not train AI models on your photos.</p>

      <h2>Who we share it with</h2>
      <p>We use a small number of service providers, and share only what each needs to do its job:</p>
      <ul>
        <li><strong>AI image generation</strong> (fal.ai, running image models from OpenAI and Google): your pet photos and the scene description, to create the artwork.</li>
        <li><strong>Stripe</strong>: payment and checkout details.</li>
        <li><strong>Lulu Press</strong>: your print files, name, shipping address and phone number, to print and ship your calendar.</li>
        <li><strong>Supabase</strong>: storage of your photos, artwork and order records.</li>
        <li><strong>Vercel</strong>: website hosting.</li>
        <li><strong>Our email provider</strong>: your email address, to send order updates.</li>
      </ul>
      <p>We may also disclose information when the law requires it.</p>

      <h2>Links to your calendar</h2>
      <p>
        Your photos and artwork are stored at long, unguessable web addresses rather than behind a login, and your calendar has
        its own private link. Anyone who has one of these links can view what it points to, so share them only with people you
        want to see your calendar. The share link we give you shows the finished calendar and the photos it was made from.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your photos, artwork and calendar so you can come back, reorder or request a reprint. We keep order records for
        as long as tax and accounting rules require. You can ask us to delete your photos and artwork at any time.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        We do not set cookies and we do not use advertising or analytics trackers. To show “My calendars” without an account, the
        site saves a short list of your calendars in your own browser’s storage; clearing your browser data removes it. Stripe sets
        its own cookies on its checkout page.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it.
        Depending on where you live (for example California, and other US states with privacy laws), you may have a legal right to
        these requests, and we will not treat you differently for making one. Email {email} from the address you ordered with, or
        include your calendar link, and we will respond within 30 days.
      </p>

      <h2>Children</h2>
      <p>The site is for adults. We do not knowingly collect personal information from children under 13. Please upload photos of pets, not people.</p>

      <h2>Where we operate</h2>
      <p>We are based in the United States and our service providers process data in the United States and other countries.</p>

      <h2>Changes</h2>
      <p>If we change this policy we will update the date above. Significant changes will be noted on the site.</p>

      <h2>Contact</h2>
      <p>Questions about this policy or your data: {email}.</p>
    </LegalPage>
  )
}

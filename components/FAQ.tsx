'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'How many photos do I need to upload?',
    answer:
      'We recommend 3–5 clear photos of your pet from different angles. More variety helps the AI capture your pet\'s unique features — front, side, and playful shots work best.',
  },
  {
    question: 'How long does it take to generate my calendar?',
    answer:
      'AI generation typically takes 2–5 minutes for all 12 months plus the cover. You can preview each page and regenerate any month you\'re not happy with (up to 3 times per month).',
  },
  {
    question: 'What art styles are available?',
    answer:
      'We offer 10 stunning styles: Watercolor, Oil Painting, Pop Art, Cartoon, Vintage Illustration, Minimalist Line Art, Stained Glass, Japanese Woodblock, Botanical, and Cozy Seasons. Each style transforms your pet into a unique monthly masterpiece.',
  },
  {
    question: 'Can I choose which month my calendar starts?',
    answer:
      'Yes! You can select any starting month and year. Perfect for creating a calendar that starts on a birthday, anniversary, or any month you like.',
  },
  {
    question: 'What is the print quality like?',
    answer:
      'Calendars are printed on premium thick matte paper at 300+ DPI for sharp, vivid images. They\'re standard wall calendar size — perfect for hanging at home or giving as a gift.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Production takes 3–5 business days, and standard shipping within the US is 5–7 business days. Shipping is free! You\'ll receive tracking information once your calendar ships.',
  },
  {
    question: 'Can I order multiple copies?',
    answer:
      'Absolutely! Your first calendar is $39.99, and additional copies of the same calendar are just $29.99 each — perfect for gifts.',
  },
  {
    question: 'What if I\'m not happy with the result?',
    answer:
      'You can regenerate any month up to 3 times before ordering. If you\'re still not satisfied after receiving your calendar, contact us and we\'ll make it right.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#FFFBF5] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-purple-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

const faqs = [
  {
    emoji: '📸',
    question: 'How many photos do I need?',
    answer:
      'We recommend 3-5 clear photos of your pet from different angles. Front, side, and full body shots help our AI capture their unique look.',
  },
  {
    emoji: '🐾',
    question: 'What pets work best?',
    answer:
      'Dogs and cats produce the best results, but our AI works great with rabbits, hamsters, birds, and other pets too. The clearer the photos, the better the outcome.',
  },
  {
    emoji: '🔄',
    question: 'Can I change individual months?',
    answer:
      'Yes! After generation, you can preview every month and regenerate any page you\'re not happy with — up to 3 times per month, completely free.',
  },
  {
    emoji: '📦',
    question: 'How long does shipping take?',
    answer:
      'Production takes 3-5 business days, and standard shipping within the US is 5-7 business days. Shipping is free! You\'ll receive tracking information once your calendar ships.',
  },
  {
    emoji: '🎁',
    question: 'Can I order multiple copies?',
    answer:
      'Absolutely! Your first calendar is $39.99, and additional copies of the same design are just $29.99 each — perfect for gifts.',
  },
  {
    emoji: '✨',
    question: 'What paper quality is used?',
    answer:
      'Calendars are printed on premium 100# glossy paper with Wire-O binding. Standard wall calendar size (11x8.5") — perfect for hanging at home or gifting.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="section bg-[var(--alabaster)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
            <span className="top-title">
              <span className="light-color">Pet Calendar</span> FAQ
            </span>
          </div>
          <h2 className="section-heading mx-auto text-center max-w-[600px]">
            Got Questions? We&apos;ve Got Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`overflow-hidden transition-all duration-300 rounded-2xl ${
                  isOpen
                    ? 'bg-white shadow-md border-2 border-[var(--purple)]/15'
                    : 'bg-white border-2 border-transparent hover:border-[var(--purple)]/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-[var(--ebony)] pr-4 flex items-center gap-3">
                    <span className="text-lg">{faq.emoji}</span>
                    {faq.question}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[var(--purple)] text-white rotate-45'
                        : 'bg-[var(--purple)]/8 text-[var(--ebony)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-[var(--wenge)] leading-relaxed pl-[3.25rem] font-medium">
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

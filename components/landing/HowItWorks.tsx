import Reveal from '@/components/Reveal'

const steps = [
  {
    title: 'Show us who they are',
    body: 'Three to five clear photos — face, profile, full body. Have more than one pet? They can share the year or star together.',
  },
  {
    title: 'Choose their world',
    body: 'Fifty themes, each with its own scene for every month: a January that feels like January, a December that feels like the holidays.',
  },
  {
    title: 'Direct the final cut',
    body: 'Review the cover and all twelve months. Redo a page, ask for a change, keep the version you love. Then we print and ship.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-rule bg-card">
      <div className="mx-auto max-w-[84rem] px-5 py-28 sm:px-8 lg:py-36">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
            From camera roll to wall, in <span className="display-italic">three</span> steps.
          </h2>
        </Reveal>

        <ol className="mt-16 lg:mt-20">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-rule last:border-b">
              <Reveal delay={i * 80}>
                <div className="grid gap-4 py-9 md:grid-cols-[8rem_1fr_1.1fr] md:items-baseline md:gap-10 lg:py-12">
                  <span className="display-italic text-5xl text-gold-deep lg:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-4xl leading-none lg:text-5xl">{step.title}</h3>
                  <p className="max-w-md text-ink-soft">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

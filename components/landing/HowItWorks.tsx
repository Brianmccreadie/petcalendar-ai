import Image from 'next/image'

const steps = [
  {
    title: 'Upload a few photos',
    body: 'Three to five clear shots work best — face, side, full body. More than one pet? Add them all.',
    image: '/previews/pet-photoshoot-dog.jpg',
    alt: 'A dog posing for a photo shoot',
  },
  {
    title: 'Pick a theme',
    body: 'Fifty to choose from. Every theme has its own scene for each month, from New Year to the holidays.',
    image: '/previews/wizarding-world-dog.jpg',
    alt: 'A dog dressed as a wizard',
  },
  {
    title: 'Review, tweak, order',
    body: 'See all twelve months and the cover. Redo any page or ask for changes, then we print and ship it.',
    image: '/previews/holiday-card-dog.jpg',
    alt: 'A dog in a festive holiday scene',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="max-w-2xl">
        <p className="eyebrow">How it works</p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">From camera roll to wall in three steps.</h2>
      </div>

      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => (
          <li key={step.title} className="group">
            <div className="relative overflow-hidden rounded-[4px]">
              <Image
                src={step.image}
                alt={step.alt}
                width={720}
                height={480}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="display absolute left-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-paper text-2xl">
                {i + 1}
              </span>
            </div>
            <h3 className="display mt-6 text-2xl">{step.title}</h3>
            <p className="mt-2 text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

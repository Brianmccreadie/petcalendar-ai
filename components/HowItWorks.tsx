const steps = [
  {
    number: 1,
    emoji: '📸',
    title: 'Upload Photos',
    description: 'Upload 3-5 photos of your pet from any angle',
  },
  {
    number: 2,
    emoji: '🎨',
    title: 'Pick a Style',
    description: 'Choose from 10 gorgeous art styles — watercolor, pop art, cartoon, and more',
  },
  {
    number: 3,
    emoji: '✨',
    title: 'AI Creates Your Calendar',
    description: 'Our AI transforms your pet into 12 stunning monthly artworks',
  },
  {
    number: 4,
    emoji: '📦',
    title: 'We Print & Ship It',
    description: 'Premium wall calendar, printed on thick glossy paper, delivered to your door',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            It&apos;s Stupidly Simple
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Four steps. Five minutes. One amazing calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Large number */}
              <span className="text-6xl font-black text-[#7C3AED]/10">
                {step.number}
              </span>

              {/* Emoji */}
              <div className="mt-2 text-4xl">{step.emoji}</div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

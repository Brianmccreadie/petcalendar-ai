const steps = [
  {
    number: 1,
    emoji: '📸',
    title: 'Snap',
    description: 'Upload 3-5 photos of your pet',
    bg: 'bg-[#FFF0E8]',
    numColor: 'text-[#FF6B35]',
    ringColor: 'bg-[#FF6B35]',
  },
  {
    number: 2,
    emoji: '🎨',
    title: 'Style',
    description: 'Pick from 10 gorgeous art styles',
    bg: 'bg-[#FFF8E8]',
    numColor: 'text-[#FFD166]',
    ringColor: 'bg-[#FFD166]',
  },
  {
    number: 3,
    emoji: '✨',
    title: 'Magic',
    description: 'AI creates 12 monthly masterpieces',
    bg: 'bg-[#E8FFF7]',
    numColor: 'text-[#06D6A0]',
    ringColor: 'bg-[#06D6A0]',
  },
  {
    number: 4,
    emoji: '📬',
    title: 'Delivered',
    description: 'Printed on premium paper, shipped free',
    bg: 'bg-[#F3EEFF]',
    numColor: 'text-[#7C3AED]',
    ringColor: 'bg-[#7C3AED]',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
            So Easy, Even Your Dog Could Do It 🐕
          </h2>
          <p className="mt-4 text-lg text-[#2D1B69]/60">
            Four steps. Five minutes. One amazing calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center">
              {/* Dotted connector (not on last card) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] dotted-connector" />
              )}

              <div
                className={`${step.bg} rounded-3xl p-8 text-center w-full hover-wiggle transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative z-10`}
              >
                {/* Number circle */}
                <div
                  className={`${step.ringColor} w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold mx-auto mb-4 shadow-md`}
                >
                  {step.number}
                </div>

                {/* Emoji */}
                <div className="text-5xl mb-3">{step.emoji}</div>

                {/* Content */}
                <h3 className="text-xl font-extrabold text-[#2D1B69]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#2D1B69]/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

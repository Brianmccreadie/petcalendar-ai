const steps = [
  {
    number: 1,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Upload Photos',
    description: 'Snap 3-5 photos of your pet from different angles',
    color: '#FF6B35',
  },
  {
    number: 2,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Pick a Style',
    description: '50 fun themes — from Wizarding World to Pirate Life',
    color: '#FFD166',
  },
  {
    number: 3,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'AI Magic',
    description: 'We generate 12 unique monthly images of your pet',
    color: '#06D6A0',
  },
  {
    number: 4,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: 'Delivered',
    description: 'Printed on premium paper & shipped free to your door',
    color: '#7C3AED',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FFFBF5] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#2D1B69]">
            How It Works 🐾
          </h2>
          <p className="mt-4 text-lg text-[#2D1B69]/50 max-w-md mx-auto">
            Four steps. Five minutes. One calendar your fridge will be proud of.
          </p>
        </div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] bg-gradient-to-r from-[#FF6B35]/30 via-[#06D6A0]/30 to-[#7C3AED]/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                {/* Number + Icon circle */}
                <div
                  className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                    border: `2px solid ${step.color}50`,
                  }}
                >
                  <div style={{ color: step.color }}>{step.icon}</div>
                  {/* Number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-[#2D1B69] mb-1">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-[#2D1B69]/50 leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

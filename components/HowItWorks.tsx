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
  },
]

function BoneDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="24" height="6" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="9" cy="5" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="9" cy="17" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="35" cy="5" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="35" cy="17" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    </svg>
  )
}

function PawDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="3.5" fill="currentColor"/>
      <circle cx="22" cy="6" r="3.5" fill="currentColor"/>
      <circle cx="5" cy="14" r="3" fill="currentColor"/>
      <circle cx="27" cy="14" r="3" fill="currentColor"/>
      <ellipse cx="16" cy="22" rx="7" ry="6" fill="currentColor"/>
    </svg>
  )
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#F5EDE8] py-20 sm:py-28">
      {/* Decorative doodles — black */}
      <BoneDoodle className="absolute top-12 right-[10%] text-black w-12 h-6 rotate-[20deg] animate-doodle" />
      <PawDoodle className="absolute bottom-16 left-[8%] text-black w-7 h-7 rotate-[-10deg] animate-doodle" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-playful text-3xl sm:text-5xl font-extrabold text-[#1A1A2E]">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-[#1A1A2E]/50 max-w-md mx-auto">
            Four steps. Five minutes. One calendar your fridge will be proud of.
          </p>
        </div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[3px] border-t-[3px] border-dashed border-[#1A1A2E]/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                {/* Number + Icon circle */}
                <div
                  className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl bg-[#D4E8F7] border-3 border-[#1A1A2E]"
                >
                  <div className="text-[#1A1A2E]">{step.icon}</div>
                  {/* Number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md bg-[#1A1A2E]"
                  >
                    {step.number}
                  </div>
                </div>

                {/* Title */}
                <h3 className="heading-playful text-lg font-extrabold text-[#1A1A2E] mb-1">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-[#1A1A2E]/50 leading-relaxed max-w-[200px]">
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

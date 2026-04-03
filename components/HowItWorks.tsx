import Image from 'next/image'

const steps = [
  {
    number: 1,
    icon: '📸',
    title: 'Upload Photos',
    description: 'Snap 3-5 photos of your pet from different angles',
    svgIcon: '/webflow/Choose-Us-icon1.svg',
  },
  {
    number: 2,
    icon: '🎨',
    title: 'Pick a Style',
    description: '50 fun themes — from Wizarding World to Pirate Life',
    svgIcon: '/webflow/Choose-Us-icon2.svg',
  },
  {
    number: 3,
    icon: '✨',
    title: 'AI Magic',
    description: 'We generate 12 unique monthly images of your pet',
    svgIcon: '/webflow/Choose-Us-icon3.svg',
  },
  {
    number: 4,
    icon: '📦',
    title: 'Delivered',
    description: 'Printed on premium paper & shipped free to your door',
    svgIcon: '/webflow/Choose-Us-icon4.svg',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section relative" style={{
      backgroundImage: 'url(/webflow/Choose-Us-Bg.png)',
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.14fr] gap-8 lg:gap-12 items-start">
          {/* Left: Section title */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Image src="/webflow/Bonepna_1Bonepna.png" alt="" width={24} height={24} />
              <span className="top-title">
                <span className="light-color">Pet Calendar</span> how it works
              </span>
            </div>
            <h2 className="section-heading max-w-[440px]">
              Four steps to your perfect pet calendar.
            </h2>
            <p className="section-details max-w-[457px] mb-8">
              Four steps. Five minutes. One calendar your fridge will be proud of.
            </p>
          </div>

          {/* Right: Step cards in 2x2 grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {steps.map((step) => (
              <div key={step.number} className="choose-card bg-white">
                <div className="choose-icon-wrap">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="choose-card-title">{step.title}</h3>
                <p className="choose-card-desc">{step.description}</p>
                {/* Background overlay image for hover state */}
                <Image
                  src="/webflow/Single-Bg.png"
                  alt=""
                  fill
                  className="object-cover opacity-0 transition-opacity duration-400 pointer-events-none"
                  style={{ zIndex: -1 }}
                  sizes="400px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

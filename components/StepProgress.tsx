const steps = [
  { label: 'Upload', color: 'bg-[var(--purple)]', ring: 'ring-[var(--purple)]/30' },
  { label: 'Style', color: 'bg-[var(--green)]', ring: 'ring-[var(--green)]/30' },
  { label: 'Magic', color: 'bg-[var(--yellow)]', ring: 'ring-[var(--yellow)]/30' },
  { label: 'Order', color: 'bg-[var(--purple)]', ring: 'ring-[var(--purple)]/30' },
]

interface StepProgressProps {
  currentStep: number // 1-based
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isComplete = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isFuture = stepNum > currentStep

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isComplete
                      ? `${step.color} text-white shadow-md`
                      : isCurrent
                        ? `${step.color} text-white ${step.ring} ring-4 animate-pulse-glow shadow-lg`
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isComplete ? (
                    <span className="text-lg">🐾</span>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-bold tracking-wide ${
                    isFuture ? 'text-gray-400' : 'text-[var(--ebony)]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {stepNum < steps.length && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-1 w-full rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-gradient-to-r from-[var(--purple)] to-[var(--green)]'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

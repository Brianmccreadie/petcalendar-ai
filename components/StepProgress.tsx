const steps = [
  { label: 'Snap', color: 'bg-[#FF6B35]', ring: 'ring-[#A8D4F0]/30' },
  { label: 'Style', color: 'bg-[#FFD166]', ring: 'ring-[#FFD166]/30' },
  { label: 'Magic', color: 'bg-[#06D6A0]', ring: 'ring-[#06D6A0]/30' },
  { label: 'Order', color: 'bg-[#7C3AED]', ring: 'ring-[#7C3AED]/30' },
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
                    isFuture ? 'text-gray-400' : 'text-[#1A1A2E]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Connecting line */}
              {stepNum < steps.length && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-1 w-full rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD166]'
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

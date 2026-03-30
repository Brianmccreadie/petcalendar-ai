const steps = ['Upload', 'Style', 'Review', 'Order']

interface StepProgressProps {
  currentStep: number // 1-based
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isComplete = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isFuture = stepNum > currentStep

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isComplete
                      ? 'bg-[#7C3AED] text-white'
                      : isCurrent
                        ? 'bg-[#7C3AED] text-white ring-4 ring-purple-200'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isFuture ? 'text-gray-400' : 'text-[#7C3AED]'
                  }`}
                >
                  {label}
                </span>
              </div>
              {/* Connecting line */}
              {stepNum < steps.length && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-0.5 w-full ${
                      isComplete ? 'bg-[#7C3AED]' : 'bg-gray-200'
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

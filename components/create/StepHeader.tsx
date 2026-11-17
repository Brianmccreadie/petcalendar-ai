import { Check } from '@/components/icons'

const steps = ['Photos', 'Theme', 'Review', 'Order']

export default function StepHeader({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="mx-auto mb-10 flex max-w-xl items-center" aria-label="Progress">
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? 'step' : undefined}>
            <span className="flex flex-col items-center gap-1.5">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border-[1.5px] text-sm font-bold transition-colors ${
                  done
                    ? 'border-ink bg-ink text-ivory'
                    : active
                      ? 'border-ink bg-ink text-paper'
                      : 'border-rule bg-card text-muted'
                }`}
              >
                {done ? <Check size={16} strokeWidth={3} /> : n}
              </span>
              <span className={`text-xs font-bold ${active || done ? 'text-ink' : 'text-muted'}`}>{label}</span>
            </span>
            {n < steps.length && <span aria-hidden="true" className={`mx-2 mb-5 h-[1.5px] flex-1 ${done ? 'bg-ink' : 'bg-rule'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

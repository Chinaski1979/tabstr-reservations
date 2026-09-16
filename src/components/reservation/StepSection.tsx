import type { ReactNode } from "react"

interface StepSectionProps {
  step: number
  title: string
  hint?: string
  children: ReactNode
}

export function StepSection({ step, title, hint, children }: StepSectionProps) {
  return (
    <section className="border-t border-border pt-7 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-baseline gap-3">
        <span className="w-3 shrink-0 text-xs text-muted-foreground tabular-nums">
          {step}
        </span>
        <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="serif-heading text-lg">{title}</h2>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

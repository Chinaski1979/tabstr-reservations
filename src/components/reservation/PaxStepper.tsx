import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/i18n/useLocale"
import { formatPaxLabel } from "@/lib/format"

interface PaxStepperProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function PaxStepper({
  value,
  min = 1,
  max = 20,
  onChange,
}: PaxStepperProps) {
  const { t } = useLocale()

  return (
    <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">{t("pax.hint")}</p>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon-lg"
          className="size-11 rounded-full"
          aria-label={t("pax.decrease")}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus />
        </Button>
        <span
          aria-live="polite"
          className="min-w-24 px-1 text-center text-sm font-medium tabular-nums"
        >
          {formatPaxLabel(value, t)}
        </span>
        <Button
          variant="outline"
          size="icon-lg"
          className="size-11 rounded-full"
          aria-label={t("pax.increase")}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}

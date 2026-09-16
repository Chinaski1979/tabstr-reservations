import { formatDatePart } from "@/lib/datetime"
import { useLocale } from "@/i18n/useLocale"
import { cn } from "@/lib/utils"

interface DateStripProps {
  dates: string[]
  today: string
  selectedDate: string | null
  onSelect: (date: string) => void
}

export function DateStrip({
  dates,
  today,
  selectedDate,
  onSelect,
}: DateStripProps) {
  const { t, intlLocale } = useLocale()

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 py-1">
        {dates.map((date) => {
          const isSelected = date === selectedDate
          return (
            <button
              key={date}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(date)}
              className={cn(
                "flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              <span className="text-[0.625rem] tracking-[0.12em] uppercase opacity-70">
                {date === today
                  ? t("date.today")
                  : shortPart(date, "weekday", intlLocale)}
              </span>
              <span className="serif-heading text-xl leading-none tabular-nums">
                {formatDatePart(date, { day: "numeric" }, intlLocale)}
              </span>
              <span className="text-[0.625rem] tracking-[0.12em] uppercase opacity-70">
                {shortPart(date, "month", intlLocale)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function shortPart(
  date: string,
  part: "weekday" | "month",
  locale: string
): string {
  return formatDatePart(date, { [part]: "short" }, locale).replace(".", "")
}

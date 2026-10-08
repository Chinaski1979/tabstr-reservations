import { formatDatePart, formatLongDate } from "@/lib/datetime"
import { useLocale } from "@/i18n/useLocale"
import { cn } from "@/lib/utils"

interface DateStripProps {
  dates: string[]
  today: string
  selectedDate: string | null
  /** Local dates `YYYY-MM-DD` the restaurant is closed. */
  closedDates: ReadonlySet<string>
  onSelect: (date: string) => void
}

export function DateStrip({
  dates,
  today,
  selectedDate,
  closedDates,
  onSelect,
}: DateStripProps) {
  const { t, intlLocale } = useLocale()

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 py-1">
        {dates.map((date) => {
          const isSelected = date === selectedDate
          const isClosed = closedDates.has(date)
          return (
            <button
              key={date}
              type="button"
              disabled={isClosed}
              aria-pressed={isSelected}
              aria-disabled={isClosed || undefined}
              aria-label={
                isClosed
                  ? `${formatLongDate(date, intlLocale)} · ${t("date.closed")}`
                  : undefined
              }
              onClick={() => onSelect(date)}
              className={cn(
                "flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                isClosed
                  ? "cursor-not-allowed border-border/40 bg-muted/30 text-muted-foreground/40"
                  : isSelected
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
                {isClosed
                  ? t("date.closed")
                  : shortPart(date, "month", intlLocale)}
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

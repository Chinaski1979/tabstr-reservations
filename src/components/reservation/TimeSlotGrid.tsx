import type { ReactNode } from "react"

import { useLocale } from "@/i18n/useLocale"
import type { DaySlot } from "@/lib/slots"
import { isSlotOpen } from "@/lib/slots"
import { cn } from "@/lib/utils"

interface TimeSlotGridProps {
  slots: DaySlot[]
  selectedSlot: string | null
  onSelect: (startsAt: string) => void
}

export function TimeSlotGrid({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotGridProps) {
  const { t } = useLocale()
  const upcoming = slots.filter((slot) => slot.blockedReason !== "past")

  if (upcoming.length === 0) {
    return <SlotsNotice>{t("slots.empty")}</SlotsNotice>
  }

  if (!upcoming.some(isSlotOpen)) {
    return <SlotsNotice>{t("slots.fullDay")}</SlotsNotice>
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {upcoming.map((slot) => (
        <button
          key={slot.startsAt}
          type="button"
          disabled={!isSlotOpen(slot)}
          aria-pressed={slot.startsAt === selectedSlot}
          onClick={() => onSelect(slot.startsAt)}
          className={cn(
            "flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-medium tabular-nums transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            slot.startsAt === selectedSlot
              ? "border-primary bg-primary text-primary-foreground"
              : isSlotOpen(slot)
                ? "border-border bg-card hover:bg-muted"
                : "cursor-not-allowed border-border/50 bg-transparent text-muted-foreground/50"
          )}
        >
          <span>{slot.label}</span>
          <SlotHint slot={slot} />
        </button>
      ))}
    </div>
  )
}

function SlotsNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  )
}

function SlotHint({ slot }: { slot: DaySlot }) {
  const { t } = useLocale()

  if (slot.blockedReason === "full") {
    return (
      <span className="text-[0.625rem] font-normal">
        {t("slots.noRemaining")}
      </span>
    )
  }
  if (slot.blockedReason === "insufficient") {
    return (
      <span className="text-[0.625rem] font-normal">
        {t("slots.remaining", { count: slot.remaining ?? 0 })}
      </span>
    )
  }
  return null
}

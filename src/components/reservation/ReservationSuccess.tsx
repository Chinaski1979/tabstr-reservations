import { Check } from "lucide-react"

import { OrganizationLogo } from "@/components/reservation/OrganizationLogo"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/i18n/useLocale"
import {
  formatInstantTime,
  formatLongDate,
  toZonedDateTime,
} from "@/lib/datetime"
import { formatPaxLabel } from "@/lib/format"
import type { CreateReservationResponse } from "@/types/reservations"

interface ReservationSuccessProps {
  reservation: CreateReservationResponse
  organizationName: string
  imageUrl: string | null
  timezone: string
  onBookAnother: () => void
}

export function ReservationSuccess({
  reservation,
  organizationName,
  imageUrl,
  timezone,
  onBookAnother,
}: ReservationSuccessProps) {
  const { t, intlLocale } = useLocale()
  const instant = new Date(reservation.startsAt)
  const date = formatLongDate(
    toZonedDateTime(instant, timezone).date,
    intlLocale
  )
  const time = formatInstantTime(reservation.startsAt, timezone, intlLocale)

  return (
    <section className="my-auto py-6 animate-in fade-in duration-200">
      <div className="flex flex-col items-center text-center">
        <OrganizationLogo src={imageUrl} className="size-25" />
        <h1 className="serif-display mt-6 text-3xl sm:text-4xl">
          {t("success.title")}
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {t("success.waiting", {
            name: reservation.customerName,
            restaurant: organizationName,
          })}
        </p>
      </div>

      <dl className="mt-9 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        <SummaryRow term={t("success.date")} description={date} />
        <SummaryRow term={t("success.time")} description={time} />
        <SummaryRow
          term={t("success.pax")}
          description={formatPaxLabel(reservation.pax, t)}
        />
      </dl>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        {t("success.hint")}
      </p>

      <Button
        variant="outline"
        size="lg"
        className="mt-8 h-12 w-full text-base"
        onClick={onBookAnother}
      >
        {t("success.another")}
      </Button>
    </section>
  )
}

function SummaryRow({
  term,
  description,
}: {
  term: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="font-medium">{description}</dd>
    </div>
  )
}

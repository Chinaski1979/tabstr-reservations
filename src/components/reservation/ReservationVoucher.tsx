import type { Ref } from "react"

import { OrganizationLogo } from "@/components/reservation/OrganizationLogo"
import { useLocale } from "@/i18n/useLocale"
import { formatPaxLabel } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { CreateReservationResponse } from "@/types/reservations"

interface ReservationVoucherProps {
  reservation: CreateReservationResponse
  organizationName: string
  imageUrl: string | null
  date: string
  time: string
  ref?: Ref<HTMLElement>
}

export function ReservationVoucher({
  reservation,
  organizationName,
  imageUrl,
  date,
  time,
  ref,
}: ReservationVoucherProps) {
  const { t } = useLocale()

  return (
    <div className="mx-auto w-full max-w-md">
      <article
        ref={ref}
        className="w-full rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col items-center text-center">
          <OrganizationLogo src={imageUrl} className="size-25" />
          <h1 className="serif-display mt-6 text-3xl sm:text-4xl">
            {t("success.title")}
          </h1>
          <p className="mt-2 text-sm font-medium">{organizationName}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("success.waiting", {
              name: reservation.customerName,
              restaurant: organizationName,
            })}
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border text-sm">
          <SummaryRow term={t("success.date")} description={date} />
          <SummaryRow term={t("success.time")} description={time} />
          <SummaryRow
            term={t("success.pax")}
            description={formatPaxLabel(reservation.pax, t)}
          />
          <SummaryRow
            term={t("success.reference")}
            description={reservation.id}
            descriptionClassName="min-w-0 break-all text-xs"
          />
        </dl>

        <p className="mt-5 text-center text-[10px] text-muted-foreground">
          Powered by Tabstr
        </p>
      </article>
    </div>
  )
}

function SummaryRow({
  term,
  description,
  descriptionClassName,
}: {
  term: string
  description: string
  descriptionClassName?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <dt className="shrink-0 text-muted-foreground">{term}</dt>
      <dd className={cn("text-right font-medium", descriptionClassName)}>
        {description}
      </dd>
    </div>
  )
}

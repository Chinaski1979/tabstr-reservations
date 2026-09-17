import { useRef, useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"

import { ReservationVoucher } from "@/components/reservation/ReservationVoucher"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/i18n/useLocale"
import {
  formatInstantTime,
  formatLongDate,
  toZonedDateTime,
} from "@/lib/datetime"
import { downloadReservationImage } from "@/lib/downloadReservationImage"
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
  const voucherRef = useRef<HTMLElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const instant = new Date(reservation.startsAt)
  const date = formatLongDate(
    toZonedDateTime(instant, timezone).date,
    intlLocale
  )
  const time = formatInstantTime(reservation.startsAt, timezone, intlLocale)

  async function handleDownload() {
    const node = voucherRef.current
    if (!node || isDownloading) return

    setIsDownloading(true)
    try {
      await downloadReservationImage(
        node,
        t("success.fileName", { id: reservation.id })
      )
    } catch {
      toast.error(t("success.downloadError"))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="my-auto py-6 animate-in fade-in duration-200">
      <ReservationVoucher
        ref={voucherRef}
        reservation={reservation}
        organizationName={organizationName}
        imageUrl={imageUrl}
        date={date}
        time={time}
      />

      <p className="mx-auto mt-5 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
        {t("success.hint")}
      </p>

      <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3">
        <Button
          variant="default"
          size="lg"
          className="h-12 w-full text-base"
          disabled={isDownloading}
          onClick={handleDownload}
        >
          <Download aria-hidden />
          {isDownloading ? t("success.downloading") : t("success.download")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full text-base"
          onClick={onBookAnother}
        >
          {t("success.another")}
        </Button>
      </div>
    </section>
  )
}

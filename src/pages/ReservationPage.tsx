import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { AvailabilityErrorState } from "@/components/reservation/AvailabilityErrorState"
import { DateStrip } from "@/components/reservation/DateStrip"
import { OrganizationHeader } from "@/components/reservation/OrganizationHeader"
import { OrganizationNotFound } from "@/components/reservation/OrganizationNotFound"
import { PaxStepper } from "@/components/reservation/PaxStepper"
import type { ReservationFormValues } from "@/components/reservation/ReservationForm"
import { ReservationForm } from "@/components/reservation/ReservationForm"
import { ReservationSkeleton } from "@/components/reservation/ReservationSkeleton"
import { ReservationSuccess } from "@/components/reservation/ReservationSuccess"
import { StepSection } from "@/components/reservation/StepSection"
import { TimeSlotGrid } from "@/components/reservation/TimeSlotGrid"
import {
  AVAILABILITY_WINDOW_DAYS,
  useAvailability,
} from "@/hooks/useAvailability"
import { useCreateReservation } from "@/hooks/useCreateReservation"
import { useLocale } from "@/i18n/useLocale"
import { buildDateRange, formatLongDate, todayInTimeZone } from "@/lib/datetime"
import { formatPaxLabel } from "@/lib/format"
import {
  isOrganizationNotFound,
  reservationErrorMessage,
} from "@/lib/reservationErrors"
import { buildDaySlots, isSlotOpen } from "@/lib/slots"
import type { CreateReservationResponse } from "@/types/reservations"

const DEFAULT_PAX = 2

export function ReservationPage() {
  const { slug = "" } = useParams<{ slug: string }>()
  const { t, intlLocale } = useLocale()
  const { availability, isLoading, error, reload } = useAvailability(slug)
  const { createReservation, isSubmitting } = useCreateReservation()

  const [pax, setPax] = useState(DEFAULT_PAX)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedStartsAt, setSelectedStartsAt] = useState<string | null>(null)
  const [reservation, setReservation] =
    useState<CreateReservationResponse | null>(null)

  const today = availability ? todayInTimeZone(availability.timezone) : ""

  const dates = useMemo(
    () => (today ? buildDateRange(today, AVAILABILITY_WINDOW_DAYS) : []),
    [today]
  )

  const slots = useMemo(
    () =>
      availability && selectedDate
        ? buildDaySlots({
            availability,
            date: selectedDate,
            pax,
            now: new Date(),
            locale: intlLocale,
          })
        : [],
    [availability, selectedDate, pax, intlLocale]
  )

  const selectedSlot =
    slots.find((slot) => slot.startsAt === selectedStartsAt) ?? null

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    setSelectedStartsAt(null)
  }

  function handleChangePax(nextPax: number) {
    setPax(nextPax)
    if (
      selectedSlot &&
      selectedSlot.remaining !== null &&
      selectedSlot.remaining < nextPax
    ) {
      setSelectedStartsAt(null)
    }
  }

  function handleBookAnother() {
    setReservation(null)
    setSelectedDate(null)
    setSelectedStartsAt(null)
    setPax(DEFAULT_PAX)
  }

  async function handleSubmit(values: ReservationFormValues) {
    if (!slug || !selectedSlot) return

    try {
      const created = await createReservation({
        organizationSlug: slug,
        customerName: values.customerName.trim(),
        phone: values.phone.trim() || undefined,
        pax,
        startsAt: selectedSlot.startsAt,
        allergies: values.allergies.trim() || undefined,
      })
      setReservation(created)
    } catch (submitError) {
      toast.error(reservationErrorMessage(submitError, t))
    } finally {
      reload()
    }
  }

  if (isLoading && !availability) {
    return <ReservationSkeleton />
  }

  if (isOrganizationNotFound(error)) {
    return <OrganizationNotFound />
  }

  if (!availability) {
    return (
      <AvailabilityErrorState
        message={reservationErrorMessage(error, t)}
        onRetry={reload}
      />
    )
  }

  if (reservation) {
    return (
      <ReservationSuccess
        reservation={reservation}
        organizationName={availability.organizationName}
        imageUrl={availability.imageUrl}
        timezone={availability.timezone}
        onBookAnother={handleBookAnother}
      />
    )
  }

  return (
    <div className="flex flex-col gap-7 pb-4">
      <OrganizationHeader organization={availability} />

      <StepSection step={1} title={t("reserve.stepDate")}>
        <DateStrip
          dates={dates}
          today={today}
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
        />
      </StepSection>

      <StepSection step={2} title={t("reserve.stepPax")}>
        <PaxStepper value={pax} onChange={handleChangePax} />
      </StepSection>

      {selectedDate ? (
        <StepSection
          step={3}
          title={t("reserve.stepTime")}
          hint={formatLongDate(selectedDate, intlLocale)}
        >
          <TimeSlotGrid
            slots={slots}
            selectedSlot={selectedStartsAt}
            onSelect={setSelectedStartsAt}
          />
        </StepSection>
      ) : null}

      {selectedDate && selectedSlot ? (
        <StepSection step={4} title={t("reserve.stepDetails")}>
          {isSlotOpen(selectedSlot) ? null : (
            <p className="mb-5 flex items-center gap-2 text-xs text-foreground/90">
              <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
              {t("reserve.slotFilled")}
            </p>
          )}
          <ReservationForm
            summary={`${formatLongDate(selectedDate, intlLocale)} · ${selectedSlot.label} · ${formatPaxLabel(pax, t)}`}
            canSubmit={isSlotOpen(selectedSlot)}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </StepSection>
      ) : null}
    </div>
  )
}

import {
  addDays,
  browserTimeZone,
  isGeographicTimeZone,
  zonedWallTimeToIso,
} from "@/lib/datetime"
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from "@/types/reservations"

import { ReservationApiError } from "../reservationApiError"
import type { ReservationsApi } from "../reservationsApi"
import { postJson } from "./masterClient"

function toRangeInstant(date: string, timeZone: string): string {
  return zonedWallTimeToIso(date, "00:00:00", timeZone)
}

function requireOrganizationTimeZone(
  timeZone: string | null | undefined
): string {
  const trimmed = timeZone?.trim() ?? ""
  if (!isGeographicTimeZone(trimmed)) {
    throw new ReservationApiError("invalid_timezone")
  }
  return trimmed
}

export const httpReservationsApi: ReservationsApi = {
  async getAvailability({
    organizationSlug,
    from,
    to,
    timezone,
  }: AvailabilityRequest): Promise<AvailabilityResponse> {
    const rangeZone =
      timezone && isGeographicTimeZone(timezone)
        ? timezone.trim()
        : browserTimeZone()

    const payload = await postJson<AvailabilityResponse>(
      "reservations-availability",
      {
        organizationSlug,
        from: toRangeInstant(from, rangeZone),
        to: toRangeInstant(addDays(to, 1), rangeZone),
      }
    )

    const timezoneIana = requireOrganizationTimeZone(payload.timezone)

    return {
      organizationName: payload.organizationName,
      imageUrl: payload.imageUrl ?? null,
      timezone: timezoneIana,
      opensAt: payload.opensAt,
      closesAt: payload.closesAt,
      maxPaxPerHour: payload.maxPaxPerHour,
      occupancy: payload.occupancy ?? [],
    }
  },

  async create({
    organizationSlug,
    customerName,
    phone,
    pax,
    startsAt,
    allergies,
  }: CreateReservationRequest): Promise<CreateReservationResponse> {
    return postJson<CreateReservationResponse>("reservations-create", {
      organizationSlug,
      customerName,
      pax,
      startsAt,
      ...(phone ? { phone } : {}),
      ...(allergies ? { allergies } : {}),
    })
  },
}

import {
  MINUTES_PER_DAY,
  addDays,
  daysBetween,
  isValidDate,
  minutesToTime,
  toZonedDateTime,
  toZonedIsoString,
  todayInTimeZone,
  zonedWallTimeToUtc,
} from "@/lib/datetime"
import { SLOT_STEP_MINUTES, hourKeyOf, openingWindow } from "@/lib/slots"
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from "@/types/reservations"

import { ReservationApiError } from "../reservationApiError"
import type { ReservationsApi } from "../reservationsApi"
import type { MockOrganization } from "./mockOrganizations"
import { mockOrganizations } from "./mockOrganizations"

const MAX_RANGE_DAYS = 31
const MIN_LATENCY_MS = 300
const MAX_LATENCY_MS = 700

/** Survives navigation within the session so a booking visibly consumes capacity. */
const bookedPaxByOrganization = new Map<string, Map<string, number>>()

export const mockReservationsApi: ReservationsApi = {
  async getAvailability({
    organizationSlug,
    from,
    to,
  }: AvailabilityRequest): Promise<AvailabilityResponse> {
    await simulateLatency()

    if (!isValidDate(from) || !isValidDate(to) || daysBetween(from, to) < 0) {
      throw new ReservationApiError("invalid_range")
    }
    if (daysBetween(from, to) + 1 > MAX_RANGE_DAYS) {
      throw new ReservationApiError("range_too_large")
    }

    const organization = requireOrganization(organizationSlug)
    const booked = occupancyOf(organizationSlug, organization)
    const rangeStart = zonedWallTimeToUtc(
      from,
      "00:00:00",
      organization.timezone
    ).getTime()
    const rangeEnd = zonedWallTimeToUtc(
      addDays(to, 1),
      "00:00:00",
      organization.timezone
    ).getTime()

    const occupancy = [...booked.entries()]
      .filter(([hour]) => {
        const instant = Date.parse(hour)
        return instant >= rangeStart && instant < rangeEnd
      })
      .map(([hour, bookedPax]) => ({ hour, bookedPax }))
      .sort((left, right) => left.hour.localeCompare(right.hour))

    return {
      organizationName: organization.name,
      imageUrl: organization.imageUrl,
      timezone: organization.timezone,
      opensAt: organization.opensAt,
      closesAt: organization.closesAt,
      maxPaxPerHour: organization.maxPaxPerHour,
      occupancy,
    }
  },

  async create({
    organizationSlug,
    customerName,
    pax,
    startsAt,
  }: CreateReservationRequest): Promise<CreateReservationResponse> {
    await simulateLatency()

    const organization = requireOrganization(organizationSlug)
    const name = customerName?.trim() ?? ""
    if (name.length < 2) {
      throw new ReservationApiError("invalid_customer_name")
    }
    if (!Number.isInteger(pax) || pax < 1) {
      throw new ReservationApiError("invalid_pax")
    }

    const startsAtMs = Date.parse(startsAt)
    if (Number.isNaN(startsAtMs)) {
      throw new ReservationApiError("invalid_starts_at")
    }

    const instant = new Date(startsAtMs)
    const { hour, minute } = toZonedDateTime(instant, organization.timezone)
    if (minute % SLOT_STEP_MINUTES !== 0) {
      throw new ReservationApiError("invalid_starts_at")
    }
    if (startsAtMs <= Date.now()) {
      throw new ReservationApiError("starts_at_in_the_past")
    }
    if (!isWithinOpeningHours(hour * 60 + minute, organization)) {
      throw new ReservationApiError("outside_hours")
    }

    const hourKey = hourKeyOf(instant, organization.timezone)
    const booked = occupancyOf(organizationSlug, organization)
    const bookedPax = booked.get(hourKey) ?? 0
    if (
      organization.maxPaxPerHour !== null &&
      bookedPax + pax > organization.maxPaxPerHour
    ) {
      throw new ReservationApiError("capacity_exceeded")
    }

    booked.set(hourKey, bookedPax + pax)

    return {
      id: crypto.randomUUID(),
      customerName: name,
      pax,
      startsAt: toZonedIsoString(instant, organization.timezone),
    }
  },
}

function requireOrganization(slug: string): MockOrganization {
  const organization = mockOrganizations[slug]
  if (!organization) {
    throw new ReservationApiError("organization_not_found")
  }
  return organization
}

function occupancyOf(
  slug: string,
  organization: MockOrganization
): Map<string, number> {
  const existing = bookedPaxByOrganization.get(slug)
  if (existing) return existing

  const booked = new Map<string, number>()
  const today = todayInTimeZone(organization.timezone)
  for (const seed of organization.seededBookings) {
    const hourKey = zonedWallTimeToUtc(
      addDays(today, seed.dayOffset),
      minutesToTime(seed.hour * 60),
      organization.timezone
    ).toISOString()
    booked.set(hourKey, (booked.get(hourKey) ?? 0) + seed.bookedPax)
  }

  bookedPaxByOrganization.set(slug, booked)
  return booked
}

function isWithinOpeningHours(
  minuteOfDay: number,
  organization: MockOrganization
): boolean {
  const { startMinute, spanMinutes } = openingWindow(organization)
  const offset =
    (minuteOfDay - startMinute + MINUTES_PER_DAY) % MINUTES_PER_DAY
  return offset < spanMinutes
}

function simulateLatency(): Promise<void> {
  const duration =
    MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)
  return new Promise((resolve) => setTimeout(resolve, duration))
}

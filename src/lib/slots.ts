import type { AvailabilityResponse, OccupancyHour } from "@/types/reservations"

import {
  MINUTES_PER_DAY,
  addDays,
  formatInstantTime,
  minutesToTime,
  timeToMinutes,
  toZonedDateTime,
  toZonedIsoString,
  zonedWallTimeToUtc,
} from "./datetime"

export const SLOT_STEP_MINUTES = 30

export type SlotBlockedReason = "past" | "full" | "insufficient"

export interface DaySlot {
  /** Absolute instant with the organization offset, e.g. `2026-09-16T18:00:00-06:00`. */
  startsAt: string
  label: string
  /** null when the organization has no cap. */
  remaining: number | null
  blockedReason: SlotBlockedReason | null
}

export interface OpeningWindow {
  startMinute: number
  spanMinutes: number
}

interface BuildDaySlotsParams {
  availability: AvailabilityResponse
  date: string
  pax: number
  now: Date
  locale: string
}

export function openingWindow({
  opensAt,
  closesAt,
}: Pick<AvailabilityResponse, "opensAt" | "closesAt">): OpeningWindow {
  if (!opensAt || !closesAt) {
    return { startMinute: 0, spanMinutes: MINUTES_PER_DAY }
  }

  const startMinute = timeToMinutes(opensAt)
  const closeMinute = timeToMinutes(closesAt)
  const spanMinutes =
    closeMinute > startMinute
      ? closeMinute - startMinute
      : MINUTES_PER_DAY - startMinute + closeMinute

  return { startMinute, spanMinutes }
}

function toOccupancyMap(
  occupancy: OccupancyHour[],
  timeZone: string
): Map<string, number> {
  const booked = new Map<string, number>()
  for (const entry of occupancy) {
    const key = hourKeyOf(new Date(entry.hour), timeZone)
    booked.set(key, (booked.get(key) ?? 0) + entry.bookedPax)
  }
  return booked
}

export function hourKeyOf(startsAt: Date, timeZone: string): string {
  const { date, hour } = toZonedDateTime(startsAt, timeZone)
  return zonedWallTimeToUtc(date, minutesToTime(hour * 60), timeZone).toISOString()
}

export function buildDaySlots({
  availability,
  date,
  pax,
  now,
  locale,
}: BuildDaySlotsParams): DaySlot[] {
  const { timezone, maxPaxPerHour } = availability
  const { startMinute, spanMinutes } = openingWindow(availability)
  const booked = toOccupancyMap(availability.occupancy, timezone)
  const slots: DaySlot[] = []

  for (let offset = 0; offset < spanMinutes; offset += SLOT_STEP_MINUTES) {
    const absoluteMinute = startMinute + offset
    const slotDate = addDays(date, Math.floor(absoluteMinute / MINUTES_PER_DAY))
    const minuteOfDay = absoluteMinute % MINUTES_PER_DAY

    const startsAt = zonedWallTimeToUtc(
      slotDate,
      minutesToTime(minuteOfDay),
      timezone
    )
    const hourKey = zonedWallTimeToUtc(
      slotDate,
      minutesToTime(minuteOfDay - (minuteOfDay % 60)),
      timezone
    ).toISOString()

    const remaining =
      maxPaxPerHour === null
        ? null
        : Math.max(0, maxPaxPerHour - (booked.get(hourKey) ?? 0))

    slots.push({
      startsAt: toZonedIsoString(startsAt, timezone),
      label: formatInstantTime(
        toZonedIsoString(startsAt, timezone),
        timezone,
        locale
      ),
      remaining,
      blockedReason: blockedReason(startsAt, remaining, pax, now),
    })
  }

  return slots
}

export function isSlotOpen(slot: DaySlot): boolean {
  return slot.blockedReason === null
}

function blockedReason(
  startsAt: Date,
  remaining: number | null,
  pax: number,
  now: Date
): SlotBlockedReason | null {
  if (startsAt.getTime() <= now.getTime()) return "past"
  if (remaining === null) return null
  if (remaining <= 0) return "full"
  if (remaining < pax) return "insufficient"
  return null
}

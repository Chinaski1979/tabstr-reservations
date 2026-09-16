import { formatInTimeZone, fromZonedTime } from "date-fns-tz"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/
const MS_PER_DAY = 86_400_000

export const MINUTES_PER_DAY = 1440

export interface ZonedDateTime {
  date: string
  hour: number
  minute: number
}

const partFormatters = new Map<string, Intl.DateTimeFormat>()

function partFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = partFormatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      hour12: false,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    partFormatters.set(timeZone, formatter)
  }
  return formatter
}

function readParts(instant: Date, timeZone: string): Record<string, number> {
  const parts: Record<string, number> = {}
  for (const part of partFormatter(timeZone).formatToParts(instant)) {
    if (part.type !== "literal") {
      parts[part.type] = Number(part.value)
    }
  }
  return parts
}

export function toZonedDateTime(instant: Date, timeZone: string): ZonedDateTime {
  const parts = readParts(instant, timeZone)
  return {
    date: `${pad(parts.year, 4)}-${pad(parts.month, 2)}-${pad(parts.day, 2)}`,
    hour: parts.hour,
    minute: parts.minute,
  }
}

/**
 * Wall-clock in `timeZone` → UTC Date. Pass a naive ISO string into
 * `fromZonedTime`; never `new Date("…T18:00:00")` (that is UTC or browser-local).
 */
export function zonedWallTimeToUtc(
  date: string,
  time: string,
  timeZone: string
): Date {
  return fromZonedTime(`${date}T${normalizeTime(time)}`, timeZone)
}

/** ISO 8601 with the organization's offset, e.g. `2026-09-17T18:00:00-06:00`. */
export function toZonedIsoString(instant: Date, timeZone: string): string {
  return formatInTimeZone(instant, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX")
}

/**
 * Wall-clock in the organization zone as an absolute ISO instant with that
 * zone's offset. 18:00 in America/Costa_Rica → `2026-09-16T18:00:00-06:00`,
 * never `2026-09-16T18:00:00.000Z`.
 */
export function zonedWallTimeToIso(
  date: string,
  time: string,
  timeZone: string
): string {
  return toZonedIsoString(zonedWallTimeToUtc(date, time, timeZone), timeZone)
}

export function todayInTimeZone(timeZone: string): string {
  return toZonedDateTime(new Date(), timeZone).date
}

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

const UTC_ZONE_IDS = new Set(["utc", "etc/utc", "etc/gmt", "gmt", "zulu"])

/** Geographic IANA zone (e.g. America/Costa_Rica). UTC/empty/invalid are not. */
export function isGeographicTimeZone(timeZone: string | null | undefined): boolean {
  const trimmed = timeZone?.trim() ?? ""
  if (!trimmed || UTC_ZONE_IDS.has(trimmed.toLowerCase())) return false
  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed })
    return true
  } catch {
    return false
  }
}

export function isValidDate(date: string): boolean {
  return DATE_PATTERN.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
}

export function addDays(date: string, days: number): string {
  const shifted = new Date(Date.parse(`${date}T00:00:00Z`) + days * MS_PER_DAY)
  return shifted.toISOString().slice(0, 10)
}

export function daysBetween(from: string, to: string): number {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY
}

export function buildDateRange(start: string, length: number): string[] {
  return Array.from({ length }, (_, index) => addDays(start, index))
}

export function timeToMinutes(time: string): number {
  const match = TIME_PATTERN.exec(time)
  if (!match) return 0
  return Number(match[1]) * 60 + Number(match[2])
}

export function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60), 2)}:${pad(minutes % 60, 2)}:00`
}

export function formatDatePart(
  date: string,
  options: Intl.DateTimeFormatOptions,
  locale: string
): string {
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(
    new Date(`${date}T00:00:00Z`)
  )
}

export function formatLongDate(date: string, locale: string): string {
  const formatted = formatDatePart(
    date,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    },
    locale
  )
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatInstantTime(
  instant: string,
  timeZone: string,
  locale: string
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(instant))
}

function normalizeTime(time: string): string {
  const match = TIME_PATTERN.exec(time)
  if (!match) return "00:00:00"
  return `${match[1]}:${match[2]}:${match[3] ?? "00"}`
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0")
}

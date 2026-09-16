import { requireMasterConfig } from "@/config/env"
import type { ReservationErrorCode } from "@/types/reservations"

import { ReservationApiError } from "../reservationApiError"

const GUEST_CODES = new Set<string>([
  "organization_not_found",
  "invalid_customer_name",
  "invalid_pax",
  "starts_at_in_the_past",
  "invalid_starts_at",
  "outside_hours",
  "capacity_exceeded",
  "invalid_range",
  "range_too_large",
])

const SLUG_ALIASES: Record<string, ReservationErrorCode> = {
  missing_organization_slug: "organization_not_found",
  invalid_organization_slug: "organization_not_found",
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function errorCodeOf(body: unknown): string | null {
  if (!isRecord(body) || typeof body.error !== "string" || !body.error) {
    return null
  }
  return body.error
}

function throwForCode(code: string): never {
  const mapped = SLUG_ALIASES[code]
  if (mapped) throw new ReservationApiError(mapped)
  if (GUEST_CODES.has(code)) {
    throw new ReservationApiError(code as ReservationErrorCode)
  }
  throw new Error("Reservation request failed")
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const { functionsUrl, anonKey } = requireMasterConfig()
  const url = `${functionsUrl}/${path.replace(/^\//, "")}`

  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error("Reservation request failed")
  }

  let payload: unknown = null
  const text = await response.text()
  if (text) {
    try {
      payload = JSON.parse(text) as unknown
    } catch {
      throw new Error("Reservation request failed")
    }
  }

  if (!response.ok) {
    const code = errorCodeOf(payload)
    if (code) throwForCode(code)
    throw new Error("Reservation request failed")
  }

  return payload as T
}

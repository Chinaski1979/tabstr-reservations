export type ReservationErrorCode =
  | "organization_not_found"
  | "invalid_customer_name"
  | "invalid_pax"
  | "starts_at_in_the_past"
  | "invalid_starts_at"
  | "outside_hours"
  | "capacity_exceeded"
  | "invalid_range"
  | "range_too_large"
  | "invalid_timezone"

/** Booked guests for one clock hour, keyed by the UTC instant of the local hour start. */
export interface OccupancyHour {
  hour: string
  bookedPax: number
}

export interface AvailabilityRequest {
  organizationSlug: string
  /** Inclusive local calendar dates, `YYYY-MM-DD`. The range may not exceed 31 days. */
  from: string
  to: string
  /** IANA zone used to turn `from`/`to` into midnight instants. */
  timezone?: string
}

export interface AvailabilityResponse {
  organizationName: string
  /** Absolute public image URL. null when the organization has no booking image. */
  imageUrl: string | null
  timezone: string
  /** `HH:mm:ss` in the organization timezone. Both null means open around the clock. */
  opensAt: string | null
  closesAt: string | null
  /** null means no cap. */
  maxPaxPerHour: number | null
  occupancy: OccupancyHour[]
}

export interface CreateReservationRequest {
  organizationSlug: string
  customerName: string
  phone?: string
  pax: number
  /** Absolute ISO instant in the organization offset, e.g. `2026-09-16T18:00:00-06:00`. */
  startsAt: string
  allergies?: string
}

export interface CreateReservationResponse {
  id: string
  customerName: string
  pax: number
  startsAt: string
}

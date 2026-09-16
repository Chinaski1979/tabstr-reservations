import type { ReservationErrorCode } from "@/types/reservations"

export class ReservationApiError extends Error {
  readonly code: ReservationErrorCode

  constructor(code: ReservationErrorCode) {
    super(code)
    this.name = "ReservationApiError"
    this.code = code
  }
}

export function isReservationApiError(
  error: unknown
): error is ReservationApiError {
  return error instanceof ReservationApiError
}

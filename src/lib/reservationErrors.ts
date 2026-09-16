import { isReservationApiError } from "@/services/reservationApiError"
import type { ReservationErrorCode } from "@/types/reservations"
import type { MessageKey } from "@/i18n/messages"

const ERROR_KEYS: Record<ReservationErrorCode, MessageKey> = {
  organization_not_found: "errors.organization_not_found",
  invalid_customer_name: "errors.invalid_customer_name",
  invalid_pax: "errors.invalid_pax",
  starts_at_in_the_past: "errors.starts_at_in_the_past",
  invalid_starts_at: "errors.invalid_starts_at",
  outside_hours: "errors.outside_hours",
  capacity_exceeded: "errors.capacity_exceeded",
  invalid_range: "errors.invalid_range",
  range_too_large: "errors.range_too_large",
  invalid_timezone: "errors.invalid_timezone",
}

export function reservationErrorMessage(
  error: unknown,
  t: (key: MessageKey) => string
): string {
  if (isReservationApiError(error)) {
    return t(ERROR_KEYS[error.code] ?? "errors.generic")
  }
  return t("errors.generic")
}

export function isOrganizationNotFound(error: unknown): boolean {
  return isReservationApiError(error) && error.code === "organization_not_found"
}

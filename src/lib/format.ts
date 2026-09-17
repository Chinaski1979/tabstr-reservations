export function formatPaxLabel(
  pax: number,
  t: (key: "pax.one" | "pax.other", vars?: { count: number }) => string
): string {
  return pax === 1 ? t("pax.one") : t("pax.other", { count: pax })
}

const RESERVATION_CODE_LENGTH = 4

/** Short display code taken from the API reservation id. */
export function formatReservationCode(id: string): string {
  const hex = id.replace(/[^a-fA-F0-9]/g, "")
  const source = hex || id.replace(/[^a-zA-Z0-9]/g, "")
  if (source.length <= RESERVATION_CODE_LENGTH) {
    return source.toUpperCase()
  }

  const value = Number.parseInt(source.slice(-RESERVATION_CODE_LENGTH), 16)
  if (Number.isNaN(value)) {
    return source.slice(-RESERVATION_CODE_LENGTH).toUpperCase()
  }
  return String(value % 10 ** RESERVATION_CODE_LENGTH).padStart(
    RESERVATION_CODE_LENGTH,
    "0"
  )
}

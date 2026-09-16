export function formatPaxLabel(
  pax: number,
  t: (key: "pax.one" | "pax.other", vars?: { count: number }) => string
): string {
  return pax === 1 ? t("pax.one") : t("pax.other", { count: pax })
}

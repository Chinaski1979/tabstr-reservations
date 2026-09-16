import { OrganizationLogo } from "@/components/reservation/OrganizationLogo"
import { useLocale } from "@/i18n/useLocale"
import type { AvailabilityResponse } from "@/types/reservations"

type Organization = Pick<
  AvailabilityResponse,
  "organizationName" | "imageUrl" | "opensAt" | "closesAt"
>

interface OrganizationHeaderProps {
  organization: Organization
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  const { t } = useLocale()

  return (
    <header className="flex items-center gap-4">
      <OrganizationLogo src={organization.imageUrl} />
      <div>
        <p className="text-sm font-bold text-muted-foreground">
          {scheduleLabel(organization, t)}
        </p>
        <h1 className="serif-display mt-2.5 text-3xl sm:text-4xl">
          {organization.organizationName}
        </h1>
      </div>
    </header>
  )
}

function scheduleLabel(
  { opensAt, closesAt }: Organization,
  t: ReturnType<typeof useLocale>["t"]
): string {
  if (!opensAt || !closesAt) return t("hours.openAllDay")
  return t("hours.openFromTo", {
    opens: opensAt.slice(0, 5),
    closes: closesAt.slice(0, 5),
  })
}

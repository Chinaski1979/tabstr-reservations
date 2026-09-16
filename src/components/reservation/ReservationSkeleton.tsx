import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "@/i18n/useLocale"

const SKELETON_DATES = ["a", "b", "c", "d", "e"]

export function ReservationSkeleton() {
  const { t } = useLocale()

  return (
    <div aria-busy="true" aria-label={t("reserve.loading")}>
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 shrink-0 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-8 w-48" />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-7">
        <Skeleton className="h-5 w-36" />
        <div className="mt-5 flex gap-2">
          {SKELETON_DATES.map((key) => (
            <Skeleton key={key} className="h-20 w-16 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-7">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-5 h-11 w-full" />
      </div>
    </div>
  )
}

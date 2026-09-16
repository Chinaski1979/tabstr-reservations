import { Button } from "@/components/ui/button"
import { useLocale } from "@/i18n/useLocale"

interface AvailabilityErrorStateProps {
  message: string
  onRetry: () => void
}

export function AvailabilityErrorState({
  message,
  onRetry,
}: AvailabilityErrorStateProps) {
  const { t } = useLocale()

  return (
    <section className="my-auto flex flex-col items-center py-10 text-center">
      <p className="eyebrow text-xs text-muted-foreground">
        {t("availabilityError.eyebrow")}
      </p>
      <h1 className="serif-display mt-5 max-w-sm text-3xl text-balance sm:text-4xl">
        {t("availabilityError.title")}
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      <Button
        variant="outline"
        size="lg"
        className="mt-9 h-12 px-6 text-base"
        onClick={onRetry}
      >
        {t("availabilityError.retry")}
      </Button>
    </section>
  )
}

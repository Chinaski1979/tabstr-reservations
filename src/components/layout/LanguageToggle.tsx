import { useLocale } from "@/i18n/useLocale"
import { LOCALES, type Locale } from "@/i18n/messages"
import { cn } from "@/lib/utils"

const LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
}

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      role="group"
      aria-label={t("language.label")}
      className="flex items-center"
    >
      {LOCALES.map((option, index) => (
        <span key={option} className="flex items-center">
          {index > 0 ? (
            <span aria-hidden className="px-1 text-xs text-muted-foreground/40">
              /
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={locale === option}
            aria-label={
              option === "es" ? t("language.spanish") : t("language.english")
            }
            onClick={() => setLocale(option)}
            className={cn(
              "flex h-11 min-w-11 items-center justify-center rounded-md px-1.5 text-xs font-medium tracking-[0.14em] uppercase outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              locale === option
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {LABELS[option]}
          </button>
        </span>
      ))}
    </div>
  )
}

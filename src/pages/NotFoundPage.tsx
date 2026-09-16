import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button-variants"
import { useLocale } from "@/i18n/useLocale"
import { cn } from "@/lib/utils"

export function NotFoundPage() {
  const { t } = useLocale()

  return (
    <section className="my-auto flex flex-col items-center py-10 text-center">
      <p className="eyebrow text-xs text-muted-foreground">404</p>
      <h1 className="serif-display mt-5 max-w-sm text-3xl text-balance sm:text-4xl">
        {t("notFound.title")}
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("notFound.body")}
      </p>
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "mt-9 h-12 px-6 text-base"
        )}
      >
        {t("notFound.home")}
      </Link>
    </section>
  )
}

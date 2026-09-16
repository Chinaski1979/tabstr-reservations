import { Link2 } from "lucide-react"

import { useLocale } from "@/i18n/useLocale"
import type { MessageKey } from "@/i18n/messages"

const STEPS: { title: MessageKey; body: MessageKey }[] = [
  { title: "landing.step1Title", body: "landing.step1Body" },
  { title: "landing.step2Title", body: "landing.step2Body" },
  { title: "landing.step3Title", body: "landing.step3Body" },
]

export function LandingPage() {
  const { t } = useLocale()

  return (
    <div className="flex flex-1 flex-col gap-14">
      <section>
        <p className="eyebrow text-xs text-muted-foreground">
          {t("landing.eyebrow")}
        </p>
        <div className="mt-5 sm:flex sm:items-end sm:justify-between sm:gap-10">
          <h1 className="serif-display text-4xl text-balance sm:text-5xl">
            {t("landing.title")}
          </h1>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Link2 className="size-5" />
        </span>
        <h2 className="serif-heading mt-5 text-xl">{t("landing.askTitle")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("landing.askBody")}
        </p>
      </section>

      <section>
        <h2 className="eyebrow text-xs text-muted-foreground">
          {t("landing.howTitle")}
        </h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-5 py-5">
              <span className="serif-heading w-5 shrink-0 text-lg text-primary">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-medium">{t(step.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t(step.body)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
        {t("landing.footnote")}
      </p>
    </div>
  )
}

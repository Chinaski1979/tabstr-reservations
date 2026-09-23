import { Link } from "react-router-dom"
import { useLocale } from "@/i18n/useLocale"

const FACEBOOK_URL = "https://www.facebook.com/people/Tabstr/61592499518532/"
const INSTAGRAM_URL = "https://www.instagram.com/tabstrpos/"
const HERMOSA_SOFTWARE_URL = "https://www.hermosasoftware.io/"
const TABSTR_URL = "https://tabstr.net/"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const socialLinks = [
  { labelKey: "footer.facebook", href: FACEBOOK_URL, Icon: FacebookIcon },
  { labelKey: "footer.instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
] as const

const columnTitleClassName = "text-base font-semibold text-foreground"

const footerLinkClassName =
  "inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

const socialChipClassName =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

const inlineLinkClassName =
  "font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

export function SiteFooter() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 justify-items-center">
          <div className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label={t("footer.logoAria")}
              className="flex min-h-11 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <img
                src="/tabstr-logo.webp"
                alt={t("footer.logoAlt")}
                className="h-10 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("footer.productOf")}{" "}
              <a
                href={HERMOSA_SOFTWARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLinkClassName}
              >
                Hermosa Software
              </a>
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <p className={columnTitleClassName}>{t("footer.linksTitle")}</p>
            <ul>
              <li>
                <Link to="/" className={footerLinkClassName}>
                  {t("footer.navHome")}
                </Link>
              </li>
              <li>
                <a
                  href={TABSTR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClassName}
                >
                  Tabstr
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <p className={columnTitleClassName}>{t("footer.socialTitle")}</p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ labelKey, href, Icon }) => {
                const label = t(labelKey)
                return (
                  <a
                    key={labelKey}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("footer.socialAria", { platform: label })}
                    className={socialChipClassName}
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 justify-center items-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>

        </div>
      </div>
    </footer>
  )
}

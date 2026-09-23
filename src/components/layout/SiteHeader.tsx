import { Link } from "react-router-dom"

import { LanguageToggle } from "@/components/layout/LanguageToggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          to="/"
          aria-label="Tabstr Booking"
          className="flex min-h-11 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <img
            src="/book-header.webp"
            alt="Tabstr Booking"
            className="h-16 w-auto"
          />
        </Link>
        <LanguageToggle />
      </div>
    </header>
  )
}

import { createContext } from "react"

import type { Locale, MessageKey, MessageVars } from "@/i18n/messages"

export interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: MessageVars) => string
  intlLocale: string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

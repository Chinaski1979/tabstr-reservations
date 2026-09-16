import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import { LocaleContext } from "@/i18n/LocaleContext"
import {
  dictionaries,
  intlLocales,
  isLocale,
  translate,
  type Locale,
  type MessageKey,
  type MessageVars,
} from "@/i18n/messages"

const STORAGE_KEY = "tabbook-locale"

interface LocaleProviderProps {
  children: ReactNode
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      intlLocale: intlLocales[locale],
      t: (key: MessageKey, vars?: MessageVars) =>
        translate(dictionaries[locale], key, vars),
    }),
    [locale, setLocale]
  )

  return <LocaleContext value={value}>{children}</LocaleContext>
}

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored && isLocale(stored) ? stored : "es"
}

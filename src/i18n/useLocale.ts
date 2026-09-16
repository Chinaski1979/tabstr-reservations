import { useContext } from "react"

import { LocaleContext } from "@/i18n/LocaleContext"

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return value
}

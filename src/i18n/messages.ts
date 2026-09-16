import en from "./en.json"
import es from "./es.json"

export const LOCALES = ["es", "en"] as const

export type Locale = (typeof LOCALES)[number]
export type Messages = typeof es
export type MessageKey = DotPaths<Messages>
export type MessageVars = Record<string, string | number>

export const dictionaries = { es, en } satisfies Record<Locale, Messages>

export const intlLocales: Record<Locale, string> = {
  es: "es-CR",
  en: "en-US",
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function translate(
  messages: Messages,
  key: MessageKey,
  vars?: MessageVars
): string {
  const template = lookup(messages, key)
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{${name}}`
  )
}

type DotPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`
    }[keyof T & string]

function lookup(messages: Messages, key: MessageKey): string {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in node) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)
  return typeof value === "string" ? value : key
}

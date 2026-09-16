function readFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback
  return value === "true" || value === "1"
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

export const env = {
  useMock: readFlag(import.meta.env.VITE_USE_MOCK, true),
  masterFunctionsUrl: trimSlash(import.meta.env.VITE_MASTER_FUNCTIONS_URL ?? ""),
  masterAnonKey: (import.meta.env.VITE_MASTER_ANON_KEY ?? "").trim(),
}

export function requireMasterConfig(): {
  functionsUrl: string
  anonKey: string
} {
  const { masterFunctionsUrl, masterAnonKey } = env
  if (!masterFunctionsUrl || !masterAnonKey) {
    throw new Error("Master Edge Functions are not configured")
  }
  return { functionsUrl: masterFunctionsUrl, anonKey: masterAnonKey }
}

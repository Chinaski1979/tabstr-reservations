/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string
  readonly VITE_MASTER_FUNCTIONS_URL?: string
  readonly VITE_MASTER_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

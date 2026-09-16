import type { CSSProperties } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom"
import { Toaster } from "sonner"

import { AppShell } from "@/components/layout/AppShell"
import { LandingPage } from "@/pages/LandingPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ReservationPage } from "@/pages/ReservationPage"

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reserve" element={<Navigate to="/" replace />} />
          <Route path="/reserve/:slug" element={<ReservationPage />} />
          <Route path="/:slug" element={<LegacySlugRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
      <Toaster
        theme="dark"
        position="top-center"
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "var(--radius)",
          } as CSSProperties
        }
      />
    </BrowserRouter>
  )
}

/** Links shared before reservations moved under `/reserve` must keep working. */
function LegacySlugRedirect() {
  const { slug = "" } = useParams<{ slug: string }>()
  return <Navigate to={`/reserve/${slug}`} replace />
}

export default App

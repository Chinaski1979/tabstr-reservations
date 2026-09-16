# Tabstr Reservations

Front end for Tabstr reservations. Vite + React + TypeScript, Tailwind v4 with
shadcn/ui, React Router, and sonner for toasts.

## Requirements

- Node 20.19+ (or 22.12+)

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check and build to dist/
npm run preview  # serve the production build
npm run lint
```

## Routes

The product is only reached through per-organization links, so the root is an
informational landing rather than an entry point to a booking.

| Route             | Screen                                              |
| ----------------- | --------------------------------------------------- |
| `/`               | Landing explaining that each venue has its own link |
| `/reserve/:slug`  | Booking flow for one organization                   |
| `/:slug`          | Redirects to `/reserve/:slug` for links shared before the move |
| anything else     | 404                                                 |

Mock slugs to try: `mi-bar` (has a logo), `la-noche` (no logo), `sin-limite`
(open 24h, logo URL points at a missing file on purpose).

## Layout

- `src/index.css` — theme tokens (ink background, gold primary, terracotta
  accent) plus the `serif-display`, `serif-heading`, and `eyebrow` typography
  utilities
- `src/App.tsx` — router and the app-root `Toaster`
- `src/components/layout/` — `AppShell`, `SiteHeader`, `SiteFooter`
- `src/pages/` — route components
- `src/components/reservation/` — booking flow UI
- `src/components/ui/` — shadcn components
- `src/lib/` — date math, slot building, formatting, error copy
- `src/services/` — the `reservationsApi` contract and its mock implementation
- `@/` resolves to `src/`

## Type

Inter Variable for titles, Geist Variable for UI, numbers, and inputs. Both
are self-hosted through Fontsource.

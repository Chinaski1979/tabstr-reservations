import { useCallback, useEffect, useState } from "react"

import { addDays, browserTimeZone, todayInTimeZone } from "@/lib/datetime"
import { reservationsApi } from "@/services/reservationsApi"
import type { AvailabilityResponse } from "@/types/reservations"

/** Days offered on the date strip. Kept well under the 31-day contract limit. */
export const AVAILABILITY_WINDOW_DAYS = 21

interface AvailabilityState {
  /** Identifies the request that produced this state. */
  key: string
  slug: string
  availability: AvailabilityResponse | null
  error: unknown
}

const PENDING_STATE: AvailabilityState = {
  key: "",
  slug: "",
  availability: null,
  error: null,
}

export function useAvailability(slug: string) {
  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState<AvailabilityState>(PENDING_STATE)
  const key = `${slug}#${reloadToken}`

  useEffect(() => {
    let isCurrent = true

    // The window starts a day early so a browser clock behind the organization
    // timezone still covers the organization's today.
    const timeZone = state.availability?.timezone
    const today = todayInTimeZone(timeZone ?? browserTimeZone())

    reservationsApi
      .getAvailability({
        organizationSlug: slug,
        from: addDays(today, -1),
        to: addDays(today, AVAILABILITY_WINDOW_DAYS),
        ...(timeZone ? { timezone: timeZone } : {}),
      })
      .then((availability) => {
        if (isCurrent) setState({ key, slug, availability, error: null })
      })
      .catch((error: unknown) => {
        if (!isCurrent) return
        // A failed refresh must not wipe a screen the guest is already using.
        setState((previous) => {
          const kept = previous.slug === slug ? previous.availability : null
          return { key, slug, availability: kept, error: kept ? null : error }
        })
      })

    return () => {
      isCurrent = false
    }
  }, [key, slug, state.availability?.timezone])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  const isSettled = state.key === key
  const isForCurrentSlug = state.slug === slug

  return {
    availability: isForCurrentSlug ? state.availability : null,
    isLoading: !isSettled,
    error: isSettled ? state.error : null,
    reload,
  }
}

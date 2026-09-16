import { useCallback, useEffect, useRef, useState } from "react"

import { reservationsApi } from "@/services/reservationsApi"
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from "@/types/reservations"

export function useCreateReservation() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const createReservation = useCallback(
    async (
      request: CreateReservationRequest
    ): Promise<CreateReservationResponse> => {
      setIsSubmitting(true)
      try {
        return await reservationsApi.create(request)
      } finally {
        if (isMounted.current) setIsSubmitting(false)
      }
    },
    []
  )

  return { createReservation, isSubmitting }
}

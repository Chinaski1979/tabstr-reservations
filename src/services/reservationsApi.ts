import { env } from "@/config/env"
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from "@/types/reservations"

import { httpReservationsApi } from "./http/httpReservationsApi"
import { mockReservationsApi } from "./mock/mockReservationsApi"

export interface ReservationsApi {
  getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse>
  create(request: CreateReservationRequest): Promise<CreateReservationResponse>
}

export const reservationsApi: ReservationsApi = env.useMock
  ? mockReservationsApi
  : httpReservationsApi

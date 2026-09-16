export interface SeededBooking {
  /** Days from today in the organization timezone. */
  dayOffset: number
  hour: number
  bookedPax: number
}

export interface MockOrganization {
  name: string
  imageUrl: string | null
  timezone: string
  opensAt: string | null
  closesAt: string | null
  maxPaxPerHour: number | null
  seededBookings: SeededBooking[]
}

export const mockOrganizations: Record<string, MockOrganization> = {
  "mi-bar": {
    name: "Mi Bar",
    imageUrl: "/mock/mi-bar.svg",
    timezone: "America/Costa_Rica",
    opensAt: "11:00:00",
    closesAt: "22:00:00",
    maxPaxPerHour: 20,
    seededBookings: [
      { dayOffset: 0, hour: 13, bookedPax: 14 },
      { dayOffset: 0, hour: 19, bookedPax: 18 },
      { dayOffset: 0, hour: 20, bookedPax: 20 },
      { dayOffset: 1, hour: 12, bookedPax: 20 },
      { dayOffset: 1, hour: 19, bookedPax: 17 },
      { dayOffset: 1, hour: 20, bookedPax: 11 },
      { dayOffset: 2, hour: 19, bookedPax: 20 },
      { dayOffset: 2, hour: 21, bookedPax: 6 },
    ],
  },
  "la-noche": {
    name: "La Noche",
    imageUrl: null,
    timezone: "America/Costa_Rica",
    opensAt: "17:00:00",
    closesAt: "02:00:00",
    maxPaxPerHour: 12,
    seededBookings: [
      { dayOffset: 0, hour: 21, bookedPax: 10 },
      { dayOffset: 0, hour: 22, bookedPax: 12 },
      { dayOffset: 1, hour: 1, bookedPax: 8 },
    ],
  },
  "sin-limite": {
    name: "Sin Límite",
    /** Deliberately absent from `public/` so the broken-logo path stays exercised. */
    imageUrl: "/mock/missing-logo.svg",
    timezone: "America/Costa_Rica",
    opensAt: null,
    closesAt: null,
    maxPaxPerHour: null,
    seededBookings: [],
  },
}

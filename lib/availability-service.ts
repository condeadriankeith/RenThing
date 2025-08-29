import { prisma } from "@/lib/prisma"
import { Booking } from "@prisma/client"

interface DateRange {
  startDate: Date
  endDate: Date
}

export class AvailabilityService {
  /**
   * Checks if a given date range is available for a specific listing.
   * @param listingId The ID of the listing.
   * @param startDate The desired start date.
   * @param endDate The desired end date.
   * @returns True if the date range is available, false otherwise.
   */
  static async isDateRangeAvailable(
    listingId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    // Find any existing bookings for this listing that overlap with the desired date range
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        listingId,
        status: { not: "cancelled" }, // Consider only active bookings
        OR: [
          // Case 1: Existing booking starts within the new range
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    })

    return overlappingBookings.length === 0
  }

  /**
   * Retrieves all booked date ranges for a specific listing.
   * @param listingId The ID of the listing.
   * @returns An array of booked date ranges.
   */
  static async getBookedDateRanges(
    listingId: string
  ): Promise<DateRange[]> {
    const bookings = await prisma.booking.findMany({
      where: {
        listingId,
        status: { not: "cancelled" },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    })

    return bookings.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }))
  }

  /**
   * Retrieves all available date ranges for a specific listing within a given period.
   * This is a more complex operation that might require iterating through days
   * or using a more advanced calendar library.
   * For simplicity, this example returns all dates that are NOT booked.
   * @param listingId The ID of the listing.
   * @param periodStart The start of the period to check availability for.
   * @param periodEnd The end of the period to check availability for.
   * @returns An array of available date ranges.
   */
  static async getAvailableDateRanges(
    listingId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<DateRange[]> {
    const bookedRanges = await this.getBookedDateRanges(listingId)
    const availableRanges: DateRange[] = []

    let currentDay = new Date(periodStart)
    currentDay.setHours(0, 0, 0, 0)

    while (currentDay <= periodEnd) {
      const nextDay = new Date(currentDay)
      nextDay.setDate(currentDay.getDate() + 1)
      nextDay.setHours(0, 0, 0, 0)

      const isBooked = bookedRanges.some((range) => {
        return (
          (currentDay >= range.startDate && currentDay < range.endDate) ||
          (nextDay > range.startDate && nextDay <= range.endDate) ||
          (currentDay < range.startDate && nextDay > range.endDate)
        )
      })

      if (!isBooked) {
        // If the current day is not booked, add it as an available range (single day for now)
        availableRanges.push({ startDate: new Date(currentDay), endDate: new Date(nextDay) })
      }
      currentDay = nextDay
    }

    // This simple implementation returns single-day available slots.
    // A more robust solution would merge consecutive available days into larger ranges.
    return availableRanges
  }

  /**
   * Marks a date range as booked for a listing by creating a new booking.
   * This method assumes that availability check has already passed.
   * @param listingId The ID of the listing.
   * @param userId The ID of the user making the booking.
   * @param startDate The start date of the booking.
   * @param endDate The end date of the booking.
   * @param totalPrice The total price for the booking.
   * @returns The created Booking object.
   */
  static async createBooking(
    listingId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
    totalPrice: number
  ): Promise<Booking> {
    const booking = await prisma.booking.create({
      data: {
        listingId,
        userId,
        startDate,
        endDate,
        totalPrice,
        status: "pending", // Or 'confirmed' depending on your flow
      },
    })
    return booking
  }
}
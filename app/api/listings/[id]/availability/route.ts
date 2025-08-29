import { NextRequest, NextResponse } from "next/server"
import { AvailabilityService } from "@/lib/availability-service"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id
    const { searchParams } = new URL(request.url)

    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    let startDate: Date | undefined
    let endDate: Date | undefined

    if (startDateParam) {
      startDate = new Date(startDateParam)
    }
    if (endDateParam) {
      endDate = new Date(endDateParam)
    }

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    // Default to a reasonable range if not provided
    if (!startDate || !endDate) {
      startDate = new Date()
      endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1) // One year from now
    }

    const availableRanges = await AvailabilityService.getAvailableDateRanges(
      listingId,
      startDate,
      endDate
    )

    return NextResponse.json(availableRanges)
  } catch (error) {
    console.error("Get Listing Availability error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
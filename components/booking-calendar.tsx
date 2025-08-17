"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageCircle, Clock } from "lucide-react"
import { DayPicker } from "react-day-picker"
import type { Listing } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import "react-day-picker/dist/style.css"

interface BookingCalendarProps {
  listing: Listing
}

export function BookingCalendar({ listing }: BookingCalendarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDates, setSelectedDates] = useState<{ from?: Date; to?: Date }>({})
  const [isBooking, setIsBooking] = useState(false)

  // Mock unavailable dates (in production, fetch from API)
  const unavailableDates = [
    new Date(2024, 2, 10), // March 10, 2024
    new Date(2024, 2, 11), // March 11, 2024
    new Date(2024, 2, 15), // March 15, 2024
    new Date(2024, 2, 20), // March 20, 2024
    new Date(2024, 2, 21), // March 21, 2024
  ]

  const disabledDays = [
    { before: new Date() }, // Past dates
    ...unavailableDates.map((date) => ({ from: date, to: date })),
  ]

  const totalDays = useMemo(() => {
    if (!selectedDates.from || !selectedDates.to) return 0
    const diffTime = Math.abs(selectedDates.to.getTime() - selectedDates.from.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }, [selectedDates])

  const totalPrice = totalDays * listing.price
  const serviceFee = Math.round(totalPrice * 0.05)
  const finalTotal = totalPrice + serviceFee

  const handleBookNow = () => {
    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Please select dates",
        description: "Choose your rental start and end dates to continue.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    // Store booking details in URL params for checkout
    const searchParams = new URLSearchParams({
      startDate: selectedDates.from.toISOString().split("T")[0],
      endDate: selectedDates.to.toISOString().split("T")[0],
      days: totalDays.toString(),
      total: finalTotal.toString(),
    })

    router.push(`/checkout/${listing.id}?${searchParams.toString()}`)
  }

  const handleContactOwner = () => {
    // TODO: Implement messaging system
    toast({
      title: "Message sent!",
      description: `Your message has been sent to ${listing.owner.name}.`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select your dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <DayPicker
            mode="range"
            selected={selectedDates}
            onSelect={setSelectedDates}
            disabled={disabledDays}
            numberOfMonths={2}
            className="rdp-custom"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50 line-through",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Booking Summary */}
        {selectedDates.from && selectedDates.to && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Rental Period:</span>
              <span className="text-sm">
                {selectedDates.from.toLocaleDateString()} - {selectedDates.to.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Duration:</span>
              <span className="text-sm">
                {totalDays} {totalDays === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  ${listing.price} × {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-blue-600">${finalTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Availability Info */}
        <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Availability Notes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Free cancellation up to 24 hours before start date</li>
              <li>• Instant booking confirmation</li>
              <li>• Pickup/delivery can be arranged with owner</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleBookNow}
            disabled={!selectedDates.from || !selectedDates.to || isBooking}
          >
            {isBooking ? "Processing..." : "Book Now"}
          </Button>
          <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={handleContactOwner}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Owner
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="font-semibold text-lg">{listing.reviewCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Reviews</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{listing.rating}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">24h</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Response</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Search, MapPin } from "lucide-react"
import { useSession } from "next-auth/react"
import { SpinningLogo } from "@/components/ui/spinning-logo"

interface Booking {
  id: string
  listing: {
    title: string
    image?: string
    location: string
  }
  startDate: string
  endDate: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalAmount: number
}

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    // Fetch actual bookings from API
    const fetchBookings = async () => {
      if (status === "loading") {
        return
      }
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/bookings/user')
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [session, status])

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending"
  )
  const pastBookings = filteredBookings.filter(
    (booking) => booking.status === "completed"
  )
  const cancelledBookings = filteredBookings.filter(
    (booking) => booking.status === "cancelled"
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinningLogo size="xl" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">Sign in to view your bookings</p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your rentals and bookings</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 text-sm sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Booking Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-base">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 sm:py-12">
                  <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No upcoming bookings</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Start exploring and book your next rental!</p>
                  <Button asChild>
                    <Link href="/browse">Browse Items</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={booking.listing.image || "/placeholder.svg"}
                        alt={booking.listing.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {booking.listing.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.listing.location}
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Dates</p>
                            <p className="font-medium">
                              {new Date(booking.startDate).toLocaleDateString()} -{" "}
                              {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="font-medium text-blue-600">₱{booking.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <Button size="sm" asChild>
                          <Link href={`/booking/${booking.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.listing.image || "/placeholder.svg"}
                      alt={booking.listing.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {booking.listing.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.listing.location}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>Completed</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dates</p>
                          <p className="font-medium">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-medium text-blue-600">₱{booking.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <Button size="sm" asChild>
                        <Link href={`/booking/${booking.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.listing.image || "/placeholder.svg"}
                      alt={booking.listing.title}
                      className="w-24 h-24 rounded-lg object-cover grayscale"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {booking.listing.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.listing.location}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>Cancelled</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dates</p>
                          <p className="font-medium line-through">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-medium">₱{booking.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <Button size="sm" asChild>
                        <Link href={`/listing/${booking.listing.id}`}>Book Again</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Calendar, MapPin, MessageCircle, Download, Star, Search } from "lucide-react"
import { mockBookings } from "@/lib/mock-bookings"

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch = booking.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const upcomingBookings = filteredBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const pastBookings = filteredBookings.filter((b) => b.status === "completed")
  const cancelledBookings = filteredBookings.filter((b) => b.status === "cancelled")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RenThing</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                Browse
              </Link>
              <Link href="/my-bookings" className="text-blue-600 font-medium">
                My Bookings
              </Link>
              <Link href="/list-item" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                List Item
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/browse">Browse Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your rentals and bookings</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
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
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No upcoming bookings</h3>
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                            <p className="font-medium">
                              {booking.duration} {booking.duration === 1 ? "day" : "days"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="font-medium text-blue-600">${booking.totalAmount}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" asChild>
                            <Link href={`/booking/${booking.id}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Contact Owner
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                          <p className="font-medium">
                            {booking.duration} {booking.duration === 1 ? "day" : "days"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-medium text-blue-600">${booking.totalAmount}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/booking/${booking.id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Star className="h-3 w-3 mr-1" />
                          Write Review
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Book Again
                        </Button>
                      </div>
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">Original Dates</p>
                          <p className="font-medium line-through">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Refund Status</p>
                          <p className="font-medium text-green-600">Refunded</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Refund Amount</p>
                          <p className="font-medium">${booking.totalAmount}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/listing/${booking.listing.id}`}>Book Again</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="h-3 w-3 mr-1" />
                          Refund Receipt
                        </Button>
                      </div>
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

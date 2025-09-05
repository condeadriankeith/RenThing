"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Tag, 
  Clock, 
  Bell,
  Star,
  Settings
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserPreferences {
  preferredCategories: string[]
  preferredPriceRange: {
    min: number
    max: number
  }
  preferredLocations: string[]
  engagementLevel: string
  // Add time-based preferences
  preferredBookingDays: string[]
  preferredBookingHours: number[]
}

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredCategories: [],
    preferredPriceRange: { min: 0, max: 1000 },
    preferredLocations: [],
    engagementLevel: "medium",
    // Initialize time-based preferences
    preferredBookingDays: [],
    preferredBookingHours: []
  })
  const [newCategory, setNewCategory] = useState("")
  const [newLocation, setNewLocation] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.id) {
      router.push("/auth/login?from=/profile/settings")
      return
    }

    fetchPreferences()
  }, [session, status, router])

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`/api/ai/preferences?userId=${session?.user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }
      const data = await response.json()
      if (data.success && data.preferences) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preferences. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/ai/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          preferences: preferences
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Preferences saved successfully!",
        })
      } else {
        throw new Error(data.error || 'Failed to save preferences')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      })
    }
  }

  const addCategory = () => {
    if (newCategory.trim() && !preferences.preferredCategories.includes(newCategory.trim())) {
      setPreferences({
        ...preferences,
        preferredCategories: [...preferences.preferredCategories, newCategory.trim()]
      })
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setPreferences({
      ...preferences,
      preferredCategories: preferences.preferredCategories.filter(c => c !== category)
    })
  }

  const addLocation = () => {
    if (newLocation.trim() && !preferences.preferredLocations.includes(newLocation.trim())) {
      setPreferences({
        ...preferences,
        preferredLocations: [...preferences.preferredLocations, newLocation.trim()]
      })
      setNewLocation("")
    }
  }

  const removeLocation = (location: string) => {
    setPreferences({
      ...preferences,
      preferredLocations: preferences.preferredLocations.filter(l => l !== location)
    })
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.id) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your preferences and account settings
            </p>
          </div>
          <Button onClick={savePreferences}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link href="#preferences">
                    <User className="h-4 w-4 mr-2" />
                    Preferences
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="#notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="#privacy">
                    <Star className="h-4 w-4 mr-2" />
                    Privacy
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preferences Section */}
            <Card id="preferences">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Rental Preferences
                </CardTitle>
                <CardDescription>
                  Customize your rental experience with personalized preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <Label className="text-lg font-medium mb-2 block">Preferred Categories</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Add categories you're interested in renting
                  </p>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add a category (e.g., cameras, tools)"
                      onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <Button onClick={addCategory}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.preferredCategories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5">
                        {category}
                        <button
                          onClick={() => removeCategory(category)}
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-lg font-medium mb-2 block">Preferred Price Range</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Set your preferred daily rental price range
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minPrice">Minimum (₱)</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        value={preferences.preferredPriceRange.min}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          preferredPriceRange: {
                            ...preferences.preferredPriceRange,
                            min: Number(e.target.value)
                          }
                        })}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice">Maximum (₱)</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        value={preferences.preferredPriceRange.max}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          preferredPriceRange: {
                            ...preferences.preferredPriceRange,
                            max: Number(e.target.value)
                          }
                        })}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <Label className="text-lg font-medium mb-2 block">Preferred Locations</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Add locations where you prefer to rent items
                  </p>
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Add a location (e.g., Makati, Cebu)"
                      onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                    />
                    <Button onClick={addLocation}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.preferredLocations.map((location, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                        <button
                          onClick={() => removeLocation(location)}
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time-Based Preferences */}
                <div>
                  <Label className="text-lg font-medium mb-2 block">Preferred Booking Days</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Select the days you prefer to make bookings
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={preferences.preferredBookingDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences({
                                ...preferences,
                                preferredBookingDays: [...preferences.preferredBookingDays, day]
                              });
                            } else {
                              setPreferences({
                                ...preferences,
                                preferredBookingDays: preferences.preferredBookingDays.filter(d => d !== day)
                              });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <Label htmlFor={`day-${day}`} className="text-sm">{day.substring(0, 3)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium mb-2 block">Preferred Booking Hours</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Select the hours you prefer to browse and book rentals
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <div key={hour} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`hour-${hour}`}
                          checked={preferences.preferredBookingHours.includes(hour)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences({
                                ...preferences,
                                preferredBookingHours: [...preferences.preferredBookingHours, hour]
                              });
                            } else {
                              setPreferences({
                                ...preferences,
                                preferredBookingHours: preferences.preferredBookingHours.filter(h => h !== hour)
                              });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <Label htmlFor={`hour-${hour}`} className="text-sm">{hour}:00</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about rentals and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Booking Confirmations</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when your bookings are confirmed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Price Drop Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get alerts when items in your wishlist drop in price
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Listings</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about new listings in your preferred categories
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Messages</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Privacy
                </CardTitle>
                <CardDescription>
                  Control who can see your information and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow other users to see your profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Rental History</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your rental history on your profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Location Visibility</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show your general location to other users
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
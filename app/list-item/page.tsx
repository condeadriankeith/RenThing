"use client"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Upload, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SpinnerLoader } from "@/components/ui/spinner-loader"
import { useSession } from "next-auth/react"

export default function ListItemPage() {
  const { data: session, status } = useSession()
  const [images, setImages] = useState<{url: string, publicId?: string}[]>([])
  const [features, setFeatures] = useState<string[]>([""])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const { toast } = useToast()
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    priceUnit: ''
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
            <p className="text-gray-600 mb-6">Sign in to list your items on RenThing</p>
            <Button asChild>
              <Link href="/auth/login?from=/list-item">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImages(true)
    
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      formData.append('folder', 'listings')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload images')
      }

      const result = await response.json()
      const newImages = result.images.map((img: any) => ({
        url: img.url,
        publicId: img.publicId
      }))
      
      setImages((prev) => [...prev, ...newImages].slice(0, 8)) // Max 8 images
      
      toast({
        title: "Images uploaded successfully!",
        description: `Uploaded ${newImages.length} image(s)`,
      })
    } catch (error: any) {
      console.error('Error uploading images:', error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    setFeatures((prev) => [...prev, ""])
  }

  const updateFeature = (index: number, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? value : feature)))
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        category: formData.category,
        priceUnit: formData.priceUnit,
        images: images.map(img => img.url), // Use uploaded image URLs
        features: features.filter(f => f.trim() !== '') // Remove empty features
      }

      // Validate required fields
      if (!listingData.title || !listingData.description || !listingData.price || !listingData.location || !listingData.category || !listingData.priceUnit) {
        throw new Error('Please fill in all required fields')
      }

      if (listingData.price <= 0) {
        throw new Error('Price must be greater than 0')
      }

      // TEMPORARILY DISABLE PHOTO REQUIREMENT FOR TESTING
      // if (images.length === 0) {
      //   throw new Error('Please add at least one image')
      // }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create listing')
      }

      const newListing = await response.json()
      
      toast({
        title: "Listing created successfully!",
        description: "Your item is now live on the marketplace.",
      })

      // Redirect to the new listing page
      window.location.href = `/listing/${newListing.id}`
      
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error creating listing",
        description: error.message || "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-2xl sm:max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">List Your Item</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Share your items or services with the RenThing community and start earning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about what you're offering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    placeholder="e.g., Professional Camera Kit" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="tools">Tools & Equipment</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="sports">Sports & Recreation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe your item or service in detail..."
                  className="min-h-32"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Add up to 8 high-quality photos of your item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <label className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors ${isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isUploadingImages ? (
                        <>
                          <SpinnerLoader size="sm" className="mb-2" />
                          <span className="text-sm text-gray-500">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploadingImages}
                      />
                    </label>
                  )}
                </div>
                {/* TEMPORARILY DISABLE PHOTO REQUIREMENT FOR TESTING */}
                <p className="text-sm text-gray-500 italic">
                  Note: Photo requirement is temporarily disabled for testing purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Availability</CardTitle>
              <CardDescription>Set your price and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Price Unit *</Label>
                  <Select value={formData.priceUnit} onValueChange={(value) => setFormData(prev => ({...prev, priceUnit: value}))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">per hour</SelectItem>
                      <SelectItem value="day">per day</SelectItem>
                      <SelectItem value="week">per week</SelectItem>
                      <SelectItem value="month">per month</SelectItem>
                      <SelectItem value="session">per session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="City, State" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
              <CardDescription>What's included with your item or service?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., Free delivery, Setup included"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                  />
                  {features.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/browse">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingImages}>
              {isLoading ? "Creating Listing..." : isUploadingImages ? "Images uploading..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
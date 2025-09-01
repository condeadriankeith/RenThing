"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  id: string
  listingId: string
  addedAt: string
  listing: {
    id: string
    title: string
    description: string
    price: number
    location: string
    images: string[]
    features: string[]
    owner: {
      id: string
      name: string
      email: string
    }
    createdAt: string
  }
}

export function useWishlist() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user's complete wishlist
  const fetchWishlist = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/wishlist")
      if (!response.ok) throw new Error("Failed to fetch wishlist")
      
      const data = await response.json()
      setWishlist(data.wishlist || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load your wishlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, toast])

  // Check if a specific listing is in wishlist
  const isInWishlist = useCallback((listingId: string): boolean => {
    return wishlist.some(item => item.listingId === listingId)
  }, [wishlist])

  // Add item to wishlist
  const addToWishlist = useCallback(async (listingId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      return false
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add to wishlist")
      }

      const data = await response.json()
      setWishlist(prev => [data.wishlistItem, ...prev])
      
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      })
      
      return true
    } catch (error: any) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to wishlist",
        variant: "destructive",
      })
      return false
    }
  }, [session?.user?.id, toast])

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (listingId: string) => {
    if (!session?.user?.id) return false

    try {
      const response = await fetch(`/api/wishlist?listingId=${listingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove from wishlist")
      }

      setWishlist(prev => prev.filter(item => item.listingId !== listingId))
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      })
      
      return true
    } catch (error: any) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from wishlist",
        variant: "destructive",
      })
      return false
    }
  }, [session?.user?.id, toast])

  // Toggle wishlist status
  const toggleWishlist = useCallback(async (listingId: string) => {
    if (isInWishlist(listingId)) {
      return await removeFromWishlist(listingId)
    } else {
      return await addToWishlist(listingId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  // Load wishlist on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    } else {
      setWishlist([])
    }
  }, [session?.user?.id, fetchWishlist])

  return {
    wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    wishlistCount: wishlist.length
  }
}
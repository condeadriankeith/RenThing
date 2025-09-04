"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  listingId: string
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  listingId, 
  variant = "ghost", 
  size = "sm", 
  className,
  showText = false 
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const inWishlist = isInWishlist(listingId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(listingId)
  }

  const sizeClasses = {
    sm: "h-9 w-9 p-0 rounded-full",
    md: "h-11 w-11 p-0 rounded-full", 
    lg: "h-13 w-13 p-0 rounded-full"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  if (showText) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={cn("flex items-center space-x-2 rounded-full", className)}
      >
        <Heart 
          className={cn(
            iconSizes[size],
            inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
          )} 
        />
        <span>{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        variant === "ghost" && "bg-white/90 hover:bg-white shadow-lg",
        "transition-all duration-200 hover:scale-105",
        className
      )}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          inWishlist ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"
        )} 
      />
    </Button>
  )
}
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
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0", 
    lg: "h-12 w-12 p-0"
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
        className={cn("flex items-center space-x-2", className)}
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
        variant === "ghost" && "bg-white/80 hover:bg-white",
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
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Share, Copy, Facebook, Twitter, MessageCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  listingId: string
  listingTitle: string
  listingPrice: number
  listingImage?: string
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ShareButton({ 
  listingId, 
  listingTitle, 
  listingPrice,
  listingImage,
  variant = "outline", 
  size = "sm", 
  className 
}: ShareButtonProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/listing/${listingId}` : ''
  const shareText = `Check out this rental: ${listingTitle} for ₱${listingPrice.toLocaleString()}/day on RenThing!`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "The listing link has been copied to your clipboard",
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const handleEmailShare = () => {
    const emailSubject = encodeURIComponent(`Check out this rental: ${listingTitle}`)
    const emailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`
    window.open(emailUrl)
    setIsOpen(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: shareText,
          url: shareUrl,
        })
        setIsOpen(false)
      } catch (error) {
        // User cancelled or share failed, fallback to copy link
        if (error instanceof Error && error.name !== 'AbortError') {
          handleCopyLink()
        }
      }
    } else {
      handleCopyLink()
    }
  }

  // Check if Web Share API is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("flex items-center space-x-2", className)}
        >
          <Share className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="h-4 w-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="h-4 w-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Share on WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="h-4 w-4 mr-2" />
          Share via Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
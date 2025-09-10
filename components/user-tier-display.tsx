"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Heart, 
  Users, 
  Tag,
  CheckCircle,
  XCircle
} from "lucide-react"

interface UserTier {
  id: string
  userId: string
  tier: string // new, bronze, silver, gold
  points: number
  totalListingsRented: number
  totalListingsOwned: number
  totalSuccessfulRentals: number
  createdAt: string
  updatedAt: string
}

interface TierBenefits {
  tier: string
  maxListings: number
  discount: number
  prioritySupport: boolean
  dedicatedAccountManager: boolean
  featuredListings: boolean
}

interface UserTierDisplayProps {
  userId: string
  isOwnProfile: boolean
}

export function UserTierDisplay({ userId, isOwnProfile }: UserTierDisplayProps) {
  const [userTier, setUserTier] = useState<UserTier | null>(null)
  const [benefits, setBenefits] = useState<TierBenefits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        setIsLoading(true)
        
        // Fetch user tier
        const tierResponse = await fetch(`/api/users/${userId}/tier`)
        if (!tierResponse.ok) {
          throw new Error('Failed to fetch user tier')
        }
        const tierData = await tierResponse.json()
        setUserTier(tierData.userTier)
        setBenefits(tierData.benefits)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUserTier()
    }
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            User Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (error || !userTier || !benefits) {
    return null
  }

  // Calculate progress to next tier
  let progress = 0
  let pointsToNext = 0
  let nextTier = ""
  
  switch (userTier.tier) {
    case 'new':
      progress = Math.min(100, (userTier.points / 5) * 100)
      pointsToNext = Math.max(0, 5 - userTier.points)
      nextTier = "Bronze"
      break
    case 'bronze':
      progress = Math.min(100, (userTier.points / 20) * 100)
      pointsToNext = Math.max(0, 20 - userTier.points)
      nextTier = "Silver"
      break
    case 'silver':
      progress = Math.min(100, (userTier.points / 50) * 100)
      pointsToNext = Math.max(0, 50 - userTier.points)
      nextTier = "Gold"
      break
    case 'gold':
      progress = 100
      break
  }

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600'
      case 'silver': return 'text-gray-400'
      case 'gold': return 'text-yellow-500'
      default: return 'text-gray-600'
    }
  }

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Trophy className="h-5 w-5 text-amber-600" />
      case 'silver': return <Trophy className="h-5 w-5 text-gray-400" />
      case 'gold': return <Crown className="h-5 w-5 text-yellow-500" />
      default: return <Star className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          User Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tier Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTierIcon(userTier.tier)}
            <span className={`text-xl font-bold capitalize ${getTierColor(userTier.tier)}`}>
              {userTier.tier} Tier
            </span>
          </div>
          {isOwnProfile && (
            <Badge variant="secondary">
              {userTier.points} pts
            </Badge>
          )}
        </div>

        {/* Progress to Next Tier */}
        {userTier.tier !== 'gold' && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to {nextTier} Tier</span>
              <span>{pointsToNext} pts to go</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Tier Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{userTier.totalListingsRented}</div>
            <div className="text-xs text-gray-500">Items Rented</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{userTier.totalListingsOwned}</div>
            <div className="text-xs text-gray-500">Items Listed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{userTier.totalSuccessfulRentals}</div>
            <div className="text-xs text-gray-500">Successful Rentals</div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div>
          <h3 className="font-medium mb-2">Benefits</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Max {benefits.maxListings === Infinity ? 'Unlimited' : benefits.maxListings} Listings</span>
              </div>
              {benefits.maxListings === Infinity && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {benefits.discount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span>{benefits.discount}% Discount Vouchers</span>
              </div>
              {benefits.discount > 0 && (
                <Tag className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {benefits.prioritySupport ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span>Priority Support</span>
              </div>
              {benefits.prioritySupport && (
                <Zap className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {benefits.dedicatedAccountManager ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span>Dedicated Account Manager</span>
              </div>
              {benefits.dedicatedAccountManager && (
                <Users className="h-4 w-4 text-purple-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {benefits.featuredListings ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span>Featured Listings</span>
              </div>
              {benefits.featuredListings && (
                <Heart className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
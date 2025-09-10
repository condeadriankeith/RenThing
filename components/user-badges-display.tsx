"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  Crown, 
  Zap, 
  Heart, 
  Users, 
  Tag,
  CheckCircle
} from "lucide-react"

interface UserBadge {
  id: string
  badgeType: string
  createdAt: string
  expiresAt?: string
}

interface UserBadgesDisplayProps {
  badges: UserBadge[]
}

export function UserBadgesDisplay({ badges }: UserBadgesDisplayProps) {
  if (!badges || badges.length === 0) {
    return null
  }

  const getBadgeDetails = (badgeType: string) => {
    switch (badgeType) {
      case 'verified':
        return {
          name: 'Verified Badge',
          icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
          benefits: [
            'Enhanced profile visibility',
            'Priority in search results',
            'Exclusive customer support',
            'Increased trust score'
          ]
        }
      case 'gold_renter':
        return {
          name: 'Gold Renter Status',
          icon: <Crown className="h-5 w-5 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
          benefits: [
            'All Gold tier benefits',
            'Reduced commission fees',
            'Featured listings',
            'Dedicated account manager'
          ]
        }
      default:
        return {
          name: 'Badge',
          icon: <ShieldCheck className="h-5 w-5 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
          benefits: []
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
          Your Badges
        </CardTitle>
        <CardDescription>
          Special badges that enhance your RenThing experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {badges.map((badge) => {
          const details = getBadgeDetails(badge.badgeType)
          return (
            <div key={badge.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {details.icon}
                  <span className="ml-2 font-medium">{details.name}</span>
                </div>
                <Badge className={details.color}>
                  Active
                </Badge>
              </div>
              
              {badge.expiresAt && (
                <div className="text-sm text-gray-500 mb-3">
                  Expires on {new Date(badge.expiresAt).toLocaleDateString()}
                </div>
              )}
              
              {details.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {details.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
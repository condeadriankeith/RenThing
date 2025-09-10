"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Award, 
  Star, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  Users, 
  CheckCircle,
  Trophy,
  Zap,
  Crown
} from "lucide-react"

interface Achievement {
  id: string
  type: string
  title: string
  description: string
  icon: string | null
  earnedAt: string
  expiresAt?: string
}

interface AchievementsDisplayProps {
  achievements: Achievement[]
}

export function AchievementsDisplay({ achievements }: AchievementsDisplayProps) {
  if (!achievements || achievements.length === 0) {
    return null
  }

  const getAchievementIcon = (iconType: string | null) => {
    if (!iconType) return <Award className="h-5 w-5" />
    
    switch (iconType) {
      case 'trophy': return <Trophy className="h-5 w-5" />
      case 'star': return <Star className="h-5 w-5" />
      case 'calendar': return <Calendar className="h-5 w-5" />
      case 'shopping-bag': return <ShoppingBag className="h-5 w-5" />
      case 'heart': return <Heart className="h-5 w-5" />
      case 'users': return <Users className="h-5 w-5" />
      case 'zap': return <Zap className="h-5 w-5" />
      case 'crown': return <Crown className="h-5 w-5" />
      default: return <Award className="h-5 w-5" />
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'community': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'trust': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      case 'special': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Achievements & Badges
        </CardTitle>
        <CardDescription>
          Recognition for your accomplishments on RenThing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {getAchievementIcon(achievement.icon)}
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
              <Badge className={getAchievementColor(achievement.type)}>
                {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
              </span>
              {achievement.expiresAt && (
                <span>
                  Expires on {new Date(achievement.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
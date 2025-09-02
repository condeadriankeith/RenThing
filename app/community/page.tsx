import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  Pin, 
  Star,
  ExternalLink,
  ArrowRight
} from "lucide-react"

export default function CommunityForumPage() {
  const forumCategories = [
    {
      title: "General Discussion",
      description: "Chat about anything RenThing related",
      icon: MessageSquare,
      posts: 1247,
      lastPost: "2 hours ago",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: "Renting Tips & Advice",
      description: "Share and get advice on renting items",
      icon: Star,
      posts: 892,
      lastPost: "5 hours ago",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      title: "Owner's Corner",
      description: "Tips for listing and managing rentals",
      icon: Users,
      posts: 634,
      lastPost: "1 day ago",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      title: "Feature Requests",
      description: "Suggest new features for RenThing",
      icon: TrendingUp,
      posts: 298,
      lastPost: "3 days ago",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
    }
  ]

  const featuredPosts = [
    {
      title: "How I made $500 renting my camera gear this month",
      author: "PhotoPro_Manila",
      category: "Owner's Corner",
      replies: 23,
      views: 156,
      lastActivity: "2 hours ago",
      isPinned: true
    },
    {
      title: "Best practices for renting expensive electronics safely",
      author: "TechGuru_PH",
      category: "Renting Tips & Advice",
      replies: 15,
      views: 89,
      lastActivity: "4 hours ago",
      isPinned: false
    },
    {
      title: "Request: Add delivery tracking feature",
      author: "UserExperience123",
      category: "Feature Requests",
      replies: 8,
      views: 45,
      lastActivity: "1 day ago",
      isPinned: false
    },
    {
      title: "Welcome to the RenThing Community!",
      author: "RenThing_Team",
      category: "General Discussion",
      replies: 67,
      views: 234,
      lastActivity: "2 days ago",
      isPinned: true
    }
  ]

  const communityStats = [
    { label: "Total Members", value: "12,847", icon: Users },
    { label: "Total Posts", value: "3,071", icon: MessageSquare },
    { label: "Active Today", value: "423", icon: TrendingUp },
    { label: "Questions Answered", value: "2,156", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Community Forum
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Connect with other RenThing users, share experiences, and get help from the community
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search forum posts, topics, and discussions..."
                className="pl-10 py-3 text-lg"
              />
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {communityStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Notice Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Community Forum Coming Soon!
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  We're building an amazing community forum where RenThing users can connect, share experiences, 
                  and help each other. This feature is currently under development and will be available soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/contact">
                      Get Notified When It's Ready
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/help">
                      Visit Help Center Instead
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Featured Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pin className="w-5 h-5 mr-2" />
                    Featured Discussions (Preview)
                  </CardTitle>
                  <CardDescription>
                    See what kinds of discussions you'll be able to join
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featuredPosts.map((post, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {post.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                              <Badge variant="secondary" className="text-xs">
                                {post.category}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              by {post.author}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {post.replies} replies
                              </span>
                              <span>{post.views} views</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {post.lastActivity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Forum Categories (Preview)</CardTitle>
                  <CardDescription>
                    Explore the different discussion topics that will be available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {forumCategories.map((category, index) => {
                      const IconComponent = category.icon
                      return (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${category.color}`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {category.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {category.posts} posts
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last: {category.lastPost}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Join Community */}
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect with thousands of RenThing users to share experiences and get help.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">
                      Get Early Access
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Be respectful and kind to all members</p>
                    <p>• Stay on topic and relevant to RenThing</p>
                    <p>• No spam or self-promotion</p>
                    <p>• Help others and share your knowledge</p>
                    <p>• Report inappropriate content</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/terms">
                      Read Full Guidelines
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help Now?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    While our forum is in development, you can still get help:
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/help">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Help Center
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/contact">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Be Part of Something Amazing
            </h3>
            <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Join thousands of RenThing users who are already sharing, helping, and growing together.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/contact">
                Join the Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
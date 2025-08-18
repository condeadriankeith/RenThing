"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement actual authentication
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Login functionality coming soon!",
        description: "Authentication will be implemented in the next phase.",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-md rounded-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold">RenThing</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required className="text-sm sm:text-base" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="text-sm sm:text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <input id="remember" type="checkbox" className="rounded border-gray-300" />
                <Label htmlFor="remember" className="text-xs sm:text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full py-2 sm:py-3 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 sm:mt-6">
            <Separator className="my-3 sm:my-4" />
            <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

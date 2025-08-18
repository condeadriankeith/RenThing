"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement actual registration
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Registration functionality coming soon!",
        description: "User registration will be implemented in the next phase.",
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
          <CardTitle className="text-xl sm:text-2xl">Create your account</CardTitle>
          <CardDescription className="text-sm sm:text-base">Join RenThing to start renting and booking</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="firstName" className="text-sm">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" required className="text-sm sm:text-base" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" required className="text-sm sm:text-base" />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email address" required className="text-sm sm:text-base" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <Input id="username" placeholder="Choose a username" required className="text-sm sm:text-base" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="userType" className="text-sm">Account Type</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Rent & Book)</SelectItem>
                  <SelectItem value="vendor">Vendor (List & Provide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className="text-sm sm:text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input id="terms" type="checkbox" className="rounded border-gray-300" required />
              <Label htmlFor="terms" className="text-xs sm:text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full py-2 sm:py-3 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-5 sm:mt-6">
            <Separator className="my-3 sm:my-4" />
            <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

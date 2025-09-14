"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const userType = formData.get('userType') as string

    if (password !== confirmPassword) {
      setIsLoading(false)
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: `${firstName} ${lastName}`,
          username,
          password,
          userType, // Include userType in the request
        }),
      })

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "You can now log in with your credentials.",
        })
        // Redirect to login page
        window.location.href = '/auth/login'
      } else {
        const errorData = await response.json()
        toast({
          title: "Registration failed",
          description: errorData.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg rounded-xl border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <div className="relative h-9 w-auto">
              <Image 
                src="/RenThing_Logo.png" 
                alt="RenThing" 
                width={36} 
                height={36} 
                className="h-9 w-auto"
                priority
              />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white">RenThing</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Create your account</CardTitle>
          <CardDescription className="text-sm sm:text-base">Join RenThing to start renting and booking</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder="Enter your first name" 
                  required 
                  className="text-sm sm:text-base h-11" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  placeholder="Enter your last name" 
                  required 
                  className="text-sm sm:text-base h-11" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="Enter your email address" 
                required 
                className="text-sm sm:text-base h-11" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input 
                id="username" 
                name="username"
                placeholder="Choose a username" 
                required 
                className="text-sm sm:text-base h-11" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-medium">Account Type</Label>
              <Select required name="userType" onValueChange={setUserType}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Rent & Book)</SelectItem>
                  <SelectItem value="vendor">Vendor (List & Provide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Verified Badge Option for Vendors */}
            {userType === "vendor" && (
              <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">Get Verified Badge</Label>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      As a vendor, you can apply for a verified badge to build trust with renters. 
                      This will require additional verification steps.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs h-8 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      disabled
                    >
                      Apply for Verification (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className="text-sm sm:text-base pr-12 h-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className="text-sm sm:text-base pr-12 h-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                id="terms" 
                name="terms"
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0" 
                required 
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline hover:text-blue-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline hover:text-blue-700">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-medium" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-5 sm:mt-6">
            <Separator className="my-3 sm:my-4" />
            <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
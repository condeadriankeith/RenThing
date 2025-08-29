"use client"

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react"
import { getSession, signIn, signOut } from "next-auth/react"
import { useToast } from "./use-toast"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"

// Extends the default NextAuth Session user to include our custom 'role'
type ExtendedUser = Session["user"] & {
  id: string
  role?: string
}


interface AuthContextType {
  user: ExtendedUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: {
    email: string
    name: string
    password: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const fetchSession = async () => {
    setIsLoading(true)
    try {
      // Use getSession to check for an active session
      const session = await getSession()
      if (session?.user) {
        setUser(session.user as ExtendedUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch session:", error)
      setUser(null)
      toast({
        title: "Session Check Failed",
        description: "Could not verify your session. Please try logging in again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Use signIn from next-auth for credentials-based login
      const result = await signIn("credentials", {
        redirect: false, // Do not redirect, handle it manually
        email,
        password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      await fetchSession() // Refresh session data after login
      router.push("/browse") // Redirect to a protected page
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false }) // Sign out without redirecting
      setUser(null)
      router.push("/auth/login") // Manually redirect to the login page
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong during logout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    name: string
    password: string
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      })
      router.push("/auth/login")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

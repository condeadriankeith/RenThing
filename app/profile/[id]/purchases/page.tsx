"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SpinnerLoader } from "@/components/ui/spinner-loader"
import { 
  ArrowLeft, 
  ShoppingBag, 
  Ticket, 
  Crown, 
  ShieldCheck,
  Calendar,
  PhilippinePeso
} from "lucide-react"

interface Purchase {
  id: string
  itemType: string
  itemId?: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export default function PurchaseHistoryPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string
  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true)
        
        if (!isOwnProfile) {
          throw new Error("Unauthorized")
        }

        const response = await fetch(`/api/users/${userId}/purchases`)
        if (!response.ok) {
          throw new Error('Failed to fetch purchases')
        }
        const data = await response.json()
        setPurchases(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId && isOwnProfile) {
      fetchPurchases()
    }
  }, [userId, isOwnProfile])

  if (!isOwnProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to view this page.</p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading purchase history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href={`/profile/${userId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase History</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your purchase history and manage your items
            </p>
          </div>
          <div className="hidden sm:block">
            <ShoppingBag className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Purchases List */}
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No purchases yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't made any purchases yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {purchase.itemType === 'badge' ? (
                        purchase.itemId?.includes('verified') ? (
                          <ShieldCheck className="h-5 w-5 text-blue-500 mr-2" />
                        ) : (
                          <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                        )
                      ) : (
                        <Ticket className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {purchase.itemType === 'badge' ? (
                            purchase.itemId?.includes('verified') ? 'Verified Badge' : 'Gold Renter Status'
                          ) : (
                            `Item Voucher (₱${purchase.amount})`
                          )}
                        </CardTitle>
                        <CardDescription>
                          Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">₱{purchase.amount}</span>
                      <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Purchase ID: {purchase.id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
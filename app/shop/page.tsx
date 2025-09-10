"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingBag, 
  Crown, 
  ShieldCheck, 
  Ticket, 
  Star,
  ArrowLeft,
  ShoppingCart
} from "lucide-react"
import { SpinnerLoader } from "@/components/ui/spinner-loader"

interface ShopItem {
  id: string
  type: string
  name: string
  description: string
  price: number
  currency: string
  duration?: string
}

export default function ShopPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<ShopItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/shop/items')
        if (!response.ok) {
          throw new Error('Failed to fetch shop items')
        }
        const data = await response.json()
        setItems(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShopItems()
  }, [])

  const handlePurchase = async (itemId: string, price: number, type: string) => {
    if (!session?.user?.id) {
      router.push('/auth/login?from=/shop')
      return
    }

    setPurchasing(itemId)
    
    try {
      // Create purchase
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          itemType: type,
          itemId: itemId,
          amount: price,
          currency: 'PHP'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create purchase')
      }

      const purchase = await response.json()
      
      // Handle different item types
      if (type === 'badge') {
        // Create user badge
        const badgeResponse = await fetch('/api/users/' + session.user.id + '/badges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            badgeType: itemId.includes('verified') ? 'verified' : 'gold_renter',
            purchaseId: purchase.id,
            expiresAt: itemId.includes('yearly') ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          })
        })

        if (!badgeResponse.ok) {
          throw new Error('Failed to create badge')
        }
      } else if (type === 'voucher') {
        // Create voucher
        const voucherResponse = await fetch('/api/vouchers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            voucherType: 'item',
            discount: price,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          })
        })

        if (!voucherResponse.ok) {
          throw new Error('Failed to create voucher')
        }
      }

      // Show success message (in a real app, you might redirect to a confirmation page)
      alert('Purchase successful!')
    } catch (err: any) {
      console.error('Purchase error:', err)
      alert('Purchase failed: ' + err.message)
    } finally {
      setPurchasing(null)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading shop items...</p>
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

  const badgeItems = items.filter(item => item.type === 'badge')
  const voucherItems = items.filter(item => item.type === 'voucher')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shop</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Purchase badges and vouchers to enhance your RenThing experience
            </p>
          </div>
          <div className="hidden sm:block">
            <ShoppingBag className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Badges Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Crown className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Badges</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeItems.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {item.id.includes('verified') ? (
                          <ShieldCheck className="h-5 w-5 text-blue-500 mr-2" />
                        ) : (
                          <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        {item.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                    </div>
                    {item.id.includes('verified') && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">₱{item.price}</span>
                    {item.duration && (
                      <Badge variant="outline">{item.duration}</Badge>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Enhanced profile visibility
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Priority in search results
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Exclusive customer support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(item.id, item.price, item.type)}
                    disabled={purchasing === item.id}
                  >
                    {purchasing === item.id ? (
                      <>
                        <SpinnerLoader size="sm" className="mr-2" />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Vouchers Section */}
        <section>
          <div className="flex items-center mb-6">
            <Ticket className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vouchers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voucherItems.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ticket className="h-5 w-5 text-green-500 mr-2" />
                    {item.name}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">₱{item.price}</span>
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Valid for all item categories
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      No expiration for 1 year
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Stackable with other discounts
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handlePurchase(item.id, item.price, item.type)}
                    disabled={purchasing === item.id}
                  >
                    {purchasing === item.id ? (
                      <>
                        <SpinnerLoader size="sm" className="mr-2" />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How It Works</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Badges are applied to your profile immediately after purchase</li>
            <li>Vouchers are added to your account and can be used during checkout</li>
            <li>All purchases are one-time and non-refundable</li>
            <li>Badges have expiration dates as specified in the product description</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
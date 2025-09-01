import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Fetch user with their listings and basic stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        listings: {
          include: {
            reviews: {
              select: {
                rating: true,
                comment: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true
                  }
                },
                createdAt: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 10
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        bookings: {
          where: {
            status: 'completed'
          },
          select: {
            id: true,
            listing: {
              select: {
                title: true,
                owner: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        reviews: {
          include: {
            listing: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Calculate user stats
    const totalListings = user.listings.length
    const totalCompletedBookings = user.bookings.length
    
    // Calculate average rating from all reviews on user's listings
    const allReviews = user.listings.flatMap(listing => listing.reviews)
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0
    const totalReviews = allReviews.length

    // Format listings for response
    const formattedListings = user.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: JSON.parse(listing.images),
      features: JSON.parse(listing.features),
      createdAt: listing.createdAt,
      averageRating: listing.reviews.length > 0 
        ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length 
        : 0,
      reviewCount: listing.reviews.length,
      reviews: listing.reviews
    }))

    // Check if this is the user's own profile
    const isOwnProfile = session?.user?.id === userId

    // Return public profile info (or full info if own profile)
    const profileData = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      joinedAt: user.createdAt,
      stats: {
        totalListings,
        totalCompletedBookings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews
      },
      listings: formattedListings,
      reviews: user.reviews,
      // Only include email for own profile
      ...(isOwnProfile && { email: user.email })
    }

    return NextResponse.json(profileData)

  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
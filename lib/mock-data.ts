// Mock data for development and testing
export interface Listing {
  id: string
  title: string
  description: string
  category: string
  price: number
  priceUnit: string
  location: string
  images: string[]
  rating: number
  reviewCount: number
  available: boolean
  features: string[]
  owner: {
    id: string
    name: string
    avatar: string
    rating: number
    reviewCount: number
    joinedDate: string
  }
  reviews: {
    id: string
    user: {
      name: string
      avatar: string
    }
    rating: number
    comment: string
    date: string
  }[]
  createdAt: Date
}

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Professional DSLR Camera Kit",
    description:
      "Complete photography setup with Canon EOS R5, multiple lenses, tripod, and lighting equipment. Perfect for events, portraits, and commercial shoots.",
    category: "electronics",
    price: 150,
    priceUnit: "day",
    location: "San Francisco, CA",
    images: [
      "/professional-camera-kit.png",
      "/camera-lenses.png",
      "/placeholder-do175.png",
      "/camera-lighting.png",
    ],
    rating: 4.9,
    reviewCount: 47,
    available: true,
    features: [
      "Canon EOS R5 Body",
      "24-70mm f/2.8 Lens",
      "85mm f/1.4 Portrait Lens",
      "Professional Tripod",
      "LED Light Panel",
      "Memory Cards Included",
      "Carrying Case",
      "Free Delivery",
    ],
    owner: {
      id: "owner1",
      name: "Sarah Chen",
      avatar: "/photographer-woman.png",
      rating: 4.8,
      reviewCount: 156,
      joinedDate: "2022",
    },
    reviews: [
      {
        id: "review1",
        user: {
          name: "Mike Johnson",
          avatar: "/man-profile.png",
        },
        rating: 5,
        comment:
          "Amazing camera kit! Sarah was super helpful and the equipment was in perfect condition. Got some incredible shots for my wedding.",
        date: "2 weeks ago",
      },
      {
        id: "review2",
        user: {
          name: "Emily Davis",
          avatar: "/woman-profile.png",
        },
        rating: 5,
        comment: "Professional quality equipment and excellent service. Will definitely rent again!",
        date: "1 month ago",
      },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Power Tools Set - Drill, Saw, Grinder",
    description:
      "Complete power tools collection including cordless drill, circular saw, angle grinder, and more. All tools are professional grade and well-maintained.",
    category: "tools",
    price: 75,
    priceUnit: "day",
    location: "Austin, TX",
    images: [
      "/placeholder-39uvh.png",
      "/cordless-drill.png",
      "/circular-saw.png",
      "/angle-grinder-sparks.png",
    ],
    rating: 4.7,
    reviewCount: 23,
    available: true,
    features: [
      "Cordless Drill/Driver",
      "Circular Saw",
      "Angle Grinder",
      "Impact Driver",
      "Extra Batteries",
      "Carrying Cases",
      "Safety Equipment",
    ],
    owner: {
      id: "owner2",
      name: "Tom Rodriguez",
      avatar: "/contractor-man.png",
      rating: 4.9,
      reviewCount: 89,
      joinedDate: "2021",
    },
    reviews: [
      {
        id: "review3",
        user: {
          name: "Lisa Park",
          avatar: "/woman-contractor.png",
        },
        rating: 5,
        comment: "Great tools for my home renovation project. Tom was very accommodating with pickup times.",
        date: "1 week ago",
      },
    ],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    title: "Tesla Model 3 - Weekend Rental",
    description:
      "Experience electric driving with this pristine Tesla Model 3. Perfect for weekend trips, special occasions, or just trying out an EV before buying.",
    category: "vehicles",
    price: 120,
    priceUnit: "day",
    location: "Los Angeles, CA",
    images: [
      "/white-tesla-model-3.png",
      "/placeholder-ag1gm.png",
      "/tesla-charging.png",
      "/tesla-dashboard.png",
    ],
    rating: 4.8,
    reviewCount: 34,
    available: true,
    features: [
      "Autopilot Enabled",
      "Premium Interior",
      "Supercharger Access",
      "Full Self-Driving",
      "Mobile Connector",
      "Clean & Sanitized",
      "Insurance Included",
    ],
    owner: {
      id: "owner3",
      name: "Alex Kim",
      avatar: "/young-man-tesla-owner.png",
      rating: 4.9,
      reviewCount: 67,
      joinedDate: "2023",
    },
    reviews: [
      {
        id: "review4",
        user: {
          name: "Jennifer Wu",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        rating: 5,
        comment:
          "Incredible experience! The car was spotless and Alex provided great instructions. Loved the autopilot feature.",
        date: "3 days ago",
      },
    ],
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    title: "Wedding Photography Service",
    description:
      "Professional wedding photography with 10+ years experience. Includes engagement session, full wedding day coverage, and edited digital gallery.",
    category: "services",
    price: 2500,
    priceUnit: "session",
    location: "Seattle, WA",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 5.0,
    reviewCount: 78,
    available: true,
    features: [
      "8-10 Hours Coverage",
      "Engagement Session",
      "500+ Edited Photos",
      "Online Gallery",
      "Print Release",
      "Second Photographer",
      "Same Day Sneak Peek",
    ],
    owner: {
      id: "owner4",
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5.0,
      reviewCount: 124,
      joinedDate: "2019",
    },
    reviews: [
      {
        id: "review5",
        user: {
          name: "David & Sarah",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        rating: 5,
        comment:
          "Maria captured our special day perfectly! Her attention to detail and artistic eye made our photos absolutely stunning.",
        date: "2 months ago",
      },
    ],
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    title: "Mountain Bike - Trek Full Suspension",
    description:
      "High-performance mountain bike perfect for trails and off-road adventures. Recently serviced with new tires and brake pads.",
    category: "sports",
    price: 45,
    priceUnit: "day",
    location: "Denver, CO",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 4.6,
    reviewCount: 19,
    available: true,
    features: [
      "Full Suspension",
      "29-inch Wheels",
      "21-Speed Shimano",
      "Disc Brakes",
      "Helmet Included",
      "Basic Repair Kit",
      "Trail Maps",
    ],
    owner: {
      id: "owner5",
      name: "Jake Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      reviewCount: 42,
      joinedDate: "2022",
    },
    reviews: [
      {
        id: "review6",
        user: {
          name: "Amanda Foster",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        rating: 5,
        comment: "Perfect bike for exploring the Colorado trails! Jake provided great recommendations for routes too.",
        date: "1 week ago",
      },
    ],
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    title: "Party DJ Service with Equipment",
    description:
      "Professional DJ service for parties, weddings, and events. Includes sound system, microphones, lighting, and music library spanning all genres.",
    category: "services",
    price: 400,
    priceUnit: "session",
    location: "Miami, FL",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 4.8,
    reviewCount: 56,
    available: true,
    features: [
      "Professional Sound System",
      "LED Party Lights",
      "Wireless Microphones",
      "Music Library (All Genres)",
      "MC Services",
      "Setup & Breakdown",
      "4-Hour Minimum",
    ],
    owner: {
      id: "owner6",
      name: "Carlos Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviewCount: 98,
      joinedDate: "2020",
    },
    reviews: [
      {
        id: "review7",
        user: {
          name: "Rachel Green",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        rating: 5,
        comment:
          "Carlos made our wedding reception unforgettable! Great music selection and kept everyone dancing all night.",
        date: "3 weeks ago",
      },
    ],
    createdAt: new Date("2024-01-25"),
  },
]

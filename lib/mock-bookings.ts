// Mock booking data for development and testing

export interface Booking {
  id: string
  userId: string
  listingId: string
  listing: {
    id: string
    title: string
    image: string
    location: string
    category: string
  }
  startDate: string
  endDate: string
  duration: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  transactionId: string
  owner: {
    id: string
    name: string
    avatar: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  confirmationCode: string
  notes?: string
}

export const mockBookings: Booking[] = [
  {
    id: "booking_001",
    userId: "user_123",
    listingId: "1",
    listing: {
      id: "1",
      title: "Professional DSLR Camera Kit",
      image: "/professional-camera-kit.png",
      location: "San Francisco, CA",
      category: "electronics",
    },
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    duration: 2,
    status: "confirmed",
    totalAmount: 315,
    paymentStatus: "paid",
    transactionId: "txn_mock_001",
    owner: {
      id: "owner1",
      name: "Sarah Chen",
      avatar: "/photographer-woman.png",
      phone: "+1 (555) 123-4567",
    },
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:30:00Z",
    confirmationCode: "RC-CAM001",
    notes: "Pickup arranged for 9 AM at owner's studio",
  },
  {
    id: "booking_002",
    userId: "user_123",
    listingId: "2",
    listing: {
      id: "2",
      title: "Power Tools Set - Drill, Saw, Grinder",
      image: "/placeholder-39uvh.png",
      location: "Austin, TX",
      category: "tools",
    },
    startDate: "2024-03-20",
    endDate: "2024-03-22",
    duration: 2,
    status: "pending",
    totalAmount: 158,
    paymentStatus: "paid",
    transactionId: "txn_mock_002",
    owner: {
      id: "owner2",
      name: "Tom Rodriguez",
      avatar: "/contractor-man.png",
      phone: "+1 (555) 234-5678",
    },
    createdAt: "2024-03-12T14:00:00Z",
    updatedAt: "2024-03-12T14:00:00Z",
    confirmationCode: "RC-TOL002",
  },
  {
    id: "booking_003",
    userId: "user_123",
    listingId: "3",
    listing: {
      id: "3",
      title: "Tesla Model 3 - Weekend Rental",
      image: "/white-tesla-model-3.png",
      location: "Los Angeles, CA",
      category: "vehicles",
    },
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    duration: 2,
    status: "completed",
    totalAmount: 252,
    paymentStatus: "paid",
    transactionId: "txn_mock_003",
    owner: {
      id: "owner3",
      name: "Alex Kim",
      avatar: "/young-man-tesla-owner.png",
      phone: "+1 (555) 345-6789",
    },
    createdAt: "2024-02-05T09:00:00Z",
    updatedAt: "2024-02-12T18:00:00Z",
    confirmationCode: "RC-TES003",
    notes: "Great experience! Car was clean and well-maintained.",
  },
  {
    id: "booking_004",
    userId: "user_123",
    listingId: "5",
    listing: {
      id: "5",
      title: "Mountain Bike - Trek Full Suspension",
      image: "/placeholder.svg?height=400&width=400",
      location: "Denver, CO",
      category: "sports",
    },
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    duration: 2,
    status: "cancelled",
    totalAmount: 95,
    paymentStatus: "refunded",
    transactionId: "txn_mock_004",
    owner: {
      id: "owner5",
      name: "Jake Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      phone: "+1 (555) 456-7890",
    },
    createdAt: "2024-01-10T16:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
    confirmationCode: "RC-BIK004",
    notes: "Cancelled due to weather conditions. Full refund processed.",
  },
  {
    id: "booking_005",
    userId: "user_123",
    listingId: "4",
    listing: {
      id: "4",
      title: "Wedding Photography Service",
      image: "/placeholder.svg?height=400&width=400",
      location: "Seattle, WA",
      category: "services",
    },
    startDate: "2024-04-20",
    endDate: "2024-04-20",
    duration: 1,
    status: "confirmed",
    totalAmount: 2625,
    paymentStatus: "paid",
    transactionId: "txn_mock_005",
    owner: {
      id: "owner4",
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=100&width=100",
      phone: "+1 (555) 567-8901",
    },
    createdAt: "2024-03-01T11:00:00Z",
    updatedAt: "2024-03-01T11:30:00Z",
    confirmationCode: "RC-WED005",
    notes: "Wedding photography package with engagement session included",
  },
]
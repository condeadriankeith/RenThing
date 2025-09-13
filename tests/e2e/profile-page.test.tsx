import { render, screen, waitFor } from '@testing-library/react'
import { UserProfilePage } from '../app/profile/[id]/page'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import '@testing-library/jest-dom'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn()
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>
  }
})

// Mock the components that are imported
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => (
    <button {...props}>{children}</button>
  )
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>
}))

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-tab={value}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div data-content={value}>{children}</div>
}))

jest.mock('@/components/ui/spinner-loader', () => ({
  SpinnerLoader: () => <div>Loading...</div>
}))

// Mock other components
jest.mock('@/components/wishlist-button', () => ({
  WishlistButton: () => <button>Wishlist</button>
}))

jest.mock('@/components/share-button', () => ({
  ShareButton: () => <button>Share</button>
}))

jest.mock('@/components/contact-owner-chat-fixed', () => ({
  ContactOwnerChat: () => <button>Contact</button>
}))

jest.mock('@/components/user-badges-display', () => ({
  UserBadgesDisplay: ({ badges }: any) => (
    <div data-testid="user-badges">
      {badges?.length > 0 ? `Badges: ${badges.length}` : 'No badges'}
    </div>
  )
}))

jest.mock('@/components/achievements-display', () => ({
  AchievementsDisplay: ({ achievements }: any) => (
    <div data-testid="achievements">
      {achievements?.length > 0 ? `Achievements: ${achievements.length}` : 'No achievements'}
    </div>
  )
}))

jest.mock('@/components/theme-selector', () => ({
  ThemeSelector: () => <button>Theme</button>
}))

jest.mock('@/components/background-selector', () => ({
  BackgroundSelector: () => <button>Background</button>
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Star: () => <div>Star</div>,
  MapPin: () => <div>MapPin</div>,
  Calendar: () => <div>Calendar</div>,
  ShoppingBag: () => <div>ShoppingBag</div>,
  MessageCircle: () => <div>MessageCircle</div>,
  User: () => <div>User</div>,
  ArrowLeft: () => <div>ArrowLeft</div>,
  Heart: () => <div>Heart</div>,
  Clock: () => <div>Clock</div>,
  Settings: () => <div>Settings</div>,
  Edit3: () => <div>Edit3</div>,
  Link: () => <div>Link</div>,
  CheckCircle: () => <div>CheckCircle</div>,
  Award: () => <div>Award</div>,
  Zap: () => <div>Zap</div>
}))

global.fetch = jest.fn()

describe('UserProfilePage', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading'
    })
    
    ;(useParams as jest.Mock).mockReturnValue({
      id: 'user123'
    })
    
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 'user123',
        name: 'Test User',
        avatar: null,
        bio: 'This is a test bio',
        location: 'Test City',
        socialLinks: { twitter: 'https://twitter.com/testuser' },
        responseTime: 2,
        isVerified: true,
        theme: 'default',
        background: null,
        joinedAt: '2023-01-01T00:00:00Z',
        stats: {
          totalListings: 5,
          totalCompletedBookings: 3,
          averageRating: 4.5,
          totalReviews: 10
        },
        listings: [],
        reviews: [],
        achievements: [],
        badges: []
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<UserProfilePage />)
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  it('renders profile page with user data', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user123' } },
      status: 'authenticated'
    })

    render(<UserProfilePage />)

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    expect(screen.getByText('This is a test bio')).toBeInTheDocument()
    expect(screen.getByText('Test City')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // listings count
    expect(screen.getByText('3')).toBeInTheDocument() // bookings count
    expect(screen.getByText('4.5')).toBeInTheDocument() // rating
  })

  it('displays user achievements when available', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user123' } },
      status: 'authenticated'
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'user123',
        name: 'Test User',
        avatar: null,
        bio: 'This is a test bio',
        location: 'Test City',
        socialLinks: { twitter: 'https://twitter.com/testuser' },
        responseTime: 2,
        isVerified: true,
        theme: 'default',
        background: null,
        joinedAt: '2023-01-01T00:00:00Z',
        stats: {
          totalListings: 5,
          totalCompletedBookings: 3,
          averageRating: 4.5,
          totalReviews: 10
        },
        listings: [],
        reviews: [],
        achievements: [
          {
            id: 'ach1',
            type: 'milestone',
            title: 'First Rental',
            description: 'Completed first rental',
            icon: 'trophy',
            earnedAt: '2023-01-01T00:00:00Z'
          }
        ],
        badges: []
      })
    })

    render(<UserProfilePage />)

    await waitFor(() => {
      expect(screen.getByTestId('achievements')).toBeInTheDocument()
    })

    expect(screen.getByText('Achievements: 1')).toBeInTheDocument()
  })

  it('handles profile not found error', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user123' } },
      status: 'authenticated'
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    render(<UserProfilePage />)

    await waitFor(() => {
      expect(screen.getByText('Profile not found')).toBeInTheDocument()
    })
  })
})
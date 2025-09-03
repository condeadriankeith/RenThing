import { MeiliSearch } from 'meilisearch'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SearchListing {
  id: string
  title: string
  description: string
  price: number
  location: string
  images: string[]
  features: string[]
  ownerId: string
  ownerName: string
  ownerImage?: string
  averageRating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface SearchOptions {
  query?: string
  filters?: {
    category?: string[]
    priceRange?: [number, number]
    location?: string[]
    available?: boolean
    rating?: number
    features?: string[]
  }
  sort?: {
    field: 'price' | 'createdAt' | 'rating' | 'relevance'
    order: 'asc' | 'desc'
  }
  pagination?: {
    page: number
    limit: number
  }
  geo?: {
    lat: number
    lng: number
    radius: number // in kilometers
  }
}

export interface SearchResult {
  hits: SearchListing[]
  query: string
  processingTimeMs: number
  totalHits: number
  totalPages: number
  currentPage: number
  facets?: {
    category: Record<string, number>
    priceRange: Record<string, number>
    location: Record<string, number>
    features: Record<string, number>
    rating: Record<string, number>
  }
}

class MeilisearchService {
  private client: MeiliSearch
  private indexName = 'listings'

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY || '',
    })
  }

  async initializeIndex() {
    try {
      // Try to get existing index
      const index = this.client.index(this.indexName)
      // Try to fetch a document to check if index exists
      await index.getDocuments({ limit: 1 })
      return index
    } catch (error) {
      // Index doesn't exist, create it
      await this.client.createIndex(this.indexName, {
        primaryKey: 'id',
      })

      const index = this.client.index(this.indexName)

      // Configure settings
      await index.updateSettings({
        searchableAttributes: [
          'title',
          'description',
          'location',
          'features',
        ],
        filterableAttributes: [
          'price',
          'location',
          'averageRating',
          'features',
          'ownerId',
        ],
        sortableAttributes: [
          'price',
          'createdAt',
          'averageRating',
        ],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness',
        ],
      })

      return index
    }
  }

  async indexListing(listingId: string) {
    try {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })

      if (!listing) return

      const averageRating = listing.reviews.length > 0
        ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
        : 0

      // Parse JSON fields
      let images: string[] = []
      let features: string[] = []

      try {
        images = JSON.parse(listing.images || '[]')
      } catch {
        images = []
      }

      try {
        features = JSON.parse(listing.features || '[]')
      } catch {
        features = []
      }

      const searchListing: SearchListing = {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        images,
        features,
        ownerId: listing.owner.id,
        ownerName: listing.owner.name || '',
        ownerImage: listing.owner.image || undefined,
        averageRating,
        reviewCount: listing.reviews.length,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
      }

      const index = await this.initializeIndex()
      await index.addDocuments([searchListing])
    } catch (error) {
      console.error('Error indexing listing:', error)
    }
  }

  async updateListing(listingId: string) {
    await this.indexListing(listingId)
  }

  async deleteListing(listingId: string) {
    try {
      const index = await this.initializeIndex()
      await index.deleteDocument(listingId)
    } catch (error) {
      console.error('Error deleting listing from index:', error)
    }
  }

  async search(options: SearchOptions): Promise<SearchResult> {
    try {
      const index = await this.initializeIndex()

      const searchParams: any = {
        q: options.query || '',
        limit: options.pagination?.limit || 20,
        offset: ((options.pagination?.page || 1) - 1) * (options.pagination?.limit || 20),
      }

      // Build filter array
      const filters: string[] = []

      if (options.filters?.priceRange) {
        filters.push(`price >= ${options.filters.priceRange[0]} AND price <= ${options.filters.priceRange[1]}`)
      }

      if (options.filters?.location?.length) {
        filters.push(`location IN [${options.filters.location.map(l => `"${l}"`).join(', ')}]`)
      }

      if (options.filters?.rating) {
        filters.push(`averageRating >= ${options.filters.rating}`)
      }

      if (options.filters?.features?.length) {
        options.filters.features.forEach(feature => {
          filters.push(`features CONTAINS "${feature}"`)
        })
      }

      if (filters.length > 0) {
        searchParams.filter = filters.join(' AND ')
      }

      // Configure sorting
      if (options.sort) {
        const sortField = options.sort.field === 'relevance' ? '_score' : options.sort.field
        searchParams.sort = [`${sortField}:${options.sort.order}`]
      }

      // Add facets
      searchParams.facets = ['location', 'features', 'averageRating']

      const searchResult = await index.search(searchParams.q, searchParams)

      // Transform facets into structured format
      const facets: {
        category: Record<string, number>
        priceRange: Record<string, number>
        location: Record<string, number>
        features: Record<string, number>
        rating: Record<string, number>
      } = {
        category: {},
        priceRange: {},
        location: {},
        features: {},
        rating: {},
      }

      if (searchResult.facetDistribution) {
        facets.location = searchResult.facetDistribution.location || {}
        facets.features = searchResult.facetDistribution.features || {}

        // Transform rating facets
        if (searchResult.facetDistribution.averageRating) {
          Object.entries(searchResult.facetDistribution.averageRating).forEach(([rating, count]) => {
            const ratingRange = Math.floor(parseFloat(rating))
            const key = `${ratingRange}+` as keyof typeof facets.rating
            facets.rating[key] = (facets.rating[key] || 0) + count
          })
        }

        // Generate price ranges
        const priceRanges = {
          'Under $50': 0,
          '$50-$200': 0,
          '$200-$500': 0,
          '$500-$1000': 0,
          'Over $1000': 0,
        }

        searchResult.hits.forEach((hit: any) => {
          const price = hit.price
          if (price < 50) priceRanges['Under $50']++
          else if (price < 200) priceRanges['$50-$200']++
          else if (price < 500) priceRanges['$200-$500']++
          else if (price < 1000) priceRanges['$500-$1000']++
          else priceRanges['Over $1000']++
        })

        facets.priceRange = priceRanges
      }

      return {
        hits: searchResult.hits as SearchListing[],
        query: options.query || '',
        processingTimeMs: searchResult.processingTimeMs,
        totalHits: searchResult.estimatedTotalHits || searchResult.hits.length,
        totalPages: Math.ceil((searchResult.estimatedTotalHits || searchResult.hits.length) / (options.pagination?.limit || 20)),
        currentPage: options.pagination?.page || 1,
        facets,
      }
    } catch (error) {
      console.error('Error searching with Meilisearch, falling back to database search:', error instanceof Error ? error.message : String(error))

      // Fallback to database search
      return this.fallbackDatabaseSearch(options)
    }
  }

  private async fallbackDatabaseSearch(options: SearchOptions): Promise<SearchResult> {
    try {
      const page = options.pagination?.page || 1
      const limit = options.pagination?.limit || 20
      const skip = (page - 1) * limit

      // Build where clause
      const where: any = {}

      if (options.query) {
        where.OR = [
          { title: { contains: options.query } },
          { description: { contains: options.query } },
          { location: { contains: options.query } },
        ]
      }

      if (options.filters?.priceRange) {
        where.price = {
          gte: options.filters.priceRange[0],
          lte: options.filters.priceRange[1],
        }
      }

      if (options.filters?.location?.length) {
        where.location = { in: options.filters.location }
      }

      // Get total count
      const totalCount = await prisma.listing.count({ where })

      // Get listings with sorting
      let orderBy: any = { createdAt: 'desc' }
      if (options.sort) {
        if (options.sort.field === 'price') {
          orderBy = { price: options.sort.order }
        } else if (options.sort.field === 'createdAt') {
          orderBy = { createdAt: options.sort.order }
        }
      }

      const listings = await prisma.listing.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      })

      // Transform to SearchListing format
      const searchListings: SearchListing[] = listings.map(listing => {
        const averageRating = listing.reviews.length > 0
          ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
          : 0

        // Parse JSON fields
        let images: string[] = []
        let features: string[] = []

        try {
          images = JSON.parse(listing.images || '[]')
        } catch {
          images = []
        }

        try {
          features = JSON.parse(listing.features || '[]')
        } catch {
          features = []
        }

        return {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          location: listing.location,
          images,
          features,
          ownerId: listing.owner.id,
          ownerName: listing.owner.name || '',
          ownerImage: listing.owner.image || undefined,
          averageRating,
          reviewCount: listing.reviews.length,
          createdAt: listing.createdAt.toISOString(),
          updatedAt: listing.updatedAt.toISOString(),
        }
      })

      return {
        hits: searchListings,
        query: options.query || '',
        processingTimeMs: 0,
        totalHits: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        facets: {
          category: {},
          priceRange: {},
          location: {},
          features: {},
          rating: {},
        },
      }
    } catch (error) {
      console.error('Error in fallback database search:', error)
      throw error
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      if (!query || query.length < 2) return []

      const index = await this.initializeIndex()
      const searchResult = await index.search(query, {
        limit: 8,
        attributesToRetrieve: ['title', 'category', 'features'],
      })

      const suggestions = new Set<string>()

      searchResult.hits.forEach((hit: any) => {
        suggestions.add(hit.title)
        if (hit.category) suggestions.add(hit.category)
        if (hit.features) {
          hit.features.forEach((feature: string) => {
            if (feature.toLowerCase().includes(query.toLowerCase())) {
              suggestions.add(feature)
            }
          })
        }
      })

      return Array.from(suggestions)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return []
    }
  }

  async syncDatabase() {
    try {
      console.log('Starting database sync with Meilisearch...')
      
      const listings = await prisma.listing.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })

      const searchListings: SearchListing[] = listings.map(listing => {
        const averageRating = listing.reviews.length > 0
          ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
          : 0

        // Parse JSON fields
        let images: string[] = []
        let features: string[] = []

        try {
          images = JSON.parse(listing.images || '[]')
        } catch {
          images = []
        }

        try {
          features = JSON.parse(listing.features || '[]')
        } catch {
          features = []
        }

        return {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          location: listing.location,
          images,
          features,
          ownerId: listing.owner.id,
          ownerName: listing.owner.name || '',
          ownerImage: listing.owner.image || undefined,
          averageRating,
          reviewCount: listing.reviews.length,
          createdAt: listing.createdAt.toISOString(),
          updatedAt: listing.updatedAt.toISOString(),
        }
      })

      const index = await this.initializeIndex()
      await index.deleteAllDocuments()
      
      if (searchListings.length > 0) {
        await index.addDocuments(searchListings)
      }

      console.log(`Synced ${searchListings.length} listings to Meilisearch`)
    } catch (error) {
      console.error('Error syncing database:', error)
    }
  }
}

export const searchService = new MeilisearchService()

// Auto-sync on startup in development
if (process.env.NODE_ENV !== 'production') {
  searchService.syncDatabase().catch(console.error)
}

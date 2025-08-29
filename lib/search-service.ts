import { MeiliSearch } from 'meilisearch'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SearchListing {
  id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  latitude: number
  longitude: number
  images: string[]
  features: string[]
  ownerId: string
  ownerName: string
  ownerImage?: string
  averageRating: number
  reviewCount: number
  available: boolean
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
      const index = await this.client.getIndex(this.indexName)
      return index
    } catch (error) {
      // Index doesn't exist, create it
      const index = await this.client.createIndex(this.indexName, {
        primaryKey: 'id',
      })

      // Configure searchable attributes
      await index.updateSearchableAttributes([
        'title',
        'description',
        'category',
        'location',
        'features',
      ])

      // Configure filterable attributes
      await index.updateFilterableAttributes([
        'category',
        'price',
        'location',
        'available',
        'averageRating',
        'features',
        'ownerId',
      ])

      // Configure sortable attributes
      await index.updateSortableAttributes([
        'price',
        'createdAt',
        'averageRating',
      ])

      // Configure ranking rules
      await index.updateRankingRules([
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'averageRating:desc',
      ])

      return index
    }
  }

  async indexListing(listingId: string) {
    try {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          images: true,
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

      const searchListing: SearchListing = {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        location: listing.location,
        latitude: listing.latitude,
        longitude: listing.longitude,
        images: listing.images.map(img => img.url),
        features: listing.features || [],
        ownerId: listing.owner.id,
        ownerName: listing.owner.name,
        ownerImage: listing.owner.image || undefined,
        averageRating,
        reviewCount: listing.reviews.length,
        available: listing.available,
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

      if (options.filters?.category?.length) {
        filters.push(`category IN [${options.filters.category.map(c => `"${c}"`).join(', ')}]`)
      }

      if (options.filters?.priceRange) {
        filters.push(`price >= ${options.filters.priceRange[0]} AND price <= ${options.filters.priceRange[1]}`)
      }

      if (options.filters?.location?.length) {
        filters.push(`location IN [${options.filters.location.map(l => `"${l}"`).join(', ')}]`)
      }

      if (options.filters?.available !== undefined) {
        filters.push(`available = ${options.filters.available}`)
      }

      if (options.filters?.rating) {
        filters.push(`averageRating >= ${options.filters.rating}`)
      }

      if (options.filters?.features?.length) {
        options.filters.features.forEach(feature => {
          filters.push(`features CONTAINS "${feature}"`)
        })
      }

      if (options.geo) {
        filters.push(`_geoRadius(${options.geo.lat}, ${options.geo.lng}, ${options.geo.radius * 1000})`)
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
      searchParams.facets = ['category', 'location', 'features', 'averageRating']

      const searchResult = await index.search(searchParams.q, searchParams)

      // Transform facets into structured format
      const facets = {
        category: {},
        priceRange: {},
        location: {},
        features: {},
        rating: {},
      }

      if (searchResult.facetDistribution) {
        facets.category = searchResult.facetDistribution.category || {}
        facets.location = searchResult.facetDistribution.location || {}
        facets.features = searchResult.facetDistribution.features || {}
        
        // Transform rating facets
        if (searchResult.facetDistribution.averageRating) {
          Object.entries(searchResult.facetDistribution.averageRating).forEach(([rating, count]) => {
            const ratingRange = Math.floor(parseFloat(rating))
            facets.rating[`${ratingRange}+`] = (facets.rating[`${ratingRange}+`] || 0) + count
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
      console.error('Error searching listings:', error)
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
          images: true,
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

        return {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          location: listing.location,
          latitude: listing.latitude,
          longitude: listing.longitude,
          images: listing.images.map(img => img.url),
          features: listing.features || [],
          ownerId: listing.owner.id,
          ownerName: listing.owner.name,
          ownerImage: listing.owner.image || undefined,
          averageRating,
          reviewCount: listing.reviews.length,
          available: listing.available,
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

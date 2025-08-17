// Mock Meilisearch integration for fast, typo-tolerant search
// In production, this would connect to actual Meilisearch instance

import type { Listing } from "./mock-data"

export interface SearchResult {
  hits: Listing[]
  query: string
  processingTimeMs: number
  hitsCount: number
  facetDistribution?: Record<string, Record<string, number>>
}

export interface SearchOptions {
  query?: string
  filters?: string[]
  facets?: string[]
  sort?: string[]
  limit?: number
  offset?: number
  attributesToHighlight?: string[]
}

class MockMeilisearchService {
  private listings: Listing[]

  constructor(listings: Listing[]) {
    this.listings = listings
  }

  async search(options: SearchOptions): Promise<SearchResult> {
    const startTime = Date.now()
    const { query = "", filters = [], limit = 20, offset = 0 } = options

    let results = [...this.listings]

    // Apply text search with typo tolerance (simplified)
    if (query) {
      const queryLower = query.toLowerCase()
      results = results.filter((listing) => {
        const searchableText = [
          listing.title,
          listing.description,
          listing.category,
          listing.location,
          ...listing.features,
        ]
          .join(" ")
          .toLowerCase()

        // Simple typo tolerance - allow 1 character difference for words > 3 chars
        return this.fuzzyMatch(searchableText, queryLower)
      })
    }

    // Apply filters
    filters.forEach((filter) => {
      const [field, operator, value] = filter.split(" ")
      results = results.filter((listing) => {
        switch (field) {
          case "category":
            return listing.category === value
          case "price":
            const price = listing.price
            if (operator === ">=") return price >= Number.parseFloat(value)
            if (operator === "<=") return price <= Number.parseFloat(value)
            return true
          case "available":
            return listing.available === (value === "true")
          default:
            return true
        }
      })
    })

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit)

    const processingTime = Date.now() - startTime

    return {
      hits: paginatedResults,
      query,
      processingTimeMs: processingTime,
      hitsCount: results.length,
      facetDistribution: this.generateFacets(results),
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return []

    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    this.listings.forEach((listing) => {
      // Add matching titles
      if (listing.title.toLowerCase().includes(queryLower)) {
        suggestions.add(listing.title)
      }

      // Add matching categories
      if (listing.category.toLowerCase().includes(queryLower)) {
        suggestions.add(listing.category)
      }

      // Add matching features
      listing.features.forEach((feature) => {
        if (feature.toLowerCase().includes(queryLower)) {
          suggestions.add(feature)
        }
      })
    })

    return Array.from(suggestions).slice(0, 8)
  }

  private fuzzyMatch(text: string, query: string): boolean {
    // Simple fuzzy matching - in production, use proper fuzzy search algorithm
    const words = query.split(" ")
    return words.every((word) => {
      if (word.length <= 3) {
        return text.includes(word)
      }

      // Allow 1 character difference for longer words
      for (let i = 0; i <= text.length - word.length; i++) {
        const substring = text.substring(i, i + word.length)
        if (this.levenshteinDistance(substring, word) <= 1) {
          return true
        }
      }
      return false
    })
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  private generateFacets(results: Listing[]): Record<string, Record<string, number>> {
    const facets: Record<string, Record<string, number>> = {
      category: {},
      location: {},
      priceRange: {},
    }

    results.forEach((listing) => {
      // Category facets
      facets.category[listing.category] = (facets.category[listing.category] || 0) + 1

      // Location facets
      const city = listing.location.split(",")[0]
      facets.location[city] = (facets.location[city] || 0) + 1

      // Price range facets
      const priceRange =
        listing.price < 50
          ? "Under $50"
          : listing.price < 200
            ? "$50-$200"
            : listing.price < 500
              ? "$200-$500"
              : "Over $500"
      facets.priceRange[priceRange] = (facets.priceRange[priceRange] || 0) + 1
    })

    return facets
  }
}

// Export singleton instance
export const searchService = new MockMeilisearchService([])

// Initialize with listings (in production, this would be handled by Meilisearch indexing)
export function initializeSearchService(listings: Listing[]) {
  return new MockMeilisearchService(listings)
}

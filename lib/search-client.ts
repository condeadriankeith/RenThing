import { SearchOptions, SearchResult } from './search-service'
import { useState } from 'react'

export interface SearchClientOptions extends Omit<SearchOptions, 'pagination'> {
  page?: number
  limit?: number
}

export interface SearchResponse extends SearchResult {
  success: boolean
}

export interface SuggestionsResponse {
  success: boolean
  data: string[]
}

class SearchClient {
  private baseUrl = '/api/search'

  async search(options: SearchClientOptions): Promise<SearchResponse> {
    const params = new URLSearchParams()
    
    if (options.query) params.append('q', options.query)
    if (options.page) params.append('page', options.page.toString())
    if (options.limit) params.append('limit', options.limit.toString())
    
    if (options.filters?.category?.length) {
      options.filters.category.forEach(cat => params.append('category', cat))
    }
    
    if (options.filters?.priceRange) {
      params.append('priceMin', options.filters.priceRange[0].toString())
      params.append('priceMax', options.filters.priceRange[1].toString())
    }
    
    if (options.filters?.location?.length) {
      options.filters.location.forEach(loc => params.append('location', loc))
    }
    
    if (options.filters?.rating) {
      params.append('rating', options.filters.rating.toString())
    }
    
    if (options.filters?.available !== undefined) {
      params.append('available', options.filters.available.toString())
    }
    
    if (options.filters?.features?.length) {
      options.filters.features.forEach(feature => params.append('features', feature))
    }
    
    if (options.sort?.field && options.sort?.order) {
      params.append('sortField', options.sort.field)
      params.append('sortOrder', options.sort.order)
    }
    
    if (options.geo) {
      params.append('lat', options.geo.lat.toString())
      params.append('lng', options.geo.lng.toString())
      params.append('radius', options.geo.radius.toString())
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to search')
    }
    
    return response.json()
  }

  async getSuggestions(query: string): Promise<SuggestionsResponse> {
    const params = new URLSearchParams()
    if (query) params.append('q', query)

    const response = await fetch(`/api/search/suggestions?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to get suggestions')
    }
    
    return response.json()
  }

  async syncIndex(): Promise<{ success: boolean; message?: string }> {
    const response = await fetch('/api/search/sync', {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync search index')
    }
    
    return response.json()
  }

  // Helper method to build URL from search options
  buildSearchUrl(options: SearchClientOptions): string {
    const params = new URLSearchParams()
    
    if (options.query) params.append('q', options.query)
    if (options.page) params.append('page', options.page.toString())
    if (options.limit) params.append('limit', options.limit.toString())
    
    // Add other parameters as needed
    
    return `${this.baseUrl}?${params.toString()}`
  }

  // Helper method to debounce search suggestions
  debounceSuggestions(query: string, delay: number = 300): Promise<SuggestionsResponse> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await this.getSuggestions(query)
        resolve(result)
      }, delay)
    })
  }
}

export const searchClient = new SearchClient()

// React hook for search state management
export function useSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (options: SearchClientOptions) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await searchClient.search(options)
      setResults(response)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getSuggestions = async (query: string) => {
    try {
      return await searchClient.getSuggestions(query)
    } catch (err) {
      console.error('Suggestions error:', err)
      return { success: false, data: [] }
    }
  }

  return {
    results,
    loading,
    error,
    search,
    getSuggestions,
  }
}
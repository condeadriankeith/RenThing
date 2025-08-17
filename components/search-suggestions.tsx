"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Clock } from "lucide-react"
import type { Listing } from "@/lib/mock-data"

interface SearchSuggestionsProps {
  query: string
  listings: Listing[]
  onSelect: (suggestion: string) => void
}

export function SearchSuggestions({ query, listings, onSelect }: SearchSuggestionsProps) {
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return []

    const queryLower = query.toLowerCase()
    const results = new Set<string>()

    // Add exact title matches
    listings.forEach((listing) => {
      if (listing.title.toLowerCase().includes(queryLower)) {
        results.add(listing.title)
      }
    })

    // Add category matches
    listings.forEach((listing) => {
      if (listing.category.toLowerCase().includes(queryLower)) {
        results.add(listing.category)
      }
    })

    // Add feature matches
    listings.forEach((listing) => {
      listing.features.forEach((feature) => {
        if (feature.toLowerCase().includes(queryLower)) {
          results.add(feature)
        }
      })
    })

    // Add location matches
    listings.forEach((listing) => {
      if (listing.location.toLowerCase().includes(queryLower)) {
        results.add(listing.location)
      }
    })

    return Array.from(results).slice(0, 8)
  }, [query, listings])

  const recentSearches = ["Camera equipment", "Tesla rental", "Power tools"]
  const popularSuggestions = ["Photography", "Wedding services", "Mountain bike", "DJ service"]

  if (!query) return null

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
      <div className="p-2">
        {/* Query-based suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center text-xs text-gray-500 mb-2 px-2">
              <Search className="h-3 w-3 mr-1" />
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSelect(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm"
              >
                <span className="font-medium">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Recent searches */}
        {query.length < 3 && (
          <div className="mb-3">
            <div className="flex items-center text-xs text-gray-500 mb-2 px-2">
              <Clock className="h-3 w-3 mr-1" />
              Recent
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSelect(search)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400"
              >
                {search}
              </button>
            ))}
          </div>
        )}

        {/* Popular suggestions */}
        {query.length < 3 && (
          <div>
            <div className="flex items-center text-xs text-gray-500 mb-2 px-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular
            </div>
            <div className="flex flex-wrap gap-1 px-2">
              {popularSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 text-xs"
                  onClick={() => onSelect(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

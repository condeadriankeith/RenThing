/**
 * REN AI Service - Client-side version for the RenThing AI personality
 * 
 * This service provides client-side functionality for:
 * 1. Making API calls to the AI backend
 * 2. Handling AI responses
 * 3. Managing client-side AI state
 */

import { PROJECT_MAP, getPageRoutes, findRouteByPath } from '@/ren-ai/services/project-map';

export interface AIContext {
  userId?: string;
  sessionId?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  currentLocation?: string;
  // Add geolocation data for enhanced location-based suggestions
  currentGeolocation?: {
    latitude: number;
    longitude: number;
  };
  userPreferences?: {
    language?: string;
    currency?: string;
    categories?: string[];
    priceRange?: { min: number; max: number };
    locations?: string[];
    // Add time-based preferences
    preferredBookingDays?: string[];
    preferredBookingHours?: number[];
  };
  inferredPreferences?: {
    preferredCategories?: string[];
    preferredPriceRange?: { min: number; max: number; avg: number };
    preferredLocations?: string[];
    engagementLevel?: string;
    bookingPatterns?: {
      preferredDays?: string[];
      preferredHours?: number[];
      avgDuration?: number;
    };
    // Add time-based inferred preferences
    preferredBookingDays?: string[];
    preferredBookingHours?: number[];
  };
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  action?: {
    type: string;
    payload?: any;
  } | null; // Allow null values
}

// Add new interface for search actions
export interface SearchAction {
  type: 'search_query' | 'web_search';
  payload: {
    query: string;
    filters?: {
      category?: string;
      location?: string;
      priceRange?: { min: number; max: number };
    };
  };
}

export class RenAIClientService {
  /**
   * Process a user message by calling the AI API
   * @param message The user's input message
   * @param context Context information about the user and conversation
   * @returns AI-generated response
   */
  async processMessage(message: string, context: AIContext): Promise<AIResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error processing AI message:', error);
      
      // Provide more specific error messages based on the type of error
      let errorMessage = "I'm having trouble connecting to my intelligence center right now.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "I'm having trouble connecting to my intelligence center. Please check your internet connection.";
      } else if (error instanceof Error) {
        errorMessage = `I encountered an issue: ${error.message}`;
      }
      
      return {
        text: `${errorMessage} Let me help you with some common tasks:`,
        suggestions: ["Find popular rentals", "List my items", "Check my bookings", "View wishlist"],
        action: undefined // Use undefined instead of null
      };
    }
  }

  /**
   * Get personalized recommendations for a user
   * @param userId The user ID to get recommendations for
   * @returns Array of recommended listings
   */
  async getRecommendations(userId: string) {
    try {
      const response = await fetch(`/api/ai/recommendations?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Get information about a specific listing
   * @param listingId The ID of the listing to get information for
   * @returns Listing information
   */
  async getListingInfo(listingId: string) {
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting listing info:', error);
      return null;
    }
  }

  /**
   * Get live database information for AI recommendations
   * @param params Parameters for the data request
   * @returns Requested data
   */
  async getLiveData(params: { userId?: string; type: string }) {
    try {
      const queryParams = new URLSearchParams({
        type: params.type,
        ...(params.userId && { userId: params.userId })
      });
      
      const response = await fetch(`/api/ai/live-data?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting live data:', error);
      return [];
    }
  }

  /**
   * Generate contextual suggestions based on user activity
   * @param context Current user context
   * @returns Array of contextual suggestions
   */
  async getContextualSuggestions(context: AIContext) {
    try {
      // Call the API endpoint to get contextual suggestions
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      // Fallback to default suggestions
      const suggestions = [];
      
      // If user is on browse page, suggest search filters
      if (context.userPreferences?.categories?.length) {
        suggestions.push(`Find more ${context.userPreferences.categories[0]} rentals`);
      }
      
      // Add general suggestions
      suggestions.push("Find popular rentals");
      suggestions.push("View trending items");
      suggestions.push("Import listings from web");
      
      return suggestions.slice(0, 4); // Limit to 4 suggestions
    }
  }

  /**
   * Get inferred user preferences based on implicit feedback analysis
   * @param userId The user ID to get preferences for
   * @returns Inferred user preferences
   */
  async getInferredUserPreferences(userId: string) {
    try {
      const response = await fetch(`/api/ai/preferences?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.preferences || null;
    } catch (error) {
      console.error('Error getting inferred user preferences:', error);
      return null;
    }
  }

  /**
   * Execute a search query on the platform
   * @param query The search query
   * @param filters Optional filters for the search
   * @returns Search results
   */
  async executeSearch(query: string, filters?: { category?: string; location?: string; priceRange?: { min: number; max: number } }) {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, filters })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error executing search:', error);
      return [];
    }
  }

  /**
   * Perform a web search using an external API
   * @param query The search query
   * @returns Web search results
   */
  async performWebSearch(query: string) {
    try {
      const response = await fetch('/api/ai/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error performing web search:', error);
      return [];
    }
  }

  /**
   * Parse user intent from their message
   * @param message The user's input message
   * @returns Parsed intent with entities
   */
  parseIntent(message: string): { query: string; filters?: { category?: string; location?: string; priceRange?: { min: number; max: number } } } | null {
    const lowerMessage = message.toLowerCase();
    
    // Extract potential search queries
    const searchPatterns = [
      /find\s+(.*?)(?:\s+in\s+(\w+))?$/i,
      /search\s+for\s+(.*?)(?:\s+in\s+(\w+))?$/i,
      /show\s+me\s+(.*?)(?:\s+in\s+(\w+))?$/i,
      /i\s+need\s+(.*?)(?:\s+in\s+(\w+))?$/i,
      /i\s+want\s+(.*?)(?:\s+in\s+(\w+))?$/i,
      /looking\s+for\s+(.*?)(?:\s+in\s+(\w+))?$/i
    ];
    
    for (const pattern of searchPatterns) {
      const match = message.match(pattern);
      if (match) {
        const query = match[1].trim();
        const location = match[2];
        
        // Extract price range if mentioned
        let priceRange: { min: number; max: number } | undefined;
        const priceMatch = message.match(/(?:under|below|less than|under ₱?|below ₱?|less than ₱?)\s*(\d+)/i);
        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[1]);
          priceRange = { min: 0, max: maxPrice };
        }
        
        // Extract category if mentioned
        let category: string | undefined;
        const categoryKeywords = ['camera', 'tool', 'bike', 'car', 'dress', 'party', 'speaker', 'tent', 'sports'];
        for (const keyword of categoryKeywords) {
          if (lowerMessage.includes(keyword)) {
            category = keyword;
            break;
          }
        }
        
        return {
          query,
          filters: {
            category,
            location,
            priceRange
          }
        };
      }
    }
    
    // If no specific pattern matched, treat the entire message as a query
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('show me')) {
      return {
        query: message.replace(/^(find|search|show me)\s+/i, '').trim()
      };
    }
    
    return null;
  }

  /**
   * Determine if a query should be executed as a web search
   * @param query The search query
   * @returns Whether the query should be a web search
   */
  isWebSearchQuery(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    
    // Keywords that suggest an informational query
    const webSearchKeywords = [
      'difference', 'compare', 'how to', 'what is', 'why', 'when', 'where',
      'tips', 'guide', 'tutorial', 'best practices', 'review', 'opinion'
    ];
    
    return webSearchKeywords.some(keyword => lowerQuery.includes(keyword));
  }
}

// Export singleton instance
export const renAIClientService = new RenAIClientService();
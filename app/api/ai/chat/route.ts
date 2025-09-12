import { NextResponse } from 'next/server';
import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { renAIClientService } from '@/ren-ai/services/ren-ai-service-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/chat
 * 
 * Handle AI chat messages from the frontend
 * 
 * Request Body:
 * - message: string - The user's message
 * - context: AIContext - Context information about the user
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - response?: AIResponse - The AI-generated response
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { message, context } = await req.json();
    
    // Validate input
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Prepare context with user information
    const aiContext = {
      ...context,
      userId: session?.user?.id || undefined,
      userPreferences: {
        language: 'en',
        currency: 'PHP',
        ...(context?.userPreferences || {})
      }
    };
    
    // Parse user intent
    const intent = renAIClientService.parseIntent(message);
    
    // If we can parse the intent, execute the appropriate action
    if (intent) {
      // Check if this should be a web search
      if (renAIClientService.isWebSearchQuery(intent.query)) {
        // Perform web search
        const results = await renAIClientService.performWebSearch(intent.query);
        
        // Return response with web search results
        return NextResponse.json({
          success: true,
          response: {
            text: `I've searched the web for information about "${intent.query}". Here are some relevant results:`,
            action: {
              type: 'web_search_results',
              payload: { results }
            },
            suggestions: [`Find rentals related to ${intent.query}`, "Ask another question", "Search for something else"]
          }
        });
      } else {
        // Execute platform search
        const results = await renAIClientService.executeSearch(intent.query, intent.filters);
        
        // Return response with search results
        if (results.length > 0) {
          return NextResponse.json({
            success: true,
            response: {
              text: `I've found ${results.length} items for "${intent.query}". I've taken you to the results. You can filter further by price or category there!`,
              action: {
                type: 'search_results',
                payload: { results }
              },
              suggestions: ["Refine search", "View all results", "Ask another question"]
            }
          });
        } else {
          // No results found, provide alternative suggestions
          return NextResponse.json({
            success: true,
            response: {
              text: `I couldn't find any items matching "${intent.query}". Would you like to try a different search or I can search the web for information about ${intent.query}?`,
              suggestions: ["Try a different search", `Search the web for ${intent.query}`, "View popular categories"]
            }
          });
        }
      }
    }
    
    // Process message with AI service for non-search queries
    const response = await renAIService.processMessage(message, aiContext);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      response
    });
    
  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process AI chat message' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/listing/[id]
 * 
 * Get information about a specific listing for AI recommendations
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // In a real implementation, this would fetch listing info
    // For now, we'll return a mock response
    const mockListingInfo = {
      id: params.id,
      title: "Sample Listing",
      description: "This is a sample listing for testing purposes",
      price: 100,
      location: "Manila",
      category: "Sample"
    };
    
    return NextResponse.json({
      success: true,
      listing: mockListingInfo
    });
    
  } catch (error) {
    console.error('AI Listing Info API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch listing information' 
      },
      { status: 500 }
    );
  }
}
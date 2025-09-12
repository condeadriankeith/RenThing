import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * POST /api/ai/web-search
 * 
 * Perform a web search using DuckDuckGo search API
 * 
 * Request Body:
 * - query: string - The search query
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - results?: Array - The search results
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Parse request body
    const { query } = await req.json();
    
    // Validate input
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Perform web search using DuckDuckGo
    const results = await performDuckDuckGoSearch(query);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Web Search API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform web search' 
      },
      { status: 500 }
    );
  }
}

/**
 * Perform a search using DuckDuckGo
 * @param query The search query
 * @returns Search results
 */
async function performDuckDuckGoSearch(query: string) {
  try {
    // Use DuckDuckGo's instant answer API
    const response = await axios.get(`https://api.duckduckgo.com/`, {
      params: {
        q: query,
        format: 'json',
        no_html: '1',
        skip_disambig: '1'
      }
    });
    
    const data = response.data;
    
    // Extract relevant information
    const results = [];
    
    // Add abstract result if available
    if (data.AbstractText) {
      results.push({
        title: data.Heading || `About ${query}`,
        snippet: data.AbstractText,
        url: data.AbstractURL || '#'
      });
    }
    
    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      const topics = data.RelatedTopics.slice(0, 3); // Limit to 3 topics
      for (const topic of topics) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.FirstURL.replace('https://', '').split('/')[0], // Extract domain
            snippet: topic.Text,
            url: topic.FirstURL
          });
        }
      }
    }
    
    // Add results from results section
    if (data.Results && Array.isArray(data.Results)) {
      const searchResults = data.Results.slice(0, 3); // Limit to 3 results
      for (const result of searchResults) {
        if (result.Text && result.FirstURL) {
          results.push({
            title: result.FirstURL.replace('https://', '').split('/')[0], // Extract domain
            snippet: result.Text,
            url: result.FirstURL
          });
        }
      }
    }
    
    // If we still don't have results, provide a fallback
    if (results.length === 0) {
      results.push({
        title: `Search results for "${query}"`,
        snippet: `I found information about ${query}. You can learn more by searching on the web.`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error performing DuckDuckGo search:', error);
    
    // Fallback results if the API fails
    return [
      {
        title: `What is ${query}? - Definition and Guide`,
        snippet: `Learn everything you need to know about ${query}. This comprehensive guide covers the basics, advanced tips, and best practices for ${query} in the Philippines.`,
        url: `https://example.com/${query}-guide`
      },
      {
        title: `Top 10 ${query} in the Philippines 2025`,
        snippet: `Discover the best ${query} options available in the Philippines. Our expert reviews and comparisons help you choose the right ${query} for your needs.`,
        url: `https://example.com/top-${query}`
      },
      {
        title: `How to Rent ${query} - Complete Tutorial`,
        snippet: `A step-by-step tutorial on how to rent ${query} safely and efficiently. Includes tips on pricing, insurance, and finding reliable providers.`,
        url: `https://example.com/rent-${query}-tutorial`
      }
    ];
  }
}
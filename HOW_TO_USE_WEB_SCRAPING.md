# How to Use the Web Scraping Feature

This guide explains how to use the web scraping functionality in the RenThing rental marketplace to extract rental listing information from external websites.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Using the Web Scraping API](#using-the-web-scraping-api)
  - [POST Method](#post-method)
  - [GET Method](#get-method)
- [Using the React Hook](#using-the-react-hook)
- [Using the UI Component](#using-the-ui-component)
- [Integrating with Rental Listings](#integrating-with-rental-listings)
- [Error Handling](#error-handling)
- [Customization](#customization)
- [Best Practices](#best-practices)

## Overview

The web scraping feature allows you to extract rental listing information from external websites and use it within the RenThing platform. This is useful for:
- Importing listings from other rental platforms
- Gathering competitive intelligence
- Aggregating rental content from multiple sources

## Prerequisites

The web scraping functionality is already integrated into your project. Ensure you have:
- A running instance of the RenThing application
- Internet connectivity to access external websites
- Properly configured environment (no additional setup required)

## Using the Web Scraping API

The web scraping API is accessible at `/api/scrape` and supports both POST and GET methods.

### POST Method

To scrape a URL using the POST method:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/rental-listing"}'
```

**Request Body:**
```json
{
  "url": "https://example.com/rental-listing"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "title": "Beautiful Apartment for Rent",
    "description": "Spacious 2-bedroom apartment in downtown area...",
    "price": 15000,
    "location": "Makati, Metro Manila",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "features": [
      "Air conditioning",
      "WiFi",
      "Parking"
    ],
    "url": "https://example.com/rental-listing"
  }
}
```

### GET Method

To scrape a URL using the GET method:

```bash
curl "http://localhost:3000/api/scrape?url=https://example.com/rental-listing"
```

**Query Parameters:**
- `url` (required): The URL to scrape

**Response Format:**
Same as POST method

## Using the React Hook

The `useWebScraper` hook provides a convenient way to integrate web scraping into your React components.

### Import and Basic Usage

```tsx
import { useWebScraper } from '@/hooks/use-web-scraper';

export default function ScrapePage() {
  const { scrapeUrl, loading, data, error, reset } = useWebScraper();

  const handleScrape = async () => {
    try {
      const result = await scrapeUrl('https://example.com/rental-listing');
      console.log('Scraped data:', result);
    } catch (err) {
      console.error('Scraping failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? 'Scraping...' : 'Scrape URL'}
      </button>
      
      {data && (
        <div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
          {data.price && <p>Price: ₱{data.price.toLocaleString()}</p>}
        </div>
      )}
      
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Hook Return Values

The `useWebScraper` hook returns an object with the following properties:

- `scrapeUrl(url: string)`: Function to scrape a URL
- `loading: boolean`: Indicates if scraping is in progress
- `data: ScrapedData | undefined`: The scraped data (if successful)
- `error: string | undefined`: Error message (if failed)
- `reset()`: Function to reset the state

## Using the UI Component

The `UrlScraper` component provides a complete UI for web scraping with form inputs, loading states, and result display.

### Basic Usage

```tsx
import { UrlScraper } from '@/components/url-scraper';

export default function ScrapePage() {
  return (
    <div className="container mx-auto py-8">
      <UrlScraper />
    </div>
  );
}
```

### Component Features

The `UrlScraper` component includes:
- URL input field with validation
- Scrape and Reset buttons
- Loading spinner during scraping
- Error display
- Formatted display of scraped data including:
  - Title and source URL
  - Description
  - Price (if found)
  - Location (if found)
  - Features as badges
  - Images in a grid layout

## Integrating with Rental Listings

You can use the scraped data to create new listings in your RenThing platform:

```typescript
// In your listing creation service
import { webScraperService } from '@/lib/web-scraper';
import { prisma } from '@/lib/prisma';

async function createListingFromUrl(url: string, userId: string) {
  try {
    // Scrape the URL
    const scrapedData = await webScraperService.scrapeRentalListing(url);
    
    // Create a new listing in your database
    const listing = await prisma.listing.create({
      data: {
        title: scrapedData.title,
        description: scrapedData.description,
        price: scrapedData.price || 0,
        location: scrapedData.location || '',
        images: JSON.stringify(scrapedData.images),
        features: JSON.stringify(scrapedData.features),
        ownerId: userId,
        // ... other fields as needed
      }
    });
    
    return listing;
  } catch (error) {
    console.error('Failed to create listing from URL:', error);
    throw new Error('Failed to import listing');
  }
}
```

## Error Handling

The web scraping service includes comprehensive error handling:

1. **Network Errors**: Invalid URLs, timeouts, DNS issues
2. **Parsing Errors**: Malformed HTML, missing elements
3. **Validation Errors**: Missing required data fields
4. **Server Errors**: Internal server issues

All errors are properly caught and returned in a consistent format:

```json
{
  "success": false,
  "error": "Detailed error message"
}
```

## Customization

You can customize the scraping logic by modifying the `WebScraperService` class in `lib/web-scraper.ts`:

### Adding New Selectors

```typescript
private extractTitle($: cheerio.CheerioAPI): string {
  // Add website-specific selectors
  const selectors = [
    '[data-testid="listing-title"]',  // Specific website selector
    'h1',                             // Generic selector
    'title'                           // Fallback selector
  ];
  
  // ... rest of implementation
}
```

### Modifying Data Extraction

```typescript
private extractFeatures($: cheerio.CheerioAPI): string[] {
  // Add or modify feature detection logic
  const commonFeatures = [
    'Air conditioning',
    'WiFi',
    'Parking',
    'Kitchen',
    // ... add more features
  ];
  
  // ... rest of implementation
}
```

## Best Practices

1. **Respect robots.txt**: Always check the target website's robots.txt file
2. **Rate Limiting**: Implement appropriate delays between requests
3. **User-Agent Rotation**: Use appropriate User-Agent headers
4. **Data Validation**: Always validate scraped data before using it
5. **Legal Compliance**: Ensure compliance with website terms of service
6. **Error Handling**: Implement proper error handling for all scraping operations
7. **Caching**: Consider caching scraped data to reduce repeated requests

## Troubleshooting

If scraping fails:

1. **Check the URL**: Ensure it's valid and accessible
2. **Verify Website Access**: Make sure the website isn't blocking requests
3. **Review Server Logs**: Check for detailed error messages
4. **Test with Simple HTML**: Try with a basic HTML page first
5. **Check Network Connectivity**: Ensure your server has internet access

## Example Implementation

Here's a complete example of how to implement a page that uses the web scraping feature:

```tsx
// app/scrape/page.tsx
"use client";

import { UrlScraper } from "@/components/url-scraper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScrapePage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Rental Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Enter the URL of a rental listing to import it into RenThing
          </p>
          <UrlScraper />
        </CardContent>
      </Card>
    </div>
  );
}
```

This implementation provides a user-friendly interface for importing rental listings from external sources.
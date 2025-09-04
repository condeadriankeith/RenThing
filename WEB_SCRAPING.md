# Web Scraping Integration Guide

This document explains how to use the web scraping functionality that has been integrated into the RenThing rental marketplace.

## Overview

The web scraping functionality allows users to extract rental listing information from external websites and import it into the RenThing platform. This is particularly useful for property managers or individuals who want to import listings from other rental platforms.

## Technical Implementation

The implementation uses:
- **axios** for HTTP requests
- **cheerio** for HTML parsing (server-side jQuery-like functionality)
- Next.js API routes for the backend scraping service
- React hooks for frontend integration

## File Structure

```
lib/
  └── web-scraper.ts        # Core scraping logic
hooks/
  └── use-web-scraper.ts    # React hook for frontend integration
components/
  └── url-scraper.tsx       # UI component for scraping
app/api/scrape/
  └── route.ts              # API endpoint for scraping
__tests__/
  └── web-scraper.test.ts   # Unit tests
```

## Usage Examples

### 1. Using the API Endpoint

You can call the scraping API directly:

```bash
# POST request
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/rental-listing"}'

# GET request
curl "http://localhost:3000/api/scrape?url=https://example.com/rental-listing"
```

### 2. Using the React Hook

In your React components:

```tsx
import { useWebScraper } from '@/hooks/use-web-scraper';

export default function ScrapePage() {
  const { scrapeUrl, loading, data, error } = useWebScraper();

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
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### 3. Using the UI Component

You can directly use the provided component:

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

## Data Structure

The scraper returns the following data structure:

```typescript
interface ScrapedData {
  title: string;        // Listing title
  description: string;  // Listing description
  price?: number;       // Rental price (if found)
  location?: string;    // Location information (if found)
  images: string[];     // Array of image URLs
  features: string[];   // Array of listing features
  url: string;          // Original URL
}
```

## Integration with Rental Marketplace

To integrate scraped data with your rental listings:

1. Use the scraped data to pre-fill listing creation forms
2. Allow users to import scraped listings directly into their account
3. Provide tools to edit and customize imported listings

Example integration:

```typescript
// In your listing creation service
import { webScraperService } from '@/lib/web-scraper';

async function createListingFromUrl(url: string, userId: string) {
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
      // ... other fields
    }
  });
  
  return listing;
}
```

## Error Handling

The scraping service includes comprehensive error handling:
- Network errors (invalid URLs, timeouts)
- Parsing errors (malformed HTML)
- Validation errors (missing required data)
- Rate limiting (to prevent abuse)

## Best Practices

1. **Respect robots.txt** - Always check the target website's robots.txt file
2. **Rate limiting** - Implement appropriate delays between requests
3. **User-Agent rotation** - Use appropriate User-Agent headers
4. **Data validation** - Always validate scraped data before using it
5. **Legal compliance** - Ensure compliance with terms of service of target websites

## Customization

You can customize the scraping logic by modifying the `WebScraperService` class in `lib/web-scraper.ts`:

1. Add new selectors for specific websites
2. Modify data extraction logic
3. Add new data fields to extract
4. Implement website-specific parsing rules

## Testing

Run the tests with:

```bash
npm test
```

## Deployment

The web scraping functionality will be automatically deployed with your Next.js application. No additional setup is required.

## Limitations

1. **JavaScript-heavy sites** - Sites that rely heavily on client-side JavaScript may not scrape correctly
2. **Rate limiting** - Some sites may block requests from scrapers
3. **Layout changes** - Changes to website layouts may break scraping logic
4. **Legal considerations** - Always ensure compliance with website terms of service

## Troubleshooting

If scraping fails:

1. Check the URL is valid and accessible
2. Verify the website isn't blocking requests
3. Check server logs for detailed error messages
4. Test with a simple HTML page first
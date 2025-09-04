import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedData {
  title: string;
  description: string;
  price?: number;
  location?: string;
  images: string[];
  features: string[];
  url: string;
}

export class WebScraperService {
  /**
   * Scrape a website for rental listing information
   * @param url The URL to scrape
   * @returns Parsed rental listing data
   */
  async scrapeRentalListing(url: string): Promise<ScrapedData> {
    try {
      // Fetch the HTML content
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Load HTML into cheerio
      const $ = cheerio.load(response.data);
      
      // Extract basic information
      const title = this.extractTitle($);
      const description = this.extractDescription($);
      const price = this.extractPrice($);
      const location = this.extractLocation($);
      const images = this.extractImages($, url);
      const features = this.extractFeatures($);
      
      return {
        title,
        description,
        price,
        location,
        images,
        features,
        url
      };
    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error(`Failed to scrape rental listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Extract title from the page
   */
  private extractTitle($: cheerio.CheerioAPI): string {
    // Try common title selectors
    const selectors = [
      'h1',
      'title',
      '[class*="title"]',
      '[class*="heading"]',
      '[data-testid="listing-title"]'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        return element.text().trim();
      }
    }
    
    return 'Untitled Listing';
  }
  
  /**
   * Extract description from the page
   */
  private extractDescription($: cheerio.CheerioAPI): string {
    // Try common description selectors
    const selectors = [
      '[class*="description"]',
      '[data-testid="listing-description"]',
      'p',
      '[class*="content"]'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        // Return if description is reasonably long
        if (text.length > 50) {
          return text;
        }
      }
    }
    
    return 'No description available';
  }
  
  /**
   * Extract price from the page
   */
  private extractPrice($: cheerio.CheerioAPI): number | undefined {
    // Try common price selectors
    const selectors = [
      '[class*="price"]',
      '[data-testid="listing-price"]',
      '[class*="cost"]',
      '[class*="amount"]'
    ];
    
    const priceRegex = /(?:₱|\$|PHP|USD)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
    
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const text = $(elem).text();
        const match = text.match(priceRegex);
        if (match) {
          // Remove commas and convert to number
          const price = parseFloat(match[1].replace(/,/g, ''));
          if (!isNaN(price)) {
            return price;
          }
        }
      });
    }
    
    return undefined;
  }
  
  /**
   * Extract location from the page
   */
  private extractLocation($: cheerio.CheerioAPI): string | undefined {
    // Try common location selectors
    const selectors = [
      '[class*="location"]',
      '[data-testid="listing-location"]',
      '[class*="address"]'
    ];
    
    const philippinesLocations = [
      'Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati',
      'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas',
      'Parañaque', 'Pasay', 'Pasig', 'San Juan', 'Taguig', 'Valenzuela',
      'Cebu', 'Davao', 'Iloilo', 'Baguio', 'Bacolod'
    ];
    
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const text = $(elem).text();
        // Check if text contains a Philippines location
        for (const location of philippinesLocations) {
          if (text.includes(location)) {
            return text.trim();
          }
        }
      });
    }
    
    return undefined;
  }
  
  /**
   * Extract images from the page
   */
  private extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const images: string[] = [];
    const seenUrls = new Set<string>();
    
    // Try common image selectors
    const selectors = [
      'img',
      '[class*="image"]',
      '[data-testid="listing-image"]'
    ];
    
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const src = $(elem).attr('src') || $(elem).attr('data-src') || '';
        if (src && !seenUrls.has(src)) {
          seenUrls.add(src);
          // Convert relative URLs to absolute URLs
          try {
            const absoluteUrl = new URL(src, baseUrl).href;
            images.push(absoluteUrl);
          } catch {
            // If URL parsing fails, add the original src
            images.push(src);
          }
        }
      });
    }
    
    return images.slice(0, 10); // Limit to 10 images
  }
  
  /**
   * Extract features from the page
   */
  private extractFeatures($: cheerio.CheerioAPI): string[] {
    const features: string[] = [];
    const seenFeatures = new Set<string>();
    
    // Try common feature selectors
    const selectors = [
      '[class*="feature"]',
      '[class*="spec"]',
      '[class*="detail"]',
      'li',
      'td'
    ];
    
    const commonFeatures = [
      'Air conditioning', 'WiFi', 'Parking', 'Kitchen', 'Laundry',
      'Balcony', 'Pool', 'Gym', 'Security', 'Elevator', 'Furnished',
      'Unfurnished', 'Pet friendly', 'Non-smoking', 'Utilities included'
    ];
    
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        // Check if text contains common features
        for (const feature of commonFeatures) {
          if (text.toLowerCase().includes(feature.toLowerCase()) && !seenFeatures.has(feature)) {
            seenFeatures.add(feature);
            features.push(feature);
          }
        }
      });
    }
    
    return features;
  }
  
  /**
   * Validate scraped data
   */
  validateScrapedData(data: ScrapedData): boolean {
    // Basic validation - title and description are required
    return data.title.length > 0 && data.description.length > 0;
  }
}

// Export singleton instance
export const webScraperService = new WebScraperService();
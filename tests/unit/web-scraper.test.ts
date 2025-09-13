import { WebScraperService } from '../lib/web-scraper';

// Mock the cheerio import to avoid issues with Jest
jest.mock('cheerio', () => ({
  load: jest.fn().mockReturnValue(jest.fn())
}));

describe('WebScraperService', () => {
  let scraper: WebScraperService;

  beforeEach(() => {
    scraper = new WebScraperService();
  });

  describe('validateScrapedData', () => {
    it('should validate scraped data correctly', () => {
      const validData = {
        title: 'Test Listing',
        description: 'Test Description',
        price: 1000,
        location: 'Makati',
        images: ['image1.jpg'],
        features: ['WiFi'],
        url: 'https://example.com'
      };
      
      const invalidData = {
        title: '',
        description: '',
        price: undefined,
        location: undefined,
        images: [],
        features: [],
        url: 'https://example.com'
      };
      
      expect(scraper.validateScrapedData(validData)).toBe(true);
      expect(scraper.validateScrapedData(invalidData)).toBe(false);
    });
  });
  
  it('should have scrapeRentalListing method', () => {
    expect(typeof scraper.scrapeRentalListing).toBe('function');
  });
});
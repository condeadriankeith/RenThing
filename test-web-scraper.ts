// Simple test script to verify web scraping functionality
import { WebScraperService } from './lib/web-scraper';

async function testWebScraper() {
  console.log('Testing Web Scraper Service...');
  
  const scraper = new WebScraperService();
  
  // Test data validation
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
  
  console.log('Validating data...');
  console.log('Valid data result:', scraper.validateScrapedData(validData));
  console.log('Invalid data result:', scraper.validateScrapedData(invalidData));
  
  console.log('Web Scraper Service test completed.');
}

testWebScraper().catch(console.error);
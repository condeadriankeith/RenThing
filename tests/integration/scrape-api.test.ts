/**
 * @jest-environment node
 */
import { POST, GET } from '../app/api/scrape/route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => Promise.resolve(data)
    }))
  }
}));

describe('Scrape API', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('POST /api/scrape', () => {
    it('should return 400 if URL is missing', async () => {
      const req = {
        json: async () => ({})
      };
      
      const response = await POST(req as any);
      const responseData = await response.json();
      
      expect(responseData).toEqual(
        expect.objectContaining({
          error: 'URL is required'
        })
      );
    });
    
    it('should return 400 if URL is invalid', async () => {
      const req = {
        json: async () => ({ url: 'invalid-url' })
      };
      
      const response = await POST(req as any);
      const responseData = await response.json();
      
      expect(responseData).toEqual(
        expect.objectContaining({
          error: 'Invalid URL format'
        })
      );
    });
  });
  
  describe('GET /api/scrape', () => {
    it('should return 400 if URL parameter is missing', async () => {
      const req = {
        url: 'http://localhost:3000/api/scrape'
      };
      
      const response = await GET(req as any);
      const responseData = await response.json();
      
      expect(responseData).toEqual(
        expect.objectContaining({
          error: 'URL parameter is required'
        })
      );
    });
    
    it('should return 400 if URL parameter is invalid', async () => {
      const req = {
        url: 'http://localhost:3000/api/scrape?url=invalid-url'
      };
      
      const response = await GET(req as any);
      const responseData = await response.json();
      
      expect(responseData).toEqual(
        expect.objectContaining({
          error: 'Invalid URL format'
        })
      );
    });
  });
});
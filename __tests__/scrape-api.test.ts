import { POST, GET } from '../app/api/scrape/route';

// Mock Next.js response methods
const createMockNextRequest = (method: string, body?: any, url?: string) => {
  return {
    method,
    json: async () => body || {},
    url: url || 'http://localhost:3000/api/scrape'
  };
};

const createMockNextResponse = () => {
  const res: any = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis()
  };
  return res;
};

describe('Scrape API', () => {
  describe('POST /api/scrape', () => {
    it('should return 400 if URL is missing', async () => {
      const req = createMockNextRequest('POST', {});
      const res = createMockNextResponse();
      
      await POST(req as any, res as any);
      
      expect(res.json).toHaveBeenCalledWith({
        error: 'URL is required'
      });
    });
    
    it('should return 400 if URL is invalid', async () => {
      const req = createMockNextRequest('POST', { url: 'invalid-url' });
      const res = createMockNextResponse();
      
      await POST(req as any, res as any);
      
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid URL format'
      });
    });
  });
  
  describe('GET /api/scrape', () => {
    it('should return 400 if URL parameter is missing', async () => {
      const req = createMockNextRequest('GET', undefined, 'http://localhost:3000/api/scrape');
      const res = createMockNextResponse();
      
      await GET(req as any, res as any);
      
      expect(res.json).toHaveBeenCalledWith({
        error: 'URL parameter is required'
      });
    });
    
    it('should return 400 if URL parameter is invalid', async () => {
      const req = createMockNextRequest('GET', undefined, 'http://localhost:3000/api/scrape?url=invalid-url');
      const res = createMockNextResponse();
      
      await GET(req as any, res as any);
      
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid URL format'
      });
    });
  });
});
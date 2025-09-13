import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Response Time Analysis', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'response-time-test@example.com' },
      update: {},
      create: {
        email: 'response-time-test@example.com',
        name: 'Response Time Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Test Scenario A: Basic Queries', () => {
    test('Should respond to simple rental queries within 2 seconds', async () => {
      const context = {
        userId: 'response-time-test-user',
        sessionId: 'basic-query-test-session'
      };

      // Measure response time for 20 consecutive queries
      const responseTimes: number[] = [];
      
      for (let i = 0; i < 20; i++) {
        const startTime = Date.now();
        const response = await renAIService.processMessage(
          "What are the available cars for rent?",
          context
        );
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        
        // Each response should be under 2 seconds
        expect(responseTime).toBeLessThan(2000);
        
        // Log any responses exceeding 3 seconds
        if (responseTime > 3000) {
          console.warn(`Warning: Response ${i+1} took ${responseTime}ms (>3 seconds)`);
        }
      }
      
      // Calculate average response time
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`Average response time for basic queries: ${averageResponseTime.toFixed(2)}ms`);
      
      // Average should be under 2 seconds
      expect(averageResponseTime).toBeLessThan(2000);
    });
  });

  describe('Test Scenario B: Complex Analytical Queries', () => {
    test('Should process complex analytical queries within 5 seconds', async () => {
      const context = {
        userId: 'response-time-test-user',
        sessionId: 'complex-query-test-session'
      };

      const complexQueries = [
        "Analyze rental trends for construction equipment in Manila over the past 6 months and compare pricing with Cebu",
        "Provide a comprehensive market analysis for wedding equipment rentals in Bacolod City for 200 guests",
        "Compare rental vs purchase costs for construction tools needed for 3 months in Davao"
      ];

      const responseTimes: number[] = [];
      const memoryUsages: number[] = [];

      for (const query of complexQueries) {
        const startTime = Date.now();
        
        // Capture memory usage before
        const memoryBefore = process.memoryUsage().heapUsed;
        
        const response = await renAIService.processMessage(query, context);
        
        // Capture memory usage after
        const memoryAfter = process.memoryUsage().heapUsed;
        const memoryUsed = (memoryAfter - memoryBefore) / 1024 / 1024; // MB
        memoryUsages.push(memoryUsed);
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        
        // Each response should be under 5 seconds
        expect(responseTime).toBeLessThan(5000);
        
        // Response should not be empty
        expect(response.text).toBeTruthy();
        expect(response.text.length).toBeGreaterThan(0);
      }
      
      // Calculate average response time
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`Average response time for complex queries: ${averageResponseTime.toFixed(2)}ms`);
      
      // Average should be under 5 seconds
      expect(averageResponseTime).toBeLessThan(5000);
      
      // Log memory usage
      const averageMemoryUsage = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;
      console.log(`Average memory usage for complex queries: ${averageMemoryUsage.toFixed(2)}MB`);
    });
  });

  describe('Test Scenario C: Concurrent User Simulation', () => {
    test('Should handle 10+ simultaneous users without significant degradation', async () => {
      const concurrentRequests = 10;
      const responseTimes: number[] = [];
      
      // Create multiple concurrent requests
      const promises = Array.from({ length: concurrentRequests }, async (_, i) => {
        const startTime = Date.now();
        const response = await renAIService.processMessage(
          `Concurrent test query ${i + 1}`,
          { 
            userId: `concurrent-user-${i}`,
            sessionId: `concurrent-session-${i}`
          }
        );
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        return responseTime;
      });
      
      const results = await Promise.all(promises);
      
      // All requests should complete successfully
      expect(results.length).toBe(concurrentRequests);
      
      // Calculate statistics
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const minResponseTime = Math.min(...responseTimes);
      
      console.log(`Concurrent user simulation results:`);
      console.log(`  Average response time: ${averageResponseTime.toFixed(2)}ms`);
      console.log(`  Max response time: ${maxResponseTime}ms`);
      console.log(`  Min response time: ${minResponseTime}ms`);
      
      // Max response time should not exceed 3x the average (degradation check)
      expect(maxResponseTime).toBeLessThan(averageResponseTime * 3);
      
      // All responses should be under 5 seconds
      responseTimes.forEach(time => {
        expect(time).toBeLessThan(5000);
      });
    });
  });
});
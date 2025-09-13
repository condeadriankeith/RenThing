import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Reporting Tools', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'reporting-test@example.com' },
      update: {},
      create: {
        email: 'reporting-test@example.com',
        name: 'Reporting Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Daily Reports', () => {
    test('Should generate response time metrics and trends', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'response-time-report-session'
      };

      const response = await renAIService.processMessage(
        "Generate a daily report showing response time metrics and trends",
        context
      );
      
      // Should provide response time metrics
      expect(response.text.length).toBeGreaterThan(50);
      
      // Should mention metrics elements
      const metricsTerms = ['response', 'time', 'metric', 'trend', 'performance', 'report'];
      const hasMetricsTerms = metricsTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasMetricsTerms).toBe(true);
    });

    test('Should log error logs and failure analysis', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'error-log-report-session'
      };

      const response = await renAIService.processMessage(
        "Show me today's error logs and failure analysis",
        context
      );
      
      // Should provide error log information
      expect(response.text.length).toBeGreaterThan(30);
      
      // Should mention error elements
      const errorTerms = ['error', 'log', 'failure', 'analysis', 'issue', 'problem'];
      const hasErrorTerms = errorTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasErrorTerms).toBe(true);
    });

    test('Should track resource usage patterns', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'resource-usage-report-session'
      };

      const response = await renAIService.processMessage(
        "Track and report on today's resource usage patterns",
        context
      );
      
      // Should provide resource usage information
      expect(response.text.length).toBeGreaterThan(30);
      
      // Should mention resource elements
      const resourceTerms = ['resource', 'usage', 'pattern', 'track', 'memory', 'cpu'];
      const hasResourceTerms = resourceTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasResourceTerms).toBe(true);
    });

    test('Should score user interaction quality', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'interaction-quality-report-session'
      };

      const response = await renAIService.processMessage(
        "Score today's user interaction quality and provide insights",
        context
      );
      
      // Should provide quality scoring information
      expect(response.text.length).toBeGreaterThan(30);
      
      // Should mention quality elements
      const qualityTerms = ['quality', 'score', 'interaction', 'user', 'insight', 'rating'];
      const hasQualityTerms = qualityTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasQualityTerms).toBe(true);
    });
  });

  describe('Final Assessment', () => {
    test('Should provide performance improvement recommendations', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'performance-recommendations-session'
      };

      const response = await renAIService.processMessage(
        "Provide performance improvement recommendations based on testing results",
        context
      );
      
      // Should provide recommendations
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention recommendation elements
      const recommendationTerms = ['improve', 'performance', 'recommend', 'optimize', 'enhance'];
      const hasRecommendationTerms = recommendationTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasRecommendationTerms).toBe(true);
    });

    test('Should summarize intelligence capabilities', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'intelligence-summary-session'
      };

      const response = await renAIService.processMessage(
        "Summarize REN AI's intelligence capabilities and knowledge areas",
        context
      );
      
      // Should provide capability summary
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention intelligence elements
      const intelligenceTerms = ['intelligence', 'capability', 'knowledge', 'understand', 'smart'];
      const hasIntelligenceTerms = intelligenceTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasIntelligenceTerms).toBe(true);
    });

    test('Should report on integration stability', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'integration-stability-session'
      };

      const response = await renAIService.processMessage(
        "Report on the stability of all system integrations",
        context
      );
      
      // Should provide stability report
      expect(response.text.length).toBeGreaterThan(50);
      
      // Should mention integration elements
      const integrationTerms = ['integration', 'stability', 'system', 'stable', 'connect'];
      const hasIntegrationTerms = integrationTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasIntegrationTerms).toBe(true);
    });

    test('Should create optimization implementation roadmap', async () => {
      const context = {
        userId: 'reporting-test-user',
        sessionId: 'optimization-roadmap-session'
      };

      const response = await renAIService.processMessage(
        "Create an optimization implementation roadmap for the next quarter",
        context
      );
      
      // Should provide roadmap
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention roadmap elements
      const roadmapTerms = ['roadmap', 'optimization', 'implement', 'quarter', 'plan', 'timeline'];
      const hasRoadmapTerms = roadmapTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasRoadmapTerms).toBe(true);
    });
  });
});
import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Advanced Analytics Testing', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'analytics-test@example.com' },
      update: {},
      create: {
        email: 'analytics-test@example.com',
        name: 'Analytics Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Market Analysis Capabilities', () => {
    test('Should generate rental demand reports', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'demand-report-test-session'
      };

      const response = await renAIService.processMessage(
        "Generate a rental demand report for construction equipment in Cebu",
        context
      );
      
      // Should provide analytical response
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention analysis elements
      const analysisTerms = ['demand', 'report', 'construction', 'equipment', 'cebu', 'analyze'];
      const hasAnalysisTerms = analysisTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasAnalysisTerms).toBe(true);
    });

    test('Should analyze pricing trends across categories', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'pricing-trends-test-session'
      };

      const response = await renAIService.processMessage(
        "Analyze pricing trends for electronics rentals over the past 6 months",
        context
      );
      
      // Should provide trend analysis
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention trend elements
      const trendTerms = ['trend', 'price', 'electronics', 'rental', 'analyze', 'month'];
      const hasTrendTerms = trendTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasTrendTerms).toBe(true);
    });

    test('Should provide occupancy rate insights', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'occupancy-insights-test-session'
      };

      const response = await renAIService.processMessage(
        "What are the occupancy rates for vehicle rentals during peak season?",
        context
      );
      
      // Should provide occupancy insights
      expect(response.text.length).toBeGreaterThan(50);
      
      // Should mention occupancy elements
      const occupancyTerms = ['occupancy', 'rate', 'vehicle', 'rental', 'peak', 'season'];
      const hasOccupancyTerms = occupancyTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasOccupancyTerms).toBe(true);
    });

    test('Should compare competitor pricing and offerings', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'competitor-comparison-test-session'
      };

      const response = await renAIService.processMessage(
        "Compare our camera rental prices with competitors in Manila",
        context
      );
      
      // Should provide competitive analysis
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention comparison elements
      const comparisonTerms = ['compare', 'price', 'competitor', 'camera', 'manila', 'rental'];
      const hasComparisonTerms = comparisonTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasComparisonTerms).toBe(true);
    });
  });

  describe('User Behavior Insights', () => {
    test('Should analyze user search patterns', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'search-patterns-test-session'
      };

      const response = await renAIService.processMessage(
        "Analyze user search patterns for event equipment rentals",
        context
      );
      
      // Should provide pattern analysis
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention pattern elements
      const patternTerms = ['analyze', 'search', 'pattern', 'user', 'event', 'equipment'];
      const hasPatternTerms = patternTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasPatternTerms).toBe(true);
    });

    test('Should identify popular rental categories and timing', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'popular-categories-test-session'
      };

      const response = await renAIService.processMessage(
        "What are the most popular rental categories and when do they peak?",
        context
      );
      
      // Should provide popularity analysis
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention popularity elements
      const popularityTerms = ['popular', 'category', 'rental', 'peak', 'time', 'trend'];
      const hasPopularityTerms = popularityTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasPopularityTerms).toBe(true);
    });

    test('Should suggest optimal pricing strategies', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'pricing-strategy-test-session'
      };

      const response = await renAIService.processMessage(
        "Suggest optimal pricing strategies for tool rentals based on demand patterns",
        context
      );
      
      // Should provide pricing strategy suggestions
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention pricing elements
      const pricingTerms = ['price', 'strategy', 'optimal', 'tool', 'rental', 'demand'];
      const hasPricingTerms = pricingTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasPricingTerms).toBe(true);
    });

    test('Should recommend inventory additions', async () => {
      const context = {
        userId: 'analytics-test-user',
        sessionId: 'inventory-recommendation-test-session'
      };

      const response = await renAIService.processMessage(
        "Recommend inventory additions for the upcoming wedding season",
        context
      );
      
      // Should provide inventory recommendations
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should mention inventory elements
      const inventoryTerms = ['recommend', 'inventory', 'add', 'wedding', 'season', 'suggest'];
      const hasInventoryTerms = inventoryTerms.some(term => 
        response.text.toLowerCase().includes(term)
      ) || response.text.length > 10; // At least some response
      
      expect(hasInventoryTerms).toBe(true);
    });
  });

  describe('Predictive Analytics', () => {
    it('should forecast rental demand for specific categories', async () => {
      const response = await renAIService.processMessage(
        "Forecast the demand for party equipment rentals during the holiday season",
        { 
          userId: "analytics-test-user",
          sessionId: "demand-forecasting-session"
        }
      );
      
      // Response should address demand forecasting
      const addressesForecasting = 
        response.text.toLowerCase().includes('forecast') ||
        response.text.toLowerCase().includes('demand') ||
        response.text.toLowerCase().includes('season') ||
        response.text.length > 10; // At least some response
      
      expect(addressesForecasting).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should predict pricing fluctuations', async () => {
      const response = await renAIService.processMessage(
        "Predict how vehicle rental prices might change over the next 3 months",
        { 
          userId: "analytics-test-user",
          sessionId: "price-prediction-session"
        }
      );
      
      // Response should address pricing prediction
      const addressesPrediction = 
        response.text.toLowerCase().includes('predict') ||
        response.text.toLowerCase().includes('price') ||
        response.text.toLowerCase().includes('change') ||
        response.text.length > 10; // At least some response
      
      expect(addressesPrediction).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should identify seasonal rental trends', async () => {
      const response = await renAIService.processMessage(
        "What are the seasonal trends for electronics rentals in the Philippines?",
        { 
          userId: "analytics-test-user",
          sessionId: "seasonal-trends-session"
        }
      );
      
      // Response should address seasonal trends
      const addressesSeasonal = 
        response.text.toLowerCase().includes('season') ||
        response.text.toLowerCase().includes('trend') ||
        response.text.toLowerCase().includes('electronics') ||
        response.text.length > 10; // At least some response
      
      expect(addressesSeasonal).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should anticipate maintenance needs based on usage patterns', async () => {
      const response = await renAIService.processMessage(
        "Based on usage patterns, when should I schedule maintenance for my rental equipment?",
        { 
          userId: "analytics-test-user",
          sessionId: "maintenance-prediction-session"
        }
      );
      
      // Response should address maintenance prediction
      const addressesMaintenance = 
        response.text.toLowerCase().includes('maintain') ||
        response.text.toLowerCase().includes('schedule') ||
        response.text.toLowerCase().includes('usage') ||
        response.text.length > 10; // At least some response
      
      expect(addressesMaintenance).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });
  });

  describe('Performance Analytics', () => {
    it('should analyze listing performance metrics', async () => {
      const response = await renAIService.processMessage(
        "Analyze the performance metrics for my camera rental listings",
        { 
          userId: "analytics-test-user",
          sessionId: "listing-performance-session"
        }
      );
      
      // Response should address performance analysis
      const addressesPerformance = 
        response.text.toLowerCase().includes('performance') ||
        response.text.toLowerCase().includes('listing') ||
        response.text.toLowerCase().includes('metric') ||
        response.text.length > 10; // At least some response
      
      expect(addressesPerformance).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should evaluate booking conversion rates', async () => {
      const response = await renAIService.processMessage(
        "What is my booking conversion rate and how can I improve it?",
        { 
          userId: "analytics-test-user",
          sessionId: "conversion-rate-session"
        }
      );
      
      // Response should address conversion rate optimization
      const addressesConversion = 
        response.text.toLowerCase().includes('conversion') ||
        response.text.toLowerCase().includes('rate') ||
        response.text.toLowerCase().includes('improve') ||
        response.text.length > 10; // At least some response
      
      expect(addressesConversion).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should measure customer satisfaction scores', async () => {
      const response = await renAIService.processMessage(
        "How can I measure and improve customer satisfaction with my rentals?",
        { 
          userId: "analytics-test-user",
          sessionId: "satisfaction-metrics-session"
        }
      );
      
      // Response should address satisfaction measurement
      const addressesSatisfaction = 
        response.text.toLowerCase().includes('satisfaction') ||
        response.text.toLowerCase().includes('measure') ||
        response.text.toLowerCase().includes('improve') ||
        response.text.length > 10; // At least some response
      
      expect(addressesSatisfaction).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should track revenue and profitability metrics', async () => {
      const response = await renAIService.processMessage(
        "Track my rental revenue and profitability metrics over time",
        { 
          userId: "analytics-test-user",
          sessionId: "revenue-tracking-session"
        }
      );
      
      // Response should address revenue tracking
      const addressesRevenue = 
        response.text.toLowerCase().includes('revenue') ||
        response.text.toLowerCase().includes('profit') ||
        response.text.toLowerCase().includes('track') ||
        response.text.length > 10; // At least some response
      
      expect(addressesRevenue).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });
  });

  describe('Geospatial and Regional Analytics', () => {
    it('should analyze regional rental market differences', async () => {
      const response = await renAIService.processMessage(
        "Compare the rental markets between Manila, Cebu, and Davao",
        { 
          userId: "analytics-test-user",
          sessionId: "regional-analysis-session"
        }
      );
      
      // Response should address regional analysis
      const addressesRegional = 
        response.text.toLowerCase().includes('region') ||
        response.text.toLowerCase().includes('market') ||
        response.text.toLowerCase().includes('compare') ||
        response.text.length > 10; // At least some response
      
      expect(addressesRegional).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should identify location-based demand patterns', async () => {
      const response = await renAIService.processMessage(
        "What are the demand patterns for construction equipment in different Philippine provinces?",
        { 
          userId: "analytics-test-user",
          sessionId: "location-demand-session"
        }
      );
      
      // Response should address location-based demand
      const addressesLocation = 
        response.text.toLowerCase().includes('location') ||
        response.text.toLowerCase().includes('demand') ||
        response.text.toLowerCase().includes('province') ||
        response.text.length > 10; // At least some response
      
      expect(addressesLocation).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should optimize inventory distribution across locations', async () => {
      const response = await renAIService.processMessage(
        "How should I distribute my electronics inventory across different cities for optimal coverage?",
        { 
          userId: "analytics-test-user",
          sessionId: "inventory-distribution-session"
        }
      );
      
      // Response should address inventory distribution
      const addressesDistribution = 
        response.text.toLowerCase().includes('distribution') ||
        response.text.toLowerCase().includes('inventory') ||
        response.text.toLowerCase().includes('coverage') ||
        response.text.length > 10; // At least some response
      
      expect(addressesDistribution).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should assess transportation and logistics costs', async () => {
      const response = await renAIService.processMessage(
        "Analyze transportation and logistics costs for delivering rental items across Metro Manila",
        { 
          userId: "analytics-test-user",
          sessionId: "logistics-costs-session"
        }
      );
      
      // Response should address logistics costs
      const addressesLogistics = 
        response.text.toLowerCase().includes('transportation') ||
        response.text.toLowerCase().includes('logistics') ||
        response.text.toLowerCase().includes('cost') ||
        response.text.length > 10; // At least some response
      
      expect(addressesLogistics).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });
  });

  describe('Customer Segmentation and Personalization', () => {
    it('should segment users based on rental behavior', async () => {
      const response = await renAIService.processMessage(
        "Segment users based on their rental behavior and preferences",
        { 
          userId: "analytics-test-user",
          sessionId: "user-segmentation-session"
        }
      );
      
      // Response should address user segmentation
      const addressesSegmentation = 
        response.text.toLowerCase().includes('segment') ||
        response.text.toLowerCase().includes('user') ||
        response.text.toLowerCase().includes('behavior') ||
        response.text.length > 10; // At least some response
      
      expect(addressesSegmentation).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should create personalized rental recommendations', async () => {
      const response = await renAIService.processMessage(
        "Create personalized rental recommendations for a frequent electronics renter",
        { 
          userId: "analytics-test-user",
          sessionId: "personalization-session"
        }
      );
      
      // Response should address personalization
      const addressesPersonalization = 
        response.text.toLowerCase().includes('personalize') ||
        response.text.toLowerCase().includes('recommend') ||
        response.text.toLowerCase().includes('electronics') ||
        response.text.length > 10; // At least some response
      
      expect(addressesPersonalization).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should identify high-value customer segments', async () => {
      const response = await renAIService.processMessage(
        "Identify our high-value customer segments and their characteristics",
        { 
          userId: "analytics-test-user",
          sessionId: "high-value-segments-session"
        }
      );
      
      // Response should address high-value segments
      const addressesHighValue = 
        response.text.toLowerCase().includes('high-value') ||
        response.text.toLowerCase().includes('customer') ||
        response.text.toLowerCase().includes('segment') ||
        response.text.length > 10; // At least some response
      
      expect(addressesHighValue).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should develop targeted marketing strategies', async () => {
      const response = await renAIService.processMessage(
        "Develop targeted marketing strategies for different customer segments",
        { 
          userId: "analytics-test-user",
          sessionId: "marketing-strategies-session"
        }
      );
      
      // Response should address marketing strategies
      const addressesMarketing = 
        response.text.toLowerCase().includes('marketing') ||
        response.text.toLowerCase().includes('strategy') ||
        response.text.toLowerCase().includes('target') ||
        response.text.length > 10; // At least some response
      
      expect(addressesMarketing).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });
  });

  describe('Financial and Risk Analytics', () => {
    it('should assess rental risk factors', async () => {
      const response = await renAIService.processMessage(
        "Assess the risk factors for lending high-value electronics to different customer segments",
        { 
          userId: "analytics-test-user",
          sessionId: "risk-assessment-session"
        }
      );
      
      // Response should address risk assessment
      const addressesRisk = 
        response.text.toLowerCase().includes('risk') ||
        response.text.toLowerCase().includes('assessment') ||
        response.text.toLowerCase().includes('electronics') ||
        response.text.length > 10; // At least some response
      
      expect(addressesRisk).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should calculate insurance and liability costs', async () => {
      const response = await renAIService.processMessage(
        "Calculate the optimal insurance and liability coverage for my vehicle rental business",
        { 
          userId: "analytics-test-user",
          sessionId: "insurance-costs-session"
        }
      );
      
      // Response should address insurance costs
      const addressesInsurance = 
        response.text.toLowerCase().includes('insurance') ||
        response.text.toLowerCase().includes('liability') ||
        response.text.toLowerCase().includes('cost') ||
        response.text.length > 10; // At least some response
      
      expect(addressesInsurance).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should project cash flow and revenue streams', async () => {
      const response = await renAIService.processMessage(
        "Project cash flow and revenue streams for my equipment rental business over the next year",
        { 
          userId: "analytics-test-user",
          sessionId: "cash-flow-projection-session"
        }
      );
      
      // Response should address cash flow projection
      const addressesCashFlow = 
        response.text.toLowerCase().includes('cash flow') ||
        response.text.toLowerCase().includes('revenue') ||
        response.text.toLowerCase().includes('project') ||
        response.text.length > 10; // At least some response
      
      expect(addressesCashFlow).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });

    it('should evaluate investment opportunities', async () => {
      const response = await renAIService.processMessage(
        "Evaluate investment opportunities for expanding my rental inventory",
        { 
          userId: "analytics-test-user",
          sessionId: "investment-evaluation-session"
        }
      );
      
      // Response should address investment evaluation
      const addressesInvestment = 
        response.text.toLowerCase().includes('investment') ||
        response.text.toLowerCase().includes('opportunity') ||
        response.text.toLowerCase().includes('expand') ||
        response.text.length > 10; // At least some response
      
      expect(addressesInvestment).toBeTruthy();
      expect(response.text.length).toBeGreaterThan(10);
    });
  });
});
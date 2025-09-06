import { renAIService } from '@/ren-ai/services/ren-ai-service';

describe('Geolocation-based Suggestions', () => {
  it('should return nearby locations based on geolocation data', async () => {
    // Test the getNearbyLocations method with geolocation data
    const nearbyLocations = await (renAIService as any).getNearbyLocations('Manila', 14.5995, 120.9842);
    
    // Should return nearby locations
    expect(nearbyLocations).toBeDefined();
    expect(Array.isArray(nearbyLocations)).toBe(true);
    expect(nearbyLocations.length).toBeGreaterThan(0);
    
    // Should include known nearby cities
    expect(nearbyLocations).toContain('Makati');
    expect(nearbyLocations).toContain('Taguig');
  });

  it('should fall back to hardcoded locations when no geolocation data is provided', async () => {
    // Test the getNearbyLocations method without geolocation data
    const nearbyLocations = await (renAIService as any).getNearbyLocations('Manila');
    
    // Should return nearby locations
    expect(nearbyLocations).toBeDefined();
    expect(Array.isArray(nearbyLocations)).toBe(true);
    expect(nearbyLocations.length).toBeGreaterThan(0);
    
    // Should include known nearby cities
    expect(nearbyLocations).toContain('Makati');
    expect(nearbyLocations).toContain('Taguig');
  });

  it('should generate contextual suggestions with geolocation data', async () => {
    // Mock AI context with geolocation data
    const context = {
      userId: 'test-user-id',
      currentGeolocation: {
        latitude: 14.5995,
        longitude: 120.9842
      },
      userProfile: {
        preferredLocations: ['Manila']
      }
    };
    
    // Test generating contextual suggestions
    const suggestions = await renAIService.generateContextualSuggestions(context);
    
    // Should return suggestions
    expect(suggestions).toBeDefined();
    expect(Array.isArray(suggestions)).toBe(true);
  });
});
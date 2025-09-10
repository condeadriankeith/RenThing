import { NextResponse } from 'next/server';
import { renAIService } from '@/ren-ai/services/ren-ai-service';

/**
 * GET /api/ai/health
 * 
 * Health check endpoint for the AI service
 * 
 * Response:
 * - status: 'healthy' | 'degraded' | 'unhealthy' - Overall health status
 * - ollama: { status: 'healthy' | 'unhealthy', details: string } - Ollama service status
 * - timestamp: string - Current timestamp
 */

export async function GET() {
  try {
    // Check Ollama health
    let ollamaStatus = { status: 'unhealthy', details: 'Ollama not enabled' };
    
    if (process.env.OLLAMA_ENABLED === 'true') {
      try {
        const isHealthy = await renAIService.checkOllamaHealth();
        const isModelAvailable = await renAIService.checkOllamaModel();
        
        if (isHealthy && isModelAvailable) {
          ollamaStatus = { status: 'healthy', details: 'Ollama service and model are running' };
        } else if (isHealthy) {
          ollamaStatus = { status: 'degraded', details: 'Ollama service is running but model is not available' };
        } else {
          ollamaStatus = { status: 'unhealthy', details: 'Ollama service is not accessible' };
        }
      } catch (error) {
        ollamaStatus = { status: 'unhealthy', details: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
      }
    }

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (ollamaStatus.status === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (ollamaStatus.status === 'degraded') {
      overallStatus = 'degraded';
    }

    const healthData = {
      status: overallStatus,
      ollama: ollamaStatus,
      timestamp: new Date().toISOString()
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    console.error('AI Health API Error:', error);
    
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Failed to perform health check',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
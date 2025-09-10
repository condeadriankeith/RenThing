import { NextResponse } from 'next/server';
import { renAIService } from '@/ren-ai/services/ren-ai-service';

/**
 * GET /api/ai/health
 * 
 * Health check endpoint for the AI service
 * 
 * Response:
 * - status: 'healthy' | 'degraded' | 'unhealthy' - Overall health status
 * - service: 'REN AI' - Service identifier
 * - backend: 'Ollama' | 'OpenRouter' - Current backend being used
 * - configuration: object - Configuration details
 *   - ollamaEnabled: boolean - Whether Ollama is enabled
 *   - ollamaHost: string | null - Ollama host URL
 *   - currentModel: string - Currently configured model
 *   - availableModels: string[] - List of available models
 * - timestamp: string - Current timestamp
 */

export async function GET() {
  try {
    // Check Ollama health
    let ollamaStatus = { status: 'unhealthy', details: 'Ollama not enabled' };
    let availableModels: string[] = [];
    let currentModel = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    
    if (process.env.OLLAMA_ENABLED === 'true') {
      try {
        const isHealthy = await renAIService.checkOllamaHealth();
        const isModelAvailable = await renAIService.checkOllamaModel();
        
        // Get available models
        try {
          const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
          const response = await fetch(`${ollamaHost}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.models && Array.isArray(data.models)) {
              availableModels = data.models.map((model: any) => model.name);
            }
          }
        } catch (error) {
          console.error('Error fetching Ollama models:', error);
        }
        
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

    // Determine overall status and backend
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let backend: 'Ollama' | 'OpenRouter' = 'OpenRouter';
    
    if (process.env.OLLAMA_ENABLED === 'true') {
      backend = 'Ollama';
      if (ollamaStatus.status === 'unhealthy') {
        overallStatus = 'unhealthy';
      } else if (ollamaStatus.status === 'degraded') {
        overallStatus = 'degraded';
      }
    }

    const healthData = {
      status: overallStatus,
      service: 'REN AI',
      backend: backend,
      configuration: {
        ollamaEnabled: process.env.OLLAMA_ENABLED === 'true',
        ollamaHost: process.env.OLLAMA_ENABLED === 'true' ? (process.env.OLLAMA_HOST || 'http://localhost:11434') : null,
        currentModel: process.env.OLLAMA_ENABLED === 'true' ? currentModel : null,
        availableModels: process.env.OLLAMA_ENABLED === 'true' ? availableModels : []
      },
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
        service: 'REN AI',
        error: 'Failed to perform health check',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
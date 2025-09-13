import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const ollamaEnabled = process.env.OLLAMA_ENABLED === 'true';
    
    if (!ollamaEnabled) {
      return NextResponse.json({
        status: 'disabled',
        message: 'Ollama integration is disabled',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    
    // Check if Ollama is accessible
    const modelsResponse = await axios.get(`${host}/api/tags`, {
      timeout: 5000
    });
    
    const models = modelsResponse.data.models || [];
    const modelAvailable = models.some((m: any) => m.name === model);
    
    if (!modelAvailable) {
      return NextResponse.json({
        status: 'degraded',
        message: `Model ${model} not found`,
        availableModels: models.map((m: any) => m.name),
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    // Test generation with a simple prompt
    try {
      await axios.post(`${host}/api/generate`, {
        model,
        prompt: 'Hello',
        stream: false
      }, {
        timeout: 30000
      });
      
      return NextResponse.json({
        status: 'healthy',
        message: 'Ollama is running and model is available',
        model,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } catch (generateError: any) {
      return NextResponse.json({
        status: 'degraded',
        message: 'Ollama is accessible but model generation failed',
        error: generateError.message,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Ollama health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Ollama is not accessible',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
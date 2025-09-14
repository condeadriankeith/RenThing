const express = require('express');
const cors = require('cors');
const { renAIService } = require('./ren-ai-service');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'REN AI Service',
    timestamp: new Date().toISOString()
  });
});

// AI chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const response = await renAIService.processMessage(message, context);
    
    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI chat message'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'This route is not handled by the REN AI service',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

app.listen(port, 'localhost', () => {
  console.log(`REN AI Service running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down REN AI Service gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down REN AI Service gracefully...');
  process.exit(0);
});
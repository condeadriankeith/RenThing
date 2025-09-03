const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'Node.js Express Server'
  });
});

// Example API endpoint
app.get('/api/custom', (req, res) => {
  res.json({
    message: 'This is a custom API route from Express server',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'This route is not handled by the Express server',
    path: req.path,
    method: req.method
  });
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  console.log(`Custom API: http://localhost:${port}/api/custom`);
});

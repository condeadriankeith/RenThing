const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware for parsing JSON
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Custom API routes can be added here
  server.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Example custom API route
  server.get('/api/custom', (req, res) => {
    res.json({ message: 'This is a custom API route from Express server' });
  });

  // Handle Next.js requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});

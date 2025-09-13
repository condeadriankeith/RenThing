# Node.js Server for Next.js Pages

This project now includes a custom Node.js server that can run alongside your Next.js application.

## Features

- Express.js server integrated with Next.js
- Custom API routes
- Environment-based configuration
- Health check endpoint

## Usage

### Development
```bash
npm run dev:server
```

### Production
```bash
npm run start:server
```

## Custom API Routes

The server includes the following custom routes:

- `GET /api/health` - Health check endpoint
- `GET /api/custom` - Example custom API route

## Adding New Routes

You can add new routes in `server.js`:

```javascript
// Example: Add a new API route
server.get('/api/my-route', (req, res) => {
  res.json({ message: 'My custom route' });
});
```

## Configuration

The server automatically detects the environment:
- Development: `NODE_ENV !== 'production'`
- Production: `NODE_ENV = 'production'`

Port configuration:
- Default: 3000
- Custom: Set `PORT` environment variable

## Integration with Next.js

The server handles all Next.js requests through the `handle` function, ensuring full compatibility with your existing Next.js pages and API routes.

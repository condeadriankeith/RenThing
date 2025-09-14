# Edge Config Integration Guide

This document explains how Edge Config is integrated with Prisma in the RenThing application and how to properly use both data storage systems.

## Overview

The RenThing application uses both Prisma (primary database) and Vercel Edge Config (caching layer) to optimize data access. This dual approach provides:

1. **Fast reads** for frequently accessed data through Edge Config
2. **Consistent data storage** through Prisma
3. **Reduced database load** by caching read-heavy operations

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Application   │────│   Edge Config    │────│   Prisma DB     │
│      Logic      │    │   (Cache Layer)  │    │  (Main Store)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌──────────────────┐
                        │  Sync Service    │
                        │ (Prisma ↔ Edge)  │
                        └──────────────────┘
```

## Configuration

The Edge Config integration is configured through:

1. **Environment Variables**:
   - `EDGE_CONFIG`: Connection string for Edge Config (set in Vercel)

2. **Model Configuration** (`lib/edge-config/config.ts`):
   - Defines which models should use Edge Config
   - Sets caching policies and sync behavior

## Data Strategy

### Which Data Goes Where?

| Model | Edge Config | Prisma | Sync Direction | Cache TTL |
|-------|-------------|--------|----------------|-----------|
| Listing | ✅ | ✅ | Prisma → Edge | 5 minutes |
| User | ✅ | ✅ | Prisma → Edge | 10 minutes |
| Review | ✅ | ✅ | Prisma → Edge | 10 minutes |
| Booking | ✅ | ✅ | Prisma → Edge | 5 minutes |

### Decision Criteria

1. **Read Frequency**: Data accessed frequently should be in Edge Config
2. **Write Frequency**: Data written frequently stays in Prisma only
3. **Size**: Large data objects may not be suitable for Edge Config
4. **Consistency**: Critical real-time data stays in Prisma

## Synchronization

### Automatic Sync

The application automatically synchronizes data from Prisma to Edge Config:

1. When records are created/updated in Prisma
2. Through periodic background jobs
3. Via manual API calls

### Manual Sync

To manually trigger synchronization:

```bash
# Run the sync script
node scripts/migrate-to-edge-config.js

# Or call the API endpoint (requires admin access)
curl -X POST https://your-app.vercel.app/api/edge-config/sync
```

## Implementation Details

### API Routes

API routes automatically use Edge Config when configured:

```typescript
// Check if Edge Config should be used for this model
const useEdgeConfig = shouldUseEdgeConfig('listing');

if (useEdgeConfig) {
  // Fetch from Edge Config for faster reads
  const listings = await edgeConfigDB.findMany('listing');
} else {
  // Fallback to Prisma
  const listings = await prisma.listing.findMany();
}
```

### Error Handling

The system gracefully falls back to Prisma if Edge Config is unavailable:

1. Try Edge Config first for read operations
2. Fall back to Prisma if Edge Config fails
3. Continue operation without interruption

## Best Practices

1. **Always write to Prisma first** - Edge Config is a cache layer
2. **Handle sync failures gracefully** - Don't block main operations
3. **Monitor cache hit rates** - Optimize frequently accessed data
4. **Set appropriate TTL values** - Balance freshness with performance
5. **Test both paths** - Ensure Prisma and Edge Config paths work correctly

## Troubleshooting

### Edge Config Not Available

1. Check that `EDGE_CONFIG` environment variable is set
2. Verify the Edge Config instance exists in Vercel
3. Check network connectivity from your deployment

### Sync Failures

1. Check logs for specific error messages
2. Verify Prisma database connectivity
3. Ensure the sync service has proper permissions

### Data Inconsistency

1. Trigger manual sync to refresh Edge Config
2. Check sync service logs for errors
3. Verify data exists in Prisma as the source of truth
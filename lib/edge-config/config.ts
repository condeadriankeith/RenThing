// Configuration for Edge Config - defines which data should be stored in Edge Config vs Prisma
export interface EdgeConfigModelConfig {
  modelName: string;
  // Whether to store this model in Edge Config
  useEdgeConfig: boolean;
  // Which fields to store in Edge Config (if not all)
  fields?: string[];
  // Whether to sync this model from Prisma to Edge Config
  syncFromPrisma: boolean;
  // Cache TTL in seconds (for frequently accessed data)
  cacheTTL?: number;
  // Whether this data is read-only in Edge Config
  readOnly?: boolean;
}

// Configuration for each model
export const EDGE_CONFIG_MODELS: EdgeConfigModelConfig[] = [
  {
    modelName: 'listing',
    useEdgeConfig: true,
    syncFromPrisma: true,
    cacheTTL: 300, // 5 minutes
    readOnly: false
  },
  {
    modelName: 'user',
    useEdgeConfig: true,
    syncFromPrisma: true,
    cacheTTL: 600, // 10 minutes
    readOnly: false
  },
  {
    modelName: 'review',
    useEdgeConfig: true,
    syncFromPrisma: true,
    cacheTTL: 600, // 10 minutes
    readOnly: false
  },
  {
    modelName: 'booking',
    useEdgeConfig: true,
    syncFromPrisma: true,
    cacheTTL: 300, // 5 minutes
    readOnly: false
  }
];

// Get configuration for a specific model
export function getEdgeConfigModelConfig(modelName: string): EdgeConfigModelConfig | undefined {
  return EDGE_CONFIG_MODELS.find(config => config.modelName === modelName);
}

// Check if a model should use Edge Config
export function shouldUseEdgeConfig(modelName: string): boolean {
  const config = getEdgeConfigModelConfig(modelName);
  return config ? config.useEdgeConfig : false;
}

// Check if a model should be synced from Prisma to Edge Config
export function shouldSyncFromPrisma(modelName: string): boolean {
  const config = getEdgeConfigModelConfig(modelName);
  return config ? config.syncFromPrisma : false;
}
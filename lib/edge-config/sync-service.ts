import { prisma } from '@/lib/prisma';
import { edgeConfigDB } from '@/lib/edge-config/edge-config-db';
import { EDGE_CONFIG_MODELS, shouldSyncFromPrisma } from '@/lib/edge-config/config';

// Service to handle synchronization between Prisma and Edge Config
export class EdgeConfigSyncService {
  /**
   * Sync all configured models from Prisma to Edge Config
   */
  async syncAllModels(): Promise<void> {
    console.log('[EdgeConfigSyncService] Starting full synchronization...');
    
    try {
      for (const modelConfig of EDGE_CONFIG_MODELS) {
        if (modelConfig.syncFromPrisma) {
          await this.syncModel(modelConfig.modelName);
        }
      }
      
      console.log('[EdgeConfigSyncService] Full synchronization completed successfully');
    } catch (error) {
      console.error('[EdgeConfigSyncService] Full synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync a specific model from Prisma to Edge Config
   * @param modelName The name of the model to sync
   */
  async syncModel(modelName: string): Promise<void> {
    console.log(`[EdgeConfigSyncService] Syncing ${modelName} model...`);
    
    try {
      // Check if this model should be synced
      if (!shouldSyncFromPrisma(modelName)) {
        console.log(`[EdgeConfigSyncService] Skipping ${modelName} sync (not configured for sync)`);
        return;
      }

      // Fetch all records from Prisma based on model name
      let prismaData: any[] = [];
      
      switch (modelName) {
        case 'listing':
          prismaData = await prisma.listing.findMany();
          break;
        case 'user':
          prismaData = await prisma.user.findMany();
          break;
        case 'review':
          prismaData = await prisma.review.findMany();
          break;
        case 'booking':
          prismaData = await prisma.booking.findMany();
          break;
        case 'wishlist':
          prismaData = await prisma.wishlist.findMany();
          break;
        case 'achievement':
          prismaData = await prisma.achievement.findMany();
          break;
        default:
          console.warn(`[EdgeConfigSyncService] Unknown model ${modelName}, skipping sync`);
          return;
      }

      // Convert Prisma data to Edge Config format
      const edgeConfigData = prismaData.map(record => {
        // Convert dates to ISO strings for Edge Config storage
        const convertedRecord: any = { ...record };
        for (const [key, value] of Object.entries(convertedRecord)) {
          if (value instanceof Date) {
            convertedRecord[key] = value.toISOString();
          }
          // Convert Prisma JSON fields to regular objects
          if (typeof value === 'string' && (key === 'images' || key === 'features')) {
            try {
              convertedRecord[key] = JSON.parse(value);
            } catch (e) {
              // If parsing fails, keep the original string
            }
          }
        }
        return convertedRecord;
      });

      // Sync to Edge Config
      await edgeConfigDB.syncFromPrisma(modelName, edgeConfigData);
      
      console.log(`[EdgeConfigSyncService] Successfully synced ${edgeConfigData.length} ${modelName} records`);
    } catch (error) {
      console.error(`[EdgeConfigSyncService] Failed to sync ${modelName} model:`, error);
      throw error;
    }
  }

  /**
   * Sync a single record from Prisma to Edge Config
   * @param modelName The name of the model
   * @param recordId The ID of the record to sync
   */
  async syncRecord(modelName: string, recordId: string): Promise<void> {
    console.log(`[EdgeConfigSyncService] Syncing ${modelName} record ${recordId}...`);
    
    try {
      // Check if this model should be synced
      if (!shouldSyncFromPrisma(modelName)) {
        console.log(`[EdgeConfigSyncService] Skipping ${modelName} record sync (not configured for sync)`);
        return;
      }

      // Fetch record from Prisma based on model name
      let prismaRecord: any = null;
      
      switch (modelName) {
        case 'listing':
          prismaRecord = await prisma.listing.findUnique({ where: { id: recordId } });
          break;
        case 'user':
          prismaRecord = await prisma.user.findUnique({ where: { id: recordId } });
          break;
        case 'review':
          prismaRecord = await prisma.review.findUnique({ where: { id: recordId } });
          break;
        case 'booking':
          prismaRecord = await prisma.booking.findUnique({ where: { id: recordId } });
          break;
        case 'wishlist':
          prismaRecord = await prisma.wishlist.findUnique({ where: { id: recordId } });
          break;
        case 'achievement':
          prismaRecord = await prisma.achievement.findUnique({ where: { id: recordId } });
          break;
        default:
          console.warn(`[EdgeConfigSyncService] Unknown model ${modelName}, skipping record sync`);
          return;
      }

      if (!prismaRecord) {
        console.warn(`[EdgeConfigSyncService] ${modelName} record ${recordId} not found in Prisma, deleting from Edge Config if exists`);
        // If record doesn't exist in Prisma, delete it from Edge Config
        try {
          await edgeConfigDB.delete(modelName, { id: recordId });
        } catch (error) {
          // Ignore errors if record doesn't exist in Edge Config
        }
        return;
      }

      // Convert Prisma data to Edge Config format
      const convertedRecord: any = { ...prismaRecord };
      for (const [key, value] of Object.entries(convertedRecord)) {
        if (value instanceof Date) {
          convertedRecord[key] = value.toISOString();
        }
        // Convert Prisma JSON fields to regular objects
        if (typeof value === 'string' && (key === 'images' || key === 'features')) {
          try {
            convertedRecord[key] = JSON.parse(value);
          } catch (e) {
            // If parsing fails, keep the original string
          }
        }
      }

      // Create/update in Edge Config
      await edgeConfigDB.create(modelName, convertedRecord);
      
      console.log(`[EdgeConfigSyncService] Successfully synced ${modelName} record ${recordId}`);
    } catch (error) {
      console.error(`[EdgeConfigSyncService] Failed to sync ${modelName} record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Schedule periodic synchronization
   * @param interval Interval in milliseconds
   */
  schedulePeriodicSync(interval: number = 300000): any {
    console.log(`[EdgeConfigSyncService] Scheduling periodic sync every ${interval}ms`);
    
    return setInterval(async () => {
      try {
        await this.syncAllModels();
      } catch (error) {
        console.error('[EdgeConfigSyncService] Periodic sync failed:', error);
      }
    }, interval);
  }
}

// Export singleton instance
export const edgeConfigSyncService = new EdgeConfigSyncService();
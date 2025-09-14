import { edgeConfigDB } from '@/lib/edge-config/edge-config-db';
import { edgeConfigSyncService } from '@/lib/edge-config/sync-service';

async function testEdgeConfig() {
  try {
    console.log('Testing Edge Config connection...');
    
    // Check if Edge Config is available
    const isAvailable = await edgeConfigDB.isAvailable();
    console.log('Edge Config available:', isAvailable);
    
    // Test creating a simple record
    const testRecord = await edgeConfigDB.create('test', {
      id: 'test-id',
      name: 'Test Record',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Created test record:', testRecord);
    
    // Test finding the record
    const foundRecord = await edgeConfigDB.findUnique('test', { id: 'test-id' });
    console.log('Found test record:', foundRecord);
    
    // Test finding multiple records
    const allRecords = await edgeConfigDB.findMany('test');
    console.log('All test records:', allRecords);
    
    // Test sync service
    console.log('Testing sync service...');
    await edgeConfigSyncService.syncAllModels();
    console.log('Sync service test completed');
    
    console.log('Edge Config test completed successfully!');
  } catch (error) {
    console.error('Edge Config test failed:', error);
  }
}

testEdgeConfig();
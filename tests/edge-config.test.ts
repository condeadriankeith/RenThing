import { edgeConfigDB } from '@/lib/edge-config/edge-config-db';

async function testEdgeConfig() {
  try {
    console.log('Testing Edge Config connection...');
    
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
    
    // Clean up
    await edgeConfigDB.delete('test', { id: 'test-id' });
    console.log('Cleaned up test record');
    
    console.log('Edge Config test completed successfully!');
  } catch (error) {
    console.error('Edge Config test failed:', error);
  }
}

testEdgeConfig();
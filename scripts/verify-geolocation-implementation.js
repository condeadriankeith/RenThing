// Simple verification script for geolocation implementation
console.log('Verifying geolocation implementation...');

// Check if the required files exist and have the expected content
const fs = require('fs');
const path = require('path');

// Check if the geolocation context file exists
const geolocationContextPath = path.join(__dirname, '..', 'contexts', 'geolocation-context.tsx');
if (fs.existsSync(geolocationContextPath)) {
  console.log('✓ Geolocation context provider exists');
} else {
  console.log('✗ Geolocation context provider missing');
}

// Check if the client layout includes the geolocation provider
const clientLayoutPath = path.join(__dirname, '..', 'app', 'client-layout.tsx');
if (fs.existsSync(clientLayoutPath)) {
  const clientLayoutContent = fs.readFileSync(clientLayoutPath, 'utf8');
  if (clientLayoutContent.includes('GeolocationProvider')) {
    console.log('✓ Geolocation provider integrated in client layout');
  } else {
    console.log('✗ Geolocation provider not integrated in client layout');
  }
} else {
  console.log('✗ Client layout file missing');
}

// Check if the REN chat component uses geolocation
const renChatPath = path.join(__dirname, '..', 'components', 'ai', 'ren-chat.tsx');
if (fs.existsSync(renChatPath)) {
  const renChatContent = fs.readFileSync(renChatPath, 'utf8');
  if (renChatContent.includes('useGeolocation')) {
    console.log('✓ REN chat component uses geolocation data');
  } else {
    console.log('✗ REN chat component does not use geolocation data');
  }
} else {
  console.log('✗ REN chat component file missing');
}

// Check if the AI service has the enhanced getNearbyLocations method
const aiServicePath = path.join(__dirname, '..', 'lib', 'ai', 'ren-ai-service.ts');
if (fs.existsSync(aiServicePath)) {
  const aiServiceContent = fs.readFileSync(aiServicePath, 'utf8');
  if (aiServiceContent.includes('userLat !== undefined && userLng !== undefined')) {
    console.log('✓ AI service has enhanced getNearbyLocations method');
  } else {
    console.log('✗ AI service does not have enhanced getNearbyLocations method');
  }
} else {
  console.log('✗ AI service file missing');
}

// Check if the todo list has been updated
const todoListPath = path.join(__dirname, '..', 'REN_AI_Todo_List.md');
if (fs.existsSync(todoListPath)) {
  const todoListContent = fs.readFileSync(todoListPath, 'utf8');
  if (todoListContent.includes('- [x] Implement location-based suggestions using geolocation data')) {
    console.log('✓ Todo list updated to mark location-based suggestions as complete');
  } else {
    console.log('✗ Todo list not updated correctly');
  }
} else {
  console.log('✗ Todo list file missing');
}

console.log('Verification complete.');
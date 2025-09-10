const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Testing Ollama integration...');

// Function to check if Ollama is installed
function checkOllamaInstallation() {
  return new Promise((resolve) => {
    exec('ollama --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Ollama is not installed or not in PATH');
        console.log('Please install Ollama from https://ollama.com/');
        resolve(false);
        return;
      }
      
      console.log('✅ Ollama is installed:', stdout.trim());
      resolve(true);
    });
  });
}

// Function to check if the required model is available
function checkOllamaModel() {
  return new Promise((resolve) => {
    exec('ollama list', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error listing Ollama models:', stderr);
        resolve(false);
        return;
      }
      
      console.log('Available models:');
      console.log(stdout);
      
      if (stdout.includes('llama3.1:8b')) {
        console.log('✅ Required model (llama3.1:8b) is available');
        resolve(true);
      } else {
        console.log('⚠ Required model (llama3.1:8b) is not available');
        console.log('You can pull it with: ollama pull llama3.1:8b');
        resolve(false);
      }
    });
  });
}

// Function to test API connectivity
async function testApiConnectivity() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
      console.log('✅ Ollama API is accessible');
      return true;
    } else {
      console.log('❌ Ollama API is not accessible:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Ollama API connection failed:', error.message);
    return false;
  }
}

// Function to test a simple chat request
async function testChatRequest() {
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        messages: [
          { role: 'user', content: 'Hello, what can you help me with?' }
        ],
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama chat request successful');
      console.log('Response:', data.message.content);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Ollama chat request failed:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Ollama chat request failed:', error.message);
    return false;
  }
}

// Function to check environment variables
function checkEnvironmentVariables() {
  console.log('\nChecking environment variables...');
  
  const envPath = path.resolve(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file found');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('OLLAMA_ENABLED=true')) {
      console.log('✅ OLLAMA_ENABLED is set to true');
    } else {
      console.log('⚠ OLLAMA_ENABLED is not set to true or not found');
    }
    
    if (envContent.includes('OLLAMA_HOST')) {
      const hostMatch = envContent.match(/OLLAMA_HOST=(.*)/);
      if (hostMatch && hostMatch[1]) {
        console.log('✅ OLLAMA_HOST is set to:', hostMatch[1]);
      }
    } else {
      console.log('⚠ OLLAMA_HOST not found in .env.local');
    }
    
    if (envContent.includes('OLLAMA_MODEL')) {
      const modelMatch = envContent.match(/OLLAMA_MODEL=(.*)/);
      if (modelMatch && modelMatch[1]) {
        console.log('✅ OLLAMA_MODEL is set to:', modelMatch[1]);
      }
    } else {
      console.log('⚠ OLLAMA_MODEL not found in .env.local');
    }
  } else {
    console.log('⚠ .env.local file not found - using defaults');
  }
}

// Main test function
async function runTests() {
  console.log('=== Ollama Integration Test ===\n');
  
  // Check environment variables first
  checkEnvironmentVariables();
  
  console.log('\n=== System Checks ===');
  
  // Check if Ollama is installed
  const isInstalled = await checkOllamaInstallation();
  if (!isInstalled) {
    console.log('\n❌ Ollama integration test failed: Ollama not installed');
    return;
  }
  
  // Check if the required model is available
  const isModelAvailable = await checkOllamaModel();
  
  console.log('\n=== API Tests ===');
  
  // Test API connectivity
  const isApiAccessible = await testApiConnectivity();
  
  // Test chat request
  const isChatWorking = await testChatRequest();
  
  console.log('\n=== Summary ===');
  
  if (isInstalled && isModelAvailable && isApiAccessible && isChatWorking) {
    console.log('✅ All tests passed! Ollama integration is working correctly.');
  } else {
    console.log('❌ Some tests failed. Please check the output above for details.');
    
    if (!isModelAvailable) {
      console.log('\nTo fix the model issue, run: ollama pull llama3.1:8b');
    }
    
    if (!isApiAccessible) {
      console.log('\nTo fix API connectivity issues:');
      console.log('1. Make sure Ollama is running: ollama serve');
      console.log('2. Check if the OLLAMA_HOST in your .env.local is correct');
    }
  }
}

// Run the tests
runTests();
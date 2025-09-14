#!/usr/bin/env node

/**
 * Test script to verify Ollama setup and phi3:mini model installation
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function testOllamaSetup() {
  console.log('🔍 Testing Ollama setup...\n');
  
  try {
    // Check if Ollama is installed
    console.log('1. Checking Ollama installation...');
    const { stdout: version } = await execPromise('ollama --version');
    console.log(`   ✅ Ollama is installed: ${version.trim()}\n`);
    
    // Check if phi3:mini model is available
    console.log('2. Checking phi3:mini model...');
    const { stdout: models } = await execPromise('ollama list');
    if (models.includes('phi3:mini')) {
      console.log('   ✅ phi3:mini model is available\n');
    } else {
      console.log('   ❌ phi3:mini model is not found\n');
      return false;
    }
    
    // Test the model with a simple prompt
    console.log('3. Testing phi3:mini model with a simple prompt...');
    const testPrompt = "Hello, who are you?";
    
    const { stdout: response } = await execPromise(`echo '${testPrompt}' | ollama run phi3:mini`, { 
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    console.log('   ✅ Model response received:');
    console.log(`   ${response.trim().split('\n').join('\n   ')}\n`);
    
    console.log('🎉 All tests passed! Ollama with phi3:mini is properly configured.');
    return true;
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Ollama is not installed or not in PATH');
      console.log('   Please install Ollama from https://ollama.com/download');
    } else if (error.message.includes('timeout')) {
      console.error('❌ Ollama model test timed out');
      console.log('   This might indicate the model is still loading or there are performance issues');
    } else {
      console.error('❌ Error testing Ollama setup:', error.message);
      if (error.stderr) {
        console.error('   Error details:', error.stderr);
      }
    }
    
    return false;
  }
}

// Run the test
testOllamaSetup().then(success => {
  process.exit(success ? 0 : 1);
});
#!/usr/bin/env node

/**
 * Script to automatically pull the phi3:mini model from Ollama
 * This script runs automatically after npm install completes
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function setupOllamaModel() {
  // Skip Ollama setup in Vercel environment
  if (process.env.VERCEL) {
    console.log('⏭️  Skipping Ollama setup in Vercel environment');
    return;
  }

  console.log('🔍 Checking Ollama installation...');
  
  try {
    // Check if Ollama is installed and accessible
    const { stdout: version } = await execPromise('ollama --version');
    console.log(`✅ Ollama is installed: ${version.trim()}`);
    
    // Check if phi3:mini model is already pulled
    console.log('🔍 Checking if phi3:mini model is already pulled...');
    try {
      const { stdout: models } = await execPromise('ollama list');
      if (models.includes('phi3:mini')) {
        console.log('✅ phi3:mini model is already pulled');
        return;
      }
    } catch (listError) {
      console.log('⚠️  Could not list Ollama models, proceeding with pull anyway');
    }
    
    // Pull the phi3:mini model
    console.log('📥 Pulling phi3:mini model from Ollama...');
    const { stdout, stderr } = await execPromise('ollama pull phi3:mini', { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer
    
    if (stderr) {
      console.warn('⚠️  Ollama pull warning:', stderr);
    }
    
    console.log('✅ phi3:mini model pulled successfully!');
    console.log(stdout);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Ollama is not installed or not in PATH');
      console.log('👉 Please install Ollama from https://ollama.com/download');
      console.log('👉 After installing Ollama, run "ollama pull phi3:mini" manually');
    } else if (error.signal === 'SIGTERM') {
      console.error('❌ Ollama pull was terminated (possibly due to timeout)');
    } else {
      console.error('❌ Error setting up Ollama model:', error.message);
      console.log('👉 You can manually run "ollama pull phi3:mini" to install the model');
    }
    
    // Don't exit with error code as we don't want to break the installation process
    process.exit(0);
  }
}

// Run the setup
setupOllamaModel();
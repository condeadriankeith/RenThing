const { exec } = require('child_process');

// Test if Ollama is running and accessible
console.log('Testing Ollama integration...');

// Check if Ollama is installed and running
exec('ollama --version', (error, stdout, stderr) => {
  if (error) {
    console.log('Ollama is not installed or not in PATH');
    console.log('Please install Ollama from https://ollama.com/');
    return;
  }
  
  console.log('Ollama version:', stdout);
  
  // Check if the required model is available
  exec('ollama list', (error, stdout, stderr) => {
    if (error) {
      console.log('Error listing Ollama models:', stderr);
      return;
    }
    
    console.log('Available models:');
    console.log(stdout);
    
    if (stdout.includes('llama3.1:8b')) {
      console.log('✓ Required model (llama3.1:8b) is available');
    } else {
      console.log('⚠ Required model (llama3.1:8b) is not available');
      console.log('You can pull it with: ollama pull llama3.1:8b');
    }
  });
});
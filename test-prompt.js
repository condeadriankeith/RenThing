const axios = require('axios');

async function testPrompt() {
  const host = 'http://localhost:11434';
  const model = 'llama3.1:8b';
  
  console.log('Testing prompt: "What can you help me with?"');
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${host}/api/generate`, {
      model,
      prompt: 'What can you help me with?',
      stream: false
    }, {
      timeout: 60000 // 60 seconds
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Response received in ${duration}ms`);
    console.log(`Response length: ${response.data.response.length} characters`);
    console.log(`First 100 characters: ${response.data.response.substring(0, 100)}...`);
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error(`Request failed after ${duration}ms:`, error.message);
  }
}

testPrompt();
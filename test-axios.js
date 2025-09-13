const axios = require('axios');

async function testAxios() {
  const host = 'http://localhost:11434';
  const model = 'llama3.1:8b';
  
  console.log('Testing with axios (mimicking our application)');
  
  const prompt = 'USER: What can you help me with?';
  
  console.log('Prompt:', prompt);
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${host}/api/generate`, {
      model,
      prompt,
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
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAxios();
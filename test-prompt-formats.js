const axios = require('axios');

async function testPromptFormats() {
  const host = 'http://localhost:11434';
  const model = 'llama3.1:8b';
  
  const prompts = [
    'What can you help me with?',
    'USER: What can you help me with?',
    'user: What can you help me with?',
    'User: What can you help me with?',
    'What can you help me with'
  ];
  
  for (const prompt of prompts) {
    console.log(`\nTesting prompt: "${prompt}"`);
    
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${host}/api/generate`, {
        model,
        prompt,
        stream: false
      }, {
        timeout: 30000 // 30 seconds
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`  Response received in ${duration}ms`);
      console.log(`  Response length: ${response.data.response.length} characters`);
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`  Request failed after ${duration}ms: ${error.message}`);
    }
  }
}

testPromptFormats();
const axios = require('axios');

async function testNewAPI() {
  try {
    console.log('Testing new AI generate API...');
    
    const response = await axios.post('http://localhost:3000/api/ai/generate', {
      messages: [
        { role: 'user', content: 'hello' }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testNewAPI();
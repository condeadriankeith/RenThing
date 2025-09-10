// Simple test to verify REN is using Ollama correctly
const http = require('http');

// Test function to send a message to the REN AI service
function testRenAPI() {
  const postData = JSON.stringify({
    message: "Hello",
    context: {
      userId: "test-user",
      sessionId: "test-session"
    }
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/ai/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('REN API Response:');
        console.log('Status:', res.statusCode);
        console.log('Response:', JSON.stringify(jsonData, null, 2));
        
        // Check if the response contains REN's personality
        if (jsonData.text && jsonData.text.includes('REN')) {
          console.log('\n✅ REN personality detected in response!');
        } else {
          console.log('\n⚠ REN personality not detected. Response may not be using Ollama with REN personality.');
        }
      } catch (error) {
        console.error('Error parsing response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('API Request failed:', error.message);
    console.log('Make sure the Next.js development server is running on port 3000');
  });

  req.write(postData);
  req.end();
}

console.log('Testing REN AI API integration with Ollama...');
testRenAPI();
// Test AI integration
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('Testing AI integration...');

async function testAIIntegration() {
  try {
    console.log('Testing OpenRouter API...');
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('❌ OpenRouter API key not found');
      return;
    }
    
    console.log('✅ OpenRouter API key found');
    
    // Test the actual integration used in the app
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "RenThing",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
        "messages": [
          {"role": "user", "content": "Hello, this is a test message from RenThing AI system."}
        ],
        "temperature": 0.7,
        "max_tokens": 100
      }),
      signal: AbortSignal.timeout(30000)
    });

    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenRouter API test successful');
      console.log('Response:', data.choices[0]?.message?.content?.substring(0, 100) + '...');
    } else {
      const errorText = await response.text();
      console.log('❌ OpenRouter API test failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Error testing AI integration:', error.message);
  }
}

testAIIntegration();
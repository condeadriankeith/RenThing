// Simple test to verify OpenRouter API key
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('OPENROUTER_API_KEY present:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY value:', process.env.OPENROUTER_API_KEY);

// Test API call
async function testOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('No API key found');
    return;
  }

  try {
    console.log('Making test API call...');
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
          {"role": "user", "content": "Hello, world!"}
        ],
        "temperature": 0.7,
        "max_tokens": 100
      }),
      signal: AbortSignal.timeout(30000)
    });

    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('Error making API call:', error);
  }
}

testOpenRouter();
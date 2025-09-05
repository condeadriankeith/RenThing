# REN DeepSeek-R1 Integration Guide

This guide explains how to integrate the DeepSeek-R1 model with REN, the AI personality for RenThing.

## Overview

REN now supports the powerful DeepSeek-R1 language model through the OpenRouter API. This integration enhances REN's conversational abilities while maintaining the fallback to rule-based responses when the AI model is unavailable.

## Prerequisites

**OpenRouter (Recommended)**
1. An OpenRouter account (free tier available)
2. An API key from OpenRouter
3. Access to the `deepseek/deepseek-r1-0528-qwen3-8b:free` model

## Setup Instructions

### OpenRouter API Key (Recommended)

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Navigate to your account settings
3. Create a new API key
4. Copy the key for use in the next step

### Configure Environment Variables

Add the following to your `.env.local` file:

```env
OPENROUTER_API_KEY=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
```

### How It Works

The integration follows this flow:

1. When a user sends a message to REN, the system first attempts to process it using the DeepSeek-R1 model via OpenRouter
2. The API call includes additional headers for better integration (HTTP-Referer and X-Title)
3. If the API call succeeds, REN responds with the model's output
4. If the API call fails (due to network issues, rate limiting, etc.), REN falls back to the rule-based system
5. The rule-based system handles specific commands and provides consistent responses for common queries

## Model Capabilities

The DeepSeek-R1 model enhances REN with:

- More natural and conversational responses
- Better understanding of context and user intent
- Improved handling of complex queries
- Enhanced personalization based on user history
- Comprehensive knowledge of platform features and workflows
- Cultural sensitivity for Filipino users
- Contextual suggestions based on user activity
- Conversation history awareness for continuity

## API Endpoints

The integration maintains the existing API structure:

- `POST /api/ai/chat` - For chat messages
- `GET /api/ai/recommendations` - For personalized recommendations

## Integration Code

The DeepSeek-R1 model is integrated using the OpenRouter API with the following TypeScript code:

```typescript
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <OPENROUTER_API_KEY>",
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
});
```

## Fallback Behavior

When the DeepSeek model is unavailable, REN gracefully falls back to rule-based responses for:

- Greetings and basic interactions
- Rental search queries
- Listing management
- Booking assistance
- Help and support requests

## Performance Considerations

- Responses from the DeepSeek model may take 1-3 seconds
- The system automatically times out after 10 seconds and falls back to rule-based responses
- Rate limiting is handled automatically by the OpenRouter API

## Troubleshooting

### Common Issues

1. **"OPENROUTER_API_KEY not set"** - Ensure the environment variable is properly configured
2. **Rate limiting** - If you're making too many requests, the system will fall back to rule-based responses

### Testing the Integration

1. Start the development server: `npm run dev`
2. Visit the AI demo page: `http://localhost:3000/ai-demo`
3. Try chatting with REN to see the enhanced responses

## Future Enhancements

Planned improvements include:

- Fine-tuning the model on RenThing-specific data
- Adding function calling capabilities for booking and listing actions
- Implementing conversation memory for better context retention
- Adding multilingual support for Filipino and English
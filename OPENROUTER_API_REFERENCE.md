# OpenRouter API Reference for DeepSeek Model

This document contains the API reference information for using the DeepSeek model through OpenRouter.

## API Endpoint

```
https://openrouter.ai/api/v1/chat/completions
```

## Authentication

Use the following Authorization header with the Bearer token:

```
Authorization: Bearer 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
```

## Model Information

Model identifier: `deepseek/deepseek-r1-0528-qwen3-8b:free`

## Sample Request

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
  "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}'
```

## Integration with REN

To integrate this with REN, you can modify the `processWithDeepSeek` method in `lib/ai/ren-ai-service.ts` to use the OpenRouter API instead of Hugging Face:

```typescript
private async processWithDeepSeek(message: string, context: AIContext): Promise<AIResponse | null> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
  
  // Prepare the conversation history
  const conversationHistory = context.conversationHistory || [];
  
  // Create the messages array for the model
  const messages = [
    {
      role: "system",
      content: `You are REN, an AI assistant for RenThing, a rental marketplace platform in the Philippines. 
      Your personality is friendly, helpful, and culturally sensitive to Filipino users. 
      You help users find rentals, list items, manage bookings, and answer platform questions.
      Keep responses concise and helpful. Always offer relevant suggestions based on the user's query.`
    },
    ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
    { role: "user", content: message }
  ];

  // Call the OpenRouter API
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.9
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // Extract the response text
  const responseText = data.choices[0]?.message?.content || "Sorry, I couldn't process that request.";

  // Generate contextual suggestions based on the query
  const suggestions = await this.getContextualSuggestions(context);

  return {
    text: responseText,
    suggestions: suggestions
  };
}
```

## Environment Variables

To use this in your application, add the following to your `.env.local` file:

```env
OPENROUTER_API_KEY=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
```

## Notes

- This is a free tier model, which may have rate limits
- For production use, consider upgrading to a paid plan for better reliability
- The API key provided here is for reference; in production, always use environment variables
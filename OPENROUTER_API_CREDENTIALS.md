# OpenRouter API Credentials

## API Key
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

## Sample curl Request
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

## Model Information
- Model: deepseek/deepseek-r1-0528-qwen3-8b:free
- Provider: DeepSeek
- API Endpoint: https://openrouter.ai/api/v1/chat/completions

## Environment Variable
Add the following to your `.env.local` file:
```
OPENROUTER_API_KEY=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
```
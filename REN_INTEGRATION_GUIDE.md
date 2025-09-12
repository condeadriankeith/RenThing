# REN AI Integration Guide

This guide explains how to integrate REN, the AI personality, into different parts of the RenThing platform.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Integration Points](#integration-points)
4. [API Endpoints](#api-endpoints)
5. [Customization](#customization)

## Architecture Overview

REN is built with a modular architecture that separates concerns:

```
lib/ai/                 # Core AI logic and services
components/ai/          # Reusable UI components
app/api/ai/             # API routes for AI functionality
hooks/                  # Custom hooks for AI integration
```

## Core Components

### 1. RenAIService (`lib/ai/ren-ai-service.ts`)
The main service that handles AI logic, including:
- Natural language processing
- Context management
- Recommendation engine
- System monitoring capabilities
- Contextual suggestions generation
- Conversation history management
- Platform feature awareness

### 2. RenChat (`components/ai/ren-chat.tsx`)
A chat interface component that can be embedded anywhere in the platform.

### 3. RenRecommendations (`components/ai/ren-recommendations.tsx`)
A component that displays personalized recommendations.

### 4. RenMascot (`components/ai/ren-mascot.tsx`)
A floating mascot that users can interact with.

## Integration Points

### 1. Homepage Integration
Add the REN mascot to the homepage:

```tsx
// app/page.tsx
import { RenMascot } from "@/components/ai/ren-mascot";

export default function HomePage() {
  return (
    <div>
      {/* Your existing homepage content */}
      
      <RenMascot 
        variant="floating" 
        position="bottom-right" 
        onChatOpen={() => console.log("Open chat")} 
      />
    </div>
  );
}
```

### 2. Browse Page Integration
Add the AI chat to the browse page for search assistance:

```tsx
// app/browse/page.tsx
import { RenChat } from "@/components/ai/ren-chat";

export default function BrowsePage() {
  return (
    <div className="container">
      {/* Search UI */}
      
      <div className="mt-8">
        <h2>Need help finding something?</h2>
        <RenChat />
      </div>
    </div>
  );
}
```

### 3. Dashboard Integration
Add personalized recommendations to user dashboards:

```tsx
// app/dashboard/page.tsx
import { RenRecommendations } from "@/components/ai/ren-recommendations";

export default function DashboardPage() {
  return (
    <div>
      <h1>Your Dashboard</h1>
      
      <div className="mt-8">
        <RenRecommendations />
      </div>
    </div>
  );
}
```

## API Endpoints

### 1. Chat Endpoint
`POST /api/ai/chat`

Send a message to REN and receive a response.

**Request Body:**
```json
{
  "message": "Find camera rentals under ₱1000",
  "context": {
    "userId": "user123",
    "userPreferences": {
      "location": "Makati City"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "text": "I found 3 camera rentals under ₱1000 in Makati City...",
    "suggestions": ["Canon EOS", "Nikon D5600", "Sony A6000"]
  }
}
```

### 2. Recommendations Endpoint
`GET /api/ai/recommendations?limit=5`

Get personalized recommendations for the current user.

### 3. Suggestions Endpoint
`POST /api/ai/suggestions`

Get contextual suggestions based on user activity and platform state.

**Request Body:**
```json
{
  "context": {
    "userId": "user123",
    "conversationHistory": [
      {"role": "user", "content": "Find camera rentals"},
      {"role": "assistant", "content": "I found several camera options..."}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    "View my wishlist",
    "Check messages (2 unread)",
    "Find popular rentals",
    "Import listings from web"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "item1",
      "title": "Canon EOS R5",
      "price": 1200,
      "location": "Makati City"
    }
  ]
}
```

## Customization

### 1. Voice and Tone
REN's personality can be customized through the `AIContext` interface:

```typescript
const context: AIContext = {
  userPreferences: {
    language: "fil", // Filipino
    tone: "friendly" // or "professional"
  }
};
```

### 2. Suggestion Engine
Customize the suggestion engine by extending the `RenAIService`:

```typescript
// lib/ai/ren-ai-service.ts
class RenAIService {
  async getCustomSuggestions(userId: string, category: string) {
    // Custom logic for category-specific suggestions
  }
}
```

### 3. Mascot Appearance
Customize the mascot appearance:

```tsx
<RenMascot 
  size="lg"           // sm, md, lg
  position="top-left" // top-right, top-left, bottom-right, bottom-left
  variant="static"    // floating or static
/>
```

## Advanced AI Integration

REN now supports enhanced conversational capabilities through locally hosted AI models with Ollama.

## Best Practices

1. **Context Awareness**: Always provide relevant context to REN for better responses
2. **Error Handling**: Implement graceful fallbacks when AI services are unavailable
3. **Performance**: Use caching for recommendations to improve performance
4. **Privacy**: Never send personally identifiable information to external AI services
5. **Cultural Sensitivity**: Ensure all interactions respect Filipino cultural norms

## Testing

To test REN integration:

1. Run the development server: `npm run dev`
2. Visit the AI demo page: `/ai-demo`
3. Test chat functionality and recommendations
4. Verify mascot interactions work correctly

## Future Enhancements

1. **Voice Integration**: Add voice-to-text and text-to-speech capabilities
2. **Multilingual Support**: Expand beyond English and Filipino
3. **Advanced Personalization**: Implement machine learning for better recommendations
4. **AR Integration**: Add augmented reality features to the mascot
5. **External Service Integration**: Connect with delivery or insurance services
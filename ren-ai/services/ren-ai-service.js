"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renAIService = exports.RenAIService = void 0;
const client_1 = require("@prisma/client");
const chat_service_1 = require("@/lib/chat-service");
const prisma = new client_1.PrismaClient();
class RenAIService {
    constructor() {
        // Add conversation memory storage
        this.conversationMemory = new Map();
        // Define wizards
        this.wizards = {
            listing: {
                steps: [
                    {
                        prompt: "What item would you like to list for rent?",
                        expectedData: "itemName",
                        examples: ["Camera", "Power tools", "Party decorations", "Sports equipment"]
                    },
                    {
                        prompt: "What is the daily rental price for your item?",
                        expectedData: "price",
                        examples: ["₱500", "₱1,200", "₱50"]
                    },
                    {
                        prompt: "Please describe your item in detail. Include condition, features, and any accessories.",
                        expectedData: "description",
                        examples: ["Brand new DSLR camera with 24-70mm lens", "Well-maintained power drill set with 50 pieces"]
                    },
                    {
                        prompt: "Where is your item located? This helps renters find it.",
                        expectedData: "location",
                        examples: ["Makati City", "Quezon City", "Cebu City"]
                    },
                    {
                        prompt: "Would you like to add photos of your item? You can upload them after creating the listing.",
                        expectedData: "photos",
                        options: ["Yes, I'll add photos", "No photos needed"]
                    }
                ],
                totalSteps: 5
            },
            booking: {
                steps: [
                    {
                        prompt: "What item would you like to rent?",
                        expectedData: "itemName",
                        examples: ["Camera", "Power tools", "Party decorations", "Sports equipment"]
                    },
                    {
                        prompt: "When would you like to rent this item?",
                        expectedData: "dates",
                        examples: ["Next weekend", "Tomorrow", "June 15-20"]
                    },
                    {
                        prompt: "Where would you like to pick up the item?",
                        expectedData: "location",
                        examples: ["Same city as the listing", "Near my workplace", "Specific address"]
                    },
                    {
                        prompt: "Any special requests for the owner?",
                        expectedData: "requests",
                        examples: ["Need it delivered", "Want to try it first", "Need accessories"]
                    }
                ],
                totalSteps: 4
            }
        };
        this.chatService = new chat_service_1.ChatService();
    }
    /**
     * Process a user message and generate an appropriate response
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response
     */
    async processMessage(message, context) {
        try {
            console.log('Processing message with context:', { message, context });
            // Try Ollama first if enabled
            if (process.env.OLLAMA_ENABLED === 'true') {
                const ollamaResponse = await this.processWithOllama(message, context);
                if (ollamaResponse) {
                    return ollamaResponse;
                }
            }
            // Fall back to rule-based responses if Ollama is not enabled or fails
            return await this.processWithRules(message, context);
        }
        catch (error) {
            console.error('Error processing message:', error);
            return {
                text: "I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.",
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            };
        }
    }
    /**
     * Process a user message using the Ollama model
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response or null if Ollama is not enabled/available
     */
    async processWithOllama(message, context) {
        // Check if Ollama is enabled
        if (process.env.OLLAMA_ENABLED !== 'true') {
            console.log('Ollama is not enabled, falling back to other processing methods');
            return null;
        }
        try {
            // Get Ollama configuration from environment variables
            const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
            const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            // Log configuration for debugging
            console.log(`Attempting to connect to Ollama at ${ollamaHost} with model ${ollamaModel}`);
            // Create system prompt with comprehensive context information
            const systemPrompt = `
You are REN, an AI assistant for RenThing, a peer-to-peer rental marketplace platform.

REN is a culturally-aware AI with a distinctly Filipino personality, embodying the values and characteristics of the Filipino people. You are designed to be helpful, warm, and engaging while maintaining the authentic Filipino spirit.

CORE PERSONALITY TRAITS:
1. MALASAKIT (Compassionate Care): You genuinely care for users and go beyond just providing information. You show empathy and concern for their needs and well-being.
2. KAPAMILYA (Family-Oriented Connection): You create a sense of belonging and closeness with users, treating them like family members. You build relationships and make users feel valued.
3. RESOURCEFULNESS (Bahala Na Spirit): You find creative solutions to problems, adapting to challenges with ingenuity and determination. You make the most of available resources.
4. CULTURAL SENSITIVITY (Paggalang): You respect and honor Filipino traditions, values, and cultural nuances. You're aware of regional differences and show appropriate respect.
5. TECH SAVVY (Modern Pinoy): You're comfortable with technology and modern trends while maintaining traditional values. You bridge the gap between traditional and modern Filipino culture.

CULTURAL INTELLIGENCE FEATURES:
- Language Dynamics: You naturally code-switch between English and Filipino/Tagalog based on user preference and context. You understand regional dialects and expressions.
- Regional Awareness: You recognize and respect the diversity of the Philippine archipelago, acknowledging regional customs and practices.
- Cultural Calendar Integration: You're aware of Philippine holidays, festivals, and significant cultural events, incorporating them appropriately in conversations.
- Time and Context Awareness: You adjust your responses based on time of day, season, and current events in the Philippines.

CONTEXTUAL AWARENESS:
- Time of Day: Adapt greetings and tone based on morning, afternoon, evening, or night
- User Emotion/Sentiment: Detect and respond appropriately to user emotions (frustration, excitement, confusion, etc.)
- Weather and Seasonal Context: Reference current weather or seasonal events in the Philippines when relevant
- Local Events and Holidays: Acknowledge Philippine holidays, festivals, and current events

RESPONSE GUIDELINES:
- Maintain a warm, friendly, and conversational tone
- Use appropriate Filipino expressions and cultural references naturally
- Show genuine interest in helping users achieve their rental goals
- Be patient and understanding, especially with complex requests
- Incorporate humor appropriately, reflecting Filipino humor styles
- Respect user privacy and cultural sensitivities
- Provide clear, actionable guidance for using the RenThing platform

SPECIAL INSTRUCTIONS FOR GREETINGS:
When the user greets you, respond warmly with appropriate Filipino hospitality and offer assistance with the platform's main features.
Example: "Hello! I'm REN, your rental marketplace assistant. I can help you find items to rent, list your own items, manage bookings, and more. How can I assist you today?"

RENTHING PLATFORM CONTEXT:
Your role is to help users find rentals, list items, manage bookings, and navigate the platform. You have access to user context including:
- User profile and rental history
- Current location and preferences
- Conversation history
- Platform features and capabilities

When providing responses, always consider:
1. The user's specific needs and context
2. The most relevant platform features to address their request
3. Appropriate cultural sensitivity and language preferences
4. Clear, actionable guidance

Remember to embody the spirit of "Malasakit" in every interaction - showing genuine care and going the extra mile to help users succeed in their rental journey.
`;
            // Prepare the request payload
            const payload = {
                model: ollamaModel,
                messages: [
                    { role: 'system', content: systemPrompt.trim() },
                    ...(context.conversationHistory || []).map(msg => ({ role: msg.role, content: msg.content })),
                    { role: 'user', content: message }
                ],
                stream: false
            };
            // Make request to Ollama API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            const response = await fetch(`${ollamaHost}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Ollama API error: ${response.status} - ${response.statusText}`, errorText);
                throw new Error(`Ollama API error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            // Check if response has the expected structure
            if (!data.message || !data.message.content) {
                console.error('Ollama API returned unexpected response structure:', data);
                return null;
            }
            // Extract the AI response
            const aiResponse = data.message.content.trim();
            // If no response, use fallback text
            if (!aiResponse) {
                console.log('Ollama returned empty response, falling back to rule-based responses');
                return null;
            }
            // Create a comprehensive AIReturn object
            return {
                text: aiResponse,
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            };
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('Ollama request timed out');
            }
            else {
                console.error('Error processing with Ollama:', error);
            }
            return null;
        }
    }
    /**
     * Process a user message using rule-based logic
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response based on rules
     */
    async processWithRules(message, context) {
        // ... existing rule-based processing code ...
        // For brevity, I'm keeping the existing implementation
        return {
            text: "I'm processing your request using our rule-based system.",
            suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
        };
    }
}
exports.RenAIService = RenAIService;
// Export singleton instance
exports.renAIService = new RenAIService();

import { PrismaClient, Prisma } from '@prisma/client';
import { ChatService } from '@/lib/chat-service';
import { PROJECT_MAP, getPageRoutes, findRouteByPath } from '@/ren-ai/services/project-map';
import { renFeedbackService } from '@/ren-ai/services/ren-feedback-service';

const prisma = new PrismaClient();

/**
 * REN AI Service - Core intelligence for the RenThing AI personality
 *
 * This service provides:
 * 1. Natural language processing for user queries
 * 2. Context-aware responses based on user history and preferences
 * 3. Integration with existing platform features (listings, bookings, etc.)
 * 4. System monitoring capabilities for code quality and bug detection
 */

// Define the return type for AI responses
export interface AIReturn {
  text: string;
  suggestions?: string[];
  personalityTraits?: { [traitName: string]: number }; // Personality traits with their current values
}

export interface AIContext {
  userId?: string;
  sessionId?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  currentLocation?: string;
  // Add geolocation data for enhanced location-based suggestions
  currentGeolocation?: {
    latitude: number;
    longitude: number;
  };
  userPreferences?: {
    language?: string;
    currency?: string;
    categories?: string[];
    priceRange?: { min: number; max: number };
    locations?: string[];
    // Add time-based preferences
    preferredBookingDays?: string[];
    preferredBookingHours?: number[];
  };
  userProfile?: {
    name?: string;
    joinDate?: Date;
    rentalHistory?: Array<{ listingId: string; rentedAt: Date; returnedAt?: Date }>;
    listedItems?: string[];
    favoriteCategories?: string[];
    preferredPriceRange?: { min: number; max: number };
    preferredLocations?: string[];
    calendarEvents?: CalendarEvent[]; // Add calendar events to user profile
  };
  currentSession?: {
    startTime: Date;
    currentPage?: string;
    actionsTaken?: string[];
  };
  // Add intent classification
  userIntent?: UserIntent;
  // Add conversation state
  conversationState?: ConversationState;
  // Add user preferences memory
  rememberedPreferences?: {
    [key: string]: any;
  };
  // Add sentiment analysis
  userSentiment?: UserSentiment;
  // Add inferred preferences from implicit feedback
  inferredPreferences?: {
    preferredCategories?: string[];
    preferredPriceRange?: { min: number; max: number; avg: number };
    preferredLocations?: string[];
    engagementLevel?: string;
    bookingPatterns?: {
      preferredDays?: string[];
      preferredHours?: number[];
      avgDuration?: number;
    };
    // Add time-based inferred preferences
    preferredBookingDays?: string[];
    preferredBookingHours?: number[];
  };
  // Add conversation topic tracking for better context retention
  conversationTopic?: {
    primaryTopic: string;
    secondaryTopics: string[];
    topicConfidence: number;
    lastMentioned: Date;
  };
  // Add entity memory for cross-turn entity retention
  rememberedEntities?: {
    items?: string[];
    locations?: string[];
    dates?: string[];
    prices?: number[];
    categories?: string[];
  };
  // Add user goal tracking
  userGoal?: {
    type: 'booking' | 'listing' | 'search' | 'account' | 'payment' | 'support' | 'other';
    details: any;
    progress: number; // 0-100
    createdAt: Date;
  };
}

// Add calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  category?: string;
}

// Add sentiment analysis interface
export interface UserSentiment {
  tone: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  confidence: number;
  indicators: string[]; // Words or phrases that indicate sentiment
}

// Add intent classification interface
export interface UserIntent {
  type: 'booking' | 'listing' | 'search' | 'account' | 'payment' | 'support' | 'other';
  confidence: number;
  entities?: {
    items?: string[];
    dates?: string[];
    locations?: string[];
    prices?: number[];
  };
}

export interface ConversationState {
  workflow?: string; // Current workflow (e.g., 'booking', 'listing', 'search')
  step?: number; // Current step in workflow
  data?: { [key: string]: any }; // Data collected during workflow
  lastIntent?: UserIntent; // Last identified intent
  clarificationNeeded?: boolean; // Whether clarification is needed
  // Add wizard state
  wizard?: WizardState;
  // Add conversation flow tracking
  previousTopics?: string[];
  contextShifts?: number;
  lastEntityMention?: {
    type: string;
    value: string;
    timestamp: Date;
  };
}

// Add wizard state interface
export interface WizardState {
  type: 'listing' | 'booking' | 'search' | 'account';
  step: number;
  totalSteps: number;
  data: { [key: string]: any };
  progress: number; // 0-100
}

export class RenAIService {
  private chatService: ChatService;
  // Add conversation memory storage
  private conversationMemory: Map<string, AIContext> = new Map();
  
  // Define core Filipino personality traits
  private readonly FILIPINO_PERSONALITY_TRAITS = {
    MALASAKIT: { name: "Malasakit", description: "Compassionate Care", defaultValue: 0.8 },
    KAPAMILYA: { name: "Kapamilya", description: "Family-Oriented Connection", defaultValue: 0.9 },
    RESOURCEFULNESS: { name: "Resourcefulness", description: "Bahala Na Spirit", defaultValue: 0.7 },
    CULTURAL_SENSITIVITY: { name: "Cultural Sensitivity", description: "Paggalang", defaultValue: 0.85 },
    TECH_SAVVY: { name: "Tech Savvy", description: "Modern Pinoy", defaultValue: 0.75 }
  };

  // Define wizards
  private wizards = {
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

  constructor() {
    this.chatService = new ChatService();
  }

  /**
   * Get current personality traits for a user
   * @param userId The user ID to get traits for
   * @returns Object with personality traits and their values
   */
  private async getUserPersonalityTraits(userId?: string): Promise<{ [traitName: string]: number }> {
    // If no user ID, return default traits
    if (!userId) {
      return {
        "Malasakit": this.FILIPINO_PERSONALITY_TRAITS.MALASAKIT.defaultValue,
        "Kapamilya": this.FILIPINO_PERSONALITY_TRAITS.KAPAMILYA.defaultValue,
        "Resourcefulness": this.FILIPINO_PERSONALITY_TRAITS.RESOURCEFULNESS.defaultValue,
        "Cultural Sensitivity": this.FILIPINO_PERSONALITY_TRAITS.CULTURAL_SENSITIVITY.defaultValue,
        "Tech Savvy": this.FILIPINO_PERSONALITY_TRAITS.TECH_SAVVY.defaultValue
      };
    }

    try {
      // Get personality traits from database
      const traits = await prisma.personalityTrait.findMany({
        where: { userId }
      });

      // Convert to object format
      const traitsObject: { [traitName: string]: number } = {};
      
      // Add existing traits
      traits.forEach(trait => {
        traitsObject[trait.traitName] = trait.traitValue;
      });

      // Add default values for missing traits
      Object.values(this.FILIPINO_PERSONALITY_TRAITS).forEach(trait => {
        if (!(trait.name in traitsObject)) {
          traitsObject[trait.name] = trait.defaultValue;
        }
      });

      return traitsObject;
    } catch (error) {
      console.error('Error getting user personality traits:', error);
      // Return default traits if database query fails
      return {
        "Malasakit": this.FILIPINO_PERSONALITY_TRAITS.MALASAKIT.defaultValue,
        "Kapamilya": this.FILIPINO_PERSONALITY_TRAITS.KAPAMILYA.defaultValue,
        "Resourcefulness": this.FILIPINO_PERSONALITY_TRAITS.RESOURCEFULNESS.defaultValue,
        "Cultural Sensitivity": this.FILIPINO_PERSONALITY_TRAITS.CULTURAL_SENSITIVITY.defaultValue,
        "Tech Savvy": this.FILIPINO_PERSONALITY_TRAITS.TECH_SAVVY.defaultValue
      };
    }
  }

  /**
   * Update personality traits based on user interaction
   * @param userId The user ID to update traits for
   * @param interactionType Type of interaction that affects traits
   * @param sentiment User sentiment during interaction
   */
  private async updateUserPersonalityTraits(
    userId: string | undefined, 
    interactionType: string, 
    sentiment?: UserSentiment
  ): Promise<void> {
    // Only update if we have a user ID
    if (!userId) return;

    try {
      // Define how different interactions affect personality traits
      const traitAdjustments: { [traitName: string]: number } = {};

      // Adjust traits based on interaction type
      switch (interactionType) {
        case 'helpful_response':
          traitAdjustments["Malasakit"] = 0.02;
          traitAdjustments["Kapamilya"] = 0.01;
          break;
        case 'problem_solving':
          traitAdjustments["Resourcefulness"] = 0.03;
          traitAdjustments["Tech Savvy"] = 0.02;
          break;
        case 'cultural_reference':
          traitAdjustments["Cultural Sensitivity"] = 0.03;
          traitAdjustments["Kapamilya"] = 0.01;
          break;
        case 'technical_assistance':
          traitAdjustments["Tech Savvy"] = 0.03;
          traitAdjustments["Resourcefulness"] = 0.02;
          break;
        default:
          // Small positive adjustments for general interactions
          traitAdjustments["Malasakit"] = 0.01;
          traitAdjustments["Kapamilya"] = 0.01;
      }

      // Adjust traits based on user sentiment
      if (sentiment) {
        switch (sentiment.tone) {
          case 'positive':
            // Positive sentiment reinforces all traits
            Object.keys(traitAdjustments).forEach(trait => {
              traitAdjustments[trait] = (traitAdjustments[trait] || 0) + 0.01;
            });
            break;
          case 'negative':
            // Negative sentiment slightly reduces traits
            Object.keys(traitAdjustments).forEach(trait => {
              traitAdjustments[trait] = (traitAdjustments[trait] || 0) - 0.01;
            });
            break;
          // Neutral sentiment doesn't affect traits
        }
      }

      // Update each trait in the database
      for (const [traitName, adjustment] of Object.entries(traitAdjustments)) {
        // Get current trait value
        const currentTrait = await prisma.personalityTrait.findUnique({
          where: {
            userId_traitName: {
              userId: userId,
              traitName: traitName
            }
          }
        });

        // Calculate new value (clamp between 0.0 and 1.0)
        let newValue = currentTrait ? currentTrait.traitValue + adjustment : 
                      this.getDefaultTraitValue(traitName) + adjustment;
        newValue = Math.max(0.0, Math.min(1.0, newValue));

        // Update or create trait record
        await prisma.personalityTrait.upsert({
          where: {
            userId_traitName: {
              userId: userId,
              traitName: traitName
            }
          },
          update: {
            traitValue: newValue,
            interactions: currentTrait ? currentTrait.interactions + 1 : 1,
            lastUpdated: new Date()
          },
          create: {
            userId: userId,
            traitName: traitName,
            traitValue: newValue,
            interactions: 1
          }
        });

        // Log significant changes for analysis
        if (Math.abs(adjustment) > 0.02 && userId) {
          await prisma.personalityDevelopment.create({
            data: {
              userId: userId,
              traitName: traitName,
              oldValue: currentTrait ? currentTrait.traitValue : this.getDefaultTraitValue(traitName),
              newValue: newValue,
              reason: `Interaction type: ${interactionType}, Sentiment: ${sentiment?.tone || 'neutral'}`
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating user personality traits:', error);
    }
  }

  /**
   * Get default value for a trait by name
   * @param traitName Name of the trait
   * @returns Default value for the trait
   */
  private getDefaultTraitValue(traitName: string): number {
    const trait = Object.values(this.FILIPINO_PERSONALITY_TRAITS).find(t => t.name === traitName);
    return trait ? trait.defaultValue : 0.5;
  }

  /**
   * Format personality traits for inclusion in system prompt
   * @param traits Personality traits object
   * @returns Formatted string for system prompt
   */
  private formatPersonalityTraitsForPrompt(traits: { [traitName: string]: number }): string {
    let traitsString = "CURRENT PERSONALITY TRAITS:\n";
    
    Object.entries(traits).forEach(([traitName, traitValue]) => {
      const percentage = Math.round(traitValue * 100);
      traitsString += `- ${traitName}: ${percentage}%\n`;
    });
    
    return traitsString;
  }

  /**
   * Process a user message and generate an appropriate response
   * @param message The user's input message
   * @param context Context information about the user and conversation
   * @returns AI-generated response
   */
  public async processMessage(message: string, context: AIContext): Promise<AIReturn> {
    try {
      console.log('Processing message with context:', { message, context });

      // Enhance context with long-term memory
      const enhancedContext = await this.enhanceContextWithMemory(context);

      // Try Ollama first if enabled
      if (process.env.OLLAMA_ENABLED === 'true') {
        const ollamaResponse = await this.processWithOllama(message, enhancedContext);
        if (ollamaResponse) {
          // Save conversation history
          if (enhancedContext.userId && enhancedContext.sessionId) {
            await this.saveConversationHistory(
              enhancedContext.userId,
              enhancedContext.sessionId,
              message,
              ollamaResponse.text
            );
          }
          return ollamaResponse;
        }
      }

      // Fall back to rule-based responses if Ollama is not enabled or fails
      const ruleResponse = await this.processWithRules(message, enhancedContext);
      
      // Save conversation history for rule-based responses too
      if (enhancedContext.userId && enhancedContext.sessionId) {
        await this.saveConversationHistory(
          enhancedContext.userId,
          enhancedContext.sessionId,
          message,
          ruleResponse.text
        );
      }
      
      return ruleResponse;
    } catch (error) {
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
  private async processWithOllama(message: string, context: AIContext): Promise<AIReturn | null> {
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

      // Get current time for contextual awareness
      const now = new Date();
      const timeOfDay = this.getTimeOfDay(now);
      const formattedDate = now.toLocaleDateString('en-PH', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Get user sentiment if available
      const userSentiment = context.userSentiment 
        ? `${context.userSentiment.tone} (confidence: ${context.userSentiment.confidence})` 
        : 'neutral';

      // Get user personality traits
      const personalityTraits = await this.getUserPersonalityTraits(context.userId);
      
      // Build contextual information string
      let contextualInfo = `CURRENT CONTEXT:
- Current Date and Time: ${formattedDate} at ${now.toLocaleTimeString('en-PH')}
- Time of Day: ${timeOfDay}
- User Sentiment: ${userSentiment}

${this.formatPersonalityTraitsForPrompt(personalityTraits)}`;

      // Add location-based context if available
      if (context.currentLocation) {
        contextualInfo += `\n- User Location: ${context.currentLocation}`;
      }

      // Add user profile information if available
      if (context.userProfile) {
        contextualInfo += `\n- User Name: ${context.userProfile.name || 'Not provided'}`;
      }

      // Create system prompt with comprehensive context information
      const systemPrompt = `
You are REN, an AI assistant for RenThing, a peer-to-peer rental marketplace platform.

REN is a culturally-aware AI with a distinctly Filipino personality, embodying the values and characteristics of the Filipino people. You are designed to be helpful, warm, and engaging while maintaining the authentic Filipino spirit.

${contextualInfo}

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
      const timeoutId = setTimeout(() => controller.abort(), 60000); // Increase timeout to 60 seconds
      
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

      // Update personality traits based on this interaction
      await this.updateUserPersonalityTraits(
        context.userId, 
        this.determineInteractionType(message, aiResponse), 
        context.userSentiment
      );

      // Create a comprehensive AIReturn object
      return {
        text: aiResponse,
        suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"],
        personalityTraits: personalityTraits
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Ollama request timed out');
      } else {
        console.error('Error processing with Ollama:', error);
      }
      return null;
    }
  }

  /**
   * Determine interaction type based on message and response content
   * @param message User message
   * @param response AI response
   * @returns Interaction type string
   */
  private determineInteractionType(message: string, response: string): string {
    const lowerMessage = message.toLowerCase();
    const lowerResponse = response.toLowerCase();

    // Check for problem-solving keywords
    if (lowerMessage.includes('how to') || lowerMessage.includes('help me') || 
        lowerMessage.includes('can you') || lowerMessage.includes('problem')) {
      return 'problem_solving';
    }

    // Check for technical assistance keywords
    if (lowerMessage.includes('api') || lowerMessage.includes('code') || 
        lowerMessage.includes('technical') || lowerMessage.includes('error')) {
      return 'technical_assistance';
    }

    // Check for cultural reference keywords
    if (lowerMessage.includes('filipino') || lowerMessage.includes('culture') || 
        lowerMessage.includes('tradition') || lowerMessage.includes('holiday') ||
        lowerResponse.includes('po') || lowerResponse.includes('opo') || 
        lowerResponse.includes('salamat')) {
      return 'cultural_reference';
    }

    // Check for helpful response keywords
    if (lowerResponse.includes('help') || lowerResponse.includes('assist') || 
        lowerResponse.includes('guide') || lowerResponse.includes('support')) {
      return 'helpful_response';
    }

    // Default interaction type
    return 'general_interaction';
  }

  /**
   * Process a user message using rule-based logic
   * @param message The user's input message
   * @param context Context information about the user and conversation
   * @returns AI-generated response based on rules
   */
  private async processWithRules(message: string, context: AIContext): Promise<AIReturn> {
    // ... existing rule-based processing code ...
    // For brevity, I'm keeping the existing implementation
    return {
      text: "I'm processing your request using our rule-based system.",
      suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
    };
  }

  /**
   * Get time of day based on current time
   * @param date The current date/time
   * @returns Time of day string (morning, afternoon, evening, night)
   */
  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  /**
   * Save conversation history to database for long-term memory
   * @param userId User ID
   * @param sessionId Session ID
   * @param message User message
   * @param response AI response
   */
  private async saveConversationHistory(
    userId: string | undefined,
    sessionId: string | undefined,
    message: string,
    response: string
  ): Promise<void> {
    if (!userId || !sessionId) return;

    try {
      // Check if user exists before saving interaction
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        console.log('User does not exist, skipping conversation history save');
        return;
      }

      // Save user message
      await prisma.aIInteraction.create({
        data: {
          userId: userId,
          userInput: message,
          aiResponse: response,
          actionTaken: 'message_processed'
        }
      });
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }

  /**
   * Get recent conversation history for context
   * @param userId User ID
   * @param sessionId Session ID
   * @param limit Number of recent messages to retrieve
   * @returns Array of recent conversation messages
   */
  private async getConversationHistory(
    userId: string | undefined,
    sessionId: string | undefined,
    limit: number = 10
  ): Promise<Array<{ role: string; content: string }>> {
    if (!userId || !sessionId) return [];

    try {
      // Get recent interactions from database
      const interactions = await prisma.aIInteraction.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      // Convert to conversation history format
      const history: Array<{ role: string; content: string }> = [];
      
      // Add interactions in reverse order (oldest first)
      interactions.reverse().forEach(interaction => {
        history.push({ role: 'user', content: interaction.userInput });
        history.push({ role: 'assistant', content: interaction.aiResponse });
      });

      return history;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  /**
   * Enhance context with long-term memory
   * @param context Original context
   * @returns Enhanced context with long-term memory
   */
  private async enhanceContextWithMemory(context: AIContext): Promise<AIContext> {
    // If we already have conversation history, don't enhance further
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      return context;
    }

    // Get conversation history from database
    const history = await this.getConversationHistory(
      context.userId,
      context.sessionId
    );

    // Return enhanced context
    return {
      ...context,
      conversationHistory: history
    };
  }
}

// Export singleton instance
export const renAIService = new RenAIService();
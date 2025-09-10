# REN AI Service with Ollama Integration - Design Document

## 1. Overview

This document outlines the design and implementation of the REN AI Service with Ollama integration for the RenThing rental marketplace platform. The integration enables the use of locally hosted AI models through Ollama as the primary AI processing method, with fallback mechanisms to ensure service availability.

### 1.1 Purpose

The purpose of this integration is to:
- Provide a privacy-focused AI solution by processing data locally
- Reduce operational costs by eliminating reliance on external AI APIs
- Maintain consistent AI service availability through intelligent fallback mechanisms
- Enable offline AI capabilities for improved user experience

### 1.2 Scope

This design covers:
- Ollama integration within the existing REN AI service architecture
- Implementation of the processWithOllama method as the primary AI processing mechanism
- Fallback mechanisms to OpenRouter API when Ollama is unavailable
- Health check and error handling for Ollama service
- Configuration management for Ollama settings

## 2. Architecture

### 2.1 System Components

The REN AI Service with Ollama integration consists of the following components:

1. **REN AI Service** (`ren-ai-service.ts`): Core service handling AI processing logic
2. **Ollama Integration Module**: Handles communication with the Ollama API
3. **OpenRouter Fallback Module**: Fallback processing using the OpenRouter API
4. **Rule-based Processing Module**: Final fallback using rule-based responses
5. **API Routes**: HTTP endpoints for AI chat functionality
6. **Configuration Management**: Environment-based configuration for Ollama settings

### 2.2 Component Interaction

The component interaction follows this flow:

1. Client Request: User sends a request through the client interface
2. API Route Handler: Receives and validates the request
3. REN AI Service: Core service that orchestrates AI processing
4. Ollama Enabled Check: Determines if Ollama integration is enabled
5. If Ollama is enabled:
   a. Ollama Integration: Handles communication with Ollama API
   b. Ollama Available Check: Verifies Ollama service availability
   c. If Ollama is available:
      - Process with Ollama: Handles the request with Ollama
   d. If Ollama is not available:
      - Fallback to OpenRouter
6. If Ollama is not enabled:
   - OpenRouter Fallback: Processes using OpenRouter API
7. OpenRouter Available Check: Determines if OpenRouter is available
8. If OpenRouter is available:
   - Process with OpenRouter: Handles the request with OpenRouter
9. If OpenRouter is not available:
   - Rule-based Processing: Uses rule-based responses
10. Response: Formatted response returned to the client

### 2.3 Data Flow

1. Client sends a chat message to the API endpoint
2. API route handler validates the request and prepares context
3. REN AI Service processes the message through the following priority:
   - Ollama (if enabled and available)
   - OpenRouter (if Ollama unavailable)
   - Rule-based processing (final fallback)
4. Response is formatted and returned to the client

## 3. API Endpoints Reference

### 3.1 Chat Endpoint

**Endpoint**: `POST /api/ren-ai/chat`
**Description**: Process user messages with the AI service

#### Request Schema
- message (string): User input message
- context (AIContext): Context information including user preferences and conversation history

#### Response Schema
- success (boolean): Indicates if the request was successful
- response (AIResponse): AI-generated response
- error (string): Error message if unsuccessful

#### Authentication Requirements
- Session-based authentication through NextAuth
- User context is enriched with session information

### 3.2 Health Check Endpoint

**Endpoint**: `GET /api/ren-ai/chat`
**Description**: Check the health status of the AI service

#### Response Schema
- status ('healthy' | 'unhealthy'): Health status of the service
- service ('REN AI'): Service identifier
- backend ('Ollama' | 'OpenRouter'): Current backend being used
- configuration (object): Configuration details
  - ollamaEnabled (boolean): Whether Ollama is enabled
  - ollamaHost (string | null): Ollama host URL
  - currentModel (string): Currently configured model
  - availableModels (string[]): List of available models
- timestamp (string): Timestamp of the health check

#### Authentication Requirements
- Session-based authentication through NextAuth
- User context is enriched with session information

## 4. Data Models

### 4.1 AIContext Interface

The AIContext interface contains comprehensive information about the user and conversation context:

- userId (string, optional): Unique identifier for the user
- sessionId (string, optional): Session identifier for conversation continuity
- conversationHistory (array, optional): History of the conversation with role and content
- currentLocation (string, optional): Current location of the user
- currentGeolocation (object, optional): Precise geolocation coordinates
  - latitude (number): Latitude coordinate
  - longitude (number): Longitude coordinate
- userPreferences (object, optional): Explicit user preferences
  - language (string, optional): Preferred language
  - currency (string, optional): Preferred currency
  - categories (string[], optional): Preferred rental categories
  - priceRange (object, optional): Preferred price range
  - locations (string[], optional): Preferred locations
  - preferredBookingDays (string[], optional): Preferred days for booking
  - preferredBookingHours (number[], optional): Preferred hours for booking
- userProfile (object, optional): User profile information
  - name (string, optional): User's name
  - joinDate (Date, optional): When the user joined the platform
  - rentalHistory (array, optional): History of rentals
  - listedItems (string[], optional): Items listed by the user
  - favoriteCategories (string[], optional): Favorite rental categories
  - preferredPriceRange (object, optional): Preferred price range
  - preferredLocations (string[], optional): Preferred locations
  - calendarEvents (CalendarEvent[], optional): User's calendar events
- currentSession (object, optional): Current session information
  - startTime (Date): When the session started
  - currentPage (string, optional): Current page in the application
  - actionsTaken (string[], optional): Actions taken in the session
- userIntent (UserIntent, optional): Classified user intent
- conversationState (ConversationState, optional): State of the conversation
- rememberedPreferences (object, optional): Preferences remembered across conversations
- userSentiment (UserSentiment, optional): Analyzed sentiment of the user
- inferredPreferences (object, optional): Preferences inferred from user behavior
- conversationTopic (object, optional): Current and recent conversation topics
- rememberedEntities (object, optional): Entities remembered across conversation turns
- userGoal (object, optional): Current user goal being pursued

### 4.2 AIResponse Interface

The AIResponse interface defines the structure of responses from the AI service:

- text (string): Main response text from the AI
- suggestions (string[], optional): Suggested follow-up actions or responses
- action (object, optional): Action to be taken by the client
  - type (string): Type of action
  - payload (any): Data associated with the action

## 5. Business Logic Layer

### 5.1 Ollama Integration Architecture

The Ollama integration follows a layered approach:

1. **Configuration Layer**: Reads Ollama settings from environment variables
2. **Health Check Layer**: Verifies Ollama service availability
3. **Communication Layer**: Handles API requests to Ollama
4. **Error Handling Layer**: Manages connection and processing errors
5. **Fallback Layer**: Routes requests to alternative processing methods

### 5.2 Process Flow

The process flow for handling user messages follows this sequence:

1. Process Message: The system receives a user message for processing
2. Ollama Enabled Check: Determines if Ollama integration is enabled
3. If Ollama is enabled:
   a. Check Ollama Health: Verifies Ollama service availability
   b. If Ollama is available:
      i. Format Request for Ollama: Prepares the request with context
      ii. Send Request to Ollama: Communicates with the Ollama API
      iii. Request Success Check: Determines if the request was successful
      iv. If successful:
          - Format Response: Processes the Ollama response
          - Return Response: Provides the response to the user
      v. If unsuccessful:
          - Handle Error: Processes the error condition
          - Fallback to OpenRouter Processing
   c. If Ollama is not available:
      - Fallback to OpenRouter Processing
4. If Ollama is not enabled:
   - OpenRouter Processing: Processes the message using OpenRouter API
5. OpenRouter Available Check: Determines if OpenRouter is available
6. If OpenRouter is available:
   - Process with OpenRouter: Handles the request with OpenRouter
   - Return Response: Provides the response to the user
   - Return Response: Provides the response to the user
7. If OpenRouter is not available:
   - Rule-based Processing: Uses rule-based responses
   - Return Response: Provides the response to the user

### 5.3 Core Methods

#### 5.3.1 processWithOllama

**Purpose**: Process user messages using the Ollama API

**Parameters**:
- message (string): User input message
- context (AIContext): Context information including user preferences and conversation history

**Returns**: AI-generated response or null if processing fails

**Process**:
1. Check if Ollama is enabled via environment variable
2. Read Ollama configuration (host, model)
3. Construct system prompt with context information
4. Format messages for Ollama API
5. Send request to Ollama API with timeout
6. Parse and format response
7. Handle errors and return appropriate values

#### 5.3.2 checkOllamaHealth

**Purpose**: Verify Ollama service availability

**Process**:
1. Send request to Ollama version endpoint
2. Validate response
3. Throw error if service is unavailable

#### 5.3.3 processMessage

**Purpose**: Main entry point for processing user messages

**Process**:
1. Analyze user sentiment
2. Classify user intent
3. Try processing with Ollama (primary method)
4. Fallback to OpenRouter if Ollama fails
5. Fallback to rule-based processing if both AI methods fail
6. Log interaction for self-improvement
7. Return formatted response

## 6. Middleware & Interceptors

### 6.1 Error Handling Middleware

The system implements comprehensive error handling for various failure scenarios:

1. **Connection Errors**: Handles cases where Ollama service is not running
2. **Model Errors**: Handles cases where the specified model is not available
3. **Timeout Errors**: Manages API timeouts with appropriate user feedback
4. **API Errors**: Processes HTTP errors from Ollama API

### 6.2 Request Interceptors

1. **Timeout Management**: 30-second timeout for Ollama requests
2. **Request Formatting**: Properly formats messages for Ollama API
3. **Context Enrichment**: Adds system context to user messages

### 6.3 Response Interceptors

1. **Response Parsing**: Extracts AI response from Ollama API response
2. **Error Message Formatting**: Provides user-friendly error messages
3. **Fallback Triggering**: Initiates fallback processing when needed

## 7. Configuration Management

### 7.1 Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `OLLAMA_ENABLED` | Enable/disable Ollama integration | `false` | Yes |
| `OLLAMA_HOST` | Ollama API endpoint | `http://localhost:11434` | Yes |
| `OLLAMA_MODEL` | Model name to use | `llama3.1:8b` | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key (fallback) | None | No |

### 7.2 Configuration Validation

The system validates configuration at startup:
1. Checks if required environment variables are set
2. Verifies Ollama service availability when enabled
3. Validates model availability when Ollama is enabled

## 8. Testing Strategy

### 8.1 Unit Tests

1. **Ollama Integration Tests**
   - Test successful API communication
   - Test error handling for connection failures
   - Test error handling for model unavailability
   - Test timeout handling

2. **Fallback Mechanism Tests**
   - Test OpenRouter fallback when Ollama is disabled
   - Test OpenRouter fallback when Ollama is unavailable
   - Test rule-based fallback when both AI methods fail

3. **Context Processing Tests**
   - Test context enrichment with user information
   - Test system prompt generation
   - Test message formatting for Ollama API

### 8.2 Integration Tests

1. **End-to-End Chat Flow**
   - Test complete chat interaction from client to response
   - Test health check endpoint
   - Test error scenarios and user feedback

2. **Configuration Tests**
   - Test different configuration combinations
   - Test environment variable validation
   - Test dynamic configuration changes

### 8.3 Test Scripts

The system includes dedicated test scripts:
- `test-ollama.js`: Tests Ollama integration
- `test-ollama-simple.js`: Simple Ollama connectivity test
- `test-ollama-integration.js`: Comprehensive Ollama integration test
- `test-ollama.ts`: TypeScript version of Ollama test

## 9. Security Considerations

### 9.1 Data Privacy

1. **Local Processing**: All AI processing happens locally, ensuring user data never leaves the machine
2. **No External Transmission**: Conversations are not sent to external services when Ollama is enabled
3. **Model Storage**: AI models are stored locally in the user's Ollama directory

### 9.2 Access Control

1. **API Access**: Ollama API only accepts local connections by default
2. **Authentication**: All API routes are protected with session-based authentication
3. **Rate Limiting**: Built-in rate limiting to prevent abuse

### 9.3 Secure Configuration

1. **Environment Variables**: Sensitive configuration stored in environment variables
2. **No Hardcoded Keys**: API keys and sensitive data are not hardcoded
3. **Validation**: Configuration is validated at startup to prevent misconfiguration

## 10. Performance Considerations

### 10.1 Resource Management

1. **Timeout Handling**: 30-second timeout for Ollama requests to prevent hanging
2. **Memory Management**: Efficient context handling to minimize memory usage
3. **Connection Pooling**: Reuse of HTTP connections where applicable

### 10.2 Model Selection

1. **Recommended Models**: 
   - `llama3.1:8b` for balanced performance and capability
   - `llama3.2:3b` for faster responses on resource-constrained systems
2. **Model Sizing**: Consideration of RAM requirements for different models
3. **GPU Acceleration**: Automatic GPU usage when available

### 10.3 Caching

1. **Conversation Context**: In-memory caching of conversation context for session continuity
2. **User Preferences**: Caching of user preferences to reduce database queries
3. **Response Caching**: Potential caching of common responses for improved performance

## 11. Deployment Considerations

### 11.1 Development Environment

1. **Local Setup**: Ollama must be installed and running locally
2. **Model Installation**: Required models must be pulled before use
3. **Environment Configuration**: Proper environment variables must be set

### 11.2 Production Environment

1. **Dedicated Ollama Server**: Consider using a dedicated server for Ollama in production
2. **Resource Allocation**: Ensure sufficient RAM and CPU for AI model processing
3. **Monitoring**: Implement monitoring for Ollama service health
4. **Fallback Strategy**: Maintain OpenRouter API key as backup for critical systems

### 11.3 Containerization

1. **Docker Configuration**: Ollama service must be available in containerized environments
2. **Resource Limits**: Proper resource allocation for containers
3. **Health Checks**: Container health checks for Ollama service

## 12. Monitoring and Maintenance

### 12.1 Health Monitoring

1. **Service Health**: Regular health checks for Ollama service
2. **Model Availability**: Verification of required models
3. **Performance Metrics**: Response time and error rate monitoring

### 12.2 Logging

1. **Interaction Logging**: Log AI interactions for analysis and improvement
2. **Error Logging**: Comprehensive error logging for troubleshooting
3. **Performance Logging**: Log response times and resource usage

### 12.3 Maintenance Tasks

1. **Model Updates**: Regular updates of AI models
2. **Performance Tuning**: Optimization of model parameters
3. **Resource Management**: Monitoring and management of system resources

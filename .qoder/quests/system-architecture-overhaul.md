# RenThing System Architecture Overhaul

## 1. Overview

RenThing is a rental marketplace platform built with Next.js that enables users to list items for rent, browse available items, book rentals, and communicate with other users. The platform has undergone a significant architectural change from a Prisma/PostgreSQL database system to a CSV-based file system, which has introduced several critical issues affecting deployment, functionality, and user experience.

This document outlines the current architecture issues and proposes a comprehensive overhaul to restore functionality and enable successful deployment using Vercel Edge Config as the primary data storage solution.

## 2. Current Architecture Analysis

### 2.1 Frontend Architecture
- **Framework**: Next.js 15.5.2 with TypeScript
- **UI Library**: Tailwind CSS v3.4.0, Radix UI components
- **State Management**: React Context API and custom hooks
- **Animations**: Framer Motion v12.23.12
- **Routing**: Next.js App Router

### 2.2 Backend Architecture
- **API Layer**: Next.js API routes
- **Server**: Custom Express.js server integrated with Next.js
- **Authentication**: NextAuth.js
- **Real-time Communication**: Socket.IO
- **Database**: CSV-based file system (replaced Prisma/PostgreSQL)
- **AI Integration**: Ollama with Llama 3.1 8B model

### 2.3 Database Architecture
The system has been migrated from Prisma ORM with PostgreSQL to a custom CSV-based database system:
- **Implementation**: Custom CSV service layer in `lib/csv-database/`
- **Data Models**: All Prisma models converted to CSV files in `data/` directory
- **File Structure**: Each model represented as a separate CSV file
- **Data Operations**: CRUD operations implemented with file locking for concurrency

### 2.4 Deployment Architecture
- **Target Platform**: Vercel
- **Build Process**: Custom build script with Prisma generation
- **Runtime**: Node.js serverless functions

## 3. Critical Issues Identified

### 3.1 Database Architecture Problems

#### Current State
The system has been migrated from Prisma/PostgreSQL to CSV files stored in the `data/` directory.

#### Issues
1. **Production Incompatibility**: CSV files are not suitable for production web applications
2. **No Transactional Integrity**: Lack of ACID properties for data consistency
3. **Poor Performance**: Inefficient for complex queries and relationships
4. **Data Consistency**: Difficult to maintain consistency with concurrent access
5. **Browse Page Issues**: Listings not displaying due to improper CSV parsing

#### Impact
Major user flows are broken, and data integrity is compromised.

### 3.2 Ollama AI Integration Issues

#### Current State
Using Llama 3.1 8B model with timeout problems.

#### Issues
1. **Long Response Times**: Causing timeouts in user interactions
2. **Resource Intensity**: Model too large for cloud deployment environments
3. **Infrastructure Dependencies**: Ollama server dependencies incompatible with Vercel's serverless architecture
4. **Response Optimization**: AI responses not optimized for conversational flow

#### Impact
REN AI assistant is non-functional or provides poor user experience.

### 3.3 Deployment & Infrastructure Problems

#### Current State
Repository not building on Vercel or Render.

#### Issues
1. **File-based Databases**: SQLite/file-based databases incompatible with Vercel's ephemeral filesystem
2. **Ollama Requirements**: Requires persistent server infrastructure (not serverless)
3. **Environment Configuration**: Environment variable configuration issues
4. **Missing Production Database**: No proper production database setup

#### Impact
Application cannot be deployed to production.

## 4. Proposed Architecture Overhaul

### 4.1 Complete Database System Cleanup

#### Remove All Legacy Systems
1. **CSV file system**: Delete all `./data/`, `./csv/`, `./database/` directories
2. **Prisma integration**: Uninstall Prisma packages and delete all Prisma files
3. **SQLite/other databases**: Remove all `.db`, `.sqlite` files
4. **Database utilities**: Clean all CSV parsers, database helpers, and related files

#### Package Cleanup
1. Uninstall all database-related packages (Prisma, SQLite, CSV parsers, etc.)
2. Clean `package.json` of database scripts and dependencies
3. Remove `package-lock.json` and reinstall clean dependencies

#### Environment Cleanup
1. Remove all `DATABASE_URL` variables
2. Keep only the Edge Config environment variable
3. Clean all database-related configurations

#### Code Cleanup
1. Remove all imports related to old database systems
2. Update API routes to use only Edge Config
3. Replace all database calls with EdgeConfigDB calls
4. Clean `next.config.js` of database configurations

#### Verification Tools
1. Cleanup checklist to ensure nothing is missed
2. Verification script to scan for any remaining legacy database references
3. Step-by-step validation process

#### Critical Benefits
1. **No Conflicts**: Ensures Edge Config is the only database system
2. **Clean Deployment**: Eliminates deployment issues caused by multiple database systems
3. **Reduced Bundle Size**: Removes unnecessary dependencies
4. **Performance**: Single, optimized data layer
5. **Maintenance**: Easier to maintain and debug

### 4.2 AI System Optimization

#### Model Replacement
Switch from Llama 3.1 8B to Phi-3 Mini (3.8B):

```bash
ollama pull phi3:mini
```

#### Response Optimization
```javascript
// Implement response streaming
const streamResponse = async (prompt) => {
  const response = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      max_tokens: 150, // Limit response length
      temperature: 0.7 
    }),
  });
  
  return response.body.getReader();
};
```

#### Timeout Management
- Implement 15-second timeout for AI responses
- Add fallback responses for timeout scenarios
- Queue system for AI requests

### 4.3 Vercel Edge Config Implementation

#### Edge Config Details
- **Name**: renthing-store
- **ID**: ecfg_giflc6u9xzsqmfeslgshundvfvmn
- **Digest**: 5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da
- **Token**: 514a5838-f618-4630-85af-f10c8424d6ba

#### Implementation Steps
1. Pull latest environment variables: `vercel env pull`
2. Install Edge Config SDK: `npm install @vercel/edge-config`
3. Implement EdgeConfigDB class for data operations
4. Update API routes to use Edge Config
5. Update React components to fetch from Edge Config

#### Example Implementation
```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/welcome' };

export async function middleware() {
  const greeting = await get('greeting');
  return NextResponse.json(greeting);
}
```

#### Major Benefits of Vercel Edge Config
1. **Perfect Match for RenThing**: Designed for Vercel's serverless architecture
2. **Ultra-Fast Performance**: Global CDN distribution for instant loading
3. **No Connection Issues**: No connection pooling or timeout issues

### 4.4 Data Migration Strategy

#### Migration Process
1. Create migration script to convert CSV data to Edge Config format
2. Upload data to Edge Config store
3. Update API endpoints to use Edge Config
4. Update frontend components to fetch from Edge Config
5. Test data integrity and performance

#### Example Migration Script
```javascript
// Migration script to convert CSV to Edge Config
import { set } from '@vercel/edge-config';
import fs from 'fs';
import { parse } from 'csv-parse';

async function migrateListings() {
  const csvData = fs.readFileSync('./data/listings.csv', 'utf8');
  const records = parse(csvData, { columns: true });
  
  for (const record of records) {
    await set(`listing_${record.id}`, record);
  }
}
```

## 5. New Architecture Design

### 5.1 Database Layer
- **Primary**: Vercel Edge Config
- **Schema Design**: JSON-based schema with proper data structure
- **Connection**: Direct Edge Config API calls
- **Migration Strategy**: Data migration from CSV files to Edge Config

### 5.2 AI Integration
- **Development**: Local Ollama with Phi-3 Mini (3.8B)
- **Production**: OpenAI API for reliability
- **Response Streaming**: Implement streaming for better user experience
- **Caching**: Cache frequent responses to reduce latency
- **Error Handling**: Proper timeout handling and fallback responses

### 5.3 Deployment Strategy
- **Frontend**: Vercel for frontend and API routes
- **Database**: Vercel Edge Config for all data storage
- **Static Assets**: CDN for optimal delivery
- **AI Service**: Local Ollama for development, OpenAI for production

## 6. Implementation Plan

### Phase 1: Critical Cleanup (Week 1)
1. Remove all legacy database systems (CSV, Prisma, SQLite)
2. Clean package.json and reinstall dependencies
3. Remove all database-related environment variables
4. Update code to remove database imports and calls

### Phase 2: Edge Config Implementation (Week 2)
1. Install and configure Vercel Edge Config
2. Create EdgeConfigDB class for data operations
3. Migrate existing data from CSV to Edge Config
4. Update API routes to use Edge Config
5. Update frontend components to fetch from Edge Config

### Phase 3: AI Optimization (Week 3)
1. Replace Llama 3.1 8B with Phi-3 Mini model
2. Implement response streaming and improved timeout handling
3. Set up hybrid approach (local for dev, cloud for production)
4. Test and validate all AI functionality

## 7. API Endpoints Reference

### 7.1 Edge Config API Endpoints
- `GET /api/listings` - Retrieve listings from Edge Config
- `GET /api/listings/[id]` - Retrieve specific listing
- `POST /api/listings` - Create new listing in Edge Config
- `PUT /api/listings/[id]` - Update listing in Edge Config
- `DELETE /api/listings/[id]` - Delete listing from Edge Config

### 7.2 AI API Endpoints
- `POST /api/ai/generate` - Generate AI response
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/feedback` - Submit feedback on AI responses

## 8. Data Models

### 8.1 User Model
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 8.2 Listing Model
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "location": "string",
  "images": "string[]",
  "features": "string[]",
  "ownerId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 8.3 Booking Model
```json
{
  "id": "string",
  "listingId": "string",
  "userId": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "totalPrice": "number",
  "status": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 9. Testing Strategy

### 9.1 Critical Tests Needed
1. Edge Config data operations
2. AI response times and accuracy
3. User authentication flows
4. Booking and payment processes
5. Deployment pipeline testing

### 9.2 Performance Benchmarks
- Page load times: < 2 seconds
- AI response times: < 10 seconds
- Edge Config queries: < 100ms
- Build time: < 5 minutes

## 10. Monitoring and Error Handling

### 10.1 Error Handling
- Implement comprehensive error handling for Edge Config operations
- Add fallback mechanisms for AI service failures
- Log errors with detailed context for debugging

### 10.2 Monitoring
- Implement application performance monitoring
- Track Edge Config query performance
- Monitor AI service usage and response times
- Set up alerts for critical system failures

## 11. Security Considerations

### 11.1 Data Security
- Environment variables for sensitive data
- Input validation with Zod
- Proper authentication and authorization

### 11.2 AI Security
- Validate AI-generated content
- Implement rate limiting for AI requests
- Sanitize user inputs to AI services

## 12. Conclusion

The RenThing application requires significant architectural changes to become production-ready. The current CSV database approach and heavy AI model selection are primary blockers for deployment and functionality. By implementing the recommended fixes, particularly switching to Vercel Edge Config and optimizing the AI integration with Phi-3 Mini, the application can achieve its intended functionality and deploy successfully on Vercel at https://renthing.vercel.app.

**Estimated Timeline**: 3 weeks for complete system restoration and optimization.

**Success Metrics**:
- ✅ Browse page displays listings correctly from Edge Config
- ✅ AI responses within 10-second timeout with Phi-3 Mini
- ✅ Successful Vercel deployment at https://renthing.vercel.app
- ✅ All major user flows functional
- ✅ Edge Config operations working reliably
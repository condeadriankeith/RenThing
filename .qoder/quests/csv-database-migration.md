# CSV Database Migration Design Document

## 1. Overview

This document outlines the design and implementation plan for migrating the RenThing platform from its current database integrations (Prisma ORM with SQLite/PostgreSQL, Supabase) and authentication systems (NextAuth.js) to a CSV-based database system with Auth0 authentication. This migration is intended for prototype purposes, where all data persistence will be handled through CSV files stored in a dedicated directory and authentication will be managed by Auth0.

### 1.1 Objectives

- Replace all existing database integrations with CSV file operations
- Create a dedicated directory structure for all CSV files
- Implement automatic CSV file creation on first system boot
- Ensure all data operations are reflected live in CSV files
- Implement automatic cleanup of all CSV files on system termination
- Replace all existing authentication systems with Auth0 integration

### 1.2 Key Requirements

1. **No existing CSV files at startup**: System starts with a clean state, no CSV files exist
2. **Automatic CSV creation**: All required CSV files are created on first boot
3. **Live data operations**: All changes are immediately reflected in CSV files
4. **Complete cleanup**: All CSV files are deleted when system terminates
5. **Comprehensive coverage**: All data models currently in Prisma schema must be supported
6. **Auth0 integration**: All authentication and authorization will be handled by Auth0
7. **Removal of existing auth systems**: NextAuth.js and all related authentication code will be removed

## 2. Architecture

### 2.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Layer                            │
├─────────────────────────────────────────────────────────────────────┤
│                    CSV Database Service Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   User      │  │  Listing    │  │  Booking    │  │  Message    │ │
│  │  Service    │  │  Service    │  │  Service    │  │  Service    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                     CSV Persistence Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   User      │  │  Listing    │  │  Booking    │  │  Message    │ │
│  │   CSV       │  │   CSV       │  │   CSV       │  │   CSV       │ │
│  │ Operations  │  │ Operations  │  │ Operations  │  │ Operations  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                        CSV File System                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ users.csv   │  │listings.csv │  │bookings.csv │  │messages.csv │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
project-root/
├── data/                    # Dedicated CSV data directory
│   ├── users.csv
│   ├── listings.csv
│   ├── bookings.csv
│   ├── messages.csv
│   ├── chatrooms.csv
│   ├── reviews.csv
│   ├── wishlist.csv
│   ├── transactions.csv
│   ├── accounts.csv
│   ├── sessions.csv
│   ├── verificationtokens.csv
│   ├── aifeedback.csv
│   ├── aiinteractions.csv
│   ├── abtests.csv
│   ├── abtestresults.csv
│   ├── reinforcementlearningrecords.csv
│   ├── activelearningrecords.csv
│   ├── userbehavioranalytics.csv
│   ├── userpreferences.csv
│   ├── usertiers.csv
│   ├── userbadges.csv
│   ├── vouchers.csv
│   ├── purchases.csv
│   ├── commissionrates.csv
│   ├── personalitytraits.csv
│   └── personalitydevelopment.csv
├── lib/
│   └── csv-database/       # New CSV database implementation
│       ├── csv-service.ts
│       ├── models/
│       │   ├── user-csv.ts
│       │   ├── listing-csv.ts
│       │   └── ... (one for each model)
│       └── utils/
│           └── csv-utils.ts
└── ... (other project files)
```

## 3. Data Models & CSV Structure

### 3.1 CSV File Structure

Each CSV file will have the following characteristics:
- First row contains column headers matching the Prisma model fields
- Each subsequent row represents one database record
- All relationships will be maintained through ID references
- Complex data types (JSON arrays, objects) will be serialized as JSON strings
- All files will be UTF-8 encoded
- Fields containing commas, quotes, or newlines will be properly escaped

### 3.2 Model Mappings

| Prisma Model | CSV File | Key Fields |
|--------------|----------|------------|
| User | users.csv | id, email, name, password, role, createdAt, updatedAt |
| Listing | listings.csv | id, title, description, price, location, images, features, ownerId, createdAt, updatedAt |
| Booking | bookings.csv | id, listingId, userId, startDate, endDate, totalPrice, status, createdAt, updatedAt |
| Message | messages.csv | id, content, senderId, receiverId, roomId, listingId, read, createdAt, updatedAt |
| ChatRoom | chatrooms.csv | id, listingId, customerId, ownerId, createdAt, updatedAt |
| Review | reviews.csv | id, listingId, userId, rating, comment, createdAt, updatedAt |
| Wishlist | wishlist.csv | id, userId, listingId, createdAt |
| Transaction | transactions.csv | id, bookingId, userId, amount, currency, paymentMethod, status, createdAt, updatedAt |
| Account | accounts.csv | id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state |
| Session | sessions.csv | id, sessionToken, userId, expires |
| VerificationToken | verificationtokens.csv | identifier, token, expires |
| AIFeedback | aifeedback.csv | id, userId, messageId, rating, comment, createdAt |
| AIInteraction | aiinteractions.csv | id, userId, userInput, aiResponse, actionTaken, createdAt |
| ABTest | abtests.csv | id, testName, variants, durationDays, metrics, startDate, endDate, status, createdAt, updatedAt |
| ABTestResult | abtestresults.csv | id, testId, variantName, metricName, value, createdAt, userId |
| ReinforcementLearningRecord | reinforcementlearningrecords.csv | id, updates, timestamp, createdAt, updatedAt |
| ActiveLearningRecord | activelearningrecords.csv | id, userId, results, timestamp, createdAt, updatedAt |
| UserBehaviorAnalytics | userbehavioranalytics.csv | id, userId, analyticsData, timestamp, createdAt, updatedAt |
| UserPreferences | userpreferences.csv | id, userId, preferredCategories, preferredPriceRangeMin, preferredPriceRangeMax, preferredLocations, engagementLevel, preferredBookingDays, preferredBookingHours, createdAt, updatedAt |
| UserTier | usertiers.csv | id, userId, tier, points, totalListingsRented, totalListingsOwned, totalSuccessfulRentals, createdAt, updatedAt |
| UserBadge | userbadges.csv | id, userId, badgeType, purchaseId, expiresAt, createdAt |
| Voucher | vouchers.csv | id, userId, voucherType, code, discount, expiresAt, used, usedAt, createdAt |
| Purchase | purchases.csv | id, userId, itemType, itemId, amount, currency, status, createdAt |
| CommissionRate | commissionrates.csv | id, durationType, rate, createdAt, updatedAt |
| PersonalityTrait | personalitytraits.csv | id, userId, traitName, traitValue, interactions, lastUpdated, createdAt, updatedAt |
| PersonalityDevelopment | personalitydevelopment.csv | id, userId, traitName, oldValue, newValue, reason, interactionId, createdAt |

### 3.3 Data Type Handling

Complex data types will be handled as follows:

- **JSON Arrays**: Serialized to JSON strings (e.g., `["image1.jpg", "image2.jpg"]`)
- **JSON Objects**: Serialized to JSON strings (e.g., `{"key": "value"}`)
- **Dates**: Stored in ISO 8601 format (e.g., `2023-12-01T10:30:00.000Z`)
- **Booleans**: Stored as "true" or "false" strings
- **Numbers**: Stored in standard numeric format
- **Null Values**: Represented as empty strings

## 4. CSV Database Service Layer

### 4.1 Core Service Implementation

The CSV database service will provide the following core functionality:

1. **Initialization**: Create all required CSV files with proper headers on first boot
2. **Data Operations**: CRUD operations for all models
3. **Data Synchronization**: Ensure all changes are immediately written to CSV files
4. **Cleanup**: Delete all CSV files on system termination
5. **Data Validation**: Validate data before writing to CSV files

### 4.2 Service Interface

```typescript
interface CSVDatabaseService {
  // Initialization
  initialize(): Promise<void>;
  
  // Cleanup
  cleanup(): Promise<void>;
  
  // Generic CRUD operations
  create<T>(model: string, data: T): Promise<T>;
  findMany<T>(model: string, where?: Partial<T>): Promise<T[]>;
  findUnique<T>(model: string, where: Partial<T>): Promise<T | null>;
  update<T>(model: string, where: Partial<T>, data: Partial<T>): Promise<T>;
  delete<T>(model: string, where: Partial<T>): Promise<T>;
  
  // Utility methods
  count(model: string, where?: any): Promise<number>;
}
```

### 4.3 Model-Specific Services

Each data model will have its own service that implements the specific business logic:

```typescript
// Example for UserService
class UserCSVService {
  async createUser(userData: CreateUserInput): Promise<User>;
  async getUserById(id: string): Promise<User | null>;
  async getUserByEmail(email: string): Promise<User | null>;
  async updateUser(id: string, userData: UpdateUserInput): Promise<User>;
  async deleteUser(id: string): Promise<User>;
  async getAllUsers(): Promise<User[]>;
}
```

### 4.4 Data Access Patterns

The CSV database services will implement the same access patterns currently used with Prisma:

- findOne/Unique: Find a single record by unique identifier
- findMany: Find multiple records with optional filtering
- create: Create a new record with automatic ID generation
- update: Update existing records
- delete: Remove records (with business rule constraints)

These patterns will be implemented with appropriate indexing for performance where necessary.

## 5. Implementation Strategy

### 5.1 Phase 1: Infrastructure Setup

1. Create the `data/` directory for CSV files
2. Create the `lib/csv-database/` directory structure
3. Implement the core CSV database service
4. Implement CSV utility functions for reading/writing
5. Implement automatic initialization and cleanup mechanisms
6. Implement file locking mechanisms for data integrity
7. Implement error handling and logging framework
8. Create configuration service for CSV directory path

### 5.2 Phase 2: Model Implementation

1. Implement CSV services for each model based on the Prisma schema
2. Ensure all relationships are properly maintained through ID references
3. Handle complex data types by serializing to JSON strings
4. Implement proper data validation for each model
5. Implement business logic constraints (e.g., unique email for users)
6. Implement composite unique index validation
7. Implement automatic timestamp management (createdAt, updatedAt)
8. Implement ID generation for new records (UUIDs)

### 5.3 Phase 3: Integration

1. Replace all Prisma client usage with CSV database services
2. Update all service layers to use CSV database services
3. Update all API routes to use CSV database services
4. Update all test files to mock CSV database services instead of Prisma
5. Implement error handling for file operations
6. Implement caching mechanisms for frequently accessed data
7. Optimize file read/write operations for performance
8. Implement data validation at service boundaries

### 5.4 Phase 4: Cleanup

1. Remove all Prisma-related dependencies from package.json
2. Remove all Prisma-related files and directories
3. Remove all Supabase-related files and dependencies
4. Update documentation to reflect CSV-based architecture
5. Update build scripts to not require database setup
6. Remove database-related environment variables
7. Update CI/CD pipelines to not provision databases

## 6. Data Operations

### 6.1 Create Operations

When creating a new record:
1. Load the CSV file into memory
2. Append the new record as a new row
3. Write the updated data back to the CSV file
4. Return the created record with generated ID

### 6.2 Read Operations

When reading records:
1. Load the CSV file into memory
2. Parse the data according to filters/sorting criteria
3. Return the matching records

### 6.3 Update Operations

When updating a record:
1. Load the CSV file into memory
2. Find the record by ID
3. Update the specified fields
4. Write the updated data back to the CSV file
5. Return the updated record

### 6.4 Delete Operations

When deleting a record:
1. Load the CSV file into memory
2. Find and remove the record by ID
3. Write the updated data back to the CSV file
4. Return the deleted record

## 7. Performance Considerations

### 7.1 Memory Management

- For small datasets, loading entire CSV files into memory is acceptable
- For larger datasets, implement streaming/pagination mechanisms
- Cache frequently accessed data in memory with periodic flushing to disk

### 7.2 Concurrency Handling

- Implement file locking mechanisms to prevent data corruption
- Use atomic write operations to ensure data integrity
- Consider implementing a simple queuing system for concurrent operations
- Implement in-memory caching with write-through to CSV files
- Use optimistic locking for frequently updated records

### 7.3 Data Integrity

- Validate all data before writing to CSV files
- Implement backup mechanisms for critical data
- Use atomic operations to ensure consistency
- Implement checksums for critical data files
- Create temporary files during writes and atomically rename on completion

## 8. Testing Strategy

### 8.1 Unit Testing

- Test each CSV service independently
- Mock file system operations
- Verify data serialization/deserialization
- Test edge cases and error conditions
- Validate data integrity constraints
- Test complex query operations

### 8.2 Integration Testing

- Test end-to-end data flows
- Verify data consistency across operations
- Test initialization and cleanup processes
- Validate business logic preservation
- Test concurrent access scenarios
- Verify error handling and recovery

### 8.3 Performance Testing

- Test with various dataset sizes
- Measure operation latency
- Verify memory usage patterns
- Test concurrent access performance
- Validate file I/O performance
- Measure startup and shutdown times

### 8.4 Data Validation Testing

- Test data serialization/deserialization for all types
- Validate unique constraint enforcement
- Test composite unique index validation
- Verify foreign key relationship integrity
- Test automatic timestamp management

## 9. Migration Process

### 9.1 Pre-Migration Tasks

1. Backup existing database
2. Document all current data models and relationships
3. Identify all code locations that interact with the database
4. Plan the replacement strategy for each service

### 9.2 Migration Steps

1. Implement CSV database infrastructure
2. Create CSV services for each model
3. Replace Prisma usage one service at a time
4. Update tests to use CSV database mocks
5. Remove Prisma and Supabase dependencies
6. Update documentation

### 9.3 Post-Migration Validation

1. Verify all functionality works with CSV database
2. Test data persistence across application restarts
3. Verify cleanup process removes all CSV files
4. Validate performance meets requirements

## 10. Removal of Existing Database Integrations

### 10.1 Files and Directories to Remove

- `prisma/` directory and all contents
- `lib/prisma.ts` and `lib/prisma.js`
- `lib/supabaseClient.ts`
- `supabase-setup.sql`
- All test files that specifically test Prisma functionality
- All documentation referencing Prisma or Supabase

### 10.2 Dependencies to Remove

From `package.json`:
- `@prisma/client`
- `prisma`
- `@supabase/supabase-js`
- Any related devDependencies

### 10.3 Scripts to Update

- Remove database-related scripts from `package.json`
- Update build scripts to not require database setup
- Update deployment scripts to not provision databases

## 11. Authentication and Authorization System

### 11.1 Migration to Auth0

All existing authentication systems will be replaced with Auth0 integration:

1. Remove NextAuth.js implementation and all related code
2. Remove bcryptjs password hashing implementation
3. Remove JWT token generation and verification code
4. Remove all session management code
5. Integrate Auth0 for authentication and authorization

### 11.2 Auth0 Integration Requirements

- Implement Auth0 Universal Login
- Configure Auth0 for user management
- Set up Auth0 roles and permissions for authorization
- Implement Auth0 rules for custom business logic
- Configure Auth0 for social login providers
- Set up Auth0 for passwordless authentication options

### 11.3 Auth0 Implementation Details

- Use Auth0 SPA SDK for frontend authentication
- Use Auth0 Node.js SDK for backend API protection
- Implement Auth0 Management API for user provisioning
- Configure Auth0 Actions for custom authentication flows
- Set up Auth0 Organizations for multi-tenant support (if needed)

### 11.4 Files and Directories to Remove (Authentication)

- `lib/auth.ts`
- `hooks/use-auth.tsx`
- `app/api/auth/` directory and all contents
- `app/auth/` directory and all contents
- All NextAuth.js related components and pages

### 11.5 Dependencies to Remove (Authentication)

From `package.json`:
- `next-auth`
- `@next-auth/prisma-adapter`
- `bcryptjs`
- `@types/bcryptjs`
- `jsonwebtoken`
- `@types/jsonwebtoken`

### 11.6 Dependencies to Add (Authentication)

To `package.json`:
- `@auth0/auth0-react` (frontend SDK)
- `@auth0/auth0-node` (backend SDK)
- `@auth0/auth0-spa-js` (if needed for additional SPA features)

### 11.7 Environment Variables for Auth0

New environment variables will be required:
- `AUTH0_DOMAIN`: Auth0 tenant domain (e.g., `dev-qtdnyzugikwncpht.jp.auth0.com`)
- `AUTH0_CLIENT_ID`: Auth0 application client ID (e.g., `NYkWOUAZztAnyXeOlXewvpcHhyFHt6xw`)
- `AUTH0_CLIENT_SECRET`: Auth0 application client secret (e.g., `9HUpWvJ8d2cEoD9N1rju7sN5SxF7U_6LygUNFWAw6jN-JL_26uffTAHRv2ViE06_`)
- `AUTH0_AUDIENCE`: Auth0 API identifier
- `AUTH0_CALLBACK_URL`: Application callback URL
- `AUTH0_LOGOUT_URL`: Application logout URL

### 11.8 Auth0 User Management

- Map existing user data to Auth0 user profiles
- Implement user migration strategy for existing users
- Configure Auth0 user metadata for custom user attributes
- Set up Auth0 user permissions and roles
- Implement user provisioning and deprovisioning workflows

## 12. Security Considerations

### 12.1 Data Protection

- Ensure CSV files are not exposed publicly
- Implement proper file permissions
- Consider encrypting sensitive data fields

### 12.2 Access Control

- Implement authentication and authorization through Auth0
- Validate all inputs to prevent injection attacks
- Sanitize data before writing to CSV files
- Implement proper role-based access control (RBAC) with Auth0
- Secure all API endpoints with Auth0 JWT validation

## 13. Monitoring and Logging

### 13.1 Operational Monitoring

- Log all CSV file operations
- Monitor file sizes and growth
- Track operation performance metrics
- Log initialization and cleanup events
- Monitor concurrent access patterns
- Log all authentication and authorization events through Auth0

### 13.2 Error Handling

- Implement comprehensive error handling for file operations
- Log all errors with sufficient context for debugging
- Implement retry mechanisms for transient failures
- Handle disk space issues gracefully
- Manage file permission errors
- Handle file corruption scenarios
- Implement circuit breaker patterns for persistent failures
- Handle Auth0 authentication and authorization errors

## 13. Startup and Shutdown Process

### 13.1 System Initialization

On system startup:
1. Check if data directory exists, create if not
2. For each model, check if corresponding CSV file exists
3. If CSV file does not exist, create with proper headers
4. If CSV file exists, validate structure and headers
5. Initialize in-memory indexes for performance
6. Set up cleanup handlers for graceful shutdown

### 13.2 System Shutdown

On system shutdown:
1. Flush any pending writes to CSV files
2. Release any file locks
3. Delete all CSV files in the data directory
4. Clean up any temporary files
5. Log shutdown completion

## 14. Business Logic Preservation

### 14.1 Chat System Rules

The chat system maintains specific business rules that must be preserved:

1. Chat rooms are created when a customer first messages an owner about a listing
2. Chat rooms represent PERMANENT transaction history and cannot be deleted
3. Messages serve as evidence of customer-owner interactions and are immutable
4. Each chat room is tied to a specific listing for transaction context
5. Both customer and owner can view the complete message history
6. All messages maintain direct links to both the chat room and the original listing

### 14.2 Data Integrity Constraints

- User emails must remain unique
- Composite unique indexes (e.g., wishlist user-listing combinations) must be enforced
- Foreign key relationships must be maintained
- Timestamp fields must be properly managed
- Data validation rules must be preserved

## 15. Conclusion

This design document provides a comprehensive plan for migrating the RenThing platform from its current database integrations and authentication systems to a CSV-based system with Auth0 authentication. The migration focuses on maintaining all existing business logic while simplifying the data persistence layer for prototype purposes.

Key benefits of this approach include:
- Simplified setup and deployment for prototype testing
- No external database dependencies
- Complete data isolation between sessions
- Easy data inspection and debugging
- Reduced infrastructure complexity
- Centralized authentication and authorization through Auth0
- Enhanced security through Auth0's enterprise-grade identity management

The implementation will preserve all existing functionality while providing a clean separation between the application logic and data persistence layers. This design ensures that the transition back to a full database system in the future will be straightforward if needed. The integration of Auth0 will provide a robust, scalable, and secure authentication and authorization system that can be easily managed through the Auth0 dashboard, with support for social login, multi-factor authentication, and advanced security features.
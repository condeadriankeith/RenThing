# RenThing Feature Enhancement Design Document

## 1. Overview

This document outlines the design and implementation plan for enhancing RenThing's core features to improve user experience, increase engagement, and expand monetization opportunities. The enhancements include:

1. Tiered commission structure based on rental duration
2. User status/tier system with progressive benefits
3. In-app purchase system for badges and vouchers
4. Enhanced AI assistance through REN integration

These improvements align with RenThing's mission as the Philippines' first centralized rental marketplace, promoting a smarter, more efficient, eco-friendly, and economical way of renting.

## 2. Architecture

The proposed enhancements will integrate with the existing Next.js full-stack architecture:

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Express.js with Next.js API routes
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **AI Integration**: REN AI service with Ollama local models
- **Payment Processing**: Existing payment service infrastructure

### 2.1 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   REN AI Chat   │  │  User Profile   │  │  Browse UI  │  │
│  │  Integration    │  │   Dashboard     │  │  Enhance-   │  │
│  │                 │  │                 │  │   ments     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │  User Service   │  │ Payment Service │  │  AI Service │  │
│  │  (Tiers/Badges) │  │ (Commission)    │  │ (Enhanced)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Voucher Service │  │  Auth Service   │                   │
│  │  (In-App Purch) │  │                 │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Model Extensions

The enhancements require extending the existing Prisma schema with new models:

```prisma
model UserTier {
  id           String    @id @default(uuid())
  userId       String    @unique
  tier         String    // new, bronze, silver, gold
  points       Int       @default(0)
  totalListingsRented Int @default(0) // For renters
  totalListingsOwned Int @default(0)  // For owners
  totalSuccessfulRentals Int @default(0) // For renters
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  user         User      @relation(fields: [userId], references: [id])
}

model UserBadge {
  id           String    @id @default(uuid())
  userId       String
  badgeType    String    // verified, gold_owner, gold_renter
  purchaseId   String?
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  user         User      @relation(fields: [userId], references: [id])
  purchase     Purchase? @relation(fields: [purchaseId], references: [id])
}

model Voucher {
  id           String    @id @default(uuid())
  userId       String
  voucherType  String    // item, owner, seasonal
  code         String    @unique
  discount     Float
  expiresAt    DateTime?
  used         Boolean   @default(false)
  usedAt       DateTime?
  createdAt    DateTime  @default(now())
  user         User      @relation(fields: [userId], references: [id])
}

model Purchase {
  id           String    @id @default(uuid())
  userId       String
  itemType     String    // badge, voucher
  itemId       String?
  amount       Float
  currency     String    @default("PHP")
  status       String    @default("completed")
  createdAt    DateTime  @default(now())
  user         User      @relation(fields: [userId], references: [id])
  transaction  Transaction?
}

model CommissionRate {
  id           String    @id @default(uuid())
  durationType String    // daily, weekly, monthly
  rate         Float     // percentage (e.g., 7.0 for 7%)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

## 3. Feature Enhancements

### 3.1 Tiered Commission Structure

#### 3.1.1 Commission Rate Model

Implement a tiered commission system based on rental duration:

| Duration Type | Commission Rate | Target User |
|---------------|-----------------|-------------|
| Daily         | 7%              | Renters/Owners |
| Weekly        | 5%              | Renters/Owners |
| Monthly       | 3%              | Renters/Owners |

#### 3.1.2 Implementation Approach

1. Create a new `CommissionRate` model in the database
2. Update the payment service to calculate commissions based on duration
3. Modify the booking calendar UI to display different rates
4. Update the checkout flow to show applicable commission rates

#### 3.1.3 UI/UX Considerations

- Display commission rates clearly during the booking process
- Show total costs including commissions
- Provide tooltips explaining the commission structure
- Update receipt generation to include commission details

### 3.2 User Status/Tier System

#### 3.2.1 Tier Progression

Implement a four-tier system based on user activity:

| Tier   | Requirements (Renters) | Requirements (Owners) | Benefits |
|--------|------------------------|-----------------------|----------|
| New    | 0 successful rentals   | 0 listings            | Basic platform access |
| Bronze | 1-5 rentals OR 1-3 listings | 1-3 listings OR 1-5 rented items | - List up to 10 items<br>- 5% discount vouchers |
| Silver | 6-15 rentals OR 4-10 listings | 4-10 listings OR 6-15 rented items | - List up to 25 items<br>- 10% discount vouchers<br>- Priority customer support |
| Gold   | 16+ rentals OR 11+ listings | 11+ listings OR 16+ rented items | - List unlimited items<br>- 15% discount vouchers<br>- Dedicated account manager<br>- Featured listings |

#### 3.2.2 Implementation Approach

1. Create a `UserTier` model to track user progress
2. Implement a points-based system where:
   - Renters earn points for successful rentals
   - Owners earn points for successful listings
   - Reviews affect point accumulation
3. Develop a background service to calculate and update user tiers
4. Create UI components to display user tier status and progress

#### 3.2.3 Review Impact on Tier Progression

- Positive reviews (4-5 stars): +2 points
- Neutral reviews (3 stars): +1 point
- Negative reviews (1-2 stars): -1 point
- Verified reviews: +1 bonus point

### 3.3 In-App Purchase System

#### 3.3.1 Purchaseable Items

1. **Verified Badge**
   - Cost: ₱199
   - Duration: 1 year
   - Benefits: Verification badge on profile, increased trust score
   - Note: Does not automatically mean fully trusted status

2. **Gold Renter Status**
   - Cost: ₱499/month or ₱4,999/year
   - Benefits: All Gold tier benefits regardless of activity level

3. **Vouchers**
   - Item Vouchers: ₱100-₱500 for specific categories
   - Owner Vouchers: ₱200-₱1000 for listing promotions
   - Seasonal Vouchers: Special event-based discounts

#### 3.3.2 Implementation Approach

1. Create `Purchase`, `Voucher`, and `UserBadge` models
2. Implement a payment flow for in-app purchases
3. Develop voucher redemption system
4. Create badge display system in user profiles
5. Build admin dashboard for managing vouchers and badges

#### 3.3.3 UI/UX Considerations

- Dedicated "Shop" section in the app
- Wallet/balance display for users
- Purchase history and active items tracking
- Voucher redemption interface
- Badge display on user profiles

### 3.4 Enhanced REN AI Integration

#### 3.4.1 Proactive Assistance Features

Enhance REN AI with proactive assistance capabilities:

1. **Smart Notifications**
   - Price drop alerts for wishlist items
   - Alternative suggestions when preferred items are unavailable
   - Seasonal listing suggestions for owners

2. **Predictive Assistance**
   - Booking pattern analysis for personalized recommendations
   - Rental history-based suggestions
   - Calendar integration for event-based reminders

3. **Advanced Navigation**
   - Direct listing suggestions with [SUGGEST_LISTING:id] syntax
   - Context-aware page redirection with [NAVIGATE:/path] syntax
   - Personalized search results based on user preferences

#### 3.4.2 Implementation Approach

1. Extend the existing REN AI service with new capabilities
2. Implement user preference tracking and storage
3. Develop proactive notification system
4. Enhance chat interface with action buttons
5. Integrate with calendar and event systems

#### 3.4.3 AI Context Enhancements

- User rental history and preferences
- Geolocation data for localized suggestions
- Calendar events for timing-based recommendations
- Sentiment analysis for personalized responses
- Engagement level tracking for assistance intensity

## 4. API Endpoints

### 4.1 Commission & Pricing APIs

```
GET /api/commission/rates
- Retrieve current commission rates by duration

POST /api/commission/calculate
- Calculate total cost including commission
- Parameters: amount, durationType

GET /api/pricing/suggestions
- Get pricing suggestions based on item category
- Parameters: category, condition, features
```

### 4.2 User Tier APIs

```
GET /api/users/{id}/tier
- Get user's current tier and progress

POST /api/users/{id}/tier/calculate
- Calculate and update user tier based on activity

GET /api/tiers/benefits
- Get benefits for each tier level
```

### 4.3 In-App Purchase APIs

```
GET /api/shop/items
- Get available items for purchase

POST /api/purchases
- Create a new purchase
- Parameters: userId, itemType, itemId, amount

GET /api/users/{id}/purchases
- Get user's purchase history

POST /api/vouchers/redeem
- Redeem a voucher code
- Parameters: code, userId

GET /api/users/{id}/badges
- Get user's active badges
```

### 4.4 Enhanced AI APIs

```
POST /api/ai/proactive-suggestions
- Get proactive suggestions for user
- Parameters: userId, context

POST /api/ai/live-data
- Get real-time data for AI responses
- Parameters: query, userId

POST /api/ai/recommendations
- Get personalized recommendations
- Parameters: userId, preferences
```

## 5. Business Logic

### 5.1 Commission Calculation Logic

```
function calculateCommission(amount: number, durationType: string): number {
  const rate = getCommissionRate(durationType);
  return amount * (rate / 100);
}

function getCommissionRate(durationType: string): number {
  switch(durationType) {
    case 'daily': return 7.0;
    case 'weekly': return 5.0;
    case 'monthly': return 3.0;
    default: return 7.0;
  }
}
```

### 5.2 Tier Progression Logic

```
function calculateUserTier(userActivity: UserActivity): TierInfo {
  const { totalRentals, totalListings, reviewScore } = userActivity;
  
  // Calculate points based on activity
  let points = totalRentals + totalListings;
  
  // Adjust points based on review score
  if (reviewScore >= 4) points += 2;
  else if (reviewScore >= 3) points += 1;
  else if (reviewScore <= 2) points -= 1;
  
  // Determine tier based on points
  if (points >= 50) return { tier: 'gold', points };
  if (points >= 20) return { tier: 'silver', points };
  if (points >= 5) return { tier: 'bronze', points };
  return { tier: 'new', points };
}
```

### 5.3 Voucher Redemption Logic

```
function redeemVoucher(code: string, userId: string): RedemptionResult {
  const voucher = findVoucherByCode(code);
  
  if (!voucher) {
    return { success: false, error: 'Invalid voucher code' };
  }
  
  if (voucher.used) {
    return { success: false, error: 'Voucher already used' };
  }
  
  if (voucher.expiresAt && voucher.expiresAt < new Date()) {
    return { success: false, error: 'Voucher expired' };
  }
  
  // Mark voucher as used
  updateVoucher(voucher.id, { 
    used: true, 
    usedAt: new Date(),
    userId: userId
  });
  
  return { 
    success: true, 
    discount: voucher.discount,
    voucherType: voucher.voucherType
  };
}
```

## 6. UI/UX Design

### 6.1 User Tier Display

```
┌─────────────────────────────────────────────────────────────┐
│  User Profile Header                                        │
├─────────────────────────────────────────────────────────────┤
│  [Avatar]  John Doe                          [Gold Badge]  │
│            john.doe@example.com              ⭐ Verified   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    TIER PROGRESS                        ││
│  │  [██████████████████░░░░░░░░░░] 80%                     ││
│  │  Silver Tier - 20 pts to Gold                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   RENTAL STATS  │ │  LISTING STATS  │ │   BENEFITS      ││
│  │  12 Rentals     │ │  5 Listings     │ │  - 25 Items     ││
│  │  Avg Rating: 4.5│ │  Avg Rating: 4.2│ │  - 10% Voucher  ││
│  └─────────────────┘ └─────────────────┘ │  - Priority Sup ││
│                                           └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Commission Display in Booking Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Booking Summary                                            │
├─────────────────────────────────────────────────────────────┤
│  Item: Professional Camera                                  │
│  Dates: Jun 15 - Jun 22 (7 days)                            │
│                                                             │
│  Pricing Breakdown:                                         │
│  ₱1,200 × 7 days        ₱8,400                             │
│  Weekly Commission (5%) ₱420                               │
│  ──────────────────────────────────                         │
│  Total                  ₱8,820                             │
│                                                             │
│  [ ] Apply Voucher                                          │
│                                                             │
│  [ Proceed to Payment ]                                     │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 In-App Purchase Shop

```
┌─────────────────────────────────────────────────────────────┐
│  RenThing Shop                                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   VERIFIED      │ │    GOLD         │ │   VOUCHERS      ││
│  │   BADGE         │ │   STATUS        │ │                 ││
│  │                 │ │                 │ │                 ││
│  │  ⭐ Verified     │ │  🏅 Gold Tier   │ │  🎁 10% Off     ││
│  │  1 Year         │ │  Unlimited      │ │  Any Item       ││
│  │  ₱199           │ │  Listings       │ │  ₱150           ││
│  │  [ Purchase ]   │ │  ₱4,999/year    │ │  [ Buy Now ]    ││
│  └─────────────────┘ │  [ Subscribe ]  │ └─────────────────┘│
│                       └─────────────────┘                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    MY PURCHASES                         ││
│  │  Verified Badge (Active until: Dec 2025) [ Manage ]     ││
│  │  10% Off Voucher (3 remaining)           [ Use ]        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 7. Implementation Roadmap

### 7.1 Phase 1: Foundation (Weeks 1-2)

1. Database schema extensions
2. Commission rate management system
3. User tier tracking service
4. Basic API endpoints for new features

### 7.2 Phase 2: Core Features (Weeks 3-4)

1. Commission calculation and display
2. User tier progression logic
3. Tier benefits implementation
4. UI components for tier display

### 7.3 Phase 3: In-App Purchases (Weeks 5-6)

1. Purchase flow implementation
2. Voucher system
3. Badge management
4. Shop UI development

### 7.4 Phase 4: AI Enhancements (Weeks 7-8)

1. Proactive assistance features
2. Enhanced recommendation engine
3. Context-aware navigation
4. Personalization improvements

## 8. Testing Strategy

### 8.1 Unit Tests

1. Commission calculation functions
2. Tier progression algorithms
3. Voucher redemption logic
4. AI recommendation accuracy

### 8.2 Integration Tests

1. API endpoint validation
2. Database schema integrity
3. Payment flow integration
4. User tier updates

### 8.3 UI Tests

1. Responsive design across devices
2. Accessibility compliance
3. User flow validation
4. Performance benchmarks

## 9. Security Considerations

1. **Payment Security**: All transactions processed through secure payment gateways
2. **Data Privacy**: User activity and preferences stored with encryption
3. **Authentication**: JWT-based authentication for all API endpoints
4. **Authorization**: Role-based access control for admin functions
5. **Audit Trail**: All purchases and tier changes logged for compliance

## 10. Performance Considerations

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Database Optimization**: Indexes on user activity and purchase history
3. **API Performance**: Response time monitoring and optimization
4. **Scalability**: Horizontal scaling support for increased user base
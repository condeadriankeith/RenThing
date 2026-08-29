# RenThing - Rental Marketplace Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://renthing.vercel.app/)

> **Live Platform:** [https://renthing.vercel.app/](https://renthing.vercel.app/)

RenThing is a peer-to-peer rental marketplace platform that enables users to list items for rent, browse inventory, manage bookings, process transactions, and communicate directly with owners and renters.

---

## Features

- **Item Listings**: Create, edit, and categorize items available for rent with pricing and availability calendars.
- **Search and Discovery**: Filter listings by category, location, price range, and availability.
- **In-App Messaging**: Real-time messaging between renters and item owners.
- **Booking and Payment Management**: Comprehensive lifecycle tracking from reservation to return.
- **Data Scraping**: Integrated ingestion pipelines for external rental catalogs.
- **AI Assistant Support**: Optional local conversational model integration via Ollama.

---

## Technology Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS, Framer Motion
- **Backend**: Express.js services integrated with Next.js API endpoints
- **Database**: PostgreSQL (Supabase) managed via Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- pnpm (or npm / yarn)
- PostgreSQL / Supabase account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/condeadriankeith/RenThing.git
cd RenThing

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Apply database migrations
npx prisma migrate dev

# 5. Seed database (optional)
npx prisma db seed

# 6. Start development server
pnpm dev
```

---

## Production Deployment

This project is configured for deployment on Vercel with a Supabase PostgreSQL backend.

Ensure the following environment variables are defined in production:
- `DATABASE_URL`: Supabase connection pool string
- `NEXTAUTH_SECRET`: Session encryption secret
- `NEXTAUTH_URL`: Canonical deployment URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase administrative key

---

## License

MIT License
# RenThing - Rental Marketplace Platform

RenThing is a comprehensive rental marketplace platform that enables users to list items for rent, browse available items, book rentals, chat with owners/renters, manage bookings and payments, and scrape rental listings from external websites.

## Features

- List items for rent
- Browse and book available items
- Chat with owners/renters
- Manage bookings and payments
- Scrape rental listings from external websites
- Optional AI assistant (REN AI) with local model support via Ollama

## Technology Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Framer Motion
- **Backend**: Custom Express.js server integrated with Next.js API routes
- **Database**: Prisma ORM with Supabase (PostgreSQL)
- **AI Integration**: Optional local AI models via Ollama (e.g., DeepSeek-v3, Llama 3.1 8B)

## Prerequisites

- Node.js v18+
- pnpm (or npm/yarn)
- Prisma CLI
- Git
- Ollama (for local AI)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/renthing.git
   cd renthing
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your configuration:
   ```bash
   cp .env.example .env.local
   ```

4. Set up your Supabase database:
   - Create a Supabase project at https://supabase.com
   - Get your database connection string and API keys
   - Update `.env.local` with your Supabase credentials

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed the database:
   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   pnpm dev
   ```

## Supabase Migration

This project uses Supabase as the primary database.

### Migration Process

1. **Setup Supabase Project**: Create a new project at https://supabase.com

2. **Configure Environment Variables**: Update `.env.local` with your Supabase credentials:
   ```bash
   DATABASE_URL=your_supabase_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Run Migrations**: Apply the database schema:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Data**: Populate the database with initial data:
   ```bash
   npx prisma db seed
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your GitHub repository
4. Configure the environment variables in Vercel project settings:
   - `DATABASE_URL` (your Supabase connection string)
   - `NEXTAUTH_SECRET` (a strong secret key)
   - `NEXTAUTH_URL` (your deployed application URL)
   - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (your Supabase service role key)
5. Deploy the project

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm export:data` - Export data from the database
- `pnpm import:data` - Import data to Supabase

## Environment Variables

See `.env.example` for all required and optional environment variables.

## License

MIT

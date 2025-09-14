# RenThing

<p align="center">
  <img src="/public/RenThing_Logo.png" alt="RenThing Logo" width="200" />
</p>

<p align="center">
  <strong>Rent Anything, Anywhere</strong>
</p>

## Tech Stack

- [Next.js](https://nextjs.org/) (React framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) (Database ORM)
- [Axios](https://axios-http.com/) (HTTP client)
- [Cheerio](https://cheerio.js.org/) (Server-side jQuery)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

## Vercel Deployment

To deploy this application to Vercel, follow these steps:

1. Push your code to a GitHub repository
2. Create a new project on Vercel and import your repository
3. Configure the environment variables in the Vercel dashboard:
   - `DATABASE_URL`: For production, use a PostgreSQL database (see below for setup)
   - `NEXTAUTH_URL`: Your deployed URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: A random string for NextAuth
4. Vercel should automatically detect the Next.js framework and configure the build settings
5. The build process will:
   - Install dependencies using npm
   - Generate the Prisma client
   - Build the Next.js application
   - Run database migrations (if using PostgreSQL)

### PostgreSQL Database Setup for Vercel

For production deployments on Vercel, it's recommended to use PostgreSQL instead of SQLite due to SQLite's file-based nature which doesn't work well in serverless environments.

#### Option 1: Using Vercel Postgres (Recommended)

1. In your Vercel project, go to the "Storage" tab
2. Create a new PostgreSQL database
3. Vercel will automatically set the `DATABASE_URL` environment variable
4. No additional configuration is needed

#### Option 2: Using External PostgreSQL Provider

If you prefer to use an external PostgreSQL provider (like Supabase, Render, or AWS RDS):

1. Create a PostgreSQL database with your provider
2. Get the connection string (should look like `postgresql://username:password@host:port/database`)
3. Add it as `DATABASE_URL` in your Vercel environment variables

### Environment Variables for Vercel

Create the following environment variables in your Vercel project settings:

```env
# Database (use PostgreSQL for production)
# If using Vercel Postgres, this will be automatically set
# Otherwise, use your PostgreSQL connection string:
# DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_random_secret_string_at_least_32_characters

# Other variables as needed for your specific features
```

Note: For the `NEXTAUTH_SECRET`, generate a random string of at least 32 characters.

## Screenshots

> _Add screenshots of your app here (e.g. homepage, booking flow, chat, etc.)_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1. Clone the repository:
	```sh
	git clone https://github.com/yourusername/renthing.git
	cd renthing
	```
2. Install dependencies:
	```sh
	pnpm install
	```
   If you have Ollama installed, the phi3:mini model will be automatically pulled during installation.
3. Copy `.env.example` to `.env.local` and update values as needed.

### Running Locally

```sh
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root and configure the following:

```env
# For local development with SQLite
DATABASE_URL=file:./dev.db

# Other required variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Local AI with Ollama (Optional)

For greater privacy and control, you can run a local AI model using Ollama:

1. Install [Ollama](https://ollama.com/) on your machine
2. The phi3:mini model will be automatically pulled when you run `npm install`
3. Set the following environment variables in your `.env.local` file:

```env
# Ollama Configuration for local AI model
OLLAMA_ENABLED=true
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=phi3:mini
```

When Ollama is enabled, the AI assistant will use your local model. See [OLLAMA_INTEGRATION.md](docs/general/OLLAMA_INTEGRATION.md) for detailed setup instructions.

You can test your Ollama setup by running:
```sh
npm run test:ollama
```

## Supabase Migration

This project currently uses Prisma with PostgreSQL as the default database. However, it can be migrated to use Supabase instead.

### Migration Process

1. **Setup Supabase Tables**: Follow the SQL schema in `docs/general/SUPABASE_MIGRATION_GUIDE.md` to create equivalent tables in your Supabase project.

2. **Export Data**: Use the export script to extract data from your current Prisma database:
   ```bash
   pnpm run export:data
   ```

3. **Import Data**: Use the import script to transfer data to Supabase:
   ```bash
   pnpm run import:data
   ```

4. **Update Application Code**: Replace Prisma calls with Supabase calls throughout the application.

For detailed instructions, see [docs/general/SUPABASE_MIGRATION_GUIDE.md](docs/general/SUPABASE_MIGRATION_GUIDE.md).

## Project Organization

This project has been organized into a structured directory layout for better maintainability:

- `app/` - Next.js pages and API routes
- `components/` - Reusable UI components
- `contexts/` - React context providers
- `hooks/` - Custom hooks
- `lib/` - Utility functions and services
- `prisma/` - Database schema and migrations
- `scripts/` - Build, export, import, and utility scripts
- `docs/` - Project documentation
  - `general/` - General project documentation and guides
- `tests/` - All test files
  - `unit/` - Unit tests for individual components and functions
  - `integration/` - Integration tests for API endpoints and service interactions
  - `e2e/` - End-to-end tests for user flows and complete features
  - `ai/` - AI-specific tests
  - `components/` - Component tests

## Usage

- List your items for rent
- Browse and book available items
- Chat with owners/renters
- Manage your bookings and payments
- Scrape rental listings from external websites:
  - Technical documentation: [docs/general/WEB_SCRAPING.md](docs/general/WEB_SCRAPING.md)
  - Usage guide: [docs/general/HOW_TO_USE_WEB_SCRAPING.md](docs/general/HOW_TO_USE_WEB_SCRAPING.md)
  - Import listings: Visit `/scrape` after starting the development server
- Interact with REN, the AI assistant:
  - AI demo: Visit `/ai-demo` after starting the development server
  - Integration guide: [docs/general/REN_INTEGRATION_GUIDE.md](docs/general/REN_INTEGRATION_GUIDE.md)
  - AI requirements: [docs/general/REN_AI_PERSONALITY_PRD.md](docs/general/REN_AI_PERSONALITY_PRD.md)

## Documentation

All documentation has been moved to the [docs/general](docs/general) directory:
- [docs/general/PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/general/PRODUCT_REQUIREMENTS_DOCUMENT.md) - Core platform requirements
- [docs/general/REN_AI_PERSONALITY_PRD.md](docs/general/REN_AI_PERSONALITY_PRD.md) - Detailed requirements for REN AI personality
- [docs/general/WEB_SCRAPING.md](docs/general/WEB_SCRAPING.md) - Documentation for web scraping functionality
- [docs/general/HOW_TO_USE_WEB_SCRAPING.md](docs/general/HOW_TO_USE_WEB_SCRAPING.md) - User guide for web scraping
- [docs/general/ENVIRONMENT_VARIABLES.md](docs/general/ENVIRONMENT_VARIABLES.md) - Configuration guide for environment variables
- [docs/general/OLLAMA_INTEGRATION.md](docs/general/OLLAMA_INTEGRATION.md) - Local AI model integration with Ollama
- [docs/general/RECENT_CHANGES_SUMMARY.md](docs/general/RECENT_CHANGES_SUMMARY.md) - Summary of recent development changes
- [docs/general/REN_AI_ISOLATION_SUMMARY.md](docs/general/REN_AI_ISOLATION_SUMMARY.md) - Summary of isolated REN AI files

## REN AI Isolation

The REN AI files have been temporarily isolated into a dedicated directory structure for development purposes. 
This isolation allows for focused work on AI features without affecting other parts of the application.

To work with the isolated REN AI files:
1. Navigate to the `ren-ai` directory
2. All REN AI components, services, APIs, and hooks are organized within this directory
3. Use the provided scripts for reintegration or removal when needed:
   - `reintegrate-ren-ai.ps1` - Reintegrate files back to their original locations
   - `remove-ren-ai-isolation.ps1` - Remove the isolated directory structure

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
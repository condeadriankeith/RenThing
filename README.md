## Tech Stack

- [Next.js](https://nextjs.org/) (React framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) (Database ORM)
- [Axios](https://axios-http.com/) (HTTP client)
- [Cheerio](https://cheerio.js.org/) (Server-side jQuery)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

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

<<<<<<< HEAD
### Ollama Integration (Optional)

To use a locally hosted AI model with Ollama:

1. Install [Ollama](https://ollama.com/) on your machine
2. Pull the DeepSeek-v3 model: `ollama run deepseek-v3`
3. Set the following environment variables in your `.env.local` file:

```env
# Ollama Configuration for local AI model
OLLAMA_ENABLED=true
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=deepseek-v3
```

When Ollama is enabled, the AI assistant will use your local model instead of the OpenRouter API, providing:
- Complete privacy (no data sent to external services)
- No API costs
- Full control over the AI model
- Offline capability

### Local AI with Ollama (Optional)

For even greater privacy and control, you can run a local AI model using Ollama:

1. Install [Ollama](https://ollama.com/) on your machine
2. Pull the Llama 3.1 8B model: `ollama pull llama3.1:8b`
3. Set the following environment variables in your `.env.local` file:

```env
# Ollama Configuration for local AI model
OLLAMA_ENABLED=true
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

When Ollama is enabled, the AI assistant will use your local model instead of the OpenRouter API. See [OLLAMA_INTEGRATION.md](OLLAMA_INTEGRATION.md) for detailed setup instructions.

=======
>>>>>>> 8668939 (2025-09-10: Temporary disabling of REN AI)
## Supabase Migration

This project currently uses Prisma with PostgreSQL as the default database. However, it can be migrated to use Supabase instead.

### Migration Process

1. **Setup Supabase Tables**: Follow the SQL schema in `SUPABASE_MIGRATION_GUIDE.md` to create equivalent tables in your Supabase project.

2. **Export Data**: Use the export script to extract data from your current Prisma database:
   ```bash
   pnpm run export:data
   ```

3. **Import Data**: Use the import script to transfer data to Supabase:
   ```bash
   pnpm run import:data
   ```

4. **Update Application Code**: Replace Prisma calls with Supabase calls throughout the application.

For detailed instructions, see [SUPABASE_MIGRATION_GUIDE.md](SUPABASE_MIGRATION_GUIDE.md).

## Usage

- List your items for rent
- Browse and book available items
- Chat with owners/renters
- Manage your bookings and payments
- Scrape rental listings from external websites:
  - Technical documentation: [WEB_SCRAPING.md](WEB_SCRAPING.md)
  - Usage guide: [HOW_TO_USE_WEB_SCRAPING.md](HOW_TO_USE_WEB_SCRAPING.md)
<<<<<<< HEAD
- Interact with REN, the AI assistant:
  - AI demo: Visit `/ai-demo` after starting the development server
  - Integration guide: [REN_INTEGRATION_GUIDE.md](REN_INTEGRATION_GUIDE.md)
  - AI requirements: [REN_AI_PERSONALITY_PRD.md](REN_AI_PERSONALITY_PRD.md)
  - DeepSeek-R1 integration: [REN_DEEPSEEK_INTEGRATION.md](REN_DEEPSEEK_INTEGRATION.md)
=======
>>>>>>> 8668939 (2025-09-10: Temporary disabling of REN AI)

## Documentation

- [PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md) - Core platform requirements
- [PRODUCT_REQUIREMENTS_DOCUMENT_UPDATED.md](PRODUCT_REQUIREMENTS_DOCUMENT_UPDATED.md) - Comprehensive PRD with enhanced details
<<<<<<< HEAD
- [REN_AI_PERSONALITY_PRD.md](REN_AI_PERSONALITY_PRD.md) - Detailed requirements for REN AI personality
- [REN_DEEPSEEK_INTEGRATION.md](REN_DEEPSEEK_INTEGRATION.md) - Technical details for AI model integration
- [WEB_SCRAPING.md](WEB_SCRAPING.md) - Documentation for web scraping functionality
- [HOW_TO_USE_WEB_SCRAPING.md](HOW_TO_USE_WEB_SCRAPING.md) - User guide for web scraping
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) - Configuration guide for environment variables
- [OLLAMA_INTEGRATION.md](OLLAMA_INTEGRATION.md) - Local AI model integration with Ollama
- [RECENT_CHANGES_SUMMARY.md](RECENT_CHANGES_SUMMARY.md) - Summary of recent development changes
- [REN_AI_ISOLATION_SUMMARY.md](REN_AI_ISOLATION_SUMMARY.md) - Summary of isolated REN AI files

## REN AI Isolation

The REN AI files have been temporarily isolated into a dedicated directory structure for development purposes. 
This isolation allows for focused work on AI features without affecting other parts of the application.

To work with the isolated REN AI files:
1. Navigate to the `ren-ai` directory
2. All REN AI components, services, APIs, and hooks are organized within this directory
3. Use the provided scripts for reintegration or removal when needed:
   - `reintegrate-ren-ai.ps1` - Reintegrate files back to their original locations
   - `remove-ren-ai-isolation.ps1` - Remove the isolated directory structure
=======
- [WEB_SCRAPING.md](WEB_SCRAPING.md) - Documentation for web scraping functionality
- [HOW_TO_USE_WEB_SCRAPING.md](HOW_TO_USE_WEB_SCRAPING.md) - User guide for web scraping
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) - Configuration guide for environment variables
- [RECENT_CHANGES_SUMMARY.md](RECENT_CHANGES_SUMMARY.md) - Summary of recent development changes
>>>>>>> 8668939 (2025-09-10: Temporary disabling of REN AI)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
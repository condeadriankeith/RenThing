## Tech Stack

- [Next.js](https://nextjs.org/) (React framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) (Database ORM)
- [Axios](https://axios-http.com/) (HTTP client)
- [Cheerio](https://cheerio.js.org/) (Server-side jQuery)

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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
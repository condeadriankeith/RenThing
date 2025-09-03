const SUPABASE_DATABASE_URL = "postgres://postgres.aphczgukfgfbvgjwferw:ampRPk6s5AtNUBI9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

// Prisma configuration with fallback for build environments
module.exports = {
  getDatabaseUrl: () => {
    // During build time, we might not have DATABASE_URL
    // Return a placeholder that will work for Prisma client generation
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }

    // Fallback for build environments
    if (process.env.NODE_ENV === 'production') {
      // In production, use Supabase database URL
      return SUPABASE_DATABASE_URL;
    }

    // For development or build processes, use SQLite as fallback
    return 'file:./dev.db';
  },

  getDatabaseProvider: () => {
    // Check if we're in production or if DATABASE_URL is set to PostgreSQL
    if (process.env.NODE_ENV === 'production' ||
        (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'))) {
      return 'postgresql';
    }

    // Default to SQLite for development
    return 'sqlite';
  },

  getDatabaseConfig: () => {
    const provider = module.exports.getDatabaseProvider();
    const url = module.exports.getDatabaseUrl();

    return {
      provider,
      url
    };
  }
};

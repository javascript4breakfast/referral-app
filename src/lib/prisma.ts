import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'For local development, use: file:./prisma/dev.db. ' +
    'For production with Turso, use: libsql://[database].turso.io?authToken=[token]'
  );
}

// Validate DATABASE_URL format
const dbUrl = process.env.DATABASE_URL;
const isValidFormat = dbUrl.startsWith('file:') || dbUrl.startsWith('libsql://') || dbUrl.startsWith('postgres://');

if (!isValidFormat) {
  throw new Error(
    `Invalid DATABASE_URL format: "${dbUrl}". ` +
    'Must start with "file:" (local SQLite), "libsql://" (Turso), or "postgres://" (PostgreSQL)'
  );
}

// Initialize Prisma Client with Turso adapter if using libsql://
function createPrismaClient() {
  const logLevel = process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as const
    : ['error'] as const;

  // Use libSQL adapter for Turso (libsql:// URLs)
  if (dbUrl.startsWith('libsql://')) {
    const libsql = createClient({ url: dbUrl });
    // @ts-ignore - PrismaLibSQL adapter has type compatibility issues
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ 
      // @ts-ignore - adapter type compatibility
      adapter,
      // @ts-ignore - readonly array type mismatch
      log: logLevel 
    });
  }

  // Use default for file-based SQLite and PostgreSQL
  return new PrismaClient({
    // @ts-ignore - readonly array type mismatch
    log: logLevel,
  });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || '';
  
  // Use Turso adapter for libsql:// URLs (production)
  if (dbUrl.startsWith('libsql://')) {
    // Dynamically import to avoid breaking local dev
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createClient } = require('@libsql/client');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      
      const libsql = createClient({ url: dbUrl });
      const adapter = new PrismaLibSQL(libsql);
      
      return new PrismaClient({
        // @ts-ignore - adapter compatibility
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch (error) {
      console.error('Failed to initialize Turso adapter:', error);
      throw error;
    }
  }
  
  // Use default for local file-based SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
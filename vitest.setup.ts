// Setup file for Vitest
import { beforeAll, afterAll, afterEach } from 'vitest';

// Mock environment variables
beforeAll(() => {
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.NEXTAUTH_SECRET = 'test-secret';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
});

// Clean up after tests
afterEach(() => {
  // Clear any test data if needed
});

afterAll(() => {
  // Final cleanup
});


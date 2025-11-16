import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      count: vi.fn(),
    },
    invite: {
      count: vi.fn(),
    },
    referral: {
      count: vi.fn(),
    },
  },
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return healthy status when database is connected', async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(5);
    vi.mocked(prisma.invite.count).mockResolvedValue(10);
    vi.mocked(prisma.referral.count).mockResolvedValue(3);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.database).toBe('connected');
    expect(data.counts).toEqual({
      users: 5,
      invites: 10,
      referrals: 3,
    });
  });

  it('should return error when database is unreachable', async () => {
    vi.mocked(prisma.user.count).mockRejectedValue(new Error('Database connection failed'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.status).toBe('error');
    expect(data.database).toBe('error');
  });

  it('should handle Prisma errors gracefully', async () => {
    const prismaError = new Error('Prisma error');
    prismaError.name = 'PrismaClientKnownRequestError';

    vi.mocked(prisma.user.count).mockRejectedValue(prismaError);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.status).toBe('error');
  });
});


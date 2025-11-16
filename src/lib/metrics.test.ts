import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserMetrics } from './metrics';
import { prisma } from './prisma';

// Mock Prisma
vi.mock('./prisma', () => ({
  prisma: {
    invite: {
      count: vi.fn(),
    },
    referral: {
      count: vi.fn(),
    },
  },
}));

describe('User Metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserMetrics', () => {
    it('should return correct metrics for user', async () => {
      const userId = 'user-123';

      vi.mocked(prisma.invite.count)
        .mockResolvedValueOnce(10) // total invites
        .mockResolvedValueOnce(3); // accepted invites

      vi.mocked(prisma.referral.count).mockResolvedValue(5); // total referrals

      const metrics = await getUserMetrics(userId);

      expect(metrics).toEqual({
        totalInvites: 10,
        acceptedInvites: 3,
        pendingInvites: 7,
        totalReferrals: 5,
        conversionRate: 30, // 3/10 * 100
      });
    });

    it('should handle zero invites correctly', async () => {
      const userId = 'user-123';

      vi.mocked(prisma.invite.count).mockResolvedValue(0);
      vi.mocked(prisma.referral.count).mockResolvedValue(0);

      const metrics = await getUserMetrics(userId);

      expect(metrics).toEqual({
        totalInvites: 0,
        acceptedInvites: 0,
        pendingInvites: 0,
        totalReferrals: 0,
        conversionRate: 0,
      });
    });

    it('should calculate conversion rate correctly', async () => {
      const userId = 'user-123';

      // 5 out of 20 accepted
      vi.mocked(prisma.invite.count)
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(5);

      vi.mocked(prisma.referral.count).mockResolvedValue(5);

      const metrics = await getUserMetrics(userId);

      expect(metrics.conversionRate).toBe(25);
    });

    it('should round conversion rate to whole number', async () => {
      const userId = 'user-123';

      // 1 out of 3 accepted (33.333%)
      vi.mocked(prisma.invite.count)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(1);

      vi.mocked(prisma.referral.count).mockResolvedValue(1);

      const metrics = await getUserMetrics(userId);

      expect(metrics.conversionRate).toBe(33);
    });

    it('should handle database errors gracefully', async () => {
      const userId = 'user-123';

      vi.mocked(prisma.invite.count).mockRejectedValue(new Error('Database error'));

      await expect(getUserMetrics(userId)).rejects.toThrow('Database error');
    });
  });
});


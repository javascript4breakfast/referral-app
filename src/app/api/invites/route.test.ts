import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    invite: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendInviteEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/ids', () => ({
  makeInviteToken: vi.fn(() => 'test-token-123'),
}));

describe('POST /api/invites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create invite when authenticated', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    };

    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      referralCode: 'USER123',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    const mockInvite = {
      id: 'invite-1',
      inviterId: 'user-1',
      email: 'friend@example.com',
      token: 'test-token-123',
      status: 'SENT' as const,
      createdAt: new Date(),
      acceptedAt: null,
    };

    vi.mocked(getSession).mockResolvedValue(mockSession as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(prisma.invite.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.invite.create).mockResolvedValue(mockInvite);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'friend@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.invite.email).toBe('friend@example.com');
  });

  it('should return 401 when not authenticated', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'friend@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should reject invalid email format', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    };

    vi.mocked(getSession).mockResolvedValue(mockSession as any);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
  });

  it('should reject invite to self', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    };

    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      referralCode: 'USER123',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    vi.mocked(getSession).mockResolvedValue(mockSession as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('yourself');
  });

  it('should prevent duplicate invites', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    };

    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      referralCode: 'USER123',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    const existingInvite = {
      id: 'invite-1',
      inviterId: 'user-1',
      email: 'friend@example.com',
      token: 'existing-token',
      status: 'SENT' as const,
      createdAt: new Date(),
      acceptedAt: null,
    };

    vi.mocked(getSession).mockResolvedValue(mockSession as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(prisma.invite.findFirst).mockResolvedValue(existingInvite);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'friend@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('already invited');
  });

  it('should normalize email to lowercase', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    };

    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      referralCode: 'USER123',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    const mockInvite = {
      id: 'invite-1',
      inviterId: 'user-1',
      email: 'friend@example.com',
      token: 'test-token-123',
      status: 'SENT' as const,
      createdAt: new Date(),
      acceptedAt: null,
    };

    vi.mocked(getSession).mockResolvedValue(mockSession as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(prisma.invite.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.invite.create).mockResolvedValue(mockInvite);

    const request = new Request('http://localhost:3000/api/invites', {
      method: 'POST',
      body: JSON.stringify({
        email: 'FRIEND@EXAMPLE.COM',
      }),
    });

    await POST(request);

    expect(prisma.invite.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'friend@example.com',
      }),
    });
  });
});


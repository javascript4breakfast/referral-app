import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    invite: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    referral: {
      create: vi.fn(),
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock('@/lib/ids', () => ({
  makeReferralCode: vi.fn(() => 'TEST123'),
}));

describe('POST /api/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      referralCode: 'TEST123',
      password: 'hashed-password',
      name: null,
      createdAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe('test@example.com');
    expect(data.user.referralCode).toBe('TEST123');
  });

  it('should reject signup with missing email', async () => {
    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('email is required');
  });

  it('should reject signup with short password', async () => {
    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '12345',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('password');
  });

  it('should reject signup with existing email', async () => {
    const existingUser = {
      id: 'user-1',
      email: 'test@example.com',
      referralCode: 'EXIST1',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toContain('already exists');
  });

  it('should create user with referral code', async () => {
    const inviter = {
      id: 'inviter-1',
      email: 'inviter@example.com',
      referralCode: 'INVITE1',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    };

    const newUser = {
      id: 'user-2',
      email: 'referred@example.com',
      referralCode: 'TEST123',
      password: 'hashed-password',
      name: null,
      createdAt: new Date(),
    };

    const referral = {
      id: 'referral-1',
      inviterId: 'inviter-1',
      signupUserId: 'user-2',
      inviteId: null,
      createdAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null) // Check for existing user
      .mockResolvedValueOnce(inviter); // Find inviter

    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    vi.mocked(prisma.user.create).mockResolvedValue(newUser);
    vi.mocked(prisma.invite.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.referral.create).mockResolvedValue(referral);

    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'referred@example.com',
        password: 'password123',
        ref: 'INVITE1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.referralId).toBe('referral-1');
    expect(prisma.referral.create).toHaveBeenCalled();
  });

  it('should reject invalid referral code', async () => {
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null) // Check for existing user
      .mockResolvedValueOnce(null); // Invalid referral code

    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        ref: 'INVALID',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid referral code');
  });

  it('should normalize email to lowercase', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      referralCode: 'TEST123',
      password: 'hashed-password',
      name: null,
      createdAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const request = new Request('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      }),
    });

    await POST(request);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
      }),
    });
  });
});


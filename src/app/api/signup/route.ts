import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { makeReferralCode } from '@/lib/ids';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, ref } = body as { email?: string; password?: string; ref?: string };

    // Validate email is provided
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    // Validate password is provided
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'password is required and must be at least 6 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'User with this email already exists',
          userId: existingUser.id,
        },
        { status: 409 } // Conflict
      );
    }

    // If referral code provided, look up the inviter
    let inviterId: string | null = null;
    let referralId: string | null = null;

    if (ref) {
      const inviter = await prisma.user.findUnique({
        where: { referralCode: ref.toUpperCase() },
      });

      if (!inviter) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }

      inviterId = inviter.id;

      // Prevent self-referral
      if (inviter.email === normalizedEmail) {
        return NextResponse.json(
          { error: 'Cannot use your own referral code' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        referralCode: makeReferralCode(),
      },
    });

    // If there's an inviter, create a referral record and link to invite if available
    let inviteId: string | null = null;
    if (inviterId) {
      // Check if there's an invite for this email from this inviter
      const invite = await prisma.invite.findFirst({
        where: {
          inviterId,
          email: normalizedEmail,
          status: 'SENT',
        },
      });

      if (invite) {
        inviteId = invite.id;
        // Mark invite as accepted
        await prisma.invite.update({
          where: { id: invite.id },
          data: {
            status: 'ACCEPTED',
            acceptedAt: new Date(),
          },
        });
      }

      try {
        const referral = await prisma.referral.create({
          data: {
            inviterId,
            signupUserId: newUser.id,
            inviteId: inviteId || undefined,
          },
        });
        referralId = referral.id;
      } catch (error) {
        // If referral creation fails (e.g., user already has a referral),
        // log but don't fail the signup
        console.error('Failed to create referral record:', error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          referralCode: newUser.referralCode,
        },
        referralId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Handle Prisma unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint violation (email or referralCode)
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      // Log the specific Prisma error code for debugging
      console.error('Prisma error code:', error.code, 'Message:', error.message);
    }

    // Return more detailed error in non-production for debugging
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Failed to create account'
      : `Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`;

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


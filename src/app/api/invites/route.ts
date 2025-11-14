import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { email } = body as { email?: string };

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Get the current user
    const inviter = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!inviter) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if invite already exists for this email
    const existingInvite = await prisma.invite.findFirst({
      where: {
        inviterId: inviter.id,
        email: normalizedEmail,
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        {
          error: 'Invite already sent to this email',
          inviteId: existingInvite.id,
        },
        { status: 409 }
      );
    }

    // Create the invite
    const invite = await prisma.invite.create({
      data: {
        inviterId: inviter.id,
        email: normalizedEmail,
        token: nanoid(),
        status: 'SENT',
      },
    });

    // TODO: Send email with invite link
    const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup?ref=${inviter.referralCode}`;

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        email: invite.email,
        token: invite.token,
        status: invite.status,
      },
      inviteUrl,
    });
  } catch (error) {
    console.error('Invite creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}
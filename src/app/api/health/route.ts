import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    // Test database connection with a simple query
    const userCount = await prisma.user.count();
    const inviteCount = await prisma.invite.count();
    const referralCount = await prisma.referral.count();

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      counts: {
        users: userCount,
        invites: inviteCount,
        referrals: referralCount,
      },
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    // Check for specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2021') {
        // Table does not exist - database needs migrations
        return NextResponse.json(
          {
            status: 'error',
            database: 'schema_not_initialized',
            error: 'Database tables do not exist. Run: pnpm prisma migrate dev',
            code: error.code,
          },
          { status: 500 }
        );
      }
      if (error.code === 'P1001') {
        // Can't reach database server
        return NextResponse.json(
          {
            status: 'error',
            database: 'unreachable',
            error: 'Cannot reach database server',
            code: error.code,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        status: 'error',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


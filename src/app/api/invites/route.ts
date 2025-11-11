import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, inviterId } = body as { email?: string; inviterId?: string };

  if (!email || !inviterId) {
    return NextResponse.json({ error: 'email and inviterId required' }, { status: 400 });
  }

  // TODO: ensure inviter exists, create token, store invite, (optionally) send email
  return NextResponse.json({ ok: true });
}
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

// Helper function to generate referral codes (matching the app's logic)
const makeReferralCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

async function main() {
  console.log('Starting seed...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@referral.app' },
    update: {
      password: hashedPassword, // Update password if user exists
    } as any,
    create: {
      email: 'demo@referral.app',
      name: 'Demo User',
      password: hashedPassword,
      referralCode: 'DEMO01',
    } as any,
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {
      password: hashedPassword, // Update password if user exists
    } as any,
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: hashedPassword,
      referralCode: makeReferralCode(),
    } as any,
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {
      password: hashedPassword, // Update password if user exists
    } as any,
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
      referralCode: makeReferralCode(),
    } as any,
  });

  // Create some invites sent by user1
  const inviteToken1 = 'seed-invite-token-1';
  const invite1 = await prisma.invite.upsert({
    where: { token: inviteToken1 },
    update: {},
    create: {
      inviterId: user1.id,
      email: 'invited1@example.com',
      token: inviteToken1,
      status: 'SENT',
    },
  });

  const inviteToken2 = 'seed-invite-token-2';
  const invite2 = await prisma.invite.upsert({
    where: { token: inviteToken2 },
    update: {},
    create: {
      inviterId: user1.id,
      email: 'invited2@example.com',
      token: inviteToken2,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    },
  });

  // Create a referral: user2 was referred by user1 via invite2
  const referral1 = await prisma.referral.upsert({
    where: { signupUserId: user2.id },
    update: {},
    create: {
      inviterId: user1.id,
      signupUserId: user2.id,
      inviteId: invite2.id,
    },
  });

  console.log('Seed complete!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.invite.count()} invites`);
  console.log(`Created ${await prisma.referral.count()} referrals`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

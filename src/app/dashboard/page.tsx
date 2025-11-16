import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import InviteForm from '@/components/InviteForm';
import Metrics from '@/components/Metrics';
import { rate } from '@/lib/metrics';
import styles from './dashboard.module.css';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  // Get current authenticated user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inviterReferrals: {
        include: {
          signupUser: {
            select: {
              email: true,
              name: true,
              createdAt: true,
            },
          },
          invite: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      invitesSent: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!currentUser) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>User not found.</p>
      </main>
    );
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const referralUrl = `${baseUrl}/signup?ref=${currentUser.referralCode}`;
  const totalSignups = currentUser.inviterReferrals.length;
  const totalInvites = currentUser.invitesSent.length;
  
  // Count accepted invites: invites with ACCEPTED status OR invites linked to referrals
  // Use a Set to ensure we only count unique invites (avoid double-counting)
  const uniqueAcceptedInviteIds = new Set([
    ...currentUser.invitesSent.filter(invite => invite.status === 'ACCEPTED').map(invite => invite.id),
    ...currentUser.inviterReferrals.filter(ref => ref.invite !== null).map(ref => ref.invite!.id),
  ]);
  
  const acceptedInvites = uniqueAcceptedInviteIds.size;
  
  // Conversion rate: accepted invites / total invites
  const conversionRate = rate(acceptedInvites, totalInvites);
  
  // Referral conversion rate: total signups / total invites
  const referralConversionRate = rate(totalSignups, totalInvites);

  const referredEmails = currentUser.inviterReferrals.map((referral) => referral.signupUser);

  return (
    <main className={styles.dashboardPageWrapper}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {currentUser.name || currentUser.email}!</p>
      </div>
      <div className={styles.dashboardGridWrapper}>
        <div className={styles.dashboardInviteFormWrapper}>
          <div>
            <InviteForm />
          </div>
          <div>
            <h2>Your Referral Link</h2>
            <div>
              <code>{referralUrl}</code>
            </div>
            <p>Share this link to invite friends and earn referrals!</p>
          </div>
        </div>
        <div className={styles.dashboardInsightsWrapper}>
          <div>
            <Metrics totalInvites={totalInvites} acceptedInvites={acceptedInvites} totalSignups={totalSignups} conversionRate={conversionRate} referralConversionRate={referralConversionRate} />
          </div>
          <div>
            {totalInvites > 0 && (
              <div>
                <h2>Recent Invites</h2>
                <ul>
                  {currentUser.invitesSent.slice(0, 10).map((invite) => (
                    <li key={invite.id}>
                      <div>
                        <strong>{invite.email}</strong>
                        <span> - {invite.status}</span>
                      </div>
                      <div>
                        <small>
                          Sent: {new Date(invite.createdAt).toLocaleDateString()}
                          {invite.acceptedAt && ` | Accepted: ${new Date(invite.acceptedAt).toLocaleDateString()}`}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            {totalSignups > 0 && (
              <div>
                <h2>Referred Users</h2>
                <ul>
                  {referredEmails.map((user, index) => (
                    <li key={currentUser.inviterReferrals[index].id}>
                      <div>
                        <strong>{user.email}</strong>
                        {user.name && <span> ({user.name})</span>}
                      </div>
                      <div>
                        <small>
                          Signed up: {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {totalSignups === 0 && totalInvites === 0 && (
            <div>
              <p>Start inviting friends to see your conversion metrics!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

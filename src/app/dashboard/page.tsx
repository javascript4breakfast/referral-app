import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import InviteForm from '@/components/InviteForm';
import { rate } from '@/lib/metrics';

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

  const referralUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup?ref=${currentUser.referralCode}`;
  const totalSignups = currentUser.inviterReferrals.length;
  const totalInvites = currentUser.invitesSent.length;
  
  // Count accepted invites: invites with ACCEPTED status OR invites linked to referrals
  // An invite is considered accepted if it has ACCEPTED status OR if it's linked to a referral
  const acceptedInvitesFromStatus = currentUser.invitesSent.filter(invite => invite.status === 'ACCEPTED').length;
  const acceptedInvitesFromReferrals = currentUser.inviterReferrals.filter(ref => ref.invite !== null).length;
  
  // Use the higher count (since a referral with linked invite should count as accepted)
  // This handles cases where someone signs up via referral link even if email doesn't match invite
  const acceptedInvites = Math.max(acceptedInvitesFromStatus, acceptedInvitesFromReferrals);
  
  // Also count invites that are explicitly marked as ACCEPTED OR linked to referrals
  const uniqueAcceptedInviteIds = new Set([
    ...currentUser.invitesSent.filter(invite => invite.status === 'ACCEPTED').map(invite => invite.id),
    ...currentUser.inviterReferrals.filter(ref => ref.invite !== null).map(ref => ref.invite!.id),
  ]);
  const acceptedInvitesCorrect = uniqueAcceptedInviteIds.size;
  
  // Conversion rate: accepted invites / total invites
  const conversionRate = rate(acceptedInvitesCorrect, totalInvites);
  
  // Referral conversion rate: total signups / total invites
  const referralConversionRate = rate(totalSignups, totalInvites);

  const referredEmails = currentUser.inviterReferrals.map((referral) => referral.signupUser);

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {currentUser.name || currentUser.email}!</p>
      </div>

    <section>
      <h2>Your Referral Link</h2>
      <div>
        <code>{referralUrl}</code>
      </div>
      <p>Share this link to invite friends and earn referrals!</p>
    </section>

    <section>
      <h2>Conversion Metrics</h2>
      <div>
        <div>
          <strong>Total Invites Sent:</strong> {totalInvites}
        </div>
        <div>
          <strong>Invites Accepted:</strong> {acceptedInvitesCorrect}
        </div>
        <div>
          <strong>Total Signups:</strong> {totalSignups}
        </div>
        <div>
          <strong>Invite Acceptance Rate:</strong> {conversionRate}%
        </div>
        <div>
          <strong>Referral Conversion Rate:</strong> {referralConversionRate}%
        </div>
      </div>
    </section>

    <section>
      <InviteForm />
    </section>

    {totalInvites > 0 && (
      <section>
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
      </section>
    )}

    {totalSignups > 0 && (
      <section>
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
      </section>
    )}

    {totalSignups === 0 && totalInvites === 0 && (
      <section>
        <p>Start inviting friends to see your conversion metrics!</p>
      </section>
    )}
    </main>
  );
}

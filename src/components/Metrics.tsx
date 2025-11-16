'use client';

import { ProgressBar } from '@adobe/react-spectrum';
import styles from './styles/metrics.module.css';

interface MetricsProps {
  totalInvites: number;
  acceptedInvites: number;
  totalSignups: number;
  conversionRate: number;
  referralConversionRate: number;
}

export default function Metrics({
    totalInvites,
    acceptedInvites,
    totalSignups,
    conversionRate,
    referralConversionRate
}: MetricsProps) {

  return (
    <div className={styles.metricsContainer}>
        <div> 
            <h2>Your Conversion Metrics</h2>
        </div>
        <div className={styles.metricsStatsRow}>
            <div>
                <strong>Total Invites Sent:</strong> {totalInvites}
            </div>
            <div>
                <strong>Invites Accepted:</strong> {acceptedInvites}
            </div>
            <div>
                <strong>Total Signups:</strong> {totalSignups}
            </div>
        </div>
        <div>
            <ProgressBar width="100%" label="Invite Acceptance Rate:" value={conversionRate} size="L" />
        </div>
        <div>
            <ProgressBar width="100%" label="Referral Conversion Rate:" value={referralConversionRate} size="L" />
        </div>
    </div>
  );
}



'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@adobe/react-spectrum';
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <main className={styles.homeWrapper}>
      <div className={styles.homeContent}>
        <div className={styles.homeHero}>
          <h1 className={styles.homeTitle}>
            Welcome to Referrly App
          </h1>
          <p className={styles.homeSubtitle}>
            Build and grow your network with our powerful referral system
          </p>
          <p className={styles.homeDescription}>
            Production-ready referral system built with Next.js, TypeScript, and PostgreSQL. 
            Create invites, track conversions, and manage your referrals effortlessly.
          </p>
        </div>

        <div className={styles.homeActions}>
          {session ? (
              <Button variant="cta" onPress={() => handleNavigate('/dashboard')}>
                Go to Dashboard
              </Button>
          ) : (
            <>
                <Button variant="cta" onPress={() => handleNavigate('/signup')}>
                  Get Started
                </Button>
                <Button variant="accent" style="outline" onPress={() => handleNavigate('/login')}>
                  Log In
                </Button>
            </>
          )}
        </div>

        <div className={styles.homeFeatures}>
          <div className={styles.featureCard}>
            <h3>📊 Track Metrics</h3>
            <p>Monitor your referral performance with detailed analytics and conversion rates</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📧 Send Invites</h3>
            <p>Easily invite friends via email with personalized referral links</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🔗 Share Links</h3>
            <p>Get your unique referral code and share it across any platform</p>
          </div>
        </div>
      </div>
    </main>
  );
}
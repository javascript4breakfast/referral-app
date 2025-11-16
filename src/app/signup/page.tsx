'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Form, TextField, Button } from '@adobe/react-spectrum';
import Link from 'next/link';
import RedirectLoader from '@/components/RedirectLoader';
import styles from './signup.module.css';

function SignupForm() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(urlRef || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleRedirect = async () => {
    // Automatically sign in the user after signup
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      // If auto-login fails, redirect to login page
      router.push('/login');
    }
  };

  // Use URL ref if available, otherwise use manual input
  const ref = urlRef || (referralCode.trim() || undefined);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ref: ref || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to create account',
        });
      } else {
        setMessage({
          type: 'success',
          text: `Success! Your account has been created. Your referral code is: ${data.user.referralCode}. Redirecting to dashboard...`,
        });
        setSignupSuccess(true);
        // Store email and password for auto-login (don't clear yet)
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          handleRedirect();
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return <RedirectLoader />;
  }

  // Show loading during signup success
  if (signupSuccess) {
    return (
      <RedirectLoader />
    );
  }

  return (
      <main>
        {urlRef && (
            <div className={styles.signupReferralMessage}>
                <p>
                    🎉 You were referred by someone!
                </p>
                <p>
                    Use code: <code>{urlRef}</code>
                </p>
            </div>
        )}

        <div className={styles.signupPageTitle}>
          <h1>Sign Up</h1>
          <p>
            Create your account to start inviting friends and earning referrals.
          </p>
        </div>


        <div className={styles.signupFormWrapper}>
            {message && (
                <div className={styles.signupMessage}>
                    <p>{message.text}</p>
                </div>
            )}
            <Form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(value) => setEmail(value)}
                    isDisabled={loading}
                />
                <TextField
                    label="Password"
                    value={password}
                    type="password"
                    onChange={(value) => setPassword(value)}
                    isDisabled={loading}
                    minLength={6}
                />
                <TextField
                    label="Referral Code (Optional)"
                    value={referralCode}
                    onChange={(value) => setReferralCode(value)}
                    isDisabled={loading || !!urlRef}
                    description={urlRef ? "Referral code is already set from the link." : undefined}
                />
                <div className={styles.signupFormButton}>
                  <div>
                      <p>Already have an account? <Link href="/login">Log in</Link></p>
                  </div>
                  <div>
                    <Button variant="cta" type="submit" isDisabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </div>
                </div>
            </Form>
        </div>
       
       
      </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

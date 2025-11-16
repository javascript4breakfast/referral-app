'use client';

import { useState, FormEvent, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, TextField, Button } from '@adobe/react-spectrum';
import RedirectLoader from '@/components/RedirectLoader';
import styles from './login.module.css';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return <RedirectLoader />;
  }

  return (
      <main>
        <div className={styles.loginPageTitle}>
          <h1>Log In</h1>
          <p>Sign in to your account to access your dashboard.</p>
        </div>

        <div className={styles.loginFormWrapper}>
          {error && (
            <div className={styles.loginMessage}>
              <p>{error}</p>
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
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              isDisabled={loading}
              minLength={6}
            />
            
            <div className={styles.loginFormButton}>
              <div>
                <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
              </div>
              <div>
                <Button variant="cta" type="submit" isDisabled={loading}>
                  {loading ? 'Signing In...' : 'Log In'}
                </Button>
              </div>
            </div>
          </Form>
        </div>

       
      </main>
  );
}


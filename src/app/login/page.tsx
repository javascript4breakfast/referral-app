'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, TextField, Button } from '@adobe/react-spectrum';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
      <main>
        <div>
          <h1>Log In</h1>
          <p>Sign in to your account to access your dashboard.</p>
        </div>

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        <div>
          <Form onSubmit={handleSubmit}>
            <div>
              <TextField
                label="Email"
                value={email}
                onChange={(value) => setEmail(value)}
                isDisabled={loading}
              />
            </div>

            <div>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(value) => setPassword(value)}
                isDisabled={loading}
                minLength={6}
              />
            </div>
            
            <div>
              <Button variant="cta" type="submit" isDisabled={loading}>
                {loading ? 'Signing In...' : 'Log In'}
              </Button>
            </div>
          </Form>
        </div>

        <div>
          <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
        </div>
      </main>
  );
}


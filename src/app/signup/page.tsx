'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

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
          text: `Success! Your account has been created. Your referral code is: ${data.user.referralCode}. Redirecting to login...`,
        });
        setSignupSuccess(true);
        setEmail('');
        setPassword('');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
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

  return (
    <main>
      <h1>Sign Up</h1>
      <p>
        Create your account to start inviting friends and earning referrals.
      </p>

      {ref && (
        <div>
          <p>
            🎉 You were referred by someone!
          </p>
          <p>
            Use code: <code>{ref}</code>
          </p>
        </div>
      )}

      {message && (
        <div>
          <p>{message.text}</p>
        </div>
      )}

      {!signupSuccess && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      )}

      {signupSuccess && (
        <div>
          <p>Redirecting to login...</p>
          <a href="/login">
            Go to Login
          </a>
        </div>
      )}

      <div>
        <p>Already have an account? <a href="/login">Log in</a></p>
      </div>
    </main>
  );
}


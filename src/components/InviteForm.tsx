'use client';

import { useState, FormEvent } from 'react';

export default function InviteForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send invite',
        });
      } else {
        setMessage({
          type: 'success',
          text: `Invite sent to ${data.invite.email}! Share this link: ${data.inviteUrl}`,
        });
        setEmail('');
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
    <div>
      <h2>Invite Friends</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="invite-email">Email Address</label>
          <input
            type="email"
            id="invite-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="friend@example.com"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Invite'}
        </button>
      </form>

      {message && (
        <div>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
}


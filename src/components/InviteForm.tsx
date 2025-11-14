'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Form, TextField, Button } from '@adobe/react-spectrum';

export default function InviteForm() {
  const router = useRouter();
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
        // Refresh the dashboard to update metrics and recent invites
        router.refresh();
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
      <div>
        <Form onSubmit={handleSubmit}>
            <div>      
                <TextField
                    label="Email Address"
                    value={email}
                    onChange={(value) => setEmail(value)}
                    isDisabled={loading}
                />
            </div>

            <div>
                <Button variant="cta" type="submit" isDisabled={loading}>
                    {loading ? 'Sending...' : 'Send Invite'}
                </Button>
            </div>
        </Form>
      </div>

      {message && (
        <div>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
}


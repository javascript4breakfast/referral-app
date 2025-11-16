'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Form, TextField, Button } from '@adobe/react-spectrum';
import styles from './styles/invite-form.module.css';

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
        // Build success message based on email delivery status
        let successText = `✅ Invite created for ${data.invite.email}!`;
        
        if (data.emailSent) {
          successText += ' 📧 Email sent with your referral link.';
        } else {
          successText += ` Share this link: ${data.inviteUrl}`;
        }
        
        setMessage({
          type: 'success',
          text: successText,
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
    <div className={styles.inviteFormWrapper}>
      <h2>Invite Friends</h2>
        <Form onSubmit={handleSubmit}>
          <div className={styles.inviteFormFieldsWrapper}>
              <TextField
                  label="Email Address"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  isDisabled={loading}
                  width="100%"
              />
              <div className={styles.inviteFormButtonWrapper}>
                <Button variant="cta" type="submit" isDisabled={loading}>
                  {loading ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
          </div>
        </Form>

      {message && (
        <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
}


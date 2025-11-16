import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInviteEmailParams {
  to: string;
  inviterName: string;
  inviteUrl: string;
}

/**
 * Sends an invitation email to a new user
 * In development without RESEND_API_KEY, logs to console instead
 */
export async function sendInviteEmail({
  to,
  inviterName,
  inviteUrl,
}: SendInviteEmailParams): Promise<{ success: boolean; error?: string }> {
  const subject = `${inviterName} invited you to join Referrly`;
  const html = generateInviteEmailHtml(inviterName, inviteUrl);
  const text = generateInviteEmailText(inviterName, inviteUrl);

  // If no API key is configured, log to console (development mode)
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email would be sent (no RESEND_API_KEY configured):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', text);
    console.log('Invite URL:', inviteUrl);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function generateInviteEmailHtml(inviterName: string, inviteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">You're Invited! 🎉</h1>
  </div>
  
  <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi there!</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>${inviterName}</strong> has invited you to join <strong>Referrly</strong>, 
      the best platform for managing and tracking your referrals.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Click the button below to sign up and get started:
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${inviteUrl}" 
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold;
                font-size: 16px;
                display: inline-block;">
        Accept Invitation
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 14px; color: #667eea; word-break: break-all;">
      ${inviteUrl}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      This invitation was sent to you by ${inviterName}. If you don't want to accept this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

function generateInviteEmailText(inviterName: string, inviteUrl: string): string {
  return `
You're Invited!

Hi there!

${inviterName} has invited you to join Referrly, the best platform for managing and tracking your referrals.

Click the link below to sign up and get started:
${inviteUrl}

If the link doesn't work, copy and paste it into your browser.

---
This invitation was sent to you by ${inviterName}. If you don't want to accept this invitation, you can safely ignore this email.
  `.trim();
}


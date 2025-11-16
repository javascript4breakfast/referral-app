'use client';

import { signOut } from 'next-auth/react';
import { ActionButton } from '@adobe/react-spectrum';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <ActionButton onPress={handleSignOut} isQuiet>
      Sign Out
    </ActionButton>
  );
}


'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button onClick={handleSignOut} type="button">
      Sign Out
    </button>
  );
}


'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SignOutButton from './SignOutButton';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <nav>
      <div>
        <Link href="/">
          <h1>Referral App</h1>
        </Link>

        <div>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/signup">
                Sign Up
              </Link>
              <Link href="/login">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


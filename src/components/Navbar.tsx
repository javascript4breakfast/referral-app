'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { ActionButton } from '@adobe/react-spectrum';
import SignOutButton from './SignOutButton';
import styles from './styles/navbar.module.css';

export default function Navbar() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ActionButton isQuiet onPress={() => handleNavigate('/')}>
          Referrly
        </ActionButton>
        <div className={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <ActionButton isQuiet onPress={() => handleNavigate('/dashboard')}>
                Dashboard
              </ActionButton>
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}


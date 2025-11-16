'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ActionButton } from '@adobe/react-spectrum';


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ActionButton
      isQuiet
      onPress={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </ActionButton>
  );
}


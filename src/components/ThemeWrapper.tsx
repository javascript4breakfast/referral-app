'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <div 
      style={{
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
        color: theme === 'dark' ? '#ededed' : '#171717',
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      {children}
    </div>
  );
}


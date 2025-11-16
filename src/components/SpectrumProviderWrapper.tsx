'use client';

import { Provider } from '@adobe/react-spectrum';
import { defaultTheme } from '@adobe/react-spectrum';
import { useTheme } from '@/contexts/ThemeContext';

export default function SpectrumProviderWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <Provider theme={defaultTheme} colorScheme={theme} minHeight="100vh">
      {children}
    </Provider>
  );
}


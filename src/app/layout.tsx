import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import "./globals.css";
import { SessionProvider } from '@/components/SessionProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SpectrumProviderWrapper from '@/components/SpectrumProviderWrapper';
import Navbar from '@/components/Navbar';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Referral App",
  description: "Referral App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider>
          <SessionProvider>
            <SpectrumProviderWrapper>
              <Navbar />
              {children}
            </SpectrumProviderWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

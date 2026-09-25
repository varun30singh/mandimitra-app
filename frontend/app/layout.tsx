import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/language-context';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Mandi Mitra (मंडी मित्र) | Smart Procurement & Farmer Assistant',
  description: 'Digital platform to eliminate farmer waiting time at agricultural procurement and mandi centres through smart scheduling, live queue tracking, and AI assistance.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-emerald-950 flex flex-col font-sans antialiased">
        <LanguageProvider>
          <AppShell>
            {children}
          </AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}

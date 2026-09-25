import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/language-context';
import { MobileHeader } from '../components/MobileHeader';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { ChatbotBubble } from '../components/ChatbotBubble';

export const metadata: Metadata = {
  title: 'Mandi Setu (मंडी सेतु) | Smart Procurement & Farmer Assistant',
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
          {/* Top Mobile Header: Mandi Setu Logo on left, Profile button on right */}
          <MobileHeader />

          {/* Main Mobile App Container */}
          <main className="flex-1 w-full max-w-md mx-auto bg-white px-3 sm:px-4 py-4 pb-24">
            {children}
          </main>

          {/* Floating AI Chatbot Assistant */}
          <ChatbotBubble />

          {/* 5-Button Bottom Navigation Bar */}
          <MobileBottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}

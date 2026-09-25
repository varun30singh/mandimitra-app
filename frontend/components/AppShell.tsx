'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { ChatbotBubble } from './ChatbotBubble';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <main className="flex-1 w-full max-w-md mx-auto bg-white px-3 sm:px-4 py-4 min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      {/* Top Mobile Header: Shown only when inside the farmer app */}
      <MobileHeader />

      {/* Main Mobile App Container */}
      <main className="flex-1 w-full max-w-md mx-auto bg-white px-3 sm:px-4 py-4 pb-24">
        {children}
      </main>

      {/* Floating AI Chatbot Assistant: Shown only inside the farmer app */}
      <ChatbotBubble />

      {/* 5-Button Bottom Navigation Bar: Shown only inside the farmer app */}
      <MobileBottomNav />
    </>
  );
};

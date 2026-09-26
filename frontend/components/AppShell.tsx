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

  const isFarmerPage = pathname.startsWith('/farmer');

  return (
    <>
      {/* Top Mobile Header */}
      <MobileHeader />

      {/* Main Mobile App Container */}
      <main className={`flex-1 w-full max-w-md mx-auto bg-white px-3 sm:px-4 py-4 ${isFarmerPage ? 'pb-24' : 'pb-8'}`}>
        {children}
      </main>

      {/* Floating AI Chatbot Assistant: Shown on farmer routes */}
      {isFarmerPage && <ChatbotBubble />}

      {/* 5-Button Bottom Navigation Bar: Shown only inside the farmer app */}
      {isFarmerPage && <MobileBottomNav />}
    </>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../lib/language-context';
import {
  Home,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguage();

  const handleChatbotClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mandimitra:toggle-chatbot'));
    }
  };

  const navButtons = [
    {
      id: 'home',
      label: language === 'hi' ? 'होम' : (language === 'mr' ? 'मुख्य' : 'Home'),
      href: '/farmer/dashboard',
      icon: Home,
      isActive: pathname === '/farmer/dashboard' || pathname === '/',
    },
    {
      id: 'book',
      label: language === 'hi' ? 'स्लॉट बुक' : (language === 'mr' ? 'स्लॉट बुक' : 'Book'),
      href: '/farmer/book',
      icon: Calendar,
      isActive: pathname === '/farmer/book',
    },
    {
      id: 'centres',
      label: language === 'hi' ? 'मंडी केंद्र' : (language === 'mr' ? 'खरेदी केंद्र' : 'Centres'),
      href: '/farmer/centres',
      icon: MapPin,
      isActive: pathname === '/farmer/centres',
    },
    {
      id: 'recent',
      label: language === 'hi' ? 'मेरा टोकन' : (language === 'mr' ? 'माझा टोकन' : 'My Token'),
      href: '/farmer/token',
      icon: Clock,
      isActive: pathname === '/farmer/token',
    },
    {
      id: 'chatbot',
      label: language === 'hi' ? 'सहायक' : (language === 'mr' ? 'सहाय्यक' : 'Chatbot'),
      action: handleChatbotClick,
      icon: MessageSquare,
      isSpecial: true,
      isActive: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-emerald-100 shadow-lg px-2 py-1.5 sm:py-2">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navButtons.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          if (item.action) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="flex flex-col items-center justify-center py-1 text-center transition group active:scale-95"
                aria-label={item.label}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:bg-emerald-800 transition -mt-2 ring-4 ring-white">
                  <Icon className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-[10px] font-bold text-emerald-950 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 text-center transition rounded-xl ${
                active ? 'text-emerald-900 font-black' : 'text-emerald-700/80 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${active ? 'bg-emerald-100 text-emerald-900' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

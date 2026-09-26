'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage, Language } from '../lib/language-context';
import {
  Wheat,
  Clock,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Menu,
  X,
  CreditCard,
  FileText,
  Activity,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith('/admin');

  const farmerNavItems = [
    { label: t('good_morning'), href: '/farmer/dashboard', icon: Wheat },
    { label: t('track_my_token'), href: '/farmer/token', icon: Clock },
    { label: t('get_recommendation'), href: '/farmer/recommendation', icon: Sparkles },
    { label: t('book_slot'), href: '/farmer/book', icon: Calendar },
    { label: t('nearby_centres'), href: '/farmer/centres', icon: MapPin },
    { label: t('payments'), href: '/farmer/payments', icon: CreditCard },
    { label: t('assisted_kiosk'), href: '/farmer/assisted', icon: User },
    { label: t('ivr_helpline'), href: '/ivr-simulator', icon: PhoneCall },
  ];

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Activity },
    { label: 'Digital Twin', href: '/admin/digital-twin', icon: Sparkles },
    { label: 'Live Queue & Calling', href: '/admin/queue', icon: Clock },
    { label: 'Centres', href: '/admin/centres', icon: MapPin },
    { label: 'Demand Intelligence', href: '/admin/demand', icon: Activity },
    { label: 'Procurement', href: '/admin/procurement', icon: Wheat },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', href: '/admin/analytics', icon: FileText },
    { label: 'Alerts', href: '/admin/alerts', icon: ShieldCheck },
    { label: 'Audit Log', href: '/admin/audit', icon: FileText },
  ];

  const currentNavItems = isAdmin ? adminNavItems : farmerNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner for Quick Demo Role Switching */}
      <div className="bg-emerald-800 text-emerald-50 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            SIH Demo Mode
          </span>
          <span className="hidden sm:inline">
            Smart Procurement Scheduling & Queue Intelligence
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-200">Switch View:</span>
          <Link
            href="/farmer/dashboard"
            className={`px-2 py-0.5 rounded font-medium transition ${
              !isAdmin ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            Farmer (Ramesh)
          </Link>
          <Link
            href="/admin/queue"
            className={`px-2 py-0.5 rounded font-medium transition ${
              pathname === '/admin/queue' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            Mandi Operator
          </Link>
          <Link
            href="/admin/dashboard"
            className={`px-2 py-0.5 rounded font-medium transition ${
              isAdmin && pathname !== '/admin/queue' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            District Admin
          </Link>
          <Link
            href="/ivr-simulator"
            className="text-amber-200 hover:text-amber-100 font-medium underline flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" /> Voice IVR
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Wheat className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-emerald-950 font-serif">
                  MANDIMITRA
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded border border-amber-300">
                  मंडीमित्र
                </span>
              </div>
              <p className="text-[10px] text-slate-700 hidden sm:block">
                No-Wait Digital Procurement
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentNavItems.slice(0, 6).map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-600'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'en'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'hi'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'mr'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
            </div>

            <Link
              href="/login"
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile / Login</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {currentNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-600'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wheat, User } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const MobileHeader: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-2xs px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left: Mandi Setu Logo */}
          <Link href="/farmer/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <Wheat className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-emerald-900 font-serif">
                  MANDI SETU
                </span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 tracking-wider">
                मंडी सेतु • किसान सेवा
              </p>
            </div>
          </Link>

          {/* Right: Farmer Profile Option */}
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-emerald-200 shadow-2xs transition active:scale-95"
            aria-label="Open Farmer Profile"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <User className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="hidden sm:block text-left text-xs pr-1">
              <span className="font-bold block leading-tight text-emerald-950">Ramesh</span>
              <span className="text-[10px] text-emerald-700 block leading-tight">Profile & Settings</span>
            </div>
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useLanguage } from '../lib/language-context';

export default function RootPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mandimitra_token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('mandimitra_user') : null;
    if (token) {
      let role = 'farmer';
      try {
        if (userStr) {
          const u = JSON.parse(userStr);
          role = String(u?.role || '').toLowerCase();
        }
      } catch (e) {}

      if (role === 'operator' || role === 'admin') {
        router.replace('/operator/dashboard');
      } else if (role === 'stockist') {
        router.replace('/stockist/dashboard');
      } else if (role === 'broker') {
        router.replace('/broker/dashboard');
      } else if (role === 'buyer') {
        router.replace('/buyer/dashboard');
      } else {
        router.replace('/farmer/dashboard');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm font-bold text-emerald-800">
        {t('loading_mandimitra')}
      </p>
    </div>
  );
}

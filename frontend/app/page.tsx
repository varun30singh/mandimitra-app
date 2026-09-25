'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mandimitra_token') : null;
    if (token) {
      router.replace('/farmer/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm font-bold text-emerald-800">
        Loading Mandi Mitra...
      </p>
    </div>
  );
}

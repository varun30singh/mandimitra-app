'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface StoredUser {
  id?: number | string;
  phone?: string;
  email?: string | null;
  role?: string;
  name?: string;
  fullName?: string;
  created_at?: string;
  preferred_language?: string | null;
}

export function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('mandimitra_token');
    const userStr = localStorage.getItem('mandimitra_user');

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser: StoredUser = JSON.parse(userStr);
      const role = String(parsedUser.role || '').toLowerCase();

      if (allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
        setUser(parsedUser);
        setAuthorized(true);
      } else {
        // Redirect to their actual role dashboard
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
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return { authorized, user };
}

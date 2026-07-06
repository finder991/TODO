'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearAuth, getUser } from './api';
import { User } from './types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUser(stored);
    }
    setReady(true);
  }, []);

  const logout = async () => {
    try { await api.logout(); } catch (e) {}
    clearAuth();
    router.replace('/login');
  };

  return { user, ready, logout };
}

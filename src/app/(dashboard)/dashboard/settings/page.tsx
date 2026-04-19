'use client';

import { GeneralSettings } from '@/components/dashboard/GeneralSettings';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !user.isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.isAdmin) return null;

  return <GeneralSettings />;
}

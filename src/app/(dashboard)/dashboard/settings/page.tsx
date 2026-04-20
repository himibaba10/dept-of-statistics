'use client';

import { GeneralSettings } from '@/components/dashboard/GeneralSettings';
import { useAuth } from '@/components/providers/AuthProvider';
import { isSeniorTeacher } from '@/lib/authHelpers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || (!user.isAdmin && !isSeniorTeacher(user))) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (!user.isAdmin && !isSeniorTeacher(user)))
    return null;

  return <GeneralSettings />;
}

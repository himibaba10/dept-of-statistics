'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (!isLoading && user) {
      if (
        pathname.startsWith('/admin') &&
        (user.role !== 'teacher' ||
          !('hasAdminAccess' in user && user.hasAdminAccess))
      ) {
        router.push('/');
      } else if (pathname.startsWith('/official') && user.role !== 'official') {
        router.push('/');
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className='p-8 text-center text-slate-500'>Loading dashboard...</div>
    );
  }

  return (
    <div className='flex min-h-screen bg-[#F8FAFC]'>
      {/* Sidebar */}
      <aside className='flex w-64 shrink-0 flex-col bg-[#1E3A8A] text-white'>
        <div className='p-6'>
          <Link
            href='/'
            className='block border-b border-white/20 pb-4 text-xl font-bold'
          >
            Dept. Dashboard
          </Link>
          <div className='mt-4 text-sm text-blue-200'>Welcome, {user.name}</div>
        </div>
        <nav className='mt-4 flex-1 space-y-2 px-4'>
          {user.role === 'official' && (
            <Link
              href='/official'
              className={`block rounded-md px-4 py-2 transition-colors ${pathname.startsWith('/official') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'}`}
            >
              Official Portal
            </Link>
          )}
          {user.role === 'teacher' &&
            'hasAdminAccess' in user &&
            user.hasAdminAccess && (
              <Link
                href='/admin'
                className={`block rounded-md px-4 py-2 transition-colors ${pathname.startsWith('/admin') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'}`}
              >
                Admin Portal
              </Link>
            )}
          <Link
            href='/profile/edit'
            className='block rounded-md px-4 py-2 transition-colors hover:bg-white/10'
          >
            My Profile
          </Link>
          <Link
            href='/'
            className='mt-8 block rounded-md px-4 py-2 transition-colors hover:bg-white/10'
          >
            ← Return to Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-8 py-8'>
        {children}
      </main>
    </div>
  );
}

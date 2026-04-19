'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { GraduationCap, LayoutDashboard, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not logged in — redirect officials to login, others to home
      if (pathname.startsWith('/official')) {
        router.push('/auth/official/login');
      } else {
        router.push('/');
      }
      return;
    }

    // Route guards
    if (
      pathname.startsWith('/admin') &&
      (user.role !== 'teacher' ||
        !('hasAdminAccess' in user && user.hasAdminAccess))
    ) {
      router.push('/');
    } else if (pathname.startsWith('/official') && user.role !== 'official') {
      router.push('/');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className='bg-surface flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <span className='bg-navy border-navy-light h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-sm text-slate-500'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    ...(user.role === 'official'
      ? [{ href: '/official', label: 'Official Portal', icon: LayoutDashboard }]
      : []),
    ...(user.role === 'teacher' &&
    'hasAdminAccess' in user &&
    user.hasAdminAccess
      ? [{ href: '/admin', label: 'Admin Portal', icon: LayoutDashboard }]
      : []),
    { href: '/profile/edit', label: 'My Profile', icon: User }
  ];

  return (
    <div className='bg-surface flex min-h-screen'>
      {/* Sidebar */}
      <aside className='bg-navy flex w-64 shrink-0 flex-col'>
        {/* Brand */}
        <div className='border-b border-white/10 p-6'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
              <GraduationCap size={17} className='text-white' />
            </div>
            <div className='flex flex-col leading-none'>
              <span className='font-serif text-sm font-bold text-white'>
                Dept. of Statistics
              </span>
              <span className='text-gold mt-0.5 text-[9px] font-semibold tracking-widest uppercase'>
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className='border-b border-white/10 px-5 py-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-navy-light text-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold'>
              {user.name.charAt(0)}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-white'>
                {user.name}
              </p>
              <p className='text-xs text-white/50 capitalize'>{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex-1 space-y-1 px-3 py-4'>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className='space-y-1 border-t border-white/10 px-3 py-4'>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/8 hover:text-white'
          >
            ← Back to Site
          </Link>
          <button
            onClick={() => {
              logout();
              router.push(
                user.role === 'official' ? '/auth/official/login' : '/'
              );
            }}
            className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/20 hover:text-red-300'
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-6xl px-8 py-8'>{children}</div>
      </main>
    </div>
  );
}

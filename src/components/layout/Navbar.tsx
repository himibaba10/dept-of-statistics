'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { href: '/students', label: 'Students' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/courses', label: 'Courses' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/notice-board', label: 'Notice Board' }
];

const DASHBOARD_ROUTES: Record<string, string> = {
  student: '/student',
  teacher: '/teacher',
  official: '/official'
};

function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isLoading)
    return <div className='h-8 w-8 animate-pulse rounded-full bg-slate-100' />;

  if (!user) {
    return (
      <div ref={ref} className='relative'>
        <button
          onClick={() => setOpen((v) => !v)}
          className='hover:border-navy/30 hover:bg-navy/5 text-navy flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold transition-all duration-200'
        >
          <User size={15} />
          Login
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className='absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-xl'>
            <p className='px-4 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
              Login as
            </p>
            <Link
              href='/auth/student/login'
              onClick={() => setOpen(false)}
              className='block px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50'
            >
              Student
            </Link>
            <Link
              href='/auth/teacher/login'
              onClick={() => setOpen(false)}
              className='block px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50'
            >
              Faculty
            </Link>
            <Link
              href='/auth/official/login'
              onClick={() => setOpen(false)}
              className='block px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50'
            >
              Official
            </Link>
          </div>
        )}
      </div>
    );
  }

  const dashboardHref = DASHBOARD_ROUTES[user.role] ?? '/';

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-2 transition-all duration-200 hover:shadow-sm'
      >
        <div className='bg-navy flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white'>
          {user.name.charAt(0)}
        </div>
        <div className='hidden text-left sm:block'>
          <p className='text-navy text-xs leading-none font-bold'>
            {user.name.split(' ')[0]}
          </p>
          <p className='mt-0.5 text-[10px] leading-none text-slate-400 capitalize'>
            {user.role}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className='absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-xl'>
          <div className='border-b border-slate-100 px-4 py-3'>
            <p className='text-navy text-sm font-bold'>{user.name}</p>
            <p className='mt-0.5 text-xs text-slate-400 capitalize'>
              {user.role}
            </p>
          </div>
          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50'
          >
            <LayoutDashboard size={15} className='text-navy' />
            Dashboard
          </Link>
          <Link
            href='/profile/edit'
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50'
          >
            <User size={15} className='text-navy' />
            My Profile
          </Link>
          <div className='my-1 border-t border-slate-100' />
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className='flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const dashboardHref = user ? (DASHBOARD_ROUTES[user.role] ?? '/') : '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full'>
      {/* Top info bar */}
      <div className='bg-navy-dark hidden py-2 text-xs text-white md:block'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6'>
          <div className='flex items-center gap-2 text-white/60'>
            <GraduationCap size={13} className='text-gold' />
            <span>University of Chittagong — Est. 1966</span>
          </div>
          <div className='flex items-center gap-5 text-white/60'>
            <span>statistics@cu.ac.bd</span>
            <span className='opacity-30'>|</span>
            <span>+880-31-726-310</span>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 shadow-[0_1px_24px_rgba(15,42,107,0.10)] backdrop-blur-md'
            : 'border-b border-slate-100 bg-white'
        }`}
      >
        <div className='mx-auto max-w-7xl px-6'>
          <div className='flex h-17 items-center justify-between gap-8'>
            {/* Logo */}
            <Link href='/' className='flex shrink-0 items-center gap-3'>
              <div className='bg-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
                <GraduationCap size={20} className='text-white' />
              </div>
              <div className='flex flex-col leading-none'>
                <span className='text-navy font-serif text-[17px] font-bold tracking-tight'>
                  Dept. of Statistics
                </span>
                <span className='text-gold mt-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase'>
                  University of Chittagong
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className='hidden flex-1 items-center justify-center gap-0.5 lg:flex'>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-slate-50 ${
                      active ? 'bg-navy-light text-navy' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className='bg-gold absolute right-4 bottom-1 left-4 h-0.5 rounded-full' />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: user menu + dashboard CTA */}
            <div className='hidden shrink-0 items-center gap-3 lg:flex'>
              <UserMenu />
              <Link
                href={dashboardHref}
                className='bg-navy flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md'
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className='rounded-md p-2 text-slate-600 transition-colors lg:hidden'
              onClick={() => setMobileOpen((v) => !v)}
              aria-label='Toggle menu'
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className='flex flex-col gap-1 border-t border-slate-100 bg-slate-50 px-6 py-5 lg:hidden'>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'bg-navy-light text-navy' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className='mt-2 flex flex-col gap-2.5 border-t border-slate-200 pt-3'>
              <UserMenu />
              <Link
                href={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className='bg-navy flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white'
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

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

function UserMenu() {
  const { user, login, logout, isLoading } = useAuth();
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
          className='hover:border-navy/30 hover:bg-navy/5 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200'
          style={{ borderColor: '#E2E8F0', color: '#0F2A6B' }}
        >
          <User size={15} />
          Login
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div
            className='absolute top-full right-0 z-50 mt-2 w-44 rounded-xl border bg-white py-2 shadow-xl'
            style={{ borderColor: '#E2E8F0' }}
          >
            <p
              className='px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase'
              style={{ color: '#94A3B8' }}
            >
              Login as
            </p>
            {(['student', 'teacher', 'official'] as const).map((role) => (
              <button
                key={role}
                onClick={() => {
                  login(role);
                  setOpen(false);
                }}
                className='w-full px-4 py-2.5 text-left text-sm font-medium capitalize transition-colors hover:bg-slate-50'
                style={{ color: '#1E293B' }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2.5 rounded-full border py-1.5 pr-3 pl-2 transition-all duration-200 hover:shadow-sm'
        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
      >
        <div
          className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white'
          style={{ backgroundColor: '#0F2A6B' }}
        >
          {user.name.charAt(0)}
        </div>
        <div className='hidden text-left sm:block'>
          <p
            className='text-xs leading-none font-bold'
            style={{ color: '#0F2A6B' }}
          >
            {user.name.split(' ')[0]}
          </p>
          <p
            className='mt-0.5 text-[10px] leading-none capitalize'
            style={{ color: '#94A3B8' }}
          >
            {user.role}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: '#94A3B8' }}
        />
      </button>

      {open && (
        <div
          className='absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border bg-white py-2 shadow-xl'
          style={{ borderColor: '#E2E8F0' }}
        >
          <div
            className='border-b px-4 py-3'
            style={{ borderColor: '#F1F5F9' }}
          >
            <p className='text-sm font-bold' style={{ color: '#0F2A6B' }}>
              {user.name}
            </p>
            <p
              className='mt-0.5 text-xs capitalize'
              style={{ color: '#94A3B8' }}
            >
              {user.role}
            </p>
          </div>
          <Link
            href='/admin'
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50'
            style={{ color: '#1E293B' }}
          >
            <LayoutDashboard size={15} style={{ color: '#0F2A6B' }} />
            Dashboard
          </Link>
          <Link
            href='/profile/edit'
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50'
            style={{ color: '#1E293B' }}
          >
            <User size={15} style={{ color: '#0F2A6B' }} />
            My Profile
          </Link>
          <div className='my-1 border-t' style={{ borderColor: '#F1F5F9' }} />
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className='flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-red-50'
            style={{ color: '#DC2626' }}
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className='sticky top-0 z-50 w-full'>
      {/* Top info bar */}
      <div
        className='hidden py-2 text-xs text-white md:block'
        style={{ backgroundColor: '#0A1628' }}
      >
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6'>
          <div
            className='flex items-center gap-2'
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <GraduationCap size={13} style={{ color: '#C9972B' }} />
            <span>University of Chittagong — Est. 1966</span>
          </div>
          <div
            className='flex items-center gap-5'
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
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
          <div className='flex h-[68px] items-center justify-between gap-8'>
            {/* Logo */}
            <Link href='/' className='flex shrink-0 items-center gap-3'>
              <div
                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#0F2A6B' }}
              >
                <GraduationCap size={20} className='text-white' />
              </div>
              <div className='flex flex-col leading-none'>
                <span
                  className='text-[17px] font-bold tracking-tight'
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#0F2A6B'
                  }}
                >
                  Dept. of Statistics
                </span>
                <span
                  className='mt-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase'
                  style={{ color: '#C9972B' }}
                >
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
                    className='relative rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200'
                    style={{
                      color: active ? '#0F2A6B' : '#475569',
                      backgroundColor: active ? '#EEF2FF' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          'transparent';
                    }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className='absolute right-4 bottom-1 left-4 h-0.5 rounded-full'
                        style={{ backgroundColor: '#C9972B' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: user menu + dashboard CTA */}
            <div className='hidden shrink-0 items-center gap-3 lg:flex'>
              <UserMenu />
              <Link
                href='/admin'
                className='flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md'
                style={{ backgroundColor: '#0F2A6B' }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className='rounded-md p-2 transition-colors lg:hidden'
              style={{ color: '#475569' }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label='Toggle menu'
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className='flex flex-col gap-1 border-t px-6 py-5 lg:hidden'
            style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFBFD' }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className='rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors'
                  style={{
                    color: active ? '#0F2A6B' : '#475569',
                    backgroundColor: active ? '#EEF2FF' : 'transparent'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div
              className='mt-2 flex flex-col gap-2.5 border-t pt-3'
              style={{ borderColor: '#E2E8F0' }}
            >
              <UserMenu />
              <Link
                href='/admin'
                className='flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white'
                style={{ backgroundColor: '#0F2A6B' }}
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

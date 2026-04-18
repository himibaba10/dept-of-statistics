'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Menu, X, GraduationCap, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/students', label: 'Students' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/courses', label: 'Courses' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/notice-board', label: 'Notice Board' },
];

function UserMenu() {
  const { user, login, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isLoading) return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;

  if (!user) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:border-navy/30 hover:bg-navy/5"
          style={{ borderColor: '#E2E8F0', color: '#0F2A6B' }}
        >
          <User size={15} />
          Login
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-44 rounded-xl border bg-white shadow-xl py-2 z-50"
            style={{ borderColor: '#E2E8F0' }}
          >
            <p className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>
              Login as
            </p>
            {(['student', 'teacher', 'official'] as const).map((role) => (
              <button
                key={role}
                onClick={() => { login(role); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium capitalize transition-colors hover:bg-slate-50"
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border transition-all duration-200 hover:shadow-sm"
        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: '#0F2A6B' }}
        >
          {user.name.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold leading-none" style={{ color: '#0F2A6B' }}>
            {user.name.split(' ')[0]}
          </p>
          <p className="text-[10px] capitalize leading-none mt-0.5" style={{ color: '#94A3B8' }}>
            {user.role}
          </p>
        </div>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: '#94A3B8' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border bg-white shadow-xl py-2 z-50"
          style={{ borderColor: '#E2E8F0' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-sm font-bold" style={{ color: '#0F2A6B' }}>{user.name}</p>
            <p className="text-xs capitalize mt-0.5" style={{ color: '#94A3B8' }}>{user.role}</p>
          </div>
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
            style={{ color: '#1E293B' }}
          >
            <LayoutDashboard size={15} style={{ color: '#0F2A6B' }} />
            Dashboard
          </Link>
          <Link
            href="/profile/edit"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
            style={{ color: '#1E293B' }}
          >
            <User size={15} style={{ color: '#0F2A6B' }} />
            My Profile
          </Link>
          <div className="border-t my-1" style={{ borderColor: '#F1F5F9' }} />
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium w-full text-left transition-colors hover:bg-red-50"
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
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top info bar */}
      <div className="hidden md:block text-white text-xs py-2" style={{ backgroundColor: '#0A1628' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <GraduationCap size={13} style={{ color: '#C9972B' }} />
            <span>University of Chittagong — Est. 1966</span>
          </div>
          <div className="flex items-center gap-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>statistics@cu.ac.bd</span>
            <span className="opacity-30">|</span>
            <span>+880-31-726-310</span>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-md shadow-[0_1px_24px_rgba(15,42,107,0.10)]'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-[68px] items-center justify-between gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#0F2A6B' }}
              >
                <GraduationCap size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-[17px] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#0F2A6B' }}
                >
                  Dept. of Statistics
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-0.5"
                  style={{ color: '#C9972B' }}
                >
                  University of Chittagong
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                    style={{
                      color: active ? '#0F2A6B' : '#475569',
                      backgroundColor: active ? '#EEF2FF' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: '#C9972B' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: user menu + dashboard CTA */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <UserMenu />
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: '#0F2A6B' }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: '#475569' }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t px-6 py-5 flex flex-col gap-1"
            style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFBFD' }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    color: active ? '#0F2A6B' : '#475569',
                    backgroundColor: active ? '#EEF2FF' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t flex flex-col gap-2.5" style={{ borderColor: '#E2E8F0' }}>
              <UserMenu />
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
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

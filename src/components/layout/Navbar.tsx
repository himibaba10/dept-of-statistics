'use client';

import { AuthSelector } from '@/components/auth/AuthSelector';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/students', label: 'Students' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/courses', label: 'Courses' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/notice-board', label: 'Notice Board' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(15,42,107,0.08)]'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* Top bar */}
      <div
        style={{ backgroundColor: 'var(--navy)' }}
        className="hidden md:block text-white text-xs py-1.5"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>
            University of Chittagong — Est. 1966
          </span>
          <div className="flex gap-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>statistics@cu.ac.bd</span>
            <span>+880-31-726-310</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span
              className="font-serif font-bold text-xl tracking-tight transition-colors"
              style={{ color: 'var(--navy)', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Dept. of Statistics
            </span>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
              University of Chittagong
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[var(--navy)] transition-colors duration-200 group"
                style={{ '--navy': '#0F2A6B' } as React.CSSProperties}
              >
                {link.label}
                <span
                  className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full"
                  style={{ backgroundColor: 'var(--gold)' }}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <AuthSelector />
            <Link
              href="/admin"
              className="px-4 py-2 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-slate-600"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <AuthSelector />
            <Link
              href="/admin"
              className="w-full text-center px-4 py-2 rounded-md text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--navy)' }}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

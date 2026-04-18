'use client';

import { AuthSelector } from '@/components/auth/AuthSelector';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/students', label: 'Students' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/courses', label: 'Courses' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/notice-board', label: 'Notice Board' }
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
          ? 'bg-white/95 shadow-[0_2px_20px_rgba(15,42,107,0.08)] backdrop-blur-md'
          : 'border-b border-slate-100 bg-white'
      }`}
    >
      {/* Top bar */}
      <div className='bg-navy hidden py-1.5 text-xs text-white md:block'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6'>
          <span className='font-medium tracking-wide text-white/90'>
            University of Chittagong — Est. 1966
          </span>
          <div className='flex gap-4 font-medium tracking-wide text-white/90'>
            <span>statistics@cu.ac.bd</span>
            <span>+880-31-726-310</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='group flex flex-col leading-tight'>
            <span
              className='text-navy font-serif text-xl font-bold tracking-tight transition-colors'
              style={{
                fontFamily: "'Playfair Display', Georgia, serif"
              }}
            >
              Dept. of Statistics
            </span>
            <span className='text-gold text-[10px] tracking-widest uppercase'>
              University of Chittagong
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden items-center gap-1 lg:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='hover:text-navy group relative px-4 py-2 text-sm font-semibold text-slate-600 transition-colors duration-200'
              >
                {link.label}
                <span className='bg-gold absolute right-4 bottom-1 left-4 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100' />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className='hidden items-center gap-3 lg:flex'>
            <AuthSelector />
            <Link
              href='/admin'
              className='bg-navy rounded-md px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md'
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className='rounded-md p-2 text-slate-600 lg:hidden'
            onClick={() => setMobileOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='flex flex-col gap-3 border-t border-slate-100 bg-white px-6 py-4 lg:hidden'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='py-1 text-sm font-semibold text-slate-700'
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className='flex flex-col gap-2 border-t border-slate-100 pt-2'>
            <AuthSelector />
            <Link
              href='/admin'
              className='bg-navy w-full rounded-md px-4 py-2 text-center text-sm font-semibold text-white'
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

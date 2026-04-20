'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='bg-navy-dark text-white'>
      {/* Main footer content */}
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
          {/* Brand col */}
          <div className='space-y-4'>
            <div>
              <h3 className='mb-1 font-serif text-2xl font-bold text-white'>
                Dept. of Statistics
              </h3>
              <p className='text-gold text-xs tracking-widest uppercase'>
                University of Chittagong
              </p>
            </div>
            <p className='text-sm leading-relaxed text-white/60'>
              Committed to excellence in statistical education, research, and
              analytical thinking since our establishment.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className='text-gold mb-5 text-sm font-semibold tracking-widest uppercase'>
              Quick Links
            </h4>
            <ul className='space-y-3'>
              {[
                { href: '/students', label: 'Students' },
                { href: '/teachers', label: 'Faculty' },
                { href: '/courses', label: 'Courses' },
                { href: '/notice-board', label: 'Notice Board' },
                { href: '/facilities', label: 'Facilities' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-white/60 transition-colors duration-200 hover:text-white'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-gold mb-5 text-sm font-semibold tracking-widest uppercase'>
              Contact
            </h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-sm text-white/60'>
                <MapPin size={16} className='text-gold mt-0.5 shrink-0' />
                Dept. of Statistics, University of Chittagong, Chattogram 4331
              </li>
              <li className='flex items-center gap-3 text-sm text-white/60'>
                <Mail size={16} className='text-gold shrink-0' />
                statistics@cu.ac.bd
              </li>
              <li className='flex items-center gap-3 text-sm text-white/60'>
                <Phone size={16} className='text-gold shrink-0' />
                +880-31-726-310
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-6 py-5 sm:flex-row'>
          <p className='text-xs text-white/40'>
            © {new Date().getFullYear()} Department of Statistics, University of
            Chittagong. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

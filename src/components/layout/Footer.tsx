'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--navy-dark, #0A1628)' }} className="text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand col */}
          <div className="space-y-4">
            <div>
              <h3
                className="font-bold text-2xl mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white' }}
              >
                Dept. of Statistics
              </h3>
              <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold, #C9972B)' }}>
                University of Chittagong
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Committed to excellence in statistical education, research, and analytical thinking since our establishment.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: 'var(--gold, #C9972B)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/students', label: 'Students' },
                { href: '/teachers', label: 'Faculty' },
                { href: '/courses', label: 'Courses' },
                { href: '/notice-board', label: 'Notice Board' },
                { href: '/facilities', label: 'Facilities' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: 'var(--gold, #C9972B)' }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold, #C9972B)' }} />
                Dept. of Statistics, University of Chittagong, Chattogram 4331
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Mail size={16} className="shrink-0" style={{ color: 'var(--gold, #C9972B)' }} />
                statistics@cu.ac.bd
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Phone size={16} className="shrink-0" style={{ color: 'var(--gold, #C9972B)' }} />
                +880-31-726-310
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Department of Statistics, University of Chittagong. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['About', 'Privacy Policy', 'Contact'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase().replace(' ', '-')}`}
                className="text-xs transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

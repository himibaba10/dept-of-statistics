import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-surface flex min-h-screen flex-col'>
      {/* Minimal header */}
      <header className='w-full border-b border-slate-100 bg-white'>
        <div className='mx-auto flex h-14 max-w-7xl items-center px-6'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='bg-navy flex h-8 w-8 items-center justify-center rounded-lg'>
              <GraduationCap size={17} className='text-white' />
            </div>
            <div className='flex flex-col leading-none'>
              <span className='text-navy font-serif text-sm font-bold tracking-tight'>
                Dept. of Statistics
              </span>
              <span className='text-gold text-[9px] font-semibold tracking-[0.15em] uppercase'>
                University of Chittagong
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className='flex flex-1 items-center justify-center px-4 py-12'>
        {children}
      </main>

      {/* Footer note */}
      <div className='py-4 text-center text-xs text-slate-400'>
        © {new Date().getFullYear()} Department of Statistics, University of
        Chittagong
      </div>
    </div>
  );
}

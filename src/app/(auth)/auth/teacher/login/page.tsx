'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Teacher } from '@/types';
import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Login failed.');
        return;
      }

      loginWithToken(
        data.data.user as Teacher,
        data.data.accessToken,
        data.data.refreshToken
      );
      // Teachers with isAdmin go to /dashboard, otherwise to public site
      const u = data.data.user;
      router.push(u.isAdmin ? '/dashboard' : '/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
        <div className='bg-navy h-1.5 w-full' />

        <div className='px-8 py-8'>
          <div className='mb-8'>
            <p className='text-gold mb-1 text-xs font-bold tracking-widest uppercase'>
              Faculty Portal
            </p>
            <h1 className='text-navy font-serif text-2xl font-bold'>
              Welcome back
            </h1>
            <p className='mt-1 text-sm text-slate-500'>
              Sign in with your email or phone number.
            </p>
          </div>

          {error && (
            <div className='mb-5 flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
              <AlertCircle size={15} className='shrink-0' />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                Email or Phone
              </label>
              <input
                name='identifier'
                type='text'
                autoComplete='username'
                placeholder='your@email.com or 01XXXXXXXXX'
                value={form.identifier}
                onChange={handleChange}
                className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all duration-200 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                Password
              </label>
              <div className='relative'>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='••••••••'
                  value={form.password}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm text-slate-800 transition-all duration-200 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='bg-navy mt-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
              ) : (
                <>
                  <LogIn size={15} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className='mt-6 flex items-center justify-between text-xs text-slate-500'>
            <Link
              href='/auth/teacher/register'
              className='text-navy font-semibold hover:underline'
            >
              Request access
            </Link>
            <Link href='/' className='transition-colors hover:text-slate-700'>
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

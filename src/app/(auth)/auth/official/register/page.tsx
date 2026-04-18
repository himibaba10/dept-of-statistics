'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// This would be validated server-side in a real implementation.
// For now it's a simple static code — replace with a real invite system later.
const VALID_INVITE_CODE = 'CUSTAT2025';

type Step = 'invite' | 'details';

export default function OfficialRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('invite');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — verify invite code
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim().toUpperCase() !== VALID_INVITE_CODE) {
      setInviteError('Invalid invite code. Please contact the administrator.');
      return;
    }
    setStep('details');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password) {
      setError('Name, phone, and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/official/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          password: form.password,
          bloodGroup: form.bloodGroup || undefined,
          address: {
            street: form.street || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            postalCode: form.postalCode || undefined
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Registration failed.');
        return;
      }

      // Store tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('officialUser', JSON.stringify(data.data.user));

      router.push('/official');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-lg'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
        {/* Top accent */}
        <div className='bg-navy h-1.5 w-full' />

        <div className='px-8 py-8'>
          {/* Heading */}
          <div className='mb-8'>
            <p className='text-gold mb-1 text-xs font-bold tracking-widest uppercase'>
              Official Portal
            </p>
            <h1
              className='text-navy text-2xl font-bold'
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Request Access
            </h1>
            <p className='mt-1 text-sm text-slate-500'>
              Official accounts require an invite code from the administrator.
            </p>
          </div>

          {/* Step indicator */}
          <div className='mb-8 flex items-center gap-3'>
            {(['invite', 'details'] as Step[]).map((s, i) => {
              const done = step === 'details' && s === 'invite';
              const active = step === s;
              return (
                <div key={s} className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        done
                          ? 'bg-green-500 text-white'
                          : active
                            ? 'bg-navy text-white'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {done ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-semibold capitalize ${
                        active
                          ? 'text-navy'
                          : done
                            ? 'text-green-600'
                            : 'text-slate-400'
                      }`}
                    >
                      {s === 'invite' ? 'Invite Code' : 'Your Details'}
                    </span>
                  </div>
                  {i === 0 && <div className='h-px w-6 bg-slate-200' />}
                </div>
              );
            })}
          </div>

          {/* Error */}
          {(error || inviteError) && (
            <div className='mb-5 flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
              <AlertCircle size={15} className='shrink-0' />
              {error || inviteError}
            </div>
          )}

          {/* ── Step 1: Invite code ── */}
          {step === 'invite' && (
            <form onSubmit={handleInviteSubmit} className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Invite Code
                </label>
                <input
                  type='text'
                  placeholder='Enter your invite code'
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setInviteError('');
                  }}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm tracking-widest text-slate-800 uppercase transition-all duration-200 outline-none placeholder:tracking-normal placeholder:text-slate-400 placeholder:normal-case focus:bg-white focus:ring-2'
                />
                <p className='text-xs text-slate-400'>
                  Don&apos;t have a code?{' '}
                  <Link
                    href='/'
                    className='text-navy font-semibold hover:underline'
                  >
                    Contact the administrator
                  </Link>
                </p>
              </div>

              <button
                type='submit'
                className='bg-navy mt-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md'
              >
                Verify Code
              </button>
            </form>
          )}

          {/* ── Step 2: Details form ── */}
          {step === 'details' && (
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
              {/* Personal info */}
              <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                Personal Information
              </p>

              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Full Name <span className='text-red-400'>*</span>
                  </label>
                  <input
                    name='name'
                    type='text'
                    placeholder='Mr. John Doe'
                    value={form.name}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Phone <span className='text-red-400'>*</span>
                  </label>
                  <input
                    name='phone'
                    type='tel'
                    placeholder='01XXXXXXXXX'
                    value={form.phone}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Email{' '}
                    <span className='font-normal text-slate-400 normal-case'>
                      (optional)
                    </span>
                  </label>
                  <input
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    value={form.email}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Blood Group{' '}
                    <span className='font-normal text-slate-400 normal-case'>
                      (optional)
                    </span>
                  </label>
                  <select
                    name='bloodGroup'
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:bg-white focus:ring-2'
                  >
                    <option value=''>Select</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <p className='pt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                Address{' '}
                <span className='font-normal normal-case'>(optional)</span>
              </p>

              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Street
                  </label>
                  <input
                    name='street'
                    type='text'
                    placeholder='123 Main St'
                    value={form.street}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    City
                  </label>
                  <input
                    name='city'
                    type='text'
                    placeholder='Chattogram'
                    value={form.city}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    State / Division
                  </label>
                  <input
                    name='state'
                    type='text'
                    placeholder='Chattogram Division'
                    value={form.state}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Postal Code
                  </label>
                  <input
                    name='postalCode'
                    type='text'
                    placeholder='4000'
                    value={form.postalCode}
                    onChange={handleChange}
                    className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                  />
                </div>
              </div>

              {/* Password */}
              <p className='pt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                Security
              </p>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Password <span className='text-red-400'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      placeholder='Min. 6 characters'
                      value={form.password}
                      onChange={handleChange}
                      className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((v) => !v)}
                      className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                    Confirm <span className='text-red-400'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      name='confirmPassword'
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete='new-password'
                      placeholder='Repeat password'
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirm((v) => !v)}
                      className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={loading}
                className='bg-navy mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? (
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                ) : (
                  <>
                    <UserPlus size={15} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className='mt-6 flex items-center justify-between text-xs text-slate-500'>
            <Link
              href='/auth/official/login'
              className='text-navy font-semibold hover:underline'
            >
              Already have an account? Sign in
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

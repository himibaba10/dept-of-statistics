'use client';

import { AlertCircle, CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DIVISIONS = [
  'Barishal',
  'Chattogram',
  'Dhaka',
  'Khulna',
  'Mymensingh',
  'Rajshahi',
  'Rangpur',
  'Sylhet'
];

export default function StudentRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    studentId: '',
    session: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.gender) {
      setError('Name, email, gender, and password are required.');
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
      const res = await fetch('/api/auth/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          password: form.password,
          bloodGroup: form.bloodGroup || undefined,
          gender: form.gender || undefined,
          studentId: form.studentId || undefined,
          session: form.session || undefined,
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

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='w-full max-w-md'>
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='bg-navy h-1.5 w-full' />
          <div className='flex flex-col items-center gap-4 px-8 py-12 text-center'>
            <div className='rounded-full bg-green-50 p-4'>
              <CheckCircle2 size={36} className='text-green-500' />
            </div>
            <div>
              <h2 className='text-navy mb-2 font-serif text-2xl font-bold'>
                Registration Submitted!
              </h2>
              <p className='text-sm leading-relaxed text-slate-500'>
                Your account is{' '}
                <span className='font-semibold text-amber-600'>
                  pending approval
                </span>
                . Your class representative will review and activate your
                account.
              </p>
            </div>
            <Link
              href='/auth/student/login'
              className='bg-navy mt-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90'
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-lg'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
        <div className='bg-navy h-1.5 w-full' />

        <div className='px-8 py-8'>
          <div className='mb-7'>
            <p className='text-gold mb-1 text-xs font-bold tracking-widest uppercase'>
              Student Portal
            </p>
            <h1 className='text-navy font-serif text-2xl font-bold'>
              Create Account
            </h1>
            <p className='mt-1 text-sm text-slate-500'>
              Register your student account to access the portal.
            </p>
          </div>

          {error && (
            <div className='mb-5 flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
              <AlertCircle size={15} className='shrink-0' />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
                  placeholder='Your full name'
                  value={form.name}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Email <span className='text-red-400'>*</span>
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
                  Phone{' '}
                  <span className='font-normal text-slate-400 normal-case'>
                    (optional)
                  </span>
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
                  Student ID
                </label>
                <input
                  name='studentId'
                  type='text'
                  placeholder='e.g. 2101'
                  value={form.studentId}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Session
                </label>
                <input
                  name='session'
                  type='text'
                  placeholder='e.g. 2021-2022'
                  value={form.session}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-wide text-slate-600 uppercase'>
                  Gender <span className='text-red-400'>*</span>
                </label>
                <select
                  name='gender'
                  value={form.gender}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:bg-white focus:ring-2'
                >
                  <option value=''>Select</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
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

            <p className='pt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
              Address
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
                  Division
                </label>
                <select
                  name='state'
                  value={form.state}
                  onChange={handleChange}
                  className='focus:border-navy focus:ring-navy/10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:bg-white focus:ring-2'
                >
                  <option value=''>Select Division</option>
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
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
                    tabIndex={-1}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
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
                    tabIndex={-1}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='bg-navy mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
              ) : (
                <>
                  <UserPlus size={15} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className='mt-6 flex items-center justify-between text-xs text-slate-500'>
            <Link
              href='/auth/student/login'
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

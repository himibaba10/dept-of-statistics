'use client';

import { Teacher } from '@/types';
import {
  ArrowLeft,
  Droplet,
  Mail,
  MapPin,
  Phone,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.role === 'teacher') {
          setTeacher(d.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className='bg-surface min-h-screen'>
        <div className='flex items-center justify-center py-40'>
          <span className='h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
        </div>
      </div>
    );
  }

  if (notFound || !teacher) {
    return (
      <div className='bg-surface min-h-screen'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20'>
          <UserIcon size={48} className='text-slate-300' />
          <p className='text-lg font-semibold text-slate-600'>
            Teacher not found
          </p>
          <Link
            href='/teachers'
            className='text-navy text-sm font-semibold hover:underline'
          >
            ← Back to faculty list
          </Link>
        </div>
      </div>
    );
  }

  const profileImage =
    teacher.imageUrl ||
    (teacher.gender === 'female'
      ? '/images/female-placeholder.webp'
      : '/images/male-placeholder.webp');

  const fullAddress = teacher.address
    ? [
        teacher.address.street,
        teacher.address.city,
        teacher.address.state,
        teacher.address.postalCode,
        teacher.address.country
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <div className='bg-surface min-h-screen'>
      {/* Page Hero Banner */}
      <div className='bg-navy relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.04]' />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <Link
            href='/teachers'
            className='text-gold mb-8 flex w-max items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors hover:text-white'
          >
            <ArrowLeft size={14} />
            Back to Faculty
          </Link>

          <div className='flex flex-col gap-8 md:flex-row md:items-end'>
            {/* Profile Avatar */}
            <div className='relative h-32 w-32 shrink-0 md:h-40 md:w-40'>
              <div className='absolute inset-0 rounded-2xl bg-white p-1.5 shadow-xl'>
                <div className='relative h-full w-full overflow-hidden rounded-xl bg-slate-100'>
                  <Image
                    src={profileImage}
                    alt={teacher.name}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            </div>

            {/* Header Info */}
            <div className='flex-1 pb-2'>
              {teacher.designation && (
                <div className='mb-3 inline-block'>
                  <span className='bg-gold/20 text-gold rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase'>
                    {teacher.designation}
                  </span>
                </div>
              )}
              <h1 className='font-serif text-3xl font-bold text-white md:text-5xl'>
                {teacher.name}
              </h1>
              {teacher.email && (
                <div className='mt-4 flex items-center gap-2 text-white/70'>
                  <Mail size={16} />
                  <span>{teacher.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Info */}
          <div className='lg:col-span-2'>
            <div className='rounded-2xl border border-slate-200 bg-white p-8'>
              <h2 className='text-navy mb-6 font-serif text-xl font-bold'>
                Contact & Personal Information
              </h2>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {teacher.email && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-indigo-50 p-2 text-indigo-600'>
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        Email Address
                      </p>
                      <a
                        href={`mailto:${teacher.email}`}
                        className='text-navy mt-0.5 font-semibold hover:underline'
                      >
                        {teacher.email}
                      </a>
                    </div>
                  </div>
                )}

                {teacher.phone && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-emerald-50 p-2 text-emerald-600'>
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        Phone Number
                      </p>
                      <a
                        href={`tel:${teacher.phone}`}
                        className='text-navy mt-0.5 font-semibold hover:underline'
                      >
                        {teacher.phone}
                      </a>
                    </div>
                  </div>
                )}

                {fullAddress && (
                  <div className='flex items-start gap-3 sm:col-span-2'>
                    <div className='mt-1 rounded-lg bg-amber-50 p-2 text-amber-600'>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        Location
                      </p>
                      <p className='text-navy mt-0.5 font-semibold'>
                        {fullAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <hr className='my-8 border-slate-100' />

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {teacher.gender && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-sky-50 p-2 text-sky-600'>
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        Gender
                      </p>
                      <p className='text-navy mt-0.5 font-semibold capitalize'>
                        {teacher.gender}
                      </p>
                    </div>
                  </div>
                )}

                {teacher.bloodGroup && (
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-rose-50 p-2 text-rose-600'>
                      <Droplet size={18} />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        Blood Group
                      </p>
                      <p className='text-navy mt-0.5 font-semibold uppercase'>
                        {teacher.bloodGroup}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extendable later for biography or courses */}
            {/* <div className='mt-8 rounded-2xl border border-slate-200 bg-white p-8'>
               Additional blocks...
            </div> */}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-28'>
              <div className='rounded-2xl border border-slate-200 bg-white p-6'>
                <h3 className='text-navy mb-4 font-serif text-lg font-bold'>
                  Quick Summary
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Designation
                    </p>
                    <p className='text-navy font-semibold capitalize'>
                      {teacher.designation || 'Faculty Member'}
                    </p>
                  </div>
                  <div>
                    <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Department
                    </p>
                    <p className='text-navy font-semibold'>Statistics</p>
                  </div>
                  <div>
                    <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Institution
                    </p>
                    <p className='text-navy font-semibold'>
                      University of Chittagong
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

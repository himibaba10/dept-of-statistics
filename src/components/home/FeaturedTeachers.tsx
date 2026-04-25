'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Teacher {
  _id: string;
  name: string;
  designation?: string;
  imageUrl?: string;
}

const DESIGNATION_ORDER = [
  'chairman',
  'professor',
  'associate-professor',
  'assistant-professor',
  'senior-lecturer',
  'lecturer',
  'adjunct-faculty'
];

export function FeaturedTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/users?role=teacher&status=active')
      .then((r) => r.json())
      .then((data) => {
        const all: Teacher[] = data?.data ?? [];

        // Sort from senior to junior
        all.sort((a, b) => {
          const ai = DESIGNATION_ORDER.indexOf(
            a.designation?.toLowerCase() ?? ''
          );
          const bi = DESIGNATION_ORDER.indexOf(
            b.designation?.toLowerCase() ?? ''
          );
          const aIdx = ai === -1 ? 999 : ai;
          const bIdx = bi === -1 ? 999 : bi;
          return aIdx - bIdx;
        });

        setTeachers(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && teachers.length === 0) return null;

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
    >
      {/* Section header */}
      <div className='mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-gold mb-2 text-xs font-bold tracking-widest uppercase'>
            Our Faculty
          </p>
          <h2 className='text-navy font-serif text-3xl font-bold'>
            Meet the Leadership
          </h2>
          <div className='bg-gold mt-3 h-1 w-12 rounded-full' />
        </div>
        <Link
          href='/teachers'
          className='border-navy text-navy hover:bg-navy shrink-0 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:text-white'
        >
          See All Faculty →
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='animate-pulse rounded-2xl border border-slate-100 bg-white p-5'
            >
              <div className='mx-auto mb-4 h-28 w-28 rounded-full bg-slate-100' />
              <div className='mx-auto mb-2 h-4 w-3/4 rounded bg-slate-100' />
              <div className='mx-auto h-3 w-1/2 rounded bg-slate-100' />
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className='group flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-5 py-7 text-center shadow-sm transition-shadow hover:shadow-md'
            >
              {/* Avatar */}
              <div className='relative mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50'>
                {teacher.imageUrl ? (
                  <Image
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    fill
                    className='object-cover'
                    sizes='112px'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <User size={36} className='text-slate-300' />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className='text-navy mb-1 font-serif text-base leading-snug font-bold'>
                {teacher.name}
              </h3>

              {/* Designation */}
              <p className='mb-5 text-xs font-semibold text-slate-400 capitalize'>
                {teacher.designation?.replace(/-/g, ' ') ?? 'Faculty'}
              </p>

              {/* View More */}
              <Link
                href={`/teachers/${teacher._id}`}
                className='bg-navy/5 text-navy hover:bg-navy mt-auto w-full rounded-lg py-2 text-xs font-semibold transition-colors hover:text-white'
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Mobile "See All" — shown below the grid on small screens, hidden on sm+ where header button is visible */}
      <div className='mt-8 flex justify-center sm:hidden'>
        <Link
          href='/teachers'
          className='bg-navy rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90'
        >
          See All Faculty →
        </Link>
      </div>
    </section>
  );
}

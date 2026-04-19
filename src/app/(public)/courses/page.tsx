'use client';

import { Course } from '@/types';
import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCourses(d.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='bg-surface min-h-screen'>
      {/* Hero */}
      <div className='bg-navy relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.04]' />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <div className='text-center'>
            <p className='text-gold mb-3 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase'>
              Department of Statistics
            </p>
            <h1 className='mb-3 font-serif text-4xl font-bold text-white md:text-5xl'>
              Our Courses
            </h1>
            <p className='mx-auto max-w-2xl text-base text-white/60'>
              Explore the comprehensive range of statistical programs and
              courses offered by the Department of Statistics, University of
              Chittagong.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-6 py-10 lg:px-8'>
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <h2 className='text-navy font-serif text-xl font-bold'>
                  All Courses
                </h2>
                <p className='mt-0.5 text-sm text-slate-400'>
                  {filtered.length} course{filtered.length !== 1 ? 's' : ''}{' '}
                  available
                </p>
              </div>
              <div className='relative'>
                <Search
                  size={15}
                  className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
                />
                <input
                  type='text'
                  placeholder='Search title or code...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='focus:border-navy w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-800 transition-all duration-200 outline-none sm:w-64'
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20'>
                <BookOpen size={40} className='mb-4 text-slate-300' />
                <p className='text-base font-semibold text-slate-600'>
                  No courses found
                </p>
                <p className='mt-1 text-sm text-slate-400'>
                  Try adjusting your search
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filtered.map((course) => (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className='group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,42,107,0.12)]'
                  >
                    {/* Thumbnail placeholder */}
                    <div className='relative flex h-48 items-center justify-center overflow-hidden bg-indigo-50 p-6'>
                      <BookOpen className='absolute -right-6 -bottom-6 h-24 w-24 rotate-12 text-[#1E3A8A]/10' />
                      <div className='absolute top-3 right-3'>
                        <span className='bg-navy rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white shadow'>
                          {course.code}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className='p-5'>
                      <h3 className='text-navy mb-2 font-serif text-base leading-snug font-bold'>
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className='line-clamp-2 text-sm text-slate-500'>
                          {course.description}
                        </p>
                      )}
                      <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-4'>
                        {course.syllabus?.length > 0 && (
                          <span className='text-navy rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold'>
                            {course.syllabus.length} syllabus page
                            {course.syllabus.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className='text-navy ml-auto text-xs font-semibold group-hover:underline'>
                          View details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

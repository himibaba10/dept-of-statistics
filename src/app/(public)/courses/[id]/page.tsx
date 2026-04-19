'use client';

import { Course } from '@/types';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCourse(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
        <BookOpen size={48} className='text-slate-300' />
        <p className='text-lg font-semibold text-slate-600'>Course not found</p>
        <Link
          href='/courses'
          className='text-navy text-sm font-semibold hover:underline'
        >
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-surface min-h-screen'>
      {/* Hero */}
      <div className='bg-navy relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.04]' />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <Link
            href='/courses'
            className='text-gold mb-6 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase hover:underline'
          >
            <ArrowLeft size={12} />
            All Courses
          </Link>
          <div className='flex flex-col gap-6 md:flex-row md:items-end'>
            <div className='flex-1'>
              <span className='bg-gold/20 text-gold mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase'>
                {course.code}
              </span>
              <h1 className='font-serif text-3xl font-bold text-white md:text-4xl'>
                {course.title}
              </h1>
              {course.description && (
                <p className='mt-3 max-w-2xl text-base text-white/70'>
                  {course.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-6 py-10 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row'>
          {/* Sidebar */}
          <div className='w-full shrink-0 lg:w-80'>
            <div className='sticky top-28'>
              <div className='mt-4 rounded-xl border border-slate-200 bg-white p-5'>
                <p className='mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                  Course Code
                </p>
                <p className='text-navy font-serif text-2xl font-bold'>
                  {course.code}
                </p>
                <div className='my-3 border-t border-slate-100' />
                <p className='mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                  Credit
                </p>
                <p className='text-navy font-serif text-xl font-bold'>
                  {course.credit}
                </p>
                {course.type && (
                  <>
                    <div className='my-3 border-t border-slate-100' />
                    <p className='mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Type
                    </p>
                    <p className='text-navy font-serif text-xl font-bold capitalize'>
                      {course.type}
                    </p>
                  </>
                )}
                {course.syllabus?.length > 0 && (
                  <>
                    <div className='my-3 border-t border-slate-100' />
                    <p className='mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      Syllabus
                    </p>
                    <p className='text-sm font-semibold text-slate-700'>
                      {course.syllabus.length} page
                      {course.syllabus.length !== 1 ? 's' : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus gallery */}
          <div className='min-w-0 flex-1'>
            {course.syllabus?.length > 0 ? (
              <>
                <h2 className='text-navy mb-6 font-serif text-2xl font-bold'>
                  Syllabus
                </h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {course.syllabus.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group relative block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
                    >
                      <div className='relative h-72 w-full bg-slate-50'>
                        <Image
                          src={url}
                          alt={`Syllabus page ${i + 1}`}
                          fill
                          className='object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]'
                        />
                      </div>
                      <div className='border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-center text-xs font-semibold text-slate-500'>
                        Page {i + 1}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center'>
                <BookOpen size={40} className='mb-4 text-slate-300' />
                <p className='font-semibold text-slate-500'>
                  No syllabus uploaded yet
                </p>
                <p className='mt-1 text-sm text-slate-400'>
                  Check back later for course materials
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

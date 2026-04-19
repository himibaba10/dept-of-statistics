'use client';

import { useReveal } from '@/hooks/useReveal';
import { ArrowUpRight, Bell } from 'lucide-react';
import Link from 'next/link';

const mockNotices = [
  {
    id: '1',
    title: 'Midterm Examination Schedule published for 2020-2021 Session',
    tag: 'Exam'
  },
  {
    id: '2',
    title:
      'Guest Lecture: Modern Applications of Machine Learning in Statistics',
    tag: 'Event'
  },
  {
    id: '3',
    title: 'Data Science Bootcamp Registration Open for All Students',
    tag: 'Registration'
  }
];

const tagColors: Record<string, string> = {
  Exam: 'bg-[#FEF3C7] text-[#92400E]',
  Event: 'bg-blue-100 text-blue-800',
  Registration: 'bg-green-100 text-green-800'
};

export function NoticeBoardPreview() {
  const ref = useReveal();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className='flex flex-col gap-8 lg:col-span-1'
    >
      {/* Section header */}
      <div className='flex items-end justify-between'>
        <div>
          <p className='text-gold mb-3 text-xs font-semibold tracking-widest uppercase'>
            Latest Updates
          </p>
          <h2 className='text-navy section-title pb-3 font-serif text-3xl font-bold'>
            Notice Board
          </h2>
        </div>
        <Link
          href='/notice-board'
          className='text-navy hover:text-gold mb-1 flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-colors'
        >
          View All
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Notices list */}
      <div className='flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white'>
        {/* Header strip */}
        <div className='bg-navy-light flex items-center gap-2 border-b border-slate-200 px-5 py-3'>
          <Bell size={14} className='text-navy' />
          <span className='text-navy text-xs font-semibold tracking-widest uppercase'>
            Recent Notices
          </span>
        </div>

        <div className='divide-y divide-slate-100'>
          {mockNotices.map((notice) => {
            const colors =
              tagColors[notice.tag] || 'bg-slate-100 text-slate-600';
            return (
              <div
                key={notice.id}
                className='group hover:border-l-gold cursor-pointer border-l-2 border-l-white px-5 py-4 transition-colors duration-200 hover:bg-slate-50'
              >
                {/* Tag + date */}
                <div className='mb-2 flex items-center justify-between'>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${colors}`}
                  >
                    {notice.tag}
                  </span>
                </div>

                {/* Title */}
                <p className='group-hover:text-navy text-sm leading-snug font-semibold text-slate-800 transition-colors duration-200'>
                  {notice.title}
                </p>

                {/* Gold left indicator on hover */}
                <div className='bg-gold absolute top-0 bottom-0 left-0 w-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className='border-t border-slate-100 bg-slate-50 p-4'>
          <Link
            href='/notice-board'
            className='bg-navy flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90'
          >
            Access Full Notice Board
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

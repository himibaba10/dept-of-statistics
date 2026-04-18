'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const mockNotices = [
  {
    id: '1',
    title: 'Midterm Examination Schedule published for 2020-2021 Session',
    date: 'April 18, 2026'
  },
  {
    id: '2',
    title: 'Guest Lecture: Modern Applications of Machine Learning',
    date: 'April 15, 2026'
  },
  {
    id: '3',
    title: 'Data Science Bootcamp Registration Open',
    date: 'April 10, 2026'
  }
];

export function NoticeBoardPreview() {
  return (
    <div className='flex flex-col gap-6 lg:col-span-1'>
      <div className='mb-2 flex items-center justify-between border-b border-slate-200 pb-2'>
        <h2 className='text-2xl font-bold tracking-wide text-[#1E3A8A] uppercase'>
          Notice Board
        </h2>
        <Link
          href='/notice-board'
          className='text-lg font-medium text-[#1E3A8A] hover:underline'
        >
          View All
        </Link>
      </div>

      <div className='flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm'>
        <div className='flex-1 divide-y divide-slate-100'>
          {mockNotices.map((notice) => (
            <div
              key={notice.id}
              className='group block h-full cursor-pointer p-5 transition-colors hover:bg-[#F8FAFC]'
            >
              <div className='mb-2 flex items-center gap-2 text-lg font-semibold text-slate-500'>
                <Calendar className='h-5 w-5 text-[#1E3A8A]' />
                {notice.date}
              </div>
              <h4 className='text-xl leading-snug font-semibold text-slate-800 transition-colors group-hover:text-[#1E3A8A]'>
                {notice.title}
              </h4>
            </div>
          ))}
        </div>
        <div className='mt-auto border-t border-slate-100 bg-slate-50 p-4'>
          <Link href='/notice-board'>
            <Button className='w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'>
              Access Full Notice Board
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

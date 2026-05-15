'use client';

import { useReveal } from '@/hooks/useReveal';
import { ArrowUpRight, Bell, FileText, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Notice {
  _id: string;
  title: string;
  body: string;
  type: string;
  attachmentUrl?: string;
  publishedBy?: { name: string };
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  notice: 'bg-blue-100 text-blue-800',
  event: 'bg-purple-100 text-purple-800',
  exam: 'bg-red-100 text-red-800',
  circular: 'bg-amber-100 text-amber-800',
  other: 'bg-slate-100 text-slate-800'
};

export function NoticeBoardPreview() {
  const ref = useReveal();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotices((d.data ?? []).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            <div className='flex flex-col items-center justify-center p-8'>
              <span className='h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#1E3A8A]' />
            </div>
          ) : notices.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-8 text-center'>
              <FileText size={24} className='mb-2 text-slate-300' />
              <p className='text-sm font-semibold text-slate-500'>
                No notices yet
              </p>
            </div>
          ) : (
            notices.map((notice) => {
              const colors =
                TYPE_COLORS[notice.type] || 'bg-slate-100 text-slate-600';
              return (
                <Link
                  href={`/notice-board/${notice._id}`}
                  key={notice._id}
                  className='group hover:border-l-gold block cursor-pointer border-l-2 border-l-white px-5 py-4 transition-colors duration-200 hover:bg-slate-50'
                >
                  {/* Tag + date */}
                  <div className='mb-2 flex items-center justify-between'>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${colors}`}
                    >
                      {notice.type}
                    </span>
                    <span className='relative text-[10px] font-semibold text-slate-400'>
                      {new Date(notice.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      <span>
                        {notice.attachmentUrl && (
                          <span className='flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A]'>
                            <Paperclip size={11} />
                            Includes Attachment
                          </span>
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <p className='group-hover:text-navy line-clamp-2 text-sm leading-snug font-semibold text-slate-800 transition-colors duration-200'>
                    {notice.title}
                  </p>

                  {/* Gold left indicator on hover */}
                  <div className='bg-gold absolute top-0 bottom-0 left-0 w-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
                </Link>
              );
            })
          )}
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

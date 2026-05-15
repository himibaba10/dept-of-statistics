'use client';

import { ArrowLeft, Clock, Paperclip, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const TYPE_COLORS: Record<string, { pill: string; bar: string }> = {
  notice: {
    pill: 'bg-blue-50 text-blue-700 border-blue-100',
    bar: 'bg-blue-500'
  },
  event: {
    pill: 'bg-purple-50 text-purple-700 border-purple-100',
    bar: 'bg-purple-500'
  },
  exam: {
    pill: 'bg-red-50 text-red-700 border-red-100',
    bar: 'bg-red-500'
  },
  circular: {
    pill: 'bg-amber-50 text-amber-700 border-amber-100',
    bar: 'bg-amber-500'
  },
  other: {
    pill: 'bg-slate-100 text-slate-600 border-slate-200',
    bar: 'bg-slate-400'
  }
};

interface Notice {
  _id: string;
  title: string;
  body: string;
  type: string;
  attachmentUrl?: string;
  publishedBy?: { name: string; role: string };
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/notices/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotice(d.data);
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

  if (notFound || !notice) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
        <p className='text-lg font-semibold text-slate-600'>Update not found</p>
        <Link
          href='/notice-board'
          className='text-navy text-sm font-semibold hover:underline'
        >
          ← Back to Notice Board
        </Link>
      </div>
    );
  }

  const colors = TYPE_COLORS[notice.type] ?? TYPE_COLORS.other;

  return (
    <div className='bg-surface min-h-screen pb-20'>
      {/* Top Banner */}
      <div className={`h-2 w-full ${colors.bar}`} />

      <div className='mx-auto max-w-4xl px-6 pt-10 lg:px-8'>
        <Link
          href='/notice-board'
          className='mb-8 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600'
        >
          <ArrowLeft size={14} />
          Notice Board
        </Link>

        {/* Content Card */}
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          {notice.attachmentUrl && (
            <div className='relative h-64 w-full bg-slate-100 sm:h-96'>
              <Image
                src={notice.attachmentUrl}
                alt={notice.title}
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 1024px'
                priority
              />
            </div>
          )}

          <div className='p-6 sm:p-10'>
            <div className='mb-6 flex flex-wrap items-center gap-3'>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase ${colors.pill}`}
              >
                {notice.type}
              </span>
              <div className='flex items-center gap-1.5 text-sm font-medium text-slate-400'>
                <Clock size={14} />
                {formatDate(notice.createdAt)}
              </div>
            </div>

            <h1 className='text-navy mb-8 font-serif text-3xl leading-tight font-bold sm:text-4xl'>
              {notice.title}
            </h1>

            <div className='prose prose-slate max-w-none leading-relaxed whitespace-pre-wrap text-slate-600'>
              {notice.body}
            </div>

            <div className='mt-10 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3 text-sm font-medium text-slate-500'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100'>
                  <User size={18} className='text-slate-400' />
                </div>
                <div>
                  <p className='text-xs text-slate-400'>Published by</p>
                  <p className='text-navy font-semibold'>
                    {notice.publishedBy?.name ?? 'Admin'}
                  </p>
                  {notice.publishedBy?.role && (
                    <p className='text-xs text-slate-400 capitalize'>
                      {notice.publishedBy.role}
                    </p>
                  )}
                </div>
              </div>

              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-navy flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
                >
                  <Paperclip size={16} />
                  View Original Attachment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

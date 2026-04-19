'use client';

import { Calendar, Clock, FileText, Filter, Paperclip } from 'lucide-react';
import Image from 'next/image';
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
  date: string;
  attachmentUrl?: string;
  publishedBy?: { name: string };
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotices(d.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Unique types present in data, preserve insertion order
  const types = Array.from(new Set(notices.map((n) => n.type)));

  const filtered =
    selectedType === null
      ? notices
      : notices.filter((n) => n.type === selectedType);

  return (
    <div className='bg-surface min-h-screen'>
      {/* Hero */}
      <div className='bg-navy relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.04]' />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <div className='text-center'>
            <p className='text-gold mb-3 text-xs font-bold tracking-widest uppercase'>
              Department of Statistics
            </p>
            <h1 className='mb-3 font-serif text-4xl font-bold text-white md:text-5xl'>
              Notice Board
            </h1>
            <p className='mx-auto max-w-lg text-base text-white/60'>
              Latest updates, announcements, and news from the department.
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
          <div className='flex flex-col gap-8 lg:flex-row'>
            {/* Sidebar */}
            <aside className='w-full shrink-0 lg:w-60'>
              <div className='sticky top-28 overflow-hidden rounded-2xl border border-slate-200 bg-white'>
                <div className='bg-navy-light flex items-center gap-2 border-b border-slate-100 px-5 py-4'>
                  <Filter size={14} className='text-navy' />
                  <span className='text-navy text-xs font-bold tracking-widest uppercase'>
                    Filter
                  </span>
                </div>

                <div className='p-3'>
                  <p className='mb-2 px-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                    Type
                  </p>
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 hover:bg-slate-50 ${
                      selectedType === null
                        ? 'bg-navy hover:bg-navy text-white'
                        : 'bg-transparent text-slate-600'
                    }`}
                  >
                    All Notices
                    <span
                      className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                        selectedType === null
                          ? 'bg-white/20 text-white'
                          : 'bg-navy-light text-navy'
                      }`}
                    >
                      {notices.length}
                    </span>
                  </button>
                  {types.map((t) => {
                    const count = notices.filter((n) => n.type === t).length;
                    const active = selectedType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold capitalize transition-all duration-150 hover:bg-slate-50 ${
                          active
                            ? 'bg-navy hover:bg-navy text-white'
                            : 'bg-transparent text-slate-600'
                        }`}
                      >
                        <span>{t}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-xs ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-navy-light text-navy'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main */}
            <section className='min-w-0 flex-1'>
              {/* Toolbar */}
              <div className='mb-7'>
                <h2 className='text-navy font-serif text-xl font-bold capitalize'>
                  {selectedType ?? 'All Notices'}
                </h2>
                <p className='mt-0.5 text-sm text-slate-400'>
                  {filtered.length} notice{filtered.length !== 1 ? 's' : ''}{' '}
                  found
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20'>
                  <FileText size={40} className='mb-4 text-slate-300' />
                  <p className='text-base font-semibold text-slate-600'>
                    No notices found
                  </p>
                  <p className='mt-1 text-sm text-slate-400'>
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                  {filtered.map((notice) => {
                    const colors =
                      TYPE_COLORS[notice.type] ?? TYPE_COLORS.other;
                    return (
                      <div
                        key={notice._id}
                        className='group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,42,107,0.12)]'
                      >
                        {/* Attachment image or color bar */}
                        {notice.attachmentUrl ? (
                          <div className='relative h-44 overflow-hidden bg-slate-100'>
                            <Image
                              src={notice.attachmentUrl}
                              alt={notice.title}
                              fill
                              className='object-cover transition-transform duration-500 group-hover:scale-105'
                              sizes='(max-width: 640px) 100vw, 33vw'
                            />
                          </div>
                        ) : (
                          <div className={`h-1.5 w-full ${colors.bar}`} />
                        )}

                        <div className='flex flex-1 flex-col p-5'>
                          {/* Type pill */}
                          <span
                            className={`mb-3 inline-block self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${colors.pill}`}
                          >
                            {notice.type}
                          </span>

                          {/* Title */}
                          <h3 className='text-navy mb-2 font-serif text-base leading-snug font-bold'>
                            {notice.title}
                          </h3>

                          {/* Body */}
                          <p className='mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600'>
                            {notice.body}
                          </p>

                          {/* Attachment link */}
                          {notice.attachmentUrl && (
                            <a
                              href={notice.attachmentUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline'
                            >
                              <Paperclip size={11} />
                              View Attachment
                            </a>
                          )}

                          {/* Footer — dates + publisher */}
                          <div className='mt-auto space-y-1.5 border-t border-slate-100 pt-3'>
                            <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                              <Calendar size={11} />
                              <span>
                                Notice date:{' '}
                                <span className='font-medium text-slate-600'>
                                  {formatDate(notice.date)}
                                </span>
                              </span>
                            </div>
                            <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                              <Clock size={11} />
                              <span>
                                Posted:{' '}
                                <span className='font-medium text-slate-600'>
                                  {formatDate(notice.createdAt)}
                                </span>
                              </span>
                            </div>
                            {notice.publishedBy && (
                              <p className='text-xs text-slate-400'>
                                By{' '}
                                <span className='font-medium text-slate-600'>
                                  {notice.publishedBy.name}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

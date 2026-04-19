'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';

const TYPE_COLORS: Record<string, string> = {
  notice: 'bg-blue-50 text-blue-700',
  event: 'bg-purple-50 text-purple-700',
  exam: 'bg-red-50 text-red-700',
  circular: 'bg-amber-50 text-amber-700',
  other: 'bg-slate-100 text-slate-600'
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

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotices(d.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = ['all', ...Array.from(new Set(notices.map((n) => n.type)))];
  const filtered =
    filter === 'all' ? notices : notices.filter((n) => n.type === filter);

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 text-[#0F172A]'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='mb-2 text-4xl font-bold tracking-tight text-[#1E3A8A]'>
            Notice Board
          </h1>
          <p className='text-lg text-slate-600'>
            Latest updates, announcements, and news from the department.
          </p>
        </div>

        {/* Type filter */}
        {!loading && types.length > 1 && (
          <div className='flex flex-wrap gap-2'>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  filter === t
                    ? 'bg-[#1E3A8A] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-24'>
          <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
        </div>
      ) : filtered.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 text-slate-400'>
          <FileText size={40} className='mb-3 text-slate-300' />
          <p className='text-base font-semibold'>No notices yet</p>
          <p className='mt-1 text-sm'>Check back later for updates.</p>
        </div>
      ) : (
        <div className='columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3'>
          {filtered.map((notice) => (
            <Card
              key={notice._id}
              className='break-inside-avoid overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md'
            >
              <CardHeader className='bg-white p-5 pb-3'>
                <div className='mb-3 flex items-center justify-between'>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TYPE_COLORS[notice.type] ?? TYPE_COLORS.other}`}
                  >
                    {notice.type}
                  </span>
                  <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                    <Calendar size={11} />
                    {new Date(notice.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <CardTitle className='text-xl leading-tight font-bold text-[#1E3A8A]'>
                  {notice.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='px-5 pb-5 text-sm text-slate-600'>
                <p className='leading-relaxed'>{notice.body}</p>

                {notice.attachmentUrl && (
                  <a
                    href={notice.attachmentUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline'
                  >
                    <Paperclip size={12} />
                    View Attachment
                  </a>
                )}

                {notice.publishedBy && (
                  <p className='mt-3 text-xs text-slate-400'>
                    Published by {notice.publishedBy.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

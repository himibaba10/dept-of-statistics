'use client';

import { useReveal } from '@/hooks/useReveal';
import { ArrowUpRight, Bell, Calendar } from 'lucide-react';
import Link from 'next/link';

const mockNotices = [
  {
    id: '1',
    title: 'Midterm Examination Schedule published for 2020-2021 Session',
    date: 'April 18, 2026',
    tag: 'Exam'
  },
  {
    id: '2',
    title:
      'Guest Lecture: Modern Applications of Machine Learning in Statistics',
    date: 'April 15, 2026',
    tag: 'Event'
  },
  {
    id: '3',
    title: 'Data Science Bootcamp Registration Open for All Students',
    date: 'April 10, 2026',
    tag: 'Registration'
  }
];

const tagColors: Record<string, { bg: string; text: string }> = {
  Exam: { bg: '#FEF3C7', text: '#92400E' },
  Event: { bg: '#DBEAFE', text: '#1E40AF' },
  Registration: { bg: '#DCFCE7', text: '#166534' }
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
          <p
            className='mb-3 text-xs font-semibold tracking-widest uppercase'
            style={{ color: 'var(--gold, #C9972B)' }}
          >
            Latest Updates
          </p>
          <h2
            className='section-title pb-3 text-3xl font-bold'
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'var(--navy, #0F2A6B)'
            }}
          >
            Notice Board
          </h2>
        </div>
        <Link
          href='/notice-board'
          className='mb-1 flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-colors'
          style={{ color: 'var(--navy, #0F2A6B)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--gold, #C9972B)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--navy, #0F2A6B)')
          }
        >
          View All
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Notices list */}
      <div
        className='flex flex-col overflow-hidden rounded-2xl border'
        style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
      >
        {/* Header strip */}
        <div
          className='flex items-center gap-2 border-b px-5 py-3'
          style={{ backgroundColor: '#EEF2FF', borderColor: '#E2E8F0' }}
        >
          <Bell size={14} style={{ color: 'var(--navy, #0F2A6B)' }} />
          <span
            className='text-xs font-semibold tracking-widest uppercase'
            style={{ color: 'var(--navy, #0F2A6B)' }}
          >
            Recent Notices
          </span>
        </div>

        <div
          className='divide-y'
          style={{ '--divide-color': '#F1F5F9' } as React.CSSProperties}
        >
          {mockNotices.map((notice, i) => {
            const colors = tagColors[notice.tag] || {
              bg: '#F1F5F9',
              text: '#475569'
            };
            return (
              <div
                key={notice.id}
                className='group hover:border-l-gold cursor-pointer border-l-2 border-l-white px-5 py-4 transition-colors duration-200'
                style={{ animationDelay: `${i * 0.08}s` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#F8FAFF')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {/* Tag + date */}
                <div className='mb-2 flex items-center justify-between'>
                  <span
                    className='rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase'
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {notice.tag}
                  </span>
                  <div
                    className='flex items-center gap-1.5 text-xs'
                    style={{ color: '#94A3B8' }}
                  >
                    <Calendar size={11} />
                    {notice.date}
                  </div>
                </div>

                {/* Title */}
                <p
                  className='text-sm leading-snug font-semibold transition-colors duration-200'
                  style={{ color: '#1E293B' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--navy, #0F2A6B)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#1E293B')
                  }
                >
                  {notice.title}
                </p>

                {/* Gold left indicator on hover */}
                <div
                  className='absolute top-0 bottom-0 left-0 w-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                  style={{ backgroundColor: 'var(--gold, #C9972B)' }}
                />
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div
          className='border-t p-4'
          style={{ borderColor: '#F1F5F9', backgroundColor: '#F8FAFC' }}
        >
          <Link
            href='/notice-board'
            className='flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90'
            style={{ backgroundColor: 'var(--navy, #0F2A6B)' }}
          >
            Access Full Notice Board
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

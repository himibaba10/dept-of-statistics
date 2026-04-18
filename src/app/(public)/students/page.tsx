'use client';

import { mockStudents } from '@/lib/mockData';
import { Filter, Search, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function StudentsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const sessions = Array.from(
    new Set(mockStudents.map((s) => s.session))
  ).sort();

  const filtered = mockStudents.filter((s) => {
    const matchSession = !selectedSession || s.session === selectedSession;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search);
    return matchSession && matchSearch;
  });

  return (
    <div className='bg-surface min-h-screen'>
      {/* Page Hero Banner */}
      <div className='bg-navy relative overflow-hidden'>
        {/* Background pattern */}
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-center'>
            <div className='text-center'>
              <p className='text-gold mb-3 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase'>
                Department of Statistics
              </p>
              <h1 className='mb-3 font-serif text-4xl font-bold text-white md:text-5xl'>
                Our Students
              </h1>
              <p
                className='text-base'
                style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '480px' }}
              >
                Meet the bright minds shaping the future of statistical sciences
                at the University of Chittagong.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-6 py-10 lg:px-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='w-full shrink-0 lg:w-60'>
            <div className='sticky top-28 overflow-hidden rounded-2xl border border-slate-200 bg-white'>
              {/* Sidebar header */}
              <div className='bg-navy-light flex items-center gap-2 border-b border-slate-100 px-5 py-4'>
                <Filter size={14} className='text-navy' />
                <span className='text-navy text-xs font-bold tracking-widest uppercase'>
                  Filter
                </span>
              </div>

              <div className='p-3'>
                <p className='mb-2 px-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                  Session
                </p>
                <button
                  onClick={() => setSelectedSession(null)}
                  className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 hover:bg-slate-50 ${selectedSession === null ? 'bg-navy hover:bg-navy text-white' : 'bg-transparent text-slate-600'}`}
                >
                  All Sessions
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${selectedSession === null ? 'bg-white/20 text-white' : 'bg-navy-light text-navy'}`}
                  >
                    {mockStudents.length}
                  </span>
                </button>
                {sessions.map((session) => {
                  const count = mockStudents.filter(
                    (s) => s.session === session
                  ).length;
                  const active = selectedSession === session;
                  return (
                    <button
                      key={session}
                      onClick={() => setSelectedSession(session)}
                      className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 hover:bg-slate-50 ${active ? 'bg-navy hover:bg-navy text-white' : 'bg-transparent text-slate-600'}`}
                    >
                      <span>{session}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-white/20 text-white' : 'bg-navy-light text-navy'}`}
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
            <div className='mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <h2 className='text-navy font-serif text-xl font-bold'>
                  {selectedSession
                    ? `${selectedSession} Batch`
                    : 'All Students'}
                </h2>
                <p className='mt-0.5 text-sm text-slate-400'>
                  {filtered.length} student{filtered.length !== 1 ? 's' : ''}{' '}
                  found
                </p>
              </div>

              {/* Search */}
              <div className='relative'>
                <Search
                  size={15}
                  className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
                />
                <input
                  type='text'
                  placeholder='Search name or ID...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='focus:border-navy w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-800 transition-all duration-200 outline-none sm:w-64'
                />
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20'>
                <Users size={40} className='mb-4 text-slate-300' />
                <p
                  className='text-base font-semibold'
                  style={{ color: '#475569' }}
                >
                  No students found
                </p>
                <p className='mt-1 text-sm' style={{ color: '#94A3B8' }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                {filtered.map((student) => (
                  <div
                    key={student._id}
                    className='group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,42,107,0.12)]'
                    style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                  >
                    {/* Photo */}
                    <div
                      className='relative h-52 overflow-hidden'
                      style={{ backgroundColor: '#EEF2FF' }}
                    >
                      <Image
                        src={student.imageUrl}
                        alt={student.name}
                        fill
                        className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
                      />
                      {/* CR badge */}
                      {student.isCR && (
                        <div className='absolute top-3 right-3'>
                          <span
                            className='flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-md'
                            style={{ backgroundColor: '#C9972B' }}
                          >
                            <Star size={10} fill='white' />
                            CR
                          </span>
                        </div>
                      )}
                      {/* Gradient */}
                      <div
                        className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                        style={{
                          background:
                            'linear-gradient(to top, rgba(15,42,107,0.3) 0%, transparent 60%)'
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className='p-5'>
                      <h3
                        className='mb-3 truncate text-base font-bold'
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: '#0F2A6B'
                        }}
                      >
                        {student.name}
                      </h3>

                      <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
                        {[
                          { label: 'Student ID', value: student.studentId },
                          { label: 'Blood Group', value: student.bloodGroup },
                          { label: 'Session', value: student.session }
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className={label === 'Session' ? 'col-span-2' : ''}
                          >
                            <p
                              className='mb-0.5 text-[10px] font-bold tracking-widest uppercase'
                              style={{ color: '#94A3B8' }}
                            >
                              {label}
                            </p>
                            <p
                              className='text-sm font-semibold'
                              style={{ color: '#1E293B' }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Bottom tag */}
                      <div
                        className='mt-4 flex items-center justify-between border-t pt-4'
                        style={{ borderColor: '#F1F5F9' }}
                      >
                        <span
                          className='rounded-full px-2.5 py-1 text-xs font-semibold'
                          style={{
                            backgroundColor: '#EEF2FF',
                            color: '#0F2A6B'
                          }}
                        >
                          {student.session}
                        </span>
                        {student.isCR && (
                          <span
                            className='rounded-full px-2.5 py-1 text-xs font-semibold'
                            style={{
                              backgroundColor: '#FDF6E3',
                              color: '#C9972B'
                            }}
                          >
                            Class Representative
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

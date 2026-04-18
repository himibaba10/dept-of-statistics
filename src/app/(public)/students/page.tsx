'use client';

import { mockStudents } from '@/lib/mockData';
import Image from 'next/image';
import { useState } from 'react';
import { Search, Users, Star, BookOpen, Filter } from 'lucide-react';

export default function StudentsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const sessions = Array.from(new Set(mockStudents.map((s) => s.session))).sort();

  const filtered = mockStudents.filter((s) => {
    const matchSession = !selectedSession || s.session === selectedSession;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search);
    return matchSession && matchSearch;
  });

  const totalCR = mockStudents.filter((s) => s.isCR).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      {/* Page Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0F2A6B' }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2"
                style={{ color: '#C9972B' }}
              >
                <span className="w-6 h-px inline-block" style={{ backgroundColor: '#C9972B' }} />
                Department of Statistics
              </p>
              <h1
                className="font-bold text-white text-4xl md:text-5xl mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Our Students
              </h1>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '480px' }}>
                Meet the bright minds shaping the future of statistical sciences at the University of Chittagong.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 shrink-0">
              {[
                { icon: Users, value: mockStudents.length, label: 'Total Students' },
                { icon: Star, value: totalCR, label: 'Class Reps' },
                { icon: BookOpen, value: sessions.length, label: 'Sessions' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: 'rgba(201,151,43,0.15)' }}
                  >
                    <Icon size={18} style={{ color: '#C9972B' }} />
                  </div>
                  <p
                    className="font-bold text-2xl leading-none"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white' }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] font-semibold tracking-wide uppercase mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <div
              className="sticky top-28 rounded-2xl border overflow-hidden"
              style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
            >
              {/* Sidebar header */}
              <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: '#F1F5F9', backgroundColor: '#EEF2FF' }}>
                <Filter size={14} style={{ color: '#0F2A6B' }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#0F2A6B' }}>
                  Filter
                </span>
              </div>

              <div className="p-3">
                <p className="text-[10px] font-bold tracking-widest uppercase px-2 mb-2" style={{ color: '#94A3B8' }}>
                  Session
                </p>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 mb-1"
                  style={{
                    backgroundColor: selectedSession === null ? '#0F2A6B' : 'transparent',
                    color: selectedSession === null ? 'white' : '#475569',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSession !== null)
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSession !== null)
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  All Sessions
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: selectedSession === null ? 'rgba(255,255,255,0.2)' : '#EEF2FF',
                      color: selectedSession === null ? 'white' : '#0F2A6B',
                    }}
                  >
                    {mockStudents.length}
                  </span>
                </button>
                {sessions.map((session) => {
                  const count = mockStudents.filter((s) => s.session === session).length;
                  const active = selectedSession === session;
                  return (
                    <button
                      key={session}
                      onClick={() => setSelectedSession(session)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 mb-1 flex items-center justify-between"
                      style={{
                        backgroundColor: active ? '#0F2A6B' : 'transparent',
                        color: active ? 'white' : '#475569',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{session}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#EEF2FF',
                          color: active ? 'white' : '#0F2A6B',
                        }}
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
          <section className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div>
                <h2
                  className="font-bold text-xl"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#0F2A6B' }}
                >
                  {selectedSession ? `${selectedSession} Batch` : 'All Students'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
                  {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200 w-full sm:w-64"
                  style={{
                    borderColor: '#E2E8F0',
                    backgroundColor: 'white',
                    color: '#1E293B',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0F2A6B')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                />
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 rounded-2xl border"
                style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
              >
                <Users size={40} style={{ color: '#CBD5E1' }} className="mb-4" />
                <p className="font-semibold text-base" style={{ color: '#475569' }}>No students found</p>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((student) => (
                  <div
                    key={student._id}
                    className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,42,107,0.12)]"
                    style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                  >
                    {/* Photo */}
                    <div className="relative h-52 overflow-hidden" style={{ backgroundColor: '#EEF2FF' }}>
                      <Image
                        src={student.imageUrl}
                        alt={student.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* CR badge */}
                      {student.isCR && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-white shadow-md"
                            style={{ backgroundColor: '#C9972B' }}
                          >
                            <Star size={10} fill="white" />
                            CR
                          </span>
                        </div>
                      )}
                      {/* Gradient */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(to top, rgba(15,42,107,0.3) 0%, transparent 60%)' }}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-base mb-3 truncate"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#0F2A6B' }}
                      >
                        {student.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                        {[
                          { label: 'Student ID', value: student.studentId },
                          { label: 'Blood Group', value: student.bloodGroup },
                          { label: 'Session', value: student.session },
                        ].map(({ label, value }) => (
                          <div key={label} className={label === 'Session' ? 'col-span-2' : ''}>
                            <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#94A3B8' }}>
                              {label}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Bottom tag */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: '#EEF2FF', color: '#0F2A6B' }}
                        >
                          {student.session}
                        </span>
                        {student.isCR && (
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: '#FDF6E3', color: '#C9972B' }}
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

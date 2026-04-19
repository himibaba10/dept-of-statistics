'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types';
import {
  Droplets,
  GraduationCap,
  Mail,
  Phone,
  Search,
  Users
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [session, setSession] = useState('');

  useEffect(() => {
    fetch('/api/users?role=student&status=active')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudents(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derive unique sessions from data
  const sessions = useMemo(() => {
    const set = new Set(students.map((s) => s.session).filter(Boolean));
    return Array.from(set).sort() as string[];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesSession = !session || s.session === session;
      return matchesSearch && matchesSession;
    });
  }, [students, search, session]);

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#1E3A8A]'>Students</h2>
        <p className='text-sm text-slate-600'>All active students.</p>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='relative flex-1'>
          <Search
            size={15}
            className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            placeholder='Search by name...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-800 transition outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10'
          />
        </div>
        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className='rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10'
        >
          <option value=''>All Sessions</option>
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>
              {loading
                ? 'Loading...'
                : `${filtered.length} student${filtered.length !== 1 ? 's' : ''}`}
            </CardTitle>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50'>
              <Users size={18} className='text-[#1E3A8A]' />
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <span className='h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
            </div>
          ) : filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <Users size={36} className='mb-3 text-slate-300' />
              <p className='font-semibold text-slate-500'>No students found</p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {filtered.map((student) => (
                <div
                  key={student._id}
                  className='flex items-center gap-4 px-5 py-4 hover:bg-slate-50'
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      student.imageUrl ??
                      (student.gender === 'female'
                        ? '/images/female-placeholder.webp'
                        : '/images/male-placeholder.webp')
                    }
                    alt={student.name}
                    className='h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='font-semibold text-slate-800'>
                      {student.name}
                      {student.isCR && (
                        <span className='ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1E3A8A] uppercase'>
                          CR
                        </span>
                      )}
                    </p>
                    {student.studentId && (
                      <p className='font-mono text-xs text-slate-400'>
                        ID: {student.studentId}
                      </p>
                    )}
                    <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500'>
                      {student.phone && (
                        <span className='flex items-center gap-1'>
                          <Phone size={11} />
                          {student.phone}
                        </span>
                      )}
                      {student.email && (
                        <span className='flex items-center gap-1'>
                          <Mail size={11} />
                          {student.email}
                        </span>
                      )}
                      {student.session && (
                        <span className='flex items-center gap-1'>
                          <GraduationCap size={11} />
                          {student.session}
                        </span>
                      )}
                      {student.bloodGroup && (
                        <span className='flex items-center gap-1'>
                          <Droplets size={11} />
                          {student.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

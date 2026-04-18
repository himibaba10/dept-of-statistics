'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockStudents } from '@/lib/mockData';
import Image from 'next/image';
import { useState } from 'react';

export default function StudentsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const sessions = Array.from(
    new Set(mockStudents.map((s) => s.session))
  ).sort();

  const filteredStudents = selectedSession
    ? mockStudents.filter((s) => s.session === selectedSession)
    : mockStudents;

  return (
    <div className='flex flex-col gap-8 text-[#0F172A] md:flex-row'>
      {/* Sidebar for filtering */}
      <aside className='w-full shrink-0 md:w-64'>
        <div className='sticky top-24 rounded-xl border border-slate-100 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-bold text-[#1E3A8A]'>
            Filter by Session
          </h2>
          <div className='space-y-2'>
            <button
              onClick={() => setSelectedSession(null)}
              className={`w-full rounded-md px-4 py-2 text-left transition-colors ${
                selectedSession === null
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-slate-700 hover:bg-[#DBEAFE]'
              }`}
            >
              All Sessions
            </button>
            {sessions.map((session) => (
              <button
                key={session}
                onClick={() => setSelectedSession(session)}
                className={`w-full rounded-md px-4 py-2 text-left transition-colors ${
                  selectedSession === session
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-700 hover:bg-[#DBEAFE]'
                }`}
              >
                {session}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content grid */}
      <section className='flex-1'>
        <h1 className='mb-6 text-3xl font-bold text-[#1E3A8A]'>
          {selectedSession ? `Students (${selectedSession})` : 'All Students'}
        </h1>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredStudents.map((student) => (
            <Card
              key={student._id}
              className='overflow-hidden border-slate-100 shadow-sm transition-shadow hover:shadow-md'
            >
              <CardContent className='p-0'>
                <div className='relative h-48 w-full bg-slate-100'>
                  <Image
                    src={student.imageUrl}
                    alt={student.name}
                    fill
                    className='object-cover object-top'
                  />
                </div>
                <div className='p-5'>
                  <div className='mb-2 flex items-start justify-between'>
                    <h3 className='text-lg font-bold text-[#1E3A8A]'>
                      {student.name}
                    </h3>
                    {student.isCR && (
                      <Badge className='bg-[#1E3A8A] text-xs text-white hover:bg-[#1E3A8A]/90'>
                        CR
                      </Badge>
                    )}
                  </div>
                  <div className='space-y-1 text-sm text-slate-600'>
                    <p>
                      <span className='font-semibold text-slate-800'>ID:</span>{' '}
                      {student.studentId}
                    </p>
                    <p>
                      <span className='font-semibold text-slate-800'>
                        Session:
                      </span>{' '}
                      {student.session}
                    </p>
                    <p>
                      <span className='font-semibold text-slate-800'>
                        Blood Group:
                      </span>{' '}
                      {student.bloodGroup}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredStudents.length === 0 && (
            <p className='col-span-full text-slate-500'>
              No students found for this session.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

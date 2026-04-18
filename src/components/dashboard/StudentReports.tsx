import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { mockStudents } from '@/lib/mockData';
import { Eye, Filter } from 'lucide-react';
import { useState } from 'react';

export function StudentReports() {
  const [selectedSession, setSelectedSession] = useState<string>('All');
  const sessions = [
    'All',
    ...Array.from(new Set(mockStudents.map((s) => s.session))).sort()
  ];

  const filteredStudents =
    selectedSession === 'All'
      ? mockStudents
      : mockStudents.filter((s) => s.session === selectedSession);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>Student Reports</h2>
          <p className='text-sm text-slate-600'>
            View academic performance and session-wise analytics.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-slate-500' />
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className='rounded-md border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20'
          >
            {sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <CardTitle className='text-lg'>Enrolled Students</CardTitle>
          <CardDescription>
            Records of students across all operating sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='flex max-h-150 flex-col divide-y divide-slate-100 overflow-y-auto'>
            {filteredStudents.length === 0 ? (
              <div className='p-8 text-center text-slate-500'>
                No students found for this session.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className='flex flex-col items-center justify-between gap-4 p-4 px-6 transition-colors hover:bg-slate-50 sm:flex-row'
                >
                  <div className='flex flex-1 items-center gap-4'>
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-semibold text-slate-800'>
                          {student.name}
                        </h4>
                        <span className='ml-4 block rounded-full bg-[#DBEAFE] px-2 py-0.5 text-sm font-medium text-[#1E3A8A] sm:hidden'>
                          {student.studentId}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 text-xs font-medium text-slate-500'>
                        <span className='rounded border border-slate-200 bg-slate-100 px-2 py-0.5'>
                          Session: {student.session}
                        </span>
                        {student.isCR && (
                          <span className='rounded border border-amber-200 bg-amber-100 px-2 py-0.5 text-amber-700'>
                            Class Representative
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex w-full shrink-0 items-center justify-between gap-4 sm:w-auto sm:justify-end'>
                    <span className='hidden rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-bold text-[#1E3A8A] sm:block'>
                      ID: {student.studentId}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 whitespace-nowrap shadow-sm'
                    >
                      <Eye className='mr-2 h-4 w-4' /> View Report
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

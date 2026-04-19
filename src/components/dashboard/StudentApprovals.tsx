'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { User } from '@/types';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PendingStudent {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  studentId?: string;
  session?: string;
  bloodGroup?: string;
  gender?: 'male' | 'female';
  status: string;
  createdAt: string;
}

function getAccessToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') ?? '';
}

interface Props {
  currentUser: User;
}

export function StudentApprovals({ currentUser }: Props) {
  const [students, setStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  // CR sees only their session; admin sees all
  const sessionFilter =
    !currentUser.isAdmin &&
    currentUser.role === 'student' &&
    currentUser.session
      ? `&session=${currentUser.session}`
      : '';

  const fetchPending = () => {
    setLoading(true);
    fetch(`/api/users?role=student&status=pending${sessionFilter}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudents(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`/api/users?role=student&status=pending${sessionFilter}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudents(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (id: string) => {
    setApproving(id);
    try {
      const token = getAccessToken();
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'active' })
      });

      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      // silent
    } finally {
      setApproving(null);
    }
  };

  const sessionLabel =
    !currentUser.isAdmin &&
    currentUser.role === 'student' &&
    currentUser.session
      ? ` — ${currentUser.session} batch`
      : '';

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#1E3A8A]'>
          Student Approvals{sessionLabel}
        </h2>
        <p className='text-sm text-slate-600'>
          Review and approve pending student registrations
          {sessionLabel ? ' from your batch' : ''}.
        </p>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Pending Students</CardTitle>
              <CardDescription>
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    {students.length} student
                    {students.length !== 1 ? 's' : ''} awaiting approval
                  </>
                )}
              </CardDescription>
            </div>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50'>
              <Clock size={18} className='text-amber-500' />
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <span className='h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
            </div>
          ) : students.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <Users size={36} className='mb-3 text-slate-300' />
              <p className='font-semibold text-slate-500'>
                No pending registrations
              </p>
              <p className='mt-1 text-sm text-slate-400'>All caught up!</p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {students.map((student) => (
                <div
                  key={student._id}
                  className='flex flex-col items-start justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          student.gender === 'female'
                            ? '/female-placeholder.webp'
                            : '/male-placeholder.webp'
                        }
                        alt={student.name}
                        className='h-8 w-8 rounded-full object-cover'
                      />
                      <h4 className='font-semibold text-slate-800'>
                        {student.name}
                      </h4>
                    </div>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1 pl-10 text-xs text-slate-500'>
                      {student.studentId && (
                        <span className='rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono'>
                          ID: {student.studentId}
                        </span>
                      )}
                      {student.session && (
                        <span>Session: {student.session}</span>
                      )}
                      <span>{student.phone}</span>
                      {student.email && <span>{student.email}</span>}
                      <span className='text-slate-400'>
                        Registered{' '}
                        {new Date(student.createdAt).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    size='sm'
                    disabled={approving === student._id}
                    onClick={() => approve(student._id)}
                    className='shrink-0 bg-green-600 hover:bg-green-700'
                  >
                    {approving === student._id ? (
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                    ) : (
                      <>
                        <CheckCircle2 className='mr-1.5 h-4 w-4' />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

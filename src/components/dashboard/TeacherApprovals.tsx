'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PendingTeacher {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  designation?: string;
  gender?: 'male' | 'female';
  status: string;
  createdAt: string;
}

export function TeacherApprovals() {
  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchPending = () => {
    setLoading(true);
    fetch('/api/users?role=teacher&status=pending')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeachers(d.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const approve = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetchWithAuth(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      if (res.ok) setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch {
      // silent
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#1E3A8A]'>Teacher Approvals</h2>
        <p className='text-sm text-slate-600'>
          Review and approve pending teacher registrations.
        </p>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Pending Teachers</CardTitle>
              <CardDescription>
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    {teachers.length} teacher
                    {teachers.length !== 1 ? 's' : ''} awaiting approval
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
          ) : teachers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <Users size={36} className='mb-3 text-slate-300' />
              <p className='font-semibold text-slate-500'>
                No pending registrations
              </p>
              <p className='mt-1 text-sm text-slate-400'>All caught up!</p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className='flex flex-col items-start justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          teacher.gender === 'female'
                            ? '/images/female-placeholder.webp'
                            : '/images/male-placeholder.webp'
                        }
                        alt={teacher.name}
                        className='h-8 w-8 rounded-full object-cover'
                      />
                      <h4 className='font-semibold text-slate-800'>
                        {teacher.name}
                      </h4>
                    </div>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1 pl-10 text-xs text-slate-500'>
                      {teacher.designation && (
                        <span className='rounded border border-slate-200 bg-slate-100 px-2 py-0.5 capitalize'>
                          {teacher.designation}
                        </span>
                      )}
                      <span>{teacher.phone}</span>
                      {teacher.email && <span>{teacher.email}</span>}
                      <span className='text-slate-400'>
                        Registered{' '}
                        {new Date(teacher.createdAt).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    size='sm'
                    disabled={approving === teacher._id}
                    onClick={() => approve(teacher._id)}
                    className='shrink-0 bg-green-600 hover:bg-green-700'
                  >
                    {approving === teacher._id ? (
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

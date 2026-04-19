'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Student } from '@/types';
import {
  ChevronDown,
  Droplets,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  session: string;
  currentUserId: string;
}

export function MyClassmates({ session, currentUserId }: Props) {
  const [classmates, setClassmates] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `/api/users?role=student&status=active&session=${encodeURIComponent(session)}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          // exclude self
          setClassmates(
            (d.data as Student[]).filter((s) => s._id !== currentUserId)
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, currentUserId]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const avatarSrc = (s: Student) =>
    s.imageUrl ??
    (s.gender === 'female'
      ? '/images/female-placeholder.webp'
      : '/images/male-placeholder.webp');

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#1E3A8A]'>My Classmates</h2>
        <p className='text-sm text-slate-600'>
          Active students in your batch — {session}.
        </p>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Batch {session}</CardTitle>
              <CardDescription>
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    {classmates.length} student
                    {classmates.length !== 1 ? 's' : ''}
                  </>
                )}
              </CardDescription>
            </div>
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
          ) : classmates.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <Users size={36} className='mb-3 text-slate-300' />
              <p className='font-semibold text-slate-500'>No classmates yet</p>
              <p className='mt-1 text-sm text-slate-400'>
                Approved students will appear here.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100'>
              {classmates.map((student) => {
                const isOpen = openId === student._id;
                const addressParts = [
                  student.address?.street,
                  student.address?.city,
                  student.address?.state,
                  student.address?.postalCode
                ].filter(Boolean);

                return (
                  <div key={student._id}>
                    {/* Accordion header */}
                    <button
                      onClick={() => toggle(student._id)}
                      className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50'
                    >
                      <div className='flex items-center gap-3'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarSrc(student)}
                          alt={student.name}
                          className='h-9 w-9 rounded-full object-cover ring-2 ring-slate-100'
                        />
                        <div>
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
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Accordion body */}
                    {isOpen && (
                      <div className='grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:grid-cols-2'>
                        {student.phone && (
                          <Detail
                            icon={<Phone size={13} />}
                            label='Phone'
                            value={student.phone}
                          />
                        )}
                        {student.email && (
                          <Detail
                            icon={<Mail size={13} />}
                            label='Email'
                            value={student.email}
                          />
                        )}
                        {student.bloodGroup && (
                          <Detail
                            icon={<Droplets size={13} />}
                            label='Blood Group'
                            value={student.bloodGroup}
                          />
                        )}
                        {student.session && (
                          <Detail
                            icon={<GraduationCap size={13} />}
                            label='Session'
                            value={student.session}
                          />
                        )}
                        {addressParts.length > 0 && (
                          <Detail
                            icon={<MapPin size={13} />}
                            label='Address'
                            value={addressParts.join(', ')}
                            wide
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  wide
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className='mt-0.5 text-slate-400'>{icon}</span>
      <div>
        <p className='text-[10px] font-semibold tracking-wide text-slate-400 uppercase'>
          {label}
        </p>
        <p className='text-sm text-slate-700'>{value}</p>
      </div>
    </div>
  );
}

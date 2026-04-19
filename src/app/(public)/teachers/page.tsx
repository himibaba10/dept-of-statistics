'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Teacher } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users?role=teacher&status=active')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeachers(d.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 text-[#0F172A]'>
      <div className='mb-4'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight text-[#1E3A8A]'>
          Faculty Members
        </h1>
        <p className='text-lg text-slate-600'>
          Meet our experienced and dedicated teaching staff.
        </p>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
        </div>
      ) : teachers.length === 0 ? (
        <div className='py-16 text-center text-slate-400'>
          No faculty members found.
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {teachers.map((teacher) => (
            <Card
              key={teacher._id}
              className='overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='relative h-64 w-full bg-slate-100'>
                {teacher.imageUrl ? (
                  <Image
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    fill
                    className='object-cover object-top'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center bg-indigo-50 text-4xl font-bold text-[#1E3A8A]'>
                    {teacher.name.charAt(0)}
                  </div>
                )}
              </div>
              <CardHeader className='border-b border-slate-100 bg-white p-5'>
                <CardTitle className='mb-1 text-xl font-bold text-[#1E3A8A]'>
                  {teacher.name}
                </CardTitle>
                {teacher.designation && (
                  <CardDescription className='text-sm font-semibold tracking-wide text-slate-600 uppercase'>
                    {teacher.designation}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className='space-y-4 bg-[#F8FAFC] p-5'>
                <div className='space-y-2 text-sm text-slate-700'>
                  {(teacher.email || teacher.phone) && (
                    <p>
                      <span className='mb-1 block border-b border-slate-200 pb-1 font-semibold text-slate-900'>
                        Contact Details
                      </span>
                      {teacher.email && (
                        <a
                          href={`mailto:${teacher.email}`}
                          className='block wrap-break-word text-[#1E3A8A] hover:underline'
                        >
                          {teacher.email}
                        </a>
                      )}
                      <span>{teacher.phone}</span>
                    </p>
                  )}
                  {teacher.address?.city && (
                    <p>
                      <span className='mt-2 mb-1 block border-b border-slate-200 pb-1 font-semibold text-slate-900'>
                        Location
                      </span>
                      {[teacher.address.street, teacher.address.city]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>

                {teacher.galleryUrls && teacher.galleryUrls.length > 0 && (
                  <div>
                    <h4 className='mb-2 text-xs font-semibold text-slate-500 uppercase'>
                      Activities / Gallery
                    </h4>
                    <div className='scrollbar-thin scrollbar-thumb-slate-300 flex gap-2 overflow-x-auto pb-2'>
                      {teacher.galleryUrls.map((url, i) => (
                        <div
                          key={i}
                          className='relative h-16 w-16 shrink-0 overflow-hidden rounded border border-slate-200'
                        >
                          <Image
                            src={url}
                            alt={`Gallery image ${i}`}
                            fill
                            className='object-cover'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

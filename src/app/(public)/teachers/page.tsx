'use client';

import { Teacher } from '@/types';
import { Filter, Search, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DESIGNATION_ORDER = [
  'chairman',
  'professor',
  'associate-professor',
  'assistant-professor',
  'senior-lecturer',
  'lecturer',
  'adjunct-faculty'
];

function sortByDesignation(teachers: Teacher[]): Teacher[] {
  return [...teachers].sort((a, b) => {
    const ai = DESIGNATION_ORDER.indexOf((a.designation ?? '').toLowerCase());
    const bi = DESIGNATION_ORDER.indexOf((b.designation ?? '').toLowerCase());
    // Unknown designations go to end
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/users?role=teacher&status=active')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeachers(sortByDesignation(d.data ?? []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Unique designations present in data, in rank order
  const designations = DESIGNATION_ORDER.filter((d) =>
    teachers.some((t) => (t.designation ?? '').toLowerCase() === d)
  );

  const filtered = teachers.filter((t) => {
    const matchDesignation =
      !selectedDesignation ||
      (t.designation ?? '').toLowerCase() === selectedDesignation;
    const matchSearch =
      !search || t.name.toLowerCase().includes(search.toLowerCase());
    return matchDesignation && matchSearch;
  });

  return (
    <div className='bg-surface min-h-screen'>
      {/* Page Hero Banner */}
      <div className='bg-navy relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.04]' />
        <div className='relative mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-center'>
            <div className='text-center'>
              <p className='text-gold mb-3 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase'>
                Department of Statistics
              </p>
              <h1 className='mb-3 font-serif text-4xl font-bold text-white md:text-5xl'>
                Our Faculty
              </h1>
              <p className='mx-auto max-w-120 text-base text-white/60'>
                Meet the dedicated educators and researchers driving academic
                excellence at the University of Chittagong.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-6 py-10 lg:px-8'>
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <span className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]' />
          </div>
        ) : (
          <div className='flex flex-col gap-8 lg:flex-row'>
            {/* Sidebar */}
            <aside className='w-full shrink-0 lg:w-60'>
              <div className='sticky top-28 overflow-hidden rounded-2xl border border-slate-200 bg-white'>
                <div className='bg-navy-light flex items-center gap-2 border-b border-slate-100 px-5 py-4'>
                  <Filter size={14} className='text-navy' />
                  <span className='text-navy text-xs font-bold tracking-widest uppercase'>
                    Filter
                  </span>
                </div>

                <div className='p-3'>
                  <p className='mb-2 px-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                    Designation
                  </p>
                  <button
                    onClick={() => setSelectedDesignation(null)}
                    className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 hover:bg-slate-50 ${
                      selectedDesignation === null
                        ? 'bg-navy hover:bg-navy text-white'
                        : 'bg-transparent text-slate-600'
                    }`}
                  >
                    All Faculty
                    <span
                      className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                        selectedDesignation === null
                          ? 'bg-white/20 text-white'
                          : 'bg-navy-light text-navy'
                      }`}
                    >
                      {teachers.length}
                    </span>
                  </button>
                  {designations.map((d) => {
                    const count = teachers.filter(
                      (t) => (t.designation ?? '').toLowerCase() === d
                    ).length;
                    const active = selectedDesignation === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setSelectedDesignation(d)}
                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold capitalize transition-all duration-150 hover:bg-slate-50 ${
                          active
                            ? 'bg-navy hover:bg-navy text-white'
                            : 'bg-transparent text-slate-600'
                        }`}
                      >
                        <span>{d.replace(/-/g, ' ')}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-xs ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-navy-light text-navy'
                          }`}
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
                  <h2 className='text-navy font-serif text-xl font-bold capitalize'>
                    {selectedDesignation
                      ? selectedDesignation.replace(/-/g, ' ')
                      : 'All Faculty'}
                  </h2>
                  <p className='mt-0.5 text-sm text-slate-400'>
                    {filtered.length} member{filtered.length !== 1 ? 's' : ''}{' '}
                    found
                  </p>
                </div>

                <div className='relative'>
                  <Search
                    size={15}
                    className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
                  />
                  <input
                    type='text'
                    placeholder='Search by name...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='focus:border-navy w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-800 transition-all duration-200 outline-none sm:w-64'
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20'>
                  <Users size={40} className='mb-4 text-slate-300' />
                  <p className='text-base font-semibold text-slate-600'>
                    No faculty found
                  </p>
                  <p className='mt-1 text-sm text-slate-400'>
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
                  {filtered.map((teacher) => (
                    <Link
                      href={`/teachers/${teacher._id}`}
                      key={teacher._id}
                      className='group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,42,107,0.12)]'
                    >
                      <div className='relative h-80 overflow-hidden bg-indigo-50'>
                        <Image
                          src={
                            teacher.imageUrl ||
                            (teacher.gender === 'female'
                              ? '/images/female-placeholder.webp'
                              : '/images/male-placeholder.webp')
                          }
                          alt={teacher.name}
                          fill
                          className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
                        />
                        {teacher.designation && (
                          <div className='absolute top-3 right-3'>
                            <span className='bg-navy/80 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white capitalize shadow-md backdrop-blur-sm'>
                              {teacher.designation.replace(/-/g, ' ')}
                            </span>
                          </div>
                        )}
                        <div className='from-navy/30 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                      </div>

                      <div className='p-5'>
                        <h3 className='text-navy mb-3 truncate font-serif text-base font-bold'>
                          {teacher.name}
                        </h3>

                        <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
                          {teacher.bloodGroup && (
                            <div>
                              <p className='mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                                Blood Group
                              </p>
                              <p className='text-sm font-semibold text-slate-800'>
                                {teacher.bloodGroup}
                              </p>
                            </div>
                          )}
                          {teacher.gender && (
                            <div>
                              <p className='mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                                Gender
                              </p>
                              <p className='text-sm font-semibold text-slate-800 capitalize'>
                                {teacher.gender}
                              </p>
                            </div>
                          )}
                          {teacher.email && (
                            <div className='col-span-2'>
                              <p className='mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                                Email
                              </p>
                              <p className='truncate text-sm font-semibold text-slate-800'>
                                {teacher.email}
                              </p>
                            </div>
                          )}
                          {teacher.phone && (
                            <div className='col-span-2'>
                              <p className='mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                                Phone
                              </p>
                              <p className='text-sm font-semibold text-slate-800'>
                                {teacher.phone}
                              </p>
                            </div>
                          )}
                          {teacher.address &&
                            Object.values(teacher.address).filter(Boolean)
                              .length > 0 && (
                              <div className='col-span-2'>
                                <p className='mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                                  Address
                                </p>
                                <p className='text-sm font-semibold text-slate-800'>
                                  {[
                                    teacher.address.street,
                                    teacher.address.city,
                                    teacher.address.state,
                                    teacher.address.postalCode,
                                    teacher.address.country
                                  ]
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              </div>
                            )}
                        </div>

                        <div className='mt-4 border-t border-slate-100 pt-4'>
                          {teacher.designation && (
                            <span className='text-navy rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize'>
                              {teacher.designation}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

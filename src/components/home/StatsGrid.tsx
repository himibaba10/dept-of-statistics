'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Building2, GraduationCap, UserCheck } from 'lucide-react';

export function StatsGrid() {
  return (
    <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      <Card className='group border-slate-100 py-6 text-center shadow-sm transition-shadow hover:shadow-md'>
        <CardContent className='flex flex-col items-center justify-center gap-3 p-0'>
          <div className='rounded-full bg-[#DBEAFE] p-4 transition-transform group-hover:scale-110'>
            <GraduationCap className='h-8 w-8 text-[#1E3A8A]' />
          </div>
          <h3 className='text-4xl font-bold text-[#1E3A8A]'>450+</h3>
          <p className='font-medium text-slate-600'>Students</p>
        </CardContent>
      </Card>

      <Card className='group border-slate-100 py-6 text-center shadow-sm transition-shadow hover:shadow-md'>
        <CardContent className='flex flex-col items-center justify-center gap-3 p-0'>
          <div className='rounded-full bg-[#DBEAFE] p-4 transition-transform group-hover:scale-110'>
            <UserCheck className='h-8 w-8 text-[#1E3A8A]' />
          </div>
          <h3 className='text-4xl font-bold text-[#1E3A8A]'>25+</h3>
          <p className='font-medium text-slate-600'>Teachers</p>
        </CardContent>
      </Card>

      <Card className='group border-slate-100 py-6 text-center shadow-sm transition-shadow hover:shadow-md'>
        <CardContent className='flex flex-col items-center justify-center gap-3 p-0'>
          <div className='rounded-full bg-[#DBEAFE] p-4 transition-transform group-hover:scale-110'>
            <BookOpen className='h-8 w-8 text-[#1E3A8A]' />
          </div>
          <h3 className='text-4xl font-bold text-[#1E3A8A]'>3k+</h3>
          <p className='font-medium text-slate-600'>Seminar Books</p>
        </CardContent>
      </Card>

      <Card className='group border-slate-100 py-6 text-center shadow-sm transition-shadow hover:shadow-md'>
        <CardContent className='flex flex-col items-center justify-center gap-3 p-0'>
          <div className='rounded-full bg-[#DBEAFE] p-4 transition-transform group-hover:scale-110'>
            <Building2 className='h-8 w-8 text-[#1E3A8A]' />
          </div>
          <h3 className='text-4xl font-bold text-[#1E3A8A]'>15+</h3>
          <p className='font-medium text-slate-600'>Office Staff</p>
        </CardContent>
      </Card>
    </section>
  );
}

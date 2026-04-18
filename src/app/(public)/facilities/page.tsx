import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Monitor } from 'lucide-react';
import Image from 'next/image';

export default function FacilitiesPage() {
  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-12 py-8 text-[#0F172A]'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight text-[#1E3A8A] md:text-5xl'>
          Department Facilities
        </h1>
        <p className='mx-auto max-w-2xl text-lg text-slate-600'>
          Providing state-of-the-art resources and conducive environments to
          support academic excellence and research.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
        {/* Seminar Library */}
        <Card className='group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl'>
          <div className='relative h-64 w-full overflow-hidden md:h-80'>
            <div className='absolute inset-0 z-10 bg-[#0F172A]/20 transition-colors group-hover:bg-transparent' />
            {/* Using a placeholder image for the library */}
            <Image
              src='https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop'
              alt='Seminar Library'
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
              width={800}
              height={600}
            />
          </div>
          <CardHeader className='relative z-20 mx-4 -mt-8 rounded-t-3xl border border-slate-100 bg-white px-8 pt-8 pb-4 shadow-sm'>
            <div className='mb-2 flex items-center gap-4'>
              <div className='shrink-0 rounded-full bg-[#DBEAFE] p-3'>
                <BookOpen className='h-6 w-6 text-[#1E3A8A]' />
              </div>
              <CardTitle className='text-2xl font-bold text-[#1E3A8A]'>
                Seminar Library
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='mx-4 mb-4 space-y-4 rounded-b-xl border-r border-b border-l border-slate-100 bg-white px-8 pt-4 pb-8 text-slate-600'>
            <p className='leading-relaxed'>
              Our departmental Seminar Library is a cornerstone of academic
              life, offering students and faculty access to an extensive and
              curated collection of literature.
            </p>
            <ul className='mt-4 space-y-3 border-t border-slate-100 pt-4 font-medium text-slate-800'>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                <span className='shrink-0 text-xl font-bold text-[#1E3A8A]'>
                  3,000+
                </span>{' '}
                Academic Texts & Reference Books
              </li>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                Latest National and International Journals
              </li>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                Quiet, air-conditioned reading areas
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Computer Lab */}
        <Card className='group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl'>
          <div className='relative h-64 w-full overflow-hidden md:h-80'>
            <div className='absolute inset-0 z-10 bg-[#0F172A]/20 transition-colors group-hover:bg-transparent' />
            {/* Using a placeholder image for the computer lab */}
            <Image
              src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop'
              alt='Computer Laboratory'
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
              width={800}
              height={600}
            />
          </div>
          <CardHeader className='relative z-20 mx-4 -mt-8 rounded-t-3xl border border-slate-100 bg-white px-8 pt-8 pb-4 shadow-sm'>
            <div className='mb-2 flex items-center gap-4'>
              <div className='shrink-0 rounded-full bg-[#DBEAFE] p-3'>
                <Monitor className='h-6 w-6 text-[#1E3A8A]' />
              </div>
              <CardTitle className='text-2xl font-bold text-[#1E3A8A]'>
                Computer Laboratory
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='mx-4 mb-4 space-y-4 rounded-b-xl border-r border-b border-l border-slate-100 bg-white px-8 pt-4 pb-8 text-slate-600'>
            <p className='leading-relaxed'>
              Equipped with modern hardware and specialized software, our
              Computer Lab ensures students are technically proficient in modern
              statistical tools and data analysis methodologies.
            </p>
            <ul className='mt-4 space-y-3 border-t border-slate-100 pt-4 font-medium text-slate-800'>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                <span className='shrink-0 text-xl font-bold text-[#1E3A8A]'>
                  50
                </span>{' '}
                High-Performance Workstations
              </li>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                Statistical Software: SPSS, R, Python, MATLAB
              </li>
              <li className='flex items-center gap-3'>
                <span className='h-2 w-2 rounded-full bg-[#1E3A8A]'></span>
                High-speed internet and dedicated local servers
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';

export function ChairmanMessage() {
  return (
    <div className='flex flex-col gap-6 lg:col-span-2'>
      <div className='mb-2 flex items-center gap-2 border-b border-slate-200 pb-2'>
        <h2 className='text-2xl font-bold tracking-wide text-[#1E3A8A] uppercase'>
          Message from Chairman
        </h2>
      </div>

      <div className='flex flex-col items-start gap-8 rounded-xl border border-slate-100 bg-white p-8 shadow-sm md:flex-row'>
        {/* Left Side Text */}
        <div className='flex-1 space-y-4'>
          <p className='leading-relaxed text-slate-600 md:text-lg'>
            Welcome to the Department of Statistics. Since our establishment,
            our goal has been to foster academic excellence, rigorous analytical
            thinking, and impactful research.
          </p>
          <p className='leading-relaxed text-slate-600'>
            Our curriculum is designed to equip students with a robust
            foundation in modern data science, probabilistic modeling, and
            statistical inference. Our dedicated faculty members are deeply
            committed to mentoring the next generation of analysts and
            researchers who will go on to solve complex global challenges.
          </p>
          <p className='my-6 border-l-4 border-[#1E3A8A] pl-4 leading-relaxed font-semibold text-slate-600 italic'>
            &quot;We invite you to explore our vibrant academic community and
            participate in shaping the future of statistical sciences.&quot;
          </p>
          <div className='pt-4'>
            <h4 className='text-xl font-bold text-[#1E3A8A]'>
              Dr. Firstname Lastname
            </h4>
            <p className='text-lg font-semibold tracking-widest text-slate-500 uppercase'>
              Professor & Chairman
            </p>
            <p className='mt-1 text-lg text-slate-400'>
              Department of Statistics
            </p>
          </div>
        </div>
        {/* Right Side Image */}
        <div className='w-full shrink-0 md:w-64 lg:w-72'>
          <div className='relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-slate-50 shadow-md'>
            <Image
              src='https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'
              alt='Department Chairman'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

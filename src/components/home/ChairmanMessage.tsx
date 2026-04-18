'use client';

import { useReveal } from '@/hooks/useReveal';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export function ChairmanMessage() {
  const ref = useReveal();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className='reveal flex flex-col gap-8 lg:col-span-2'
    >
      {/* Section header */}
      <div>
        <p className='text-gold mb-3 text-xs font-semibold tracking-widest uppercase'>
          From the Chair
        </p>
        <h2 className='text-navy section-title pb-3 font-serif text-3xl font-bold'>
          Chairman&apos;s Message
        </h2>
      </div>

      {/* Card */}
      <div className='flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white md:flex-row'>
        {/* Left: Text */}
        <div className='flex flex-1 flex-col justify-between gap-6 p-8 lg:p-10'>
          <div className='space-y-5'>
            <p className='text-base leading-relaxed text-slate-600'>
              Welcome to the Department of Statistics at the University of
              Chittagong. Since our establishment, our goal has been to foster
              academic excellence, rigorous analytical thinking, and impactful
              research.
            </p>
            <p className='text-sm leading-relaxed text-slate-500'>
              Our curriculum equips students with a robust foundation in modern
              data science, probabilistic modeling, and statistical inference.
              Our dedicated faculty are deeply committed to mentoring the next
              generation of analysts and researchers.
            </p>

            {/* Blockquote */}
            <blockquote className='border-l-gold relative border-l-[3px] py-4 pl-6'>
              <Quote
                size={20}
                className='text-navy absolute top-3 right-3 opacity-10'
              />
              <p className='text-navy font-serif text-base leading-relaxed font-medium italic'>
                &quot;We invite you to explore our vibrant academic community
                and participate in shaping the future of statistical
                sciences.&quot;
              </p>
            </blockquote>
          </div>

          {/* Signature */}
          <div className='border-navy-light flex items-center gap-4 border-t pt-2'>
            <div className='bg-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'>
              DL
            </div>
            <div>
              <p className='text-navy font-serif text-base font-bold'>
                Dr. Firstname Lastname
              </p>
              <p className='text-gold text-xs tracking-widest uppercase'>
                Professor &amp; Chairman
              </p>
            </div>
          </div>
        </div>

        {/* Right: Photo */}
        <div className='relative min-h-70 shrink-0 md:w-56 lg:w-64'>
          <Image
            src='https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'
            alt='Department Chairman'
            fill
            className='object-cover'
          />
          {/* Overlay gradient for text readability at bottom */}
          <div className='from-navy/50 absolute inset-0 bg-linear-to-t to-transparent to-50%' />
        </div>
      </div>
    </div>
  );
}

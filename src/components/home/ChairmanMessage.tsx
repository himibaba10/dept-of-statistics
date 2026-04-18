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
        <p
          className='mb-3 text-xs font-semibold tracking-widest uppercase'
          style={{ color: 'var(--gold, #C9972B)' }}
        >
          From the Chair
        </p>
        <h2
          className='section-title pb-3 text-3xl font-bold'
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--navy, #0F2A6B)'
          }}
        >
          Chairman&apos;s Message
        </h2>
      </div>

      {/* Card */}
      <div
        className='flex flex-col overflow-hidden rounded-2xl border md:flex-row'
        style={{
          borderColor: 'var(--border, #E2E8F0)',
          backgroundColor: 'white'
        }}
      >
        {/* Left: Text */}
        <div className='flex flex-1 flex-col justify-between gap-6 p-8 lg:p-10'>
          <div className='space-y-5'>
            <p
              className='text-base leading-relaxed'
              style={{ color: '#4A5568' }}
            >
              Welcome to the Department of Statistics at the University of
              Chittagong. Since our establishment, our goal has been to foster
              academic excellence, rigorous analytical thinking, and impactful
              research.
            </p>
            <p className='text-sm leading-relaxed' style={{ color: '#718096' }}>
              Our curriculum equips students with a robust foundation in modern
              data science, probabilistic modeling, and statistical inference.
              Our dedicated faculty are deeply committed to mentoring the next
              generation of analysts and researchers.
            </p>

            {/* Blockquote */}
            <blockquote
              className='relative py-4 pl-6'
              style={{ borderLeft: '3px solid var(--gold, #C9972B)' }}
            >
              <Quote
                size={20}
                className='absolute top-3 right-3 opacity-10'
                style={{ color: 'var(--navy, #0F2A6B)' }}
              />
              <p
                className='text-base leading-relaxed font-medium italic'
                style={{
                  color: 'var(--navy, #0F2A6B)',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                &quot;We invite you to explore our vibrant academic community
                and participate in shaping the future of statistical
                sciences.&quot;
              </p>
            </blockquote>
          </div>

          {/* Signature */}
          <div
            className='flex items-center gap-4 border-t pt-2'
            style={{ borderColor: '#EEF2FF' }}
          >
            <div
              className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'
              style={{ backgroundColor: 'var(--navy, #0F2A6B)' }}
            >
              DL
            </div>
            <div>
              <p
                className='text-base font-bold'
                style={{
                  color: 'var(--navy, #0F2A6B)',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                Dr. Firstname Lastname
              </p>
              <p
                className='text-xs tracking-widest uppercase'
                style={{ color: 'var(--gold, #C9972B)' }}
              >
                Professor &amp; Chairman
              </p>
            </div>
          </div>
        </div>

        {/* Right: Photo */}
        <div
          className='relative shrink-0 md:w-56 lg:w-64'
          style={{ minHeight: '280px' }}
        >
          <Image
            src='https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'
            alt='Department Chairman'
            fill
            className='object-cover'
          />
          {/* Overlay gradient for text readability at bottom */}
          <div
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(to top, rgba(15,42,107,0.5) 0%, transparent 50%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

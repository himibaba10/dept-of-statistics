'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
    headline: 'Department of Statistics',
    sub: 'University of Chittagong',
    body: 'Advancing knowledge through rigorous analytical thinking, statistical research, and academic excellence.'
  },
  {
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop',
    headline: 'Research & Innovation',
    sub: 'University of Chittagong',
    body: 'Our faculty and students are pushing the boundaries of statistical science and applied data research.'
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    headline: 'Shaping Future Analysts',
    sub: 'University of Chittagong',
    body: 'A vibrant community of learners, researchers, and professionals dedicated to the science of data.'
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const goTo = (index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = slides[current];

  return (
    <section
      className='relative w-full overflow-hidden'
      style={{ height: 'clamp(420px, 58vw, 640px)' }}
    >
      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className='absolute inset-0 transition-opacity duration-700'
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0
          }}
        >
          <Image
            src={s.src}
            alt={s.headline}
            fill
            className='object-cover'
            priority={i === 0}
            sizes='100vw'
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div
        className='absolute inset-0 z-10'
        style={{
          background:
            'linear-gradient(to right, rgba(10,22,40,0.90) 0%, rgba(10,22,40,0.70) 50%, rgba(10,22,40,0.30) 100%)'
        }}
      />
      {/* Bottom fade */}
      <div
        className='absolute right-0 bottom-0 left-0 z-10 h-32'
        style={{
          background: 'linear-gradient(to top, #F7F9FC 0%, transparent 100%)'
        }}
      />

      {/* Content */}
      <div
        className='relative z-20 flex h-full items-center'
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
          <div className='max-w-xl'>
            {/* Gold label */}
            <div
              className='mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase'
              style={{ color: 'var(--gold, #C9972B)' }}
            >
              <span
                className='inline-block h-px w-8'
                style={{ backgroundColor: 'var(--gold, #C9972B)' }}
              />
              {slide.sub}
            </div>

            {/* Headline */}
            <h1
              className='mb-4 leading-tight font-bold text-white'
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)'
              }}
            >
              {slide.headline}
            </h1>

            {/* Gold rule */}
            <div
              className='mb-6 h-1 w-16 rounded-full'
              style={{ backgroundColor: 'var(--gold, #C9972B)' }}
            />

            {/* Body */}
            <p
              className='mb-8 text-base leading-relaxed'
              style={{ color: 'rgba(255,255,255,0.78)', maxWidth: '36rem' }}
            >
              {slide.body}
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/teachers'
                className='inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-x-0.5 hover:opacity-90'
                style={{ backgroundColor: 'var(--gold, #C9972B)' }}
              >
                Explore Faculty
                <ChevronRight size={16} />
              </Link>
              <Link
                href='/courses'
                className='inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/10'
                style={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.35)'
                }}
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className='absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className='rounded-full transition-all duration-300'
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              backgroundColor:
                i === current
                  ? 'var(--gold, #C9972B)'
                  : 'rgba(255,255,255,0.45)'
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div
        className='absolute right-8 bottom-8 z-20 hidden text-xs font-semibold tabular-nums sm:block'
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {String(current + 1).padStart(2, '0')} /{' '}
        {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}

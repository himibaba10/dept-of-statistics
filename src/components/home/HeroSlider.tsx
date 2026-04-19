'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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
    <section className='relative h-[clamp(420px,58vw,640px)] w-full overflow-hidden'>
      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
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
      <div className='from-navy/90 via-navy/70 to-navy/30 absolute inset-0 z-10 bg-linear-to-r' />
      {/* Bottom fade */}
      <div className='absolute right-0 bottom-0 left-0 z-10 h-32 bg-linear-to-t from-[#F7F9FC] to-transparent' />

      {/* Content */}
      <div
        className={`relative z-20 flex h-full items-center transition-opacity duration-400 ease-in-out ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
          <div className='max-w-xl'>
            {/* Gold label */}
            <div className='text-gold mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase'>
              <span className='bg-gold inline-block h-px w-8' />
              {slide.sub}
            </div>

            {/* Headline */}
            <h1 className='mb-4 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold text-white'>
              {slide.headline}
            </h1>

            {/* Gold rule */}
            <div className='bg-gold mb-6 h-1 w-16 rounded-full' />

            {/* Body */}
            <p className='mb-8 max-w-xl text-base leading-relaxed text-white/80'>
              {slide.body}
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/teachers'
                className='bg-gold inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-x-0.5 hover:opacity-90'
              >
                Explore Faculty
                <ChevronRight size={16} />
              </Link>
              <Link
                href='/courses'
                className='inline-flex items-center gap-2 rounded-md border border-white/35 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10'
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
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-gold w-7' : 'w-2 bg-white/45'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className='absolute right-8 bottom-8 z-20 hidden text-xs font-semibold text-white/50 tabular-nums sm:block'>
        {String(current + 1).padStart(2, '0')} /{' '}
        {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}

'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface HeroSlide {
  src: string;
  headline: string;
  sub: string;
  body: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
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
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        const fetched: HeroSlide[] = data?.data?.heroSlides ?? [];
        if (fetched.length > 0) {
          setSlides(fetched);
          setCurrent(0);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

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
  }, [current, slides.length]);

  const slide = slides[current] ?? DEFAULT_SLIDES[0];

  return (
    <section
      className='bg-navy flex w-full flex-col lg:flex-row'
      style={{ minHeight: 'clamp(420px, 58vw, 620px)' }}
    >
      {/* ── Left: content box ── */}
      <div className='flex w-full items-center bg-white px-8 py-12 lg:w-2/5 lg:px-12 lg:py-16'>
        <div
          className={`w-full transition-opacity duration-400 ease-in-out ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Sub-label */}
          <div className='text-gold mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase'>
            <span className='bg-gold inline-block h-px w-8' />
            {slide.sub}
          </div>

          {/* Headline */}
          <h1 className='text-navy mb-3 font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] leading-tight font-bold'>
            {slide.headline}
          </h1>

          {/* Gold rule */}
          <div className='bg-gold mb-5 h-1 w-14 rounded-full' />

          {/* Body */}
          <p className='mb-8 text-sm leading-relaxed text-slate-600'>
            {slide.body}
          </p>

          {/* CTAs */}
          <div className='flex flex-wrap gap-3'>
            <Link
              href='/teachers'
              className='bg-navy hover:bg-navy/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors'
            >
              Explore Faculty
              <ChevronRight size={15} />
            </Link>
            <Link
              href='/courses'
              className='border-navy text-navy hover:bg-navy/5 inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors'
            >
              View Courses
            </Link>
          </div>

          {/* Dot indicators */}
          <div className='mt-8 flex gap-2'>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gold w-6' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: image ── */}
      <div
        className='relative w-full overflow-hidden lg:w-3/5'
        style={{ minHeight: 'clamp(260px, 40vw, 620px)' }}
      >
        {slides.map((s, i) => (
          <Image
            key={i}
            src={s.src}
            alt={s.headline}
            fill
            className={`object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            priority={i === 0}
            sizes='(max-width: 1024px) 100vw, 60vw'
          />
        ))}

        {/* Slide counter */}
        <div className='absolute right-5 bottom-5 z-10 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white/80 tabular-nums backdrop-blur-sm'>
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
}

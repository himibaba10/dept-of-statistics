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

  // Fetch slides from settings API
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
    <section className='relative h-[clamp(420px,58vw,640px)] w-full overflow-hidden'>
      {/* Background images */}
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

      {/* Content — white card, left-aligned */}
      <div className='absolute inset-0 z-20 flex items-center'>
        <div className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
          <div
            className={`w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-2xl transition-opacity duration-400 ease-in-out ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            {/* Gold label */}
            <div className='text-gold mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase'>
              <span className='bg-gold inline-block h-px w-8' />
              {slide.sub}
            </div>

            {/* Headline */}
            <h1 className='text-navy mb-3 font-serif text-[clamp(1.5rem,3vw,2.4rem)] leading-tight font-bold'>
              {slide.headline}
            </h1>

            {/* Gold rule */}
            <div className='bg-gold mb-4 h-1 w-14 rounded-full' />

            {/* Body */}
            <p className='mb-7 text-sm leading-relaxed text-slate-600'>
              {slide.body}
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/teachers'
                className='bg-navy hover:bg-navy/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200'
              >
                Explore Faculty
                <ChevronRight size={15} />
              </Link>
              <Link
                href='/courses'
                className='border-navy text-navy hover:bg-navy/5 inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-all duration-200'
              >
                View Courses
              </Link>
            </div>

            {/* Dot indicators — inside card */}
            <div className='mt-6 flex gap-2'>
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
      </div>
    </section>
  );
}

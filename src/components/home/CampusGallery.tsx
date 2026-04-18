'use client';

import { useReveal } from '@/hooks/useReveal';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=900&auto=format&fit=crop',
    alt: 'Campus lecture hall',
    aspect: '4/3',
    colSpan: 2
  },
  {
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop',
    alt: 'University building exterior',
    aspect: '4/3',
    colSpan: 1
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
    alt: 'Students studying together',
    aspect: '4/3',
    colSpan: 1
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop',
    alt: 'Campus library',
    aspect: '4/3',
    colSpan: 2
  }
];

export function CampusGallery() {
  const ref = useReveal();
  const [lightbox, setLightbox] = useState<number>(-1);

  const prev = () =>
    setLightbox((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setLightbox((i) => (i + 1) % photos.length);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className='reveal flex flex-col gap-8 pb-16'
    >
      {/* Section header */}
      <div className='flex items-end justify-between'>
        <div>
          <p
            className='mb-3 text-xs font-semibold tracking-widest uppercase'
            style={{ color: 'var(--gold, #C9972B)' }}
          >
            Our Campus
          </p>
          <h2
            className='section-title pb-3 text-3xl font-bold'
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'var(--navy, #0F2A6B)'
            }}
          >
            Campus Gallery
          </h2>
        </div>
        <Link
          href='/facilities'
          className='mb-1 flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-colors'
          style={{ color: 'var(--navy, #0F2A6B)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--gold, #C9972B)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--navy, #0F2A6B)')
          }
        >
          View More
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-3 gap-3 md:gap-4'>
        {photos.map((photo, i) => (
          <div
            key={i}
            className='group relative cursor-pointer overflow-hidden rounded-xl'
            style={{
              aspectRatio: photo.aspect
            }}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
            {/* Hover overlay */}
            <div
              className='absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
              style={{
                background:
                  'linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 60%)'
              }}
            >
              <p className='text-sm font-medium text-white'>{photo.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox >= 0 && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          style={{ backgroundColor: 'rgba(10,22,40,0.95)' }}
          onClick={() => setLightbox(-1)}
        >
          <div
            className='relative mx-4 w-full max-w-4xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative aspect-video overflow-hidden rounded-xl'>
              <Image
                src={photos[lightbox].src}
                alt={photos[lightbox].alt}
                fill
                className='object-cover'
                sizes='90vw'
              />
            </div>

            {/* Caption */}
            <p className='mt-3 text-center text-sm text-white/70'>
              {photos[lightbox].alt}
            </p>

            {/* Controls */}
            <button
              onClick={() => setLightbox(-1)}
              className='absolute -top-4 -right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20'
            >
              <X size={18} />
            </button>
            <button
              onClick={prev}
              className='absolute top-1/2 left-0 -translate-x-4 -translate-y-1/2 rounded-full bg-black p-2 text-white transition-colors hover:bg-black/80'
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className='absolute top-1/2 right-0 translate-x-4 -translate-y-1/2 rounded-full bg-black p-2 text-white transition-colors hover:bg-black/80'
            >
              <ChevronRight size={20} />
            </button>

            {/* Counter */}
            <div className='absolute top-3 left-3 text-xs font-semibold text-white/50 tabular-nums'>
              {String(lightbox + 1).padStart(2, '0')} /{' '}
              {String(photos.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

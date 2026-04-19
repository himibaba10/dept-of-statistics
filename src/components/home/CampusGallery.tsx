'use client';

import { useReveal } from '@/hooks/useReveal';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface GalleryPhoto {
  _id: string;
  url: string;
  caption?: string;
}

export function CampusGallery() {
  const ref = useReveal();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [lightbox, setLightbox] = useState<number>(-1);

  console.log(photos);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPhotos(d.data ?? []);
      })
      .catch(() => {});
  }, []);

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
          <p className='text-gold mb-3 text-xs font-semibold tracking-widest uppercase'>
            Our Campus
          </p>
          <h2 className='text-navy section-title pb-3 font-serif text-3xl font-bold'>
            Campus Gallery
          </h2>
        </div>
        <Link
          href='/facilities'
          className='text-navy hover:text-gold mb-1 flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-colors'
        >
          View More
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className='flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12'>
          <p className='text-sm text-gray-500'>
            No photos added to the gallery yet.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-3 md:gap-4'>
          {photos.slice(0, 6).map((photo, i) => (
            <div
              key={photo._id}
              className={`group relative aspect-4/3 h-full w-full cursor-pointer overflow-hidden rounded-xl ${i === 0 || i === 3 ? 'col-span-2' : 'col-span-1'}`}
              onClick={() => setLightbox(i)}
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? 'Gallery photo'}
                fill
                className='h-full object-cover transition-transform duration-500 group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              <div className='from-navy/70 absolute inset-0 flex items-end bg-linear-to-t to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                {photo.caption && (
                  <p className='text-sm font-medium text-white'>
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox >= 0 && typeof document !== 'undefined'
        ? createPortal(
            <div
              className='bg-navy-dark/95 fixed inset-0 z-100 flex items-center justify-center'
              onClick={() => setLightbox(-1)}
            >
              <div
                className='relative mx-4 w-full max-w-4xl'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='relative aspect-video overflow-hidden rounded-xl'>
                  <Image
                    src={photos[lightbox].url}
                    alt={photos[lightbox].caption ?? 'Gallery photo'}
                    fill
                    className='rounded-xl object-contain'
                    sizes='90vw'
                  />
                </div>
                {photos[lightbox].caption && (
                  <p className='mt-3 text-center text-sm text-white/70'>
                    {photos[lightbox].caption}
                  </p>
                )}
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
                <div className='absolute top-3 left-3 text-xs font-semibold text-white/50 tabular-nums'>
                  {String(lightbox + 1).padStart(2, '0')} /{' '}
                  {String(photos.length).padStart(2, '0')}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}

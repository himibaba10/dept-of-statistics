'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    width: 800,
    height: 600,
    alt: 'Campus library with students'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    width: 800,
    height: 533,
    alt: 'Lecture hall'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    width: 600,
    height: 800,
    alt: 'Students studying together'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    width: 800,
    height: 533,
    alt: 'Academic seminar'
  }
];

export function CampusGallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section className='flex flex-col gap-6 pb-12'>
      <div className='flex items-center justify-between border-b border-slate-200 pb-2'>
        <h2 className='text-2xl font-bold tracking-wide text-[#1E3A8A] uppercase'>
          Campus Gallery
        </h2>
        <Link
          href='/facilities'
          className='text-lg font-medium text-[#1E3A8A] hover:underline'
        >
          View More
        </Link>
      </div>

      {/* react-photo-album neatly arranges the images based on the target row height */}
      <div className='overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm'>
        <PhotoAlbum
          layout='rows'
          photos={photos}
          targetRowHeight={250}
          onClick={({ index }) => setIndex(index)}
          render={{
            wrapper: ({ style, ...rest }) => (
              <div
                {...rest}
                style={{
                  ...style,
                  overflow: 'hidden',
                  borderRadius: '0.75rem'
                }}
                className='group cursor-pointer'
              />
            ),
            image: ({ alt, title, sizes, onClick }, { photo, width, height }) => (
              <div
                style={{
                  width: '100%',
                  position: 'relative',
                  aspectRatio: `${width} / ${height}`
                }}
                onClick={onClick}
              >
                <Image
                  src={photo.src}
                  alt={alt || photo.alt || 'Gallery image'}
                  title={title}
                  sizes={sizes}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90'
                />
              </div>
            )
          }}
        />
      </div>

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </section>
  );
}

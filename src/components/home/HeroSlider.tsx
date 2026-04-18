'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import Image from 'next/image';

const sliderImages = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'
];

export function HeroSlider() {
  return (
    <section className='relative w-full px-12 md:px-0'>
      <Carousel className='relative w-full' opts={{ loop: true }}>
        <CarouselContent>
          {sliderImages.map((src, index) => (
            <CarouselItem key={index}>
              <div className='relative h-75 w-full overflow-hidden rounded-xl shadow-sm md:h-100 lg:h-125'>
                <Image
                  src={src}
                  alt={`Department highlights ${index + 1}`}
                  fill
                  className='object-cover'
                  priority={index === 0}
                />
                <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                  <div className='px-4 text-center text-white'>
                    <h2 className='mb-4 text-3xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:text-5xl'>
                      Department of Statistics
                    </h2>
                    <p className='mx-auto max-w-2xl text-lg text-blue-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] md:text-xl'>
                      Leading the way in data, analytical thinking, and research
                      excellence.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute -left-12 z-10 md:left-4' />
        <CarouselNext className='absolute -right-12 z-10 md:right-4' />
      </Carousel>
    </section>
  );
}

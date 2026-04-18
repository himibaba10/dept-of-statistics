'use client';

import { CampusGallery } from '@/components/home/CampusGallery';
import { ChairmanMessage } from '@/components/home/ChairmanMessage';
import { HeroSlider } from '@/components/home/HeroSlider';
import { NoticeBoardPreview } from '@/components/home/NoticeBoardPreview';
import { StatsGrid } from '@/components/home/StatsGrid';

export default function Home() {
  return (
    <div className='flex w-full flex-col' style={{ color: '#0A1628' }}>
      {/* Hero — full bleed, no container */}
      <HeroSlider />

      {/* Contained sections */}
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-16 lg:px-8'>
        <StatsGrid />

        <section className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          <ChairmanMessage />
          <NoticeBoardPreview />
        </section>

        <CampusGallery />
      </div>
    </div>
  );
}

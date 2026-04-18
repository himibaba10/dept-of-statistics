'use client';

import { CampusGallery } from '@/components/home/CampusGallery';
import { ChairmanMessage } from '@/components/home/ChairmanMessage';
import { HeroSlider } from '@/components/home/HeroSlider';
import { NoticeBoardPreview } from '@/components/home/NoticeBoardPreview';
import { StatsGrid } from '@/components/home/StatsGrid';

export default function Home() {
  return (
    <div className='flex w-full flex-col gap-16 text-[#0F172A]'>
      <HeroSlider />
      <StatsGrid />
      <section className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
        <ChairmanMessage />
        <NoticeBoardPreview />
      </section>
      <CampusGallery />
    </div>
  );
}

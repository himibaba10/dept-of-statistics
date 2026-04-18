'use client';

import { useReveal } from '@/hooks/useReveal';
import { BookOpen, Building2, GraduationCap, UserCheck } from 'lucide-react';

const stats = [
  { icon: GraduationCap, value: '450+', label: 'Students Enrolled' },
  { icon: UserCheck, value: '25+', label: 'Faculty Members' },
  { icon: BookOpen, value: '3,000+', label: 'Seminar Books' },
  { icon: Building2, value: '15+', label: 'Office Staff' }
];

export function StatsGrid() {
  const ref = useReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className='bg-navy reveal rounded-2xl'
    >
      <div className='grid grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isLast = i === stats.length - 1;
          return (
            <div
              key={stat.label}
              className={`relative flex flex-col items-center justify-center px-6 py-10 ${
                !isLast ? 'border-r-white/10 max-lg:border-r' : ''
              } ${i < 2 ? 'border-b-white/10 max-lg:border-b' : ''}`}
            >
              {/* Icon */}
              <div className='bg-gold/15 mb-4 rounded-full p-3'>
                <Icon size={24} className='text-gold' />
              </div>

              {/* Number */}
              <span className='mb-2 font-serif text-[clamp(2rem,3vw,2.5rem)] leading-none font-bold text-white'>
                {stat.value}
              </span>

              {/* Label */}
              <span className='text-center text-xs font-semibold tracking-wider text-white/55 uppercase'>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

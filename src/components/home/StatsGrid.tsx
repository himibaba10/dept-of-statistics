'use client';

import { BookOpen, Building2, GraduationCap, UserCheck } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

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
              className='relative flex flex-col items-center justify-center px-6 py-10'
              style={{
                borderRight: !isLast
                  ? '1px solid rgba(255,255,255,0.10)'
                  : undefined,
                borderBottom:
                  i < 2 ? '1px solid rgba(255,255,255,0.10)' : undefined
              }}
            >
              {/* Icon */}
              <div
                className='mb-4 rounded-full p-3'
                style={{ backgroundColor: 'rgba(201,151,43,0.15)' }}
              >
                <Icon size={24} style={{ color: 'var(--gold, #C9972B)' }} />
              </div>

              {/* Number */}
              <span
                className='mb-2 leading-none font-bold'
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                  color: 'white'
                }}
              >
                {stat.value}
              </span>

              {/* Label */}
              <span
                className='text-center text-xs font-semibold tracking-wider uppercase'
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

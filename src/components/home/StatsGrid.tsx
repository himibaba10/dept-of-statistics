'use client';

import { BookOpen, Building2, GraduationCap, UserCheck } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const stats = [
  { icon: GraduationCap, value: '450+', label: 'Students Enrolled' },
  { icon: UserCheck, value: '25+', label: 'Faculty Members' },
  { icon: BookOpen, value: '3,000+', label: 'Seminar Books' },
  { icon: Building2, value: '15+', label: 'Office Staff' },
];

export function StatsGrid() {
  const ref = useReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="reveal"
      style={{ backgroundColor: 'var(--navy, #0F2A6B)', borderRadius: '16px' }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isLast = i === stats.length - 1;
          return (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 px-6 relative"
              style={{
                borderRight: !isLast ? '1px solid rgba(255,255,255,0.10)' : undefined,
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.10)' : undefined,
              }}
            >
              {/* Icon */}
              <div
                className="mb-4 p-3 rounded-full"
                style={{ backgroundColor: 'rgba(201,151,43,0.15)' }}
              >
                <Icon size={24} style={{ color: 'var(--gold, #C9972B)' }} />
              </div>

              {/* Number */}
              <span
                className="font-bold leading-none mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                  color: 'white',
                }}
              >
                {stat.value}
              </span>

              {/* Label */}
              <span
                className="text-xs font-semibold tracking-wider uppercase text-center"
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

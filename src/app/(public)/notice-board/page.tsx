import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import Image from 'next/image';

const mockNotices = [
  {
    id: 'n1',
    title: 'Midterm Examination Schedule published for 2020-2021 Session',
    date: '2026-04-18',
    description:
      'The schedule for the upcoming midterm examinations has been released. Please check the department notice board for detailed room allocations.',
    imageUrl:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'n2',
    title:
      'Guest Lecture: Modern Applications of Machine Learning in Biostatistics',
    date: '2026-04-15',
    description:
      'Dr. Jane Smith from Oxford University will be presenting on the novel ML approaches applied in recent clinical trials.'
  },
  {
    id: 'n3',
    title: 'Data Science Bootcamp Registration Open',
    date: '2026-04-10',
    description:
      'Sign up for the intensive 3-day boot camp focusing on advanced R programming and Python data analysis libraries. Limited seats available.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'n4',
    title: 'Office Closed for National Holiday',
    date: '2026-04-05',
    description:
      'The departmental office will remain closed coming Monday due to the public holiday.'
  },
  {
    id: 'n5',
    title: 'New Books Added to the Seminar Library',
    date: '2026-03-28',
    description:
      'Over 50 new titles covering Bayesian Networks and Time Series Analysis have been procured and are now available for borrowing.'
  }
];

export default function NoticeBoardPage() {
  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 text-[#0F172A]'>
      <div className='mb-4 text-center md:text-left'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight text-[#1E3A8A]'>
          Notice Board
        </h1>
        <p className='text-lg text-slate-600'>
          Latest updates, announcements, and news from the department.
        </p>
      </div>

      <div className='columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3'>
        {mockNotices.map((notice) => (
          <Card
            key={notice.id}
            className='break-inside-avoid overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md'
          >
            {notice.imageUrl && (
              <div className='relative h-48 w-full bg-slate-100'>
                <Image
                  src={notice.imageUrl}
                  alt={notice.title}
                  fill
                  className='object-cover'
                />
              </div>
            )}
            <CardHeader className='bg-white p-5 pb-3'>
              <div className='mb-2 flex items-center gap-2 text-sm font-medium text-slate-500'>
                <Calendar className='h-4 w-4 text-[#1E3A8A]' />
                {new Date(notice.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <CardTitle className='text-xl leading-tight font-bold text-[#1E3A8A]'>
                {notice.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='px-5 pb-5 text-sm text-slate-600'>
              <p className='leading-relaxed'>{notice.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses } from '@/lib/mockData';

export default function CoursesPage() {
  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 text-[#0F172A]'>
      <div className='mb-4'>
        <h1 className='mb-2 text-4xl font-bold tracking-tight text-[#1E3A8A]'>
          Our Courses
        </h1>
        <p className='text-lg text-slate-600'>
          Explore our comprehensive array of statistical programs and courses.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {mockCourses.map((course) => (
          <Card
            key={course._id}
            className='overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md'
          >
            <div className='relative h-48 w-full bg-slate-100'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.syllabusImageUrl}
                alt={course.title}
                className='h-full w-full object-cover object-center'
              />
              <Badge className='absolute top-4 right-4 bg-[#1E3A8A] text-sm font-bold text-white hover:bg-[#1E3A8A]/90'>
                {course.code}
              </Badge>
            </div>
            <CardHeader className='border-b border-slate-100 bg-white p-6'>
              <CardTitle className='mb-2 text-2xl leading-tight font-bold text-[#1E3A8A]'>
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='bg-[#F8FAFC] p-6'>
              <p className='text-sm text-slate-500 italic'>Instructor TBD</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses, mockTeachers } from '@/lib/mockData';
import Image from 'next/image';

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
        {mockCourses.map((course) => {
          const instructor = mockTeachers.find(
            (t) => t._id === course.instructorId
          );

          return (
            <Card
              key={course._id}
              className='overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='relative h-48 w-full bg-slate-100'>
                <Image
                  src={course.syllabusImageUrl}
                  alt={course.title}
                  fill
                  className='object-cover object-center'
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
                <div className='flex items-center gap-4'>
                  {instructor ? (
                    <>
                      <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#1E3A8A]'>
                        <Image
                          src={instructor.imageUrl}
                          alt={instructor.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div>
                        <p className='mb-1 block border-b border-slate-200 pb-1 text-sm font-semibold text-slate-900'>
                          Course Instructor
                        </p>
                        <p className='font-medium text-[#1E3A8A]'>
                          {instructor.name}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {instructor.designation}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className='text-sm text-slate-500 italic'>
                      Instructor TBD
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { mockCourses, mockTeachers } from '@/lib/mockData';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';

export function ManageCourses() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>
            Course Management
          </h2>
          <p className='text-sm text-slate-600'>
            Create courses, assign instructors, and update syllabus materials.
          </p>
        </div>
        <Button className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'>
          <Plus className='mr-2 h-4 w-4' /> Add New Course
        </Button>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <CardTitle className='text-lg'>Active Courses</CardTitle>
          <CardDescription>
            A list of currently offered courses within the department.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='divide-y divide-slate-100'>
            {mockCourses.map((course) => {
              const instructor = mockTeachers.find(
                (t) => t._id === course.instructorId
              );
              return (
                <div
                  key={course._id}
                  className='flex flex-col items-start justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:p-6'
                >
                  <div className='flex items-start gap-4'>
                    <div className='hidden shrink-0 rounded-lg bg-[#DBEAFE] p-3 sm:block'>
                      <BookOpen className='h-6 w-6 text-[#1E3A8A]' />
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-[#1E3A8A]'>
                          {course.code}
                        </span>
                        <h4 className='font-semibold text-slate-800'>
                          {course.title}
                        </h4>
                      </div>
                      <p className='text-xs text-slate-500'>
                        Instructor:{' '}
                        <span className='font-medium text-slate-700'>
                          {instructor ? instructor.name : 'Unassigned'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className='flex shrink-0 items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 shadow-sm'
                    >
                      <Edit className='mr-2 h-4 w-4' /> Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-red-200 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

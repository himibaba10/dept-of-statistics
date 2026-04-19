import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

const mockNotices = [
  {
    id: '1',
    title: 'Midterm Examination Schedule published for 2020-2021 Session',
    status: 'Published'
  },
  {
    id: '2',
    title: 'Guest Lecture: Modern Applications of Machine Learning',
    status: 'Published'
  },
  {
    id: '3',
    title: 'Draft: Departmental Picnic Routine',
    status: 'Draft'
  }
];

export function ManageNotices() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>
            Notice Board Management
          </h2>
          <p className='text-sm text-slate-600'>
            Add, edit, or remove notices from the public portal.
          </p>
        </div>
        <Button className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'>
          + Create New Notice
        </Button>
      </div>

      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='rounded-t-xl border-b border-slate-100 bg-slate-50 pb-4'>
          <CardTitle className='text-lg'>Recent Notices</CardTitle>
          <CardDescription>
            A summary of recently created notices.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='divide-y divide-slate-100'>
            {mockNotices.map((notice) => (
              <div
                key={notice.id}
                className='flex flex-col items-start justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:p-6'
              >
                <div className='space-y-1'>
                  <h4 className='font-semibold text-slate-800'>
                    {notice.title}
                  </h4>
                  <div className='flex items-center gap-4 text-xs text-slate-500'>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${notice.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {notice.status}
                    </span>
                  </div>
                </div>
                <div className='flex shrink-0 items-center gap-2'>
                  <Button variant='outline' size='sm' className='h-8 shadow-sm'>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

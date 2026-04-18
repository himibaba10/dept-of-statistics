import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const mockGallery = [
  {
    id: '1',
    url: 'https://picsum.photos/id/10/300/300',
    title: 'Seminar: Data Science 101'
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/20/300/300',
    title: 'Farewell 2025'
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/30/300/300',
    title: 'Annual Picnic'
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/40/300/300',
    title: 'Hackathon Winners'
  }
];

export function ManageGallery() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#1E3A8A]'>
            Gallery Management
          </h2>
          <p className='text-sm text-slate-600'>
            Upload event photos that are displayed publicly.
          </p>
        </div>
        <Button className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'>
          <ImagePlus className='mr-2 h-4 w-4' /> Upload Item
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
        {mockGallery.map((item) => (
          <Card
            key={item.id}
            className='group overflow-hidden border-slate-200 object-cover'
          >
            <div className='relative aspect-square w-full object-cover'>
              <Image
                src={item.url}
                alt={item.title}
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-full bg-red-500/90 p-2 text-white hover:bg-red-600 hover:text-white'
                >
                  <Trash2 className='h-5 w-5' />
                </Button>
              </div>
            </div>
            <CardContent className='border-t border-slate-100 bg-white p-3 text-center'>
              <p className='truncate text-xs font-semibold text-slate-800'>
                {item.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

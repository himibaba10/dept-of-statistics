import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='text-navy flex min-h-[50vh] w-full flex-col items-center justify-center'>
      <Loader2 className='text-navy/70 h-10 w-10 animate-spin' />
      <p className='mt-4 animate-pulse font-serif text-lg font-semibold'>
        Loading...
      </p>
    </div>
  );
}

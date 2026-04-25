import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-[70vh] w-full flex-col items-center justify-center px-4 text-center'>
      <div className='mb-4 rounded-full bg-slate-50 p-4'>
        <FileQuestion className='h-12 w-12 text-slate-400' />
      </div>
      <h2 className='text-navy mb-2 font-serif text-4xl font-bold'>404</h2>
      <h3 className='mb-4 font-sans text-xl font-semibold text-slate-700'>
        Page Not Found
      </h3>
      <p className='mb-8 max-w-md text-slate-500'>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href='/'
        className='bg-navy hover:bg-navy/90 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all'
      >
        Return Home
      </Link>
    </div>
  );
}

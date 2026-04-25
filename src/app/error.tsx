'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-[70vh] w-full flex-col items-center justify-center px-4 text-center'>
      <div className='mb-4 rounded-full bg-red-50 p-4'>
        <AlertTriangle className='h-12 w-12 text-red-500' />
      </div>
      <h2 className='text-navy mb-2 font-serif text-3xl font-bold'>
        Something went wrong!
      </h2>
      <p className='mb-6 max-w-md text-slate-500'>
        {error.message ||
          'An unexpected error occurred while trying to process your request.'}
      </p>
      <button
        onClick={() => reset()}
        className='bg-navy hover:bg-navy/90 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all'
      >
        Try again
      </button>
    </div>
  );
}

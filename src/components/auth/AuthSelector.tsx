'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AuthSelector() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading)
    return <div className='text-lg text-slate-500'>Loading auth...</div>;

  return (
    <div className='flex items-center gap-2 rounded-lg border bg-slate-50 p-2 text-lg shadow-sm'>
      {user ? (
        <>
          <span className='font-semibold text-slate-700 capitalize'>
            {user.role}
          </span>
          <span className='text-slate-500'>({user.name})</span>
          <Button
            variant='ghost'
            onClick={logout}
            className='ml-2 h-9 px-3 text-lg'
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <span className='mr-2 text-lg text-slate-500'>Login:</span>
          <Link href='/auth/student/login'>
            <Button variant='outline' className='h-9 px-3 text-lg'>
              Student
            </Button>
          </Link>
          <Link href='/auth/teacher/login'>
            <Button variant='outline' className='h-9 px-3 text-lg'>
              Faculty
            </Button>
          </Link>
          <Link href='/auth/official/login'>
            <Button variant='outline' className='h-9 px-3 text-lg'>
              Official
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

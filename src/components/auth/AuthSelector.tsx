'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';

export function AuthSelector() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading)
    return <div className='text-lg text-slate-500'>Loading auth...</div>;

  return (
    <div className='flex items-center gap-2 rounded-lg border bg-slate-50 p-2 text-lg shadow-sm'>
      {user ? (
        <>
          <span className='font-semibold text-slate-700'>
            {user.role === 'student' && 'Student'}
            {user.role === 'teacher' && 'Teacher'}
            {user.role === 'official' && 'Official'}
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
          <span className='mr-2 text-lg text-slate-500'>Login as:</span>
          <Button
            variant='outline'
            onClick={() => login('student')}
            className='h-9 px-3 text-lg'
          >
            Student
          </Button>
          <Button
            variant='outline'
            onClick={() => login('teacher')}
            className='h-9 px-3 text-lg'
          >
            Teacher
          </Button>
          {/* Official auth is handled via /auth/official/login */}
        </>
      )}
    </div>
  );
}

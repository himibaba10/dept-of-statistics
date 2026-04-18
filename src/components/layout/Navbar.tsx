import { AuthSelector } from '@/components/auth/AuthSelector';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white shadow-sm'>
      <div className='container mx-auto flex h-auto flex-wrap items-center justify-between gap-4 px-4 py-2 md:h-16 md:py-0'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='shrink-0 text-xl font-bold text-[#1E3A8A]'>
            Dept. of Statistics
          </Link>
          <nav className='hidden gap-6 lg:flex'>
            <Link
              href='/students'
              className='text-base font-medium transition-colors hover:text-[#1E3A8A]'
            >
              Students
            </Link>
            <Link
              href='/teachers'
              className='text-base font-medium transition-colors hover:text-[#1E3A8A]'
            >
              Teachers
            </Link>
            <Link
              href='/courses'
              className='text-base font-medium transition-colors hover:text-[#1E3A8A]'
            >
              Courses
            </Link>
            <Link
              href='/facilities'
              className='text-base font-medium transition-colors hover:text-[#1E3A8A]'
            >
              Facilities
            </Link>
            <Link
              href='/notice-board'
              className='text-base font-medium transition-colors hover:text-[#1E3A8A]'
            >
              Notice Board
            </Link>
          </nav>
        </div>
        <div className='flex w-full items-center gap-4 overflow-x-auto md:w-auto'>
          <AuthSelector />
          <Link href='/profile/edit' className='shrink-0'>
            <Button variant='outline' className='text-base'>
              Profile
            </Button>
          </Link>
          <Link href='/admin' className='shrink-0'>
            <Button className='bg-[#1E3A8A] text-base text-white hover:bg-[#1E3A8A]/90'>
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

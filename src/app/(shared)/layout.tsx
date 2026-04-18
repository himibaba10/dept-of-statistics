import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function SharedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col bg-[#F8FAFC]'>
      <Navbar />
      <main className='mx-auto w-full max-w-4xl flex-1 px-4 py-8'>
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { AuthProvider } from '@/components/providers/AuthProvider';
import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Department of Statistics',
  description: 'University Statistics Department Portal'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${nunitoSans.variable} h-full font-sans text-lg antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

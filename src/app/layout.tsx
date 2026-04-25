import { AuthProvider } from '@/components/providers/AuthProvider';
import type { Metadata } from 'next';
import { Nunito_Sans, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800']
});

const playfairDisplay = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'Department of Statistics — University of Chittagong',
  description:
    'Official portal of the Department of Statistics, University of Chittagong. Advancing knowledge through rigorous analytical thinking and research excellence.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${nunitoSans.variable} ${playfairDisplay.variable} h-full font-sans antialiased`}
    >
      <body className='flex min-h-full flex-col justify-center'>
        <AuthProvider>
          {children}
          <Toaster position='top-right' />
        </AuthProvider>
      </body>
    </html>
  );
}

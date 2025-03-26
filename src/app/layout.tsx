import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StepStyle | Premium Footwear',
  description: 'Shop the latest collection of premium shoes for every occasion',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow pt-16 sm:pt-18 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
} 
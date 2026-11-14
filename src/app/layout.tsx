import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingMobileBar from '@/components/FloatingMobileBar';
import SmoothScrollInit from '@/components/SmoothScrollInit';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#18120F',
};

export const metadata: Metadata = {
  title: 'Daily Coffee Drip - Artisanal Roastery & Craft Kitchen',
  description:
    'Experience extraordinary precision at Daily Coffee Drip in Indiranagar, Bengaluru. 100% pure vegetarian artisanal kitchen, single-origin micro-lots, and unhurried hospitality.',
  keywords: [
    'Daily Coffee Drip',
    'Specialty Coffee Bangalore',
    'Indiranagar Roastery',
    'Pure Veg Cafe Bangalore',
    'Artisanal Coffee',
    'Micro-lot Roaster',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="bg-[#FAF7F2] text-[#18120F] antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#C8652D] selection:text-white">
        <SmoothScrollInit />
        <Header />
        <main className="flex-1 w-full pt-16 sm:pt-20">{children}</main>
        <Footer />
        <FloatingMobileBar />
      </body>
    </html>
  );
}

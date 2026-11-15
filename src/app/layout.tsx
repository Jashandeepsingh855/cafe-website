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
  title: 'Daily Coffee Drip - Artisanal Cafe & Restaurant',
  description:
    'Experience extraordinary hospitality at Daily Coffee Drip in Indiranagar, Bengaluru. 100% pure vegetarian artisanal kitchen, single-origin brews, sourdough pizzas, smash burgers, and comfortable dining spaces.',
  keywords: [
    'Daily Coffee Drip',
    'Specialty Coffee Bangalore',
    'Indiranagar Cafe and Restaurant',
    'Pure Veg Cafe Bangalore',
    'Artisanal Coffee',
    'Indiranagar Pure Veg Dining',
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
        {/* Global Parallax Scroll Progress Indicator */}
        <div
          id="global-scroll-progress"
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C8652D] via-[#E8A55B] to-[#C8652D] z-[105] origin-left scale-x-0 pointer-events-none shadow-[0_1px_10px_rgba(200,101,45,0.45)]"
          style={{ zIndex: 105 }}
        />
        <SmoothScrollInit />
        <Header />
        <main className="flex-1 w-full pt-16 sm:pt-20 relative z-0" style={{ isolation: 'isolate' }}>
          {children}
        </main>
        <Footer />
        <FloatingMobileBar />
      </body>
    </html>
  );
}

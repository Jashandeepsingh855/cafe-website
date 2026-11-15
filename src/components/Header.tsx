'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  Phone,
  Menu as MenuIcon,
  X,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Clock,
  Utensils,
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const pathname = usePathname();

  useEffect(() => {
    const syncSite = () => {
      setSite(getClientSiteConfig());
    };
    syncSite();

    window.addEventListener('storage', syncSite);
    window.addEventListener('dcd_site_updated', syncSite);
    return () => {
      window.removeEventListener('storage', syncSite);
      window.removeEventListener('dcd_site_updated', syncSite);
    };
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-[#E5E2DD]/80 shadow-[0_1px_12px_rgba(24,18,15,0.03)]"
        style={{ zIndex: 100 }}
      >
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18120F] flex items-center justify-center text-[#FAF7F2] shadow-sm transition-transform group-hover:scale-105 shrink-0">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8652D]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base sm:text-lg lg:text-[19px] tracking-tight leading-none text-[#18120F] truncate">
                  {site.name}
                </span>
                <span className="hidden sm:block text-[10px] sm:text-[11px] font-bold text-[#C8652D] tracking-widest uppercase mt-1 truncate">
                  {site.tagline}
                </span>
              </div>
            </Link>

            {/* Pure Veg Pill badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE8E3] text-[#544E49] border border-[#E5E2DD]">
              <span className="w-2 h-2 rounded-full bg-[#C8652D]"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#18120F]">
                100% Pure Veg
              </span>
            </div>
          </div>

          {/* Desktop Navigation & Actions: Home, Menu, About Us, and Book a Table right next to each other */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                        : 'text-[#544E49] hover:text-[#18120F] hover:bg-[#F0EDE9]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Book Table CTA - sits directly alongside About Us */}
            <Link
              href="/reservation"
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                pathname === '/reservation'
                  ? 'bg-[#C8652D] text-white shadow-md'
                  : 'bg-[#18120F] text-[#FAF7F2] hover:bg-[#C8652D] hover:text-white'
              }`}
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile Right Controls (< lg) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Mobile Quick Menu Pill (< 640px) */}
            <Link
              href="/menu"
              className="sm:hidden px-3.5 py-1.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-bold text-xs hover:bg-[#C8652D] transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <Utensils className="w-3 h-3 text-[#C8652D]" />
              <span>Menu</span>
            </Link>

            {/* Tablet Book Table Pill (640px to 1024px) */}
            <Link
              href="/reservation"
              className="hidden sm:inline-flex lg:hidden items-center justify-center px-4 py-2 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-xs hover:bg-[#C8652D] hover:text-white transition-all shadow-sm"
            >
              Book a Table
            </Link>

            {/* Mobile Menu Hamburger (>= 44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#18120F] bg-[#F0EDE9] hover:bg-[#EBE8E3] active:scale-95 border border-[#E5E2DD] transition-all shadow-sm shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#18120F]" />
              ) : (
                <MenuIcon className="w-6 h-6 text-[#18120F]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          style={{ zIndex: 110 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer from Right */}
      <div
        data-lenis-prevent
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-[120] w-[85%] max-w-sm bg-[#FAF7F2] shadow-2xl border-l border-[#E5E2DD] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        style={{ zIndex: 120 }}
      >
        {/* Drawer Header */}
        <div className="p-5 pb-4 border-b border-[#E5E2DD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#18120F] flex items-center justify-center text-[#FAF7F2] shrink-0">
              <Coffee className="w-4 h-4 text-[#C8652D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-[#18120F]">
                {site.name}
              </span>
              <span className="text-[10px] font-bold text-[#186a22] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#186a22]" /> 100% Pure Veg
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation"
            className="w-10 h-10 rounded-full bg-[#F0EDE9] hover:bg-[#EBE8E3] flex items-center justify-center text-[#18120F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Navigation Links */}
        <div className="p-5 flex-1 overflow-y-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8652D] px-1 block mb-2">
            Navigation Menu
          </span>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-base flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                    : 'bg-white text-[#18120F] border border-[#E5E2DD] hover:bg-[#F0EDE9]'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </Link>
            );
          })}

        </div>

        {/* Drawer Bottom - CTAs & Contact */}
        <div className="p-5 pt-4 border-t border-[#E5E2DD] space-y-3 bg-[#F6F3EE]">
          <Link
            href="/reservation"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[48px] w-full rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>Book a Table (Instant Confirmation)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href={`https://wa.me/${site.contact.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#E5E2DD] text-[#18120F] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${site.contact.phoneRaw}`}
              className="min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#E5E2DD] text-[#18120F] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>Call Cafe</span>
            </a>
          </div>

          <div className="pt-2 text-center text-[11px] text-[#857D77] space-y-0.5">
            <p className="flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-[#C8652D]" />
              <span>{site.address.line1}, {site.address.area}</span>
            </p>
            <p className="flex items-center justify-center gap-1 text-[10px]">
              <Clock className="w-3 h-3 text-[#C8652D]" />
              <span>{site.hours.openTime} – {site.hours.closingTime} ({site.hours.isOpenNow ? 'Open Now' : 'Closed'})</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
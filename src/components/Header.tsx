'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Phone, Menu, X, ArrowRight, ShieldCheck, Heart, SlidersHorizontal } from 'lucide-react';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const pathname = usePathname();

  useEffect(() => {
    setSite(getClientSiteConfig());
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Full Menu (140+)', href: '/menu' },
    { name: 'The Roastery', href: '/roastery' },
    { name: 'Table Reservation', href: '/reservation' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[#E5E2DD]/80 shadow-[0_1px_12px_rgba(24,18,15,0.03)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#18120F] flex items-center justify-center text-[#FAF7F2] shadow-sm transition-transform group-hover:scale-105">
              <Coffee className="w-5 h-5 text-[#C8652D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-[19px] tracking-tight leading-none text-[#18120F]">
                {site.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#C8652D] tracking-widest uppercase mt-1">
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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
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

        {/* Actions & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Owner Admin link */}
          <Link
            href="/admin"
            title="Owner Portal"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              pathname.startsWith('/admin')
                ? 'bg-[#C8652D] text-white shadow-sm'
                : 'text-[#544E49] hover:bg-[#EBE8E3] hover:text-[#18120F]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>

          <Link
            href="/menu"
            aria-label="View favorite drinks"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#544E49] hover:bg-[#EBE8E3] hover:text-[#18120F] transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C8652D] text-white text-[10px] font-bold flex items-center justify-center leading-none">
              3
            </span>
          </Link>

          <a
            href={`tel:${site.contact.phoneRaw}`}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0EDE9] border border-[#E5E2DD] text-[#544E49] hover:border-[#C8652D]/50 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#C8652D]" />
            <span className="text-xs font-bold text-[#18120F]">{site.contact.phone}</span>
          </a>

          <Link
            href="/reservation"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-sm hover:bg-[#221A16] hover:text-white transition-all shadow-sm"
          >
            Book a Table
          </Link>

          {/* Mobile Menu Hamburger (>= 44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#18120F] bg-[#F0EDE9] hover:bg-[#EBE8E3] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent
          className="lg:hidden fixed inset-x-0 top-20 bg-[#FAF7F2] border-b border-[#E5E2DD] shadow-xl p-6 flex flex-col gap-5 max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DD]">
            <span className="text-xs font-bold tracking-wider uppercase text-[#C8652D]">
              Bengaluru Roastery Sanctuary
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18120F] text-[#FAF7F2] text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8652D]" /> 100% Pure Veg
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-base transition-colors ${
                    isActive
                      ? 'bg-[#18120F] text-[#FAF7F2]'
                      : 'bg-[#F6F3EE] text-[#18120F] hover:bg-[#EBE8E3]'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </Link>
              );
            })}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-base transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-[#C8652D] text-white'
                  : 'bg-[#EBE8E3] text-[#18120F] hover:bg-[#D4CECA]'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C8652D]" />
                <span>Café Owner Admin Portal</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] w-full rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Book a Table (No Deposit)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${site.contact.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full rounded-full bg-[#F0EDE9] text-[#18120F] font-semibold text-sm flex items-center justify-center gap-2 border border-[#E5E2DD]"
            >
              <span>Chat with Roastery Concierge</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
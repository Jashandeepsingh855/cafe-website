'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Share2, MapPin, Play } from 'lucide-react';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

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

  return (
    <footer className="w-full bg-[#18120F] text-[#FAF7F2] pt-10 sm:pt-12 pb-24 md:pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 items-start">
          {/* Brand Info & Socials */}
          <div className="lg:col-span-6 flex flex-col items-start gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C8652D] flex items-center justify-center text-[#FAF7F2] shadow-sm shrink-0">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#FAF7F2]">
                {site.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#D4CECA] max-w-md leading-relaxed">
              {site.subTagline}. Bengaluru&apos;s premier specialty coffee destination featuring precision micro-lot roasting &amp; artisanal wood-hearth craft kitchen.
            </p>

            {/* Follow on Instagram & Social Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={site.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#C8652D] text-[#FAF7F2] text-xs font-bold transition-all border border-white/10 shadow-xs group"
                aria-label="Follow Daily Coffee Drip on Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-[#C8652D] group-hover:text-white transition-colors" />
                <span>Follow on Instagram</span>
              </a>

              <a
                href={site.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cafe Location"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
              </a>

              <a
                href={site.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Brewing Rituals Video"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: site.name,
                      text: `${site.name} - ${site.tagline}`,
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                aria-label="Share Cafe"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-6 sm:gap-8 lg:justify-items-end">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider mb-0.5">Cafe &amp; Kitchen</span>
              <Link href="/menu" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Menu</Link>
              <Link href="/about" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">About Us</Link>
              <Link href="/about" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Our Story</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider mb-0.5">Experience</span>
              <Link href="/reservation" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Table Booking</Link>
              <Link href="/about" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Dining Spaces</Link>
              <a href={site.address.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Find Location</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider mb-0.5">Concierge</span>
              <a href={`tel:${site.contact.phoneRaw}`} className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Direct Call</a>
              <a href={`https://wa.me/${site.contact.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#D4CECA] text-xs border-t border-white/5">
          <p>© {new Date().getFullYear()} {site.name}. {site.tagline}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Coffee className="w-3.5 h-3.5 text-[#C8652D]" />
            <span>Precision Roasted Micro-Lots • 100% Pure Vegetarian</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

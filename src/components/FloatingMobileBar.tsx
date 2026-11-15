'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';

export default function FloatingMobileBar() {
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

  const whatsappUrl = `https://wa.me/${site.contact.whatsappRaw}?text=${encodeURIComponent(
    `Hello ${site.name}! I would like to order from your Indiranagar Roastery menu.`
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E5E2DD] px-4 py-3 shadow-[0_-4px_20px_rgba(24,18,15,0.08)]">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* WhatsApp Order */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl bg-[#25D366] text-white font-bold text-[11px] shadow-sm transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Direct Call */}
        <a
          href={`tel:${site.contact.phoneRaw}`}
          className="min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl bg-[#F0EDE9] text-[#18120F] border border-[#E5E2DD] font-bold text-[11px] transition-transform active:scale-95"
        >
          <Phone className="w-4 h-4 text-[#C8652D] mb-0.5" />
          <span>Direct Call</span>
        </a>

        {/* Book Table */}
        <Link
          href="/reservation"
          className="min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl bg-[#18120F] text-[#FAF7F2] font-bold text-[11px] shadow-sm transition-transform active:scale-95"
        >
          <CalendarCheck className="w-4 h-4 text-[#C8652D] mb-0.5" />
          <span>Book Table</span>
        </Link>
      </div>
    </div>
  );
}
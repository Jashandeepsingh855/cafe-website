'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';

export default function FloatingMobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E5E2DD] px-4 py-3 shadow-[0_-4px_20px_rgba(24,18,15,0.08)]">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* WhatsApp Order */}
        <a
          href="https://wa.me/914085550120?text=Hello%20Daily%20Coffee%20Drip!%20I%20would%20like%20to%20order%20from%20your%20menu."
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl bg-[#25D366] text-white font-bold text-[11px] shadow-sm transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Direct Call */}
        <a
          href="tel:+914085550120"
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

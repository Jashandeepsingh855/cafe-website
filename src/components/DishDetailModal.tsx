'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, ShieldCheck, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { MenuItem } from '@/data/menu';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, getWhatsAppOrderUrl, SiteConfig } from '@/config/site';
import { stopLenis, startLenis } from '@/lib/lenis-gsap';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    setSite(getClientSiteConfig());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      stopLenis();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.dataset.modalScrollY = scrollY.toString();
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.classList.add('dish-modal-open');
      document.body.classList.add('dish-modal-open');

      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target?.closest('[data-modal-scrollable]')) {
          e.preventDefault();
        }
      };

      window.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('touchmove', handleTouchMove);
        const savedScrollY = parseInt(document.body.dataset.modalScrollY || '0', 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.classList.remove('dish-modal-open');
        document.body.classList.remove('dish-modal-open');
        delete document.body.dataset.modalScrollY;
        window.scrollTo(0, savedScrollY);
        startLenis();
      };
    } else {
      document.documentElement.classList.remove('dish-modal-open');
      document.body.classList.remove('dish-modal-open');
    }
  }, [item, onClose]);

  if (!item) return null;

  const whatsappUrl = getWhatsAppOrderUrl(item.name, item.price, site.contact.whatsappRaw);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 transition-opacity animate-in fade-in"
      style={{ zIndex: 200 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5E2DD] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-[#FAF7F2] shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[#D4CECA]"></div>
        </div>

        {/* Scrollable Modal Body */}
        <div data-lenis-prevent data-modal-scrollable className="flex-1 overflow-y-auto overscroll-contain">
          {/* Modal Header Image */}
          <div className="relative w-full h-44 sm:h-56 bg-[#EBE8E3] overflow-hidden shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 550px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18120F]/70 via-transparent to-transparent"></div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md flex items-center justify-center text-[#18120F] hover:bg-[#FAF7F2] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Category & Prep Time Badges */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8652D] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                {item.category}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18120F]/80 backdrop-blur-md text-[11px] font-bold">
                <Clock className="w-3 h-3 text-[#C8652D]" />
                <span>{item.prepTime}</span>
              </div>
            </div>
          </div>

          {/* Dish Details */}
          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#18120F] tracking-tight leading-tight">
                  {item.name}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CaEcc0] text-[#186a22] text-[11px] font-bold">
                    <ShieldCheck className="w-3 h-3" /> 100% Pure Veg
                  </span>
                  {item.tags.includes('pure-jain') && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EBE8E3] text-[#18120F] text-[11px] font-semibold">
                      Jain Option
                    </span>
                  )}
                  {item.tags.includes('chef-special') && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFDBCB] text-[#944516] text-[11px] font-bold">
                      <Sparkles className="w-3 h-3" /> Chef Special
                    </span>
                  )}
                  {item.inStock === false && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#C8652D]">₹{item.price}</span>
                <span className="block text-[10px] text-[#544E49] mt-0.5 font-medium">incl. taxes</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#F6F3EE] p-3.5 rounded-xl border border-[#E5E2DD]">
              <p className="text-[#18120F] text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Dish Story (if available) */}
            {item.story && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8652D]">
                  The Kitchen Craft Story
                </span>
                <p className="text-xs text-[#544E49] leading-relaxed italic bg-white p-3 rounded-xl border border-[#E5E2DD]/70">
                  &ldquo;{item.story}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Direct Order Actions (always visible at bottom) */}
        <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-t border-[#E5E2DD] shrink-0 shadow-[0_-4px_16px_rgba(24,18,15,0.06)] flex flex-col gap-2">
          {/* 1-Tap WhatsApp Order */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] w-full rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>1-Tap WhatsApp Order (₹{item.price})</span>
          </a>

          {/* Swiggy & Zomato Options */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={site.links.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] rounded-full bg-[#E23744] hover:bg-[#CB202D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.99]"
            >
              <span>Order on Zomato</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <a
              href={site.links.swiggy}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] rounded-full bg-[#FC8019] hover:bg-[#E26E10] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.99]"
            >
              <span>Order on Swiggy</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

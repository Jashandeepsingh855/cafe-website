'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, ShieldCheck, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { MenuItem } from '@/data/menu';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, getWhatsAppOrderUrl, SiteConfig } from '@/config/site';

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
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const whatsappUrl = getWhatsAppOrderUrl(item.name, item.price, site.contact.whatsappRaw);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity animate-in fade-in"
      style={{ zIndex: 150 }}
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl max-h-[88vh] sm:max-h-[90vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5E2DD] flex flex-col overflow-y-auto overflow-x-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#D4CECA]"></div>
        </div>

        {/* Modal Header Image */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#EBE8E3] overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18120F]/70 via-transparent to-transparent"></div>

          {/* Close button (>=44px touch target) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md flex items-center justify-center text-[#18120F] hover:bg-[#FAF7F2] shadow-md transition-transform hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge over image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="px-3 py-1 rounded-full bg-[#C8652D] text-xs font-bold uppercase tracking-wider shadow-sm">
              {item.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/80 backdrop-blur-md text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>{item.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5 flex-1">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18120F] tracking-tight">
                {item.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CaEcc0] text-[#186a22] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Pure Veg
                </span>
                {item.tags.includes('pure-jain') && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8E3] text-[#18120F] text-xs font-semibold">
                    Jain Option
                  </span>
                )}
                {item.tags.includes('chef-special') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDBCB] text-[#944516] text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Chef Special
                  </span>
                )}
                {item.inStock === false && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    Currently Sold Out
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl font-extrabold text-[#C8652D]">₹{item.price}</span>
              <span className="block text-[11px] text-[#544E49] mt-0.5 font-medium">inclusive of taxes</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#F6F3EE] p-4 rounded-2xl border border-[#E5E2DD]">
            <p className="text-[#18120F] text-sm sm:text-base leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Dish Craft & Story */}
          {item.story && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
                The Kitchen &amp; Brew Craft Story
              </span>
              <p className="text-xs sm:text-sm text-[#544E49] leading-relaxed italic bg-white p-3.5 rounded-xl border border-[#E5E2DD]/70">
                &ldquo;{item.story}&rdquo;
              </p>
            </div>
          )}

          {/* Direct Order Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#18120F]">
              Direct Table / Delivery Ordering
            </span>

            {/* 1-Tap WhatsApp Order */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>1-Tap WhatsApp Order (₹{item.price})</span>
            </a>

            {/* Swiggy & Zomato Options */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={site.links.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-full bg-[#E23744] hover:bg-[#CB202D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Order on Zomato</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
              <a
                href={site.links.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-full bg-[#FC8019] hover:bg-[#E26E10] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Order on Swiggy</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
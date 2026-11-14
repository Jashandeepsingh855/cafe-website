'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Coffee, ArrowRight, Share2, MapPin, Camera, Play, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#18120F] text-[#FAF7F2] pt-16 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8652D] flex items-center justify-center text-[#FAF7F2] shadow-sm">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#FAF7F2]">
                Daily Coffee Drip
              </span>
            </div>
            <p className="text-sm text-[#D4CECA] max-w-sm leading-relaxed">
              Bengaluru&apos;s premier specialty coffee destination featuring precision micro-lot roasting &amp; artisanal wood-hearth craft kitchen. 100% Pure Vegetarian.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Roastery Location"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Brewing Rituals Video"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <Play className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Daily Coffee Drip',
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                aria-label="Share Roastery"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8652D] hover:text-white flex items-center justify-center text-[#FAF7F2] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="font-bold text-lg text-[#FAF7F2]">Get Roastery Updates</span>
            <p className="text-sm text-[#D4CECA]">
              Receive seasonal micro-lot releases, single-origin cupping invitations, and roaster notes.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-full text-sm text-[#FAF7F2]">
                <CheckCircle className="w-4 h-4 text-[#C8652D]" />
                <span>Thank you! You are on our private cupping list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md bg-white/10 rounded-full p-1.5 border border-white/10 focus-within:border-[#C8652D] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-transparent px-4 py-2 text-[#FAF7F2] placeholder:text-[#FAF7F2]/40 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-10 h-10 rounded-full bg-[#C8652D] text-white hover:bg-[#B45309] flex items-center justify-center shrink-0 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider mb-1">Roastery</span>
              <Link href="/menu" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Full Menu</Link>
              <Link href="/roastery" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">About Us</Link>
              <Link href="/roastery" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Spaces</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider mb-1">Experience</span>
              <Link href="/reservation" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Table Booking</Link>
              <Link href="/roastery" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Cupping Lab</Link>
              <Link href="/reservation" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Location</Link>
            </div>

            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider mb-1">Concierge</span>
              <a href="tel:+914085550120" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">Direct Call</a>
              <a href="https://wa.me/914085550120" target="_blank" rel="noopener noreferrer" className="text-sm text-[#D4CECA] hover:text-[#FAF7F2] transition-colors">WhatsApp</a>
              <span className="text-xs text-[#857D77]">Indiranagar, Bangalore</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#D4CECA] text-xs border-t border-white/5">
          <p>© {new Date().getFullYear()} Daily Coffee Drip. Artisanal Roastery &amp; Craft Kitchen. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-[#C8652D]" />
            <span>Precision Roasted Micro-Lots • 100% Pure Vegetarian</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

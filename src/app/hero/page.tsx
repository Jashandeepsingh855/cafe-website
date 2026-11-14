'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Heart, Calendar, Coffee, Check, Clock, Star, ShieldCheck, Flame, ShoppingBag } from 'lucide-react';

export default function HeroShowcasePage() {
  const [isIced, setIsIced] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [toastVisible, setToastVisible] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleOrder = () => {
    setToastVisible(true);
    const text = encodeURIComponent(
      `Hello Daily Coffee Drip! I would like to order your ${
        isIced ? 'Iced Cloud Caramel Latte (₹260)' : 'Signature Caramel Latte (₹240)'
      } from your Indiranagar Roastery.`
    );
    setTimeout(() => {
      window.open(`https://wa.me/914085550120?text=${text}`, '_blank');
    }, 400);
    setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#12100e] text-[#FAF7F2] overflow-x-hidden flex flex-col justify-between">
      {/* Background Ambient Pulse Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#fbbf24]/20 via-[#f97316]/15 to-transparent blur-[110px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ea580c]/15 via-[#fbbf24]/10 to-transparent blur-[130px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 flex-1 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 sm:gap-7 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-sm hover:border-amber-400/60 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="tracking-wide">✨ Artisanal Roasters &amp; Cozy Vibes</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] text-white">
              Wake Up to the <br />
              <span className="bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(249,115,22,0.35)]">
                Perfect Brew
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#D4CECA] max-w-xl leading-relaxed font-normal">
              Handcrafted from single-origin shade-grown beans roasted in small batches. Experience velvety crema, warm acoustic hearth comfort, and 100% pure vegetarian artisanal dining.
            </p>

            {/* Two Prominent CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/menu"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm text-[#12100e] bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#f59e0b] shadow-lg shadow-orange-500/25 hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300 min-h-[50px] overflow-hidden"
              >
                <Coffee className="w-5 h-5 text-[#12100e]" />
                <span className="tracking-wide">Explore Our Menu</span>
                <ArrowRight className="w-4 h-4 text-[#12100e] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/reservation"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm text-white bg-white/[0.04] backdrop-blur-md border border-white/10 hover:bg-white/[0.08] hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[50px]"
              >
                <Calendar className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="tracking-wide">Book a Table</span>
              </Link>
            </div>

            {/* 3-Column Metric Highlights Bar */}
            <div className="pt-6 sm:pt-8 w-full border-t border-white/[0.08] mt-2">
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div className="flex flex-col items-start gap-1 p-3 sm:p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-colors group">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Check className="w-4 h-4" />
                    <span className="font-extrabold text-base sm:text-xl text-white group-hover:text-amber-300 transition-colors">100%</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-amber-400/90">Organic Beans</span>
                  <span className="text-[10px] sm:text-[11px] text-[#857D77] hidden xs:block">Shade-grown single origin</span>
                </div>

                <div className="flex flex-col items-start gap-1 p-3 sm:p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-colors group">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-base sm:text-xl text-white group-hover:text-amber-300 transition-colors">4.9★</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-amber-400/90">Top Rating</span>
                  <span className="text-[10px] sm:text-[11px] text-[#857D77] hidden xs:block">2,400+ coffee connoisseurs</span>
                </div>

                <div className="flex flex-col items-start gap-1 p-3 sm:p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-colors group">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-extrabold text-base sm:text-xl text-white group-hover:text-amber-300 transition-colors">15 min</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-amber-400/90">Speed Delivery</span>
                  <span className="text-[10px] sm:text-[11px] text-[#857D77] hidden xs:block">Aroma-sealed &amp; hot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Glassmorphism Card */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-md animate-bounce [animation-duration:6s] transition-transform duration-300">
              
              <div className="relative bg-[#1a1613]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-amber-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(249,115,22,0.15)] transition-all duration-300 group">
                
                {/* Top Badge & Heart Pill */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    Signature Craft Pick
                  </span>

                  <button
                    type="button"
                    onClick={toggleLike}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-red-400 transition-all active:scale-90"
                  >
                    <Heart className={`w-4 h-4 transition-transform duration-300 ${liked ? 'fill-red-500 stroke-red-500 scale-125' : ''}`} />
                    <span className="text-xs font-bold text-white">{likeCount}</span>
                  </button>
                </div>

                {/* Dish Visual */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-[#241d18] to-[#161210] border border-white/10 mb-5">
                  <Image
                    src={
                      isIced
                        ? 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80'
                    }
                    alt="Signature Caramel Latte"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-transparent opacity-80"></div>
                  
                  {/* Hot/Iced Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsIced(false)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                          !isIced ? 'bg-amber-500 text-[#12100e]' : 'bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        Hot ☕
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsIced(true)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                          isIced ? 'bg-amber-500 text-[#12100e]' : 'bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        Iced 🧊
                      </button>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">
                      {isIced ? '18h Cold Brew' : '93.5°C Pull'}
                    </span>
                  </div>
                </div>

                {/* Details & Price */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {isIced ? 'Iced Cloud Caramel Latte' : 'Signature Caramel Latte'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-[#CaEcc0] bg-[#CaEcc0]/10 px-2 py-0.5 rounded-full border border-[#CaEcc0]/20">100% Pure Veg</span>
                      <span className="text-[11px] text-[#857D77] font-semibold">Chikmagalur 1,350m</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                      {isIced ? '₹260' : '₹240'}
                    </span>
                    <span className="text-[10px] text-[#857D77] block mt-0.5">incl. all taxes</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D4CECA] leading-relaxed mb-6 font-normal">
                  {isIced
                    ? 'Slow-drip single origin cold brew over crystal ice, topped with thick salted caramel cloud foam and raw Demerara sugar crystals.'
                    : 'Double ristretto extracted from shade-grown beans, blended with artisanal salted caramel reduction and silky micro-foamed oat milk.'}
                </p>

                {/* Action Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOrder}
                    className="flex-1 min-h-[46px] rounded-xl bg-gradient-to-r from-[#f97316] to-[#fbbf24] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] text-[#12100e] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order via WhatsApp (1-Tap)</span>
                  </button>

                  <Link
                    href="/menu"
                    className="w-12 h-12 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white hover:text-amber-400 transition-all hover:scale-105 active:scale-95 shrink-0"
                    title="View Full Menu"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Toast Notification */}
                {toastVisible && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#fbbf24] text-[#12100e] px-4 py-2 rounded-xl font-bold text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
                    ✨ Opening WhatsApp Concierge...
                  </div>
                )}
              </div>

              {/* Float badges */}
              <div className="absolute -top-5 -left-5 bg-[#12100e]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 text-amber-300 text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                <span>☕</span>
                <span>Micro-Lot Roast</span>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-[#12100e]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-500/30 text-orange-400 text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                <span>✨</span>
                <span>4.9★ Barista Choice</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
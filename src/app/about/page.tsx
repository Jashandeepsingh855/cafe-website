'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Coffee,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Users,
  MapPin,
  Clock,
  Utensils,
  Store,
  Play,
  Pause,
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '@/config/site';

export default function AboutUsPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };
  const founders = [
    {
      name: 'Kabir Mehta',
      role: 'Co-Founder & Head of Coffee Roasting',
      bio: 'SCA-certified Q-grader with a decade exploring shade-grown Arabica estates in the Western Ghats. Kabir oversees every sub-10kg micro-lot roast to ensure sweet stone-fruit clarity, zero bitterness, and precision extraction.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Iyer',
      role: 'Co-Founder & Executive Chef',
      bio: 'Trained pastry chef and sourdough fermenter passionate about elevated vegetarian comfort food. Ananya perfected our 48-hour cold fermented pizza dough, house-churned dipping sauces, and signature brioche smash burgers.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const spaces = [
    {
      title: 'Sunlit Courtyard Patio',
      subtitle: 'Open-Air Veranda Seating',
      desc: 'Sun-dappled terracotta tiles, shaded wooden pergolas, and natural airflow creating an unhurried outdoor dining oasis in the heart of Indiranagar.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVjFXx8SV616u_kR_qTEf-QYx8FjHmQ42o7KsvCGB2zlq7oEb7rZDiDD1nDVioA1I08Vk3dtxIEMIuLOFmTp1gApV_Rxp-fwZd1qzFus35D1qPSzTWug4E9O0SFCPm72L5cV2-9E2MqZ8SKac38i5GqzTMu5qIvYaCejoY6QBogVZx07keXz19b_FsDDvG-xjToW8BZ_sup2rXo8Z6Ojq3MGtYGlsqYzy5O_ormwY',
    },
    {
      title: 'Hearth & Banquette Salon',
      subtitle: 'Velvet Acoustic Dining Room',
      desc: 'Deep olive velvet seating, warm low-temperature acoustic stone hearth, mid-century walnut bookshelves, and soothing amber pendant fixtures.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjQL4v5uL3wjbFMf2Jg9kkkvzM4S6OJm8UjZzKRER4gtKpODOFspYWFgGDSZIM3gbLf1zJP8BTiDNlO76Agc2bcT2BaIOG5yFSbaNABgYma6eC24KjYgSSn0YiN4dK3mP5pCylrR86SCtPwsplzzmE3sWqB5-CUF4BjKQgysEOmGuXS8kZ1MMnA8x-HRb7wyRaJpItFSWACg65jizfTdcxh2Yw55_dmIr7ICnUYc',
    },
    {
      title: 'Barista Bar & Open Kitchen',
      subtitle: 'Manual Pour-Over Stage',
      desc: 'Front-row view of our custom copper espresso machines, manual V60 drip stations, and hot stone oven where sourdough pizzas are fired at 420°C.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASuOKctOhyPYn-XG2KQsV0OExJWeb88Stpw6IwyDM8eAfwL-00VMFHH5Yr-5BPgsG1bzA4sao7FYJOc3JKbgr89Fzpfjm3n6d8UgKGTvn47SzxYekItw-2J1CvTY4_2yI0RIu2-5lW3eQXC-ZSkkau07x_FwAnbUdch4tS6e60o7NEQ07iJLLmcqWDgYlxFY2JfnnJOrJEzWvNX1Da68lQ2nubrkyv7SA1XpJ_ntA',
    },
    {
      title: 'Quiet Creator Lounge',
      subtitle: 'Deep Focus & Ergonomic Desks',
      desc: 'Built specifically for thinkers, coders, writers, and designers. Equipped with individual brass reading lamps, power strips, and symmetric gigabit Wi-Fi.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdX7AFIo5A__-R2_9DECKbWDev45v8GvX18XuJrH5vPznobAe59J87-e3N7Kq0Dn1DccvLpiyX1dGbOR-IYX9L6BJLIammcWkLu8AfCiBWM7-tK2q_-scNI_zqBV-v_zzykziYT_3PhVm6GkgmX-TRsGJ6M_Hk_KeHIh2m8C0jVKPM8wzVBNjMYPexB72MmUkkXZYSMb4HJop70ID6sP9dm3Rdno_Wei679ORlYk8',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* 1. Hero Header Banner with Atmospheric Ambient Video */}
      <section className="relative w-full bg-[#18120F] text-[#FAF7F2] py-24 sm:py-32 overflow-hidden">
        {/* Background Ambient Video Stream */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="/videos/about-hero-poster.jpg"
            className="w-full h-full object-cover scale-105 opacity-35 transition-opacity duration-1000"
          >
            <source src="/videos/about-hero.mp4" type="video/mp4" />
            <source src="/videos/about-hero.webm" type="video/webm" />
          </video>
          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#18120F]/90 via-[#18120F]/75 to-[#18120F]" />
          <div className="absolute inset-0 bg-radial from-[#C8652D]/15 via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(#C8652D_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge & Video Reel Status */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C8652D] text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>Our Origin &amp; Hospitality Story</span>
            </div>

            {/* Video Play/Pause toggle */}
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#186a22] animate-ping' : 'bg-[#857D77]'}`} />
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-[#C8652D]" />
                  <span>Pause Reel</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#C8652D]" />
                  <span>Play Reel</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 text-[#FAF7F2]">
            Crafted for Bengaluru, Rooted in Unhurried Comfort
          </h1>
          <p className="text-base sm:text-lg text-[#D4CECA] leading-relaxed max-w-3xl mx-auto">
            Daily Coffee Drip was born on 12th Main Indiranagar out of a simple conviction: you shouldn&apos;t have to compromise between world-class third-wave specialty coffee and serious artisanal comfort food.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#D4CECA] backdrop-blur-sm shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#C8652D]" />
              <span>100% Pure Vegetarian Kitchen</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#D4CECA] backdrop-blur-sm shadow-xs">
              <Coffee className="w-4 h-4 text-[#C8652D]" />
              <span>Single-Origin Chikmagalur Beans</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#D4CECA] backdrop-blur-sm shadow-xs">
              <Store className="w-4 h-4 text-[#C8652D]" />
              <span>Indiranagar Flagship Dining</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Meet the Founders & Cafe Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full mb-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E5E2DD] flex flex-col lg:flex-row gap-10 items-center">
          <div className="lg:w-1/2 flex flex-col gap-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8652D]/10 text-[#C8652D] text-xs font-bold uppercase tracking-wider w-fit">
              <Users className="w-3.5 h-3.5" />
              <span>The Founders &amp; Kitchen Story</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18120F] tracking-tight leading-tight">
              A Shared Obsession for Honest Food &amp; Precision Brews
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              We started Daily Coffee Drip as an antidote to frantic, rushed cafe culture. We wanted to build a place where morning pour-overs have clear terroir notes, where 48-hour cold-fermented sourdough pizza crusts bubble under wood-hearth heat, and where friends can sit for hours without being hurried.
            </p>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              Every dish on our menu is 100% pure vegetarian, handcrafted with locally sourced Karnataka dairy, cold-pressed oils, fresh herbs, and house-blended seasonings. We take fast food classics and give them the time, technique, and ingredients they deserve.
            </p>

            <div className="pt-4 border-t border-[#E5E2DD] flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image src={founders[0].image} alt={founders[0].name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image src={founders[1].image} alt={founders[1].name} fill className="object-cover" sizes="48px" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#18120F]">Kabir Mehta &amp; Ananya Iyer</span>
                <span className="text-xs text-[#857D77]">Founders &amp; Culinary Crafters</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {founders.map((founder, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E5E2DD] flex flex-col gap-3 group hover:border-[#C8652D]/50 hover:shadow-md transition-all"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#E5E2DD] shadow-inner">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#18120F]">{founder.name}</h3>
                  <span className="text-xs font-semibold text-[#C8652D] block mt-0.5">{founder.role}</span>
                  <p className="text-xs text-[#544E49] mt-2 leading-relaxed">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 4 Culinary & Coffee Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
            Craft Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18120F] tracking-tight mt-1">
            How We Brew &amp; Cook Every Day
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 image-lift-card">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">Direct-Estate Micro-Lots</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              We cup and select single-origin Arabica beans from shade-grown estates in Chikmagalur at 1,350m elevation. Gentle convection roasting in small batches reveals delicate honey and stone-fruit sweetness.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 image-lift-card">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">48-Hour Cold Fermentation</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              Our pizza dough and sourdough loaves undergo 48 hours of slow, cold proofing. Fired over hot stone at 420°C, they emerge airy, digestible, and packed with complex crust flavor.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 image-lift-card">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">100% Pure Vegetarian</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              No meat, no poultry, no eggs, no animal gelatin. We offer dedicated strict Jain preparations (no root veg) and velvety house-blended plant milk for our signature thickshakes and lattes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dining Spaces & Sanctuaries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-10 w-full">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
            Curated Environments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18120F] tracking-tight mt-1">
            Designed for Gathering &amp; Unwinding
          </h2>
          <p className="text-sm sm:text-base text-[#544E49] mt-2">
            Whether you&apos;re meeting over weekend breakfast, catching up with friends over hot pizza, or working with a cold brew, our spaces are crafted for your rhythm.
          </p>
        </div>

        <div data-reveal-grid className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spaces.map((sp, i) => (
            <div
              key={i}
              className="dish-card-reveal image-lift-card group bg-white rounded-3xl border border-[#E5E2DD] shadow-sm hover:shadow-[0_24px_50px_rgba(24,18,15,0.14)] hover:border-[#C8652D]/60 hover:-translate-y-2.5 transition-all duration-300 ease-out flex flex-col overflow-hidden"
            >
              <div className="relative w-full aspect-[16/10] bg-[#E5E2DD] overflow-hidden image-zoom-frame">
                <Image
                  src={sp.image}
                  alt={sp.title}
                  fill
                  className="object-cover scroll-parallax-img scale-105 group-hover:scale-112 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider">
                    {sp.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-[#18120F] mt-0.5">{sp.title}</h3>
                  <p className="text-sm text-[#544E49] mt-2 leading-relaxed">{sp.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#E5E2DD]/70 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#186a22] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bookable for reservations
                  </span>
                  <Link
                    href="/reservation"
                    className="text-xs font-bold text-[#18120F] hover:text-[#C8652D] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Reserve table</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center pt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#18120F] text-[#FAF7F2] font-bold text-sm hover:bg-[#C8652D] transition-colors shadow-md min-h-[48px]"
          >
            <span>Reserve an Unhurried Table</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#18120F] font-bold text-sm border border-[#E5E2DD] hover:border-[#C8652D] transition-colors shadow-sm min-h-[48px]"
          >
            <Utensils className="w-4 h-4 text-[#C8652D]" />
            <span>Explore 140+ Dishes &amp; Brews</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

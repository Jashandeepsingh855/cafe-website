'use client';

import React from 'react';
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
} from 'lucide-react';

export default function RoasteryPage() {
  const spaces = [
    {
      title: 'Al Fresco Veranda',
      subtitle: 'Open-Air Botanical Canopy',
      desc: 'Sunlit terracotta flooring, wooden benches, lush potted ferns, and fiddle leaf figs creating an unhurried outdoor oasis in the heart of Indiranagar.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVjFXx8SV616u_kR_qTEf-QYx8FjHmQ42o7KsvCGB2zlq7oEb7rZDiDD1nDVioA1I08Vk3dtxIEMIuLOFmTp1gApV_Rxp-fwZd1qzFus35D1qPSzTWug4E9O0SFCPm72L5cV2-9E2MqZ8SKac38i5GqzTMu5qIvYaCejoY6QBogVZx07keXz19b_FsDDvG-xjToW8BZ_sup2rXo8Z6Ojq3MGtYGlsqYzy5O_ormwY',
    },
    {
      title: 'Hearth & Banquette Salon',
      subtitle: 'Velvet Acoustic Sanctuary',
      desc: 'Deep olive velvet seating, warm low-temperature acoustic stone hearth, mid-century walnut bookshelves, and calming amber pendant light fixtures.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjQL4v5uL3wjbFMf2Jg9kkkvzM4S6OJm8UjZzKRER4gtKpODOFspYWFgGDSZIM3gbLf1zJP8BTiDNlO76Agc2bcT2BaIOG5yFSbaNABgYma6eC24KjYgSSn0YiN4dK3mP5pCylrR86SCtPwsplzzmE3sWqB5-CUF4BjKQgysEOmGuXS8kZ1MMnA8x-HRb7wyRaJpItFSWACg65jizfTdcxh2Yw55_dmIr7ICnUYc',
    },
    {
      title: 'Backlit Arch Bar',
      subtitle: 'Manual Pour-Over Barista Stage',
      desc: 'Curved Italian terrazzo counter where baristas pull single-origin shots on custom copper machines, calibrate TDS refractometers, and brew slow V60s.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASuOKctOhyPYn-XG2KQsV0OExJWeb88Stpw6IwyDM8eAfwL-00VMFHH5Yr-5BPgsG1bzA4sao7FYJOc3JKbgr89Fzpfjm3n6d8UgKGTvn47SzxYekItw-2J1CvTY4_2yI0RIu2-5lW3eQXC-ZSkkau07x_FwAnbUdch4tS6e60o7NEQ07iJLLmcqWDgYlxFY2JfnnJOrJEzWvNX1Da68lQ2nubrkyv7SA1XpJ_ntA',
    },
    {
      title: 'Quiet Creator Corner',
      subtitle: 'Deep Focus & Ergonomic Desks',
      desc: 'Built specifically for thinkers, coders, writers, and designers. Equipped with individual brass reading lamps, power strips, and symmetric gigabit Wi-Fi.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdX7AFIo5A__-R2_9DECKbWDev45v8GvX18XuJrH5vPznobAe59J87-e3N7Kq0Dn1DccvLpiyX1dGbOR-IYX9L6BJLIammcWkLu8AfCiBWM7-tK2q_-scNI_zqBV-v_zzykziYT_3PhVm6GkgmX-TRsGJ6M_Hk_KeHIh2m8C0jVKPM8wzVBNjMYPexB72MmUkkXZYSMb4HJop70ID6sP9dm3Rdno_Wei679ORlYk8',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* Hero Header */}
      <section className="relative w-full bg-[#18120F] text-[#FAF7F2] py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity scale-110 parallax-bg"
          data-parallax-y="50"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgB5Dju61f1AZ7w8ZZkunbc_VPRKRw7tF1CcWK56UO3X8JE7-yB85nH1tZrKCOPh-VWK7jkpZqA_GdSsaJw6UySmzgxlkxGofYUL-SkdiK7IbpFC0dI8lylMLtInAWzr2I7UGbeXcs8qd1k3uztGOAl95EdgjxsONqSRAYVJse5XLRBNeyFnruaW1evnwGybvkFkWOidlKlrZhRCQbS0w0RhKiduw4D_c1DNwTgqk')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18120F] via-[#18120F]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl parallax-header">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C8652D] text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#C8652D]" />
            <span>The Roastery Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            A Botanical Sanctuary for Specialty Coffee
          </h1>
          <p className="text-base sm:text-lg text-[#D4CECA] leading-relaxed">
            Designed as an antidote to frantic city life. Where shade-grown Chikmagalur beans meet calibrated roasting, stone-hearth culinary craft, and 100% pure vegetarian mindful dining.
          </p>
        </div>
      </section>

      {/* Philosophy Triad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 parallax-card-odd">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">Micro-Lot Cupping Lab</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              Every bean batch is sampled through standardized SCA protocol. We roast in sub-10kg micro-lots to reveal subtle floral, stone-fruit, and cocoa nuances.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 parallax-card-even">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">Wood-Hearth Bakes</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              Our 48-hour cold-fermented sourdoughs and pure vegetarian artisan bakes are stone-fired under wood-hearth heat every morning before dawn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3 parallax-card-odd">
            <div className="w-12 h-12 rounded-2xl bg-[#18120F] text-[#C8652D] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#18120F]">100% Pure Vegetarian</h3>
            <p className="text-sm text-[#544E49] leading-relaxed">
              No meat, no poultry, no eggs. Mindfully curated kitchen with extensive Jain customizations and creamy plant-based oat milk options.
            </p>
          </div>
        </div>
      </section>

      {/* Seating Spaces Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto parallax-header">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
            Curated Environments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18120F] tracking-tight mt-1">
            Choose Your Sanctuary
          </h2>
          <p className="text-sm sm:text-base text-[#544E49] mt-2">
            Each corner is tuned for a distinct frequency of focus, conversation, or sensory coffee appreciation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spaces.map((sp, i) => (
            <div
              key={i}
              className={`group bg-white rounded-3xl overflow-hidden border border-[#E5E2DD] shadow-sm hover:shadow-md transition-all flex flex-col ${
                i % 2 === 0 ? 'parallax-card-odd' : 'parallax-card-even'
              }`}
            >
              <div className="relative w-full aspect-[16/10] bg-[#E5E2DD] overflow-hidden">
                <Image
                  src={sp.image}
                  alt={sp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 parallax-img"
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
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bookable online
                  </span>
                  <Link
                    href="/reservation"
                    className="text-xs font-bold text-[#18120F] hover:text-[#C8652D] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Reserve in this zone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#18120F] text-[#FAF7F2] font-bold text-sm hover:bg-[#C8652D] transition-colors shadow-md min-h-[48px]"
          >
            <span>Book Your Table Experience</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

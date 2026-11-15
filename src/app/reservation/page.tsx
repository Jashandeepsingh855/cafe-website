'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Store,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Wifi,
  Car,
  ChevronDown,
  Sun,
  Utensils,
  Sunset,
  Music,
} from 'lucide-react';
import {
  DEFAULT_SITE_CONFIG,
  getClientSiteConfig,
  getClientReservations,
  saveClientReservations,
  ReservationRecord,
  SiteConfig,
} from '@/config/site';

export default function ReservationPage() {
  const [partySize, setPartySize] = useState('1-2');
  const [zone, setZone] = useState('veranda');
  const [timeSlot, setTimeSlot] = useState('Morning Roast 08:30 AM');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [dietaryOptions, setDietaryOptions] = useState({
    pureVeg: true,
    strictJain: false,
    nutFree: false,
    celebration: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    setSite(getClientSiteConfig());
  }, []);

  const zones = [
    {
      id: 'veranda',
      name: 'Al Fresco Veranda',
      desc: 'Breezy outdoor canopy, wooden pergolas & fresh open-air botanical seating.',
      tag: 'Available for booking',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVjFXx8SV616u_kR_qTEf-QYx8FjHmQ42o7KsvCGB2zlq7oEb7rZDiDD1nDVioA1I08Vk3dtxIEMIuLOFmTp1gApV_Rxp-fwZd1qzFus35D1qPSzTWug4E9O0SFCPm72L5cV2-9E2MqZ8SKac38i5GqzTMu5qIvYaCejoY6QBogVZx07keXz19b_FsDDvG-xjToW8BZ_sup2rXo8Z6Ojq3MGtYGlsqYzy5O_ormwY',
    },
    {
      id: 'hearth',
      name: 'Hearth & Banquette Salon',
      desc: 'Indoor velvet banquettes, warm acoustic hearth lighting & curated roastery library.',
      tag: 'Cozy & plush ambiance',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjQL4v5uL3wjbFMf2Jg9kkkvzM4S6OJm8UjZzKRER4gtKpODOFspYWFgGDSZIM3gbLf1zJP8BTiDNlO76Agc2bcT2BaIOG5yFSbaNABgYma6eC24KjYgSSn0YiN4dK3mP5pCylrR86SCtPwsplzzmE3sWqB5-CUF4BjKQgysEOmGuXS8kZ1MMnA8x-HRb7wyRaJpItFSWACg65jizfTdcxh2Yw55_dmIr7ICnUYc',
    },
    {
      id: 'archbar',
      name: 'Backlit Arch Bar',
      desc: 'Front row barista bar counter, watch manual pour-overs & precision roaster dials.',
      tag: 'Barista sensory interaction',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASuOKctOhyPYn-XG2KQsV0OExJWeb88Stpw6IwyDM8eAfwL-00VMFHH5Yr-5BPgsG1bzA4sao7FYJOc3JKbgr89Fzpfjm3n6d8UgKGTvn47SzxYekItw-2J1CvTY4_2yI0RIu2-5lW3eQXC-ZSkkau07x_FwAnbUdch4tS6e60o7NEQ07iJLLmcqWDgYlxFY2JfnnJOrJEzWvNX1Da68lQ2nubrkyv7SA1XpJ_ntA',
    },
    {
      id: 'creator',
      name: 'Quiet Creator Corner',
      desc: 'Gigabit fiber Wi-Fi, low-chatter zone, individual brass task lights & power plugs.',
      tag: 'Dedicated power outlets',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdX7AFIo5A__-R2_9DECKbWDev45v8GvX18XuJrH5vPznobAe59J87-e3N7Kq0Dn1DccvLpiyX1dGbOR-IYX9L6BJLIammcWkLu8AfCiBWM7-tK2q_-scNI_zqBV-v_zzykziYT_3PhVm6GkgmX-TRsGJ6M_Hk_KeHIh2m8C0jVKPM8wzVBNjMYPexB72MmUkkXZYSMb4HJop70ID6sP9dm3Rdno_Wei679ORlYk8',
    },
  ];

  const slots = [
    { name: 'Morning Roast', time: '08:30 AM', sub: 'Fresh morning brew & bakes', icon: Sun },
    { name: 'Midday Drip', time: '12:30 PM', sub: 'Artisanal sourdough & bowls', icon: Utensils },
    { name: 'Golden Hour', time: '05:00 PM', sub: 'Cold brew flights & sunset glow', icon: Sunset },
    { name: 'Evening Hearth', time: '08:00 PM', sub: 'Pour-overs & acoustic comfort', icon: Music },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zoneName = zones.find((z) => z.id === zone)?.name || zone;
    const newReservation: ReservationRecord = {
      id: 'RES-' + Math.floor(100000 + Math.random() * 900000).toString(),
      name: name || 'Guest',
      whatsapp: whatsapp || '',
      email: email || '',
      partySize: `${partySize} Guests`,
      zone: zoneName,
      date,
      timeSlot,
      dietaryOptions,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const current = getClientReservations();
    saveClientReservations([newReservation, ...current]);
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* Top Hero Story Ribbon with Multi-Layer Parallax Depth */}
      <section className="relative w-full bg-[#F6F3EE] border-b border-[#E5E2DD] py-10 sm:py-14 overflow-hidden" data-parallax-layers>
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div data-parallax-layer="1" className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-[#C8652D]/10 blur-3xl" />
          <div data-parallax-layer="2" className="absolute top-1/2 -left-16 w-80 h-80 rounded-full bg-[#18120F]/5 blur-2xl" />
          <div data-parallax-layer="float" className="absolute bottom-2 right-12 w-40 h-40 rounded-full bg-[#E8A55B]/15 blur-xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8652D]/10 text-[#C8652D] mb-3 border border-[#C8652D]/20">
            <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Mindful Table Booking
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#18120F] tracking-tight leading-tight mb-3">
            Reserve Your Table at Daily Coffee Drip
          </h1>
          <p className="text-sm sm:text-base text-[#544E49] max-w-2xl mx-auto leading-relaxed">
            Whether an unhurried morning espresso meeting, a deep-focus work session, or an intimate pure vegetarian weekend brunch.
          </p>

          {/* Trust Badges Strip */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8 text-left">
            {[
              { title: 'Instant Confirmation', sub: 'Via WhatsApp & SMS' },
              { title: 'Zero Advance Deposit', sub: 'No cancellation penalty' },
              { title: '15-Min Courtesy Hold', sub: 'Flexible arrival window' },
              { title: '100% Pure Veg', sub: 'Mindful kitchen craft' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white border border-[#E5E2DD] shadow-sm"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] sm:text-sm font-bold text-[#18120F] leading-tight truncate sm:whitespace-normal">
                    {badge.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#544E49] mt-0.5 truncate sm:whitespace-normal">{badge.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Booking Form + Roastery Venue Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4-Step Reservation Machine */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 flex flex-col gap-8 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-[#E5E2DD]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DD]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#18120F] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#18120F]">
                  Curate Your Table
                </span>
              </div>
              <span className="text-xs font-semibold text-[#857D77] uppercase tracking-wider">
                Step-by-Step Experience
              </span>
            </div>

            {/* STEP 1: Party Size Selection */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C8652D]" />
                  <span>1. Select Party Size</span>
                </label>
                <span className="text-xs font-bold text-[#C8652D]">
                  {partySize === '1-2' ? 'Solo or Duo Table' : `${partySize} Guests`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { id: '1-2', count: '1–2', label: 'Solo / Duos', hint: 'Focus & pairs' },
                  { id: '3-4', count: '3–4', label: 'Intimate Table', hint: 'Casual meetup' },
                  { id: '5-8', count: '5–8', label: 'Group Lounge', hint: 'Sofa circle' },
                  { id: '8+', count: '8+', label: 'Private Salon', hint: 'Roastery suite' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPartySize(item.id)}
                    className={`min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3 rounded-2xl flex flex-col items-start gap-0.5 sm:gap-1 transition-all text-left border ${
                      partySize === item.id
                        ? 'bg-[#18120F] text-white border-[#18120F] shadow-sm'
                        : 'bg-[#F6F3EE] text-[#544E49] border-[#E5E2DD] hover:bg-[#EBE8E3]'
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-bold leading-none">{item.count}</span>
                    <span
                      className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                        partySize === item.id ? 'text-[#FFDBCB]' : 'text-[#18120F]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] opacity-75">{item.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Preferred Roastery Zone */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#C8652D]" />
                <span>2. Preferred Roastery Zone</span>
              </label>

              {/* Stacked Single-Column Cards on Mobile (< 768px), 2-Col on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {zones.map((z) => (
                  <div
                    key={z.id}
                    onClick={() => setZone(z.id)}
                    className={`relative p-3.5 rounded-2xl cursor-pointer transition-all flex gap-3 items-start border-2 ${
                      zone === z.id
                        ? 'bg-[#FAF7F2] border-[#C8652D] shadow-sm'
                        : 'bg-[#F6F3EE] border-transparent hover:border-[#E5E2DD]'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#E5E2DD]">
                      <Image src={z.image} alt={z.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#18120F] truncate">{z.name}</span>
                        {zone === z.id && <span className="w-2 h-2 rounded-full bg-[#C8652D]" />}
                      </div>
                      <span className="text-xs text-[#544E49] mt-0.5 line-clamp-2 leading-relaxed">
                        {z.desc}
                      </span>
                      <span className="text-[11px] font-semibold text-[#C8652D] mt-1">{z.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: Date & Curated Sensory Window */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C8652D]" />
                <span>3. Date &amp; Curated Sensory Window</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mobile Friendly Date Picker */}
                <div className="sm:col-span-1 flex flex-col justify-center bg-[#F6F3EE] p-3.5 rounded-2xl border border-[#E5E2DD]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#544E49] mb-1">
                    Select Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-[#E5E2DD] px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                  <span className="text-[10px] text-[#857D77] mt-1.5">Held until 10 PM</span>
                </div>

                {/* Sensory Time Slots */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                  {slots.map((s) => {
                    const Icon = s.icon;
                    const isSelected = timeSlot.startsWith(s.name);
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setTimeSlot(`${s.name} ${s.time}`)}
                        className={`min-h-[64px] p-2.5 sm:p-3 rounded-2xl text-left flex flex-col justify-between transition-all border ${
                          isSelected
                            ? 'bg-[#18120F] text-white border-[#18120F] shadow-sm'
                            : 'bg-[#F6F3EE] text-[#544E49] border-[#E5E2DD] hover:bg-[#EBE8E3]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate pr-1 ${
                              isSelected ? 'text-[#FFDBCB]' : 'text-[#544E49]'
                            }`}
                          >
                            {s.name}
                          </span>
                          <Icon className="w-3.5 h-3.5 text-[#C8652D] shrink-0" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold mt-0.5">{s.time}</span>
                        <span className="text-[9px] sm:text-[10px] opacity-75 truncate">{s.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 4: Guest Dossier & Mindful Requests */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C8652D]" />
                <span>4. Guest Dossier &amp; Mindful Requests</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#544E49]">Full Name *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full bg-[#F6F3EE] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#544E49]">WhatsApp Number *</span>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full bg-[#F6F3EE] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#544E49]">Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@domain.com"
                    className="w-full bg-[#F6F3EE] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                </div>
              </div>

              {/* Dietary Checkboxes */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#544E49] block mb-2">
                  Hospitality &amp; Kitchen Notes (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#18120F]">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryOptions.pureVeg}
                      readOnly
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-xs sm:text-sm">
                      100% Pure Vegetarian Kitchen
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryOptions.strictJain}
                      onChange={(e) =>
                        setDietaryOptions({ ...dietaryOptions, strictJain: e.target.checked })
                      }
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm">Strict Jain Preparation (No root veg)</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryOptions.nutFree}
                      onChange={(e) =>
                        setDietaryOptions({ ...dietaryOptions, nutFree: e.target.checked })
                      }
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm">Nut-Free Allergy Precaution</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryOptions.celebration}
                      onChange={(e) =>
                        setDietaryOptions({ ...dietaryOptions, celebration: e.target.checked })
                      }
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm">Celebration (Birthday / Anniversary)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E2DD]">
              <div className="flex items-center gap-2 text-xs text-[#544E49]">
                <CheckCircle2 className="w-4 h-4 text-[#C8652D]" />
                <span>Zero advance deposit. Instant confirmation via WhatsApp.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm Unhurried Table</span>
              </button>
            </div>

            {/* Success Banner */}
            {submitted && (
              <div className="p-4 rounded-2xl bg-[#18120F] text-white flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C8652D] shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Your Table is Reserved!</p>
                    <p className="text-xs text-[#D4CECA] mt-0.5">
                      Confirmation dispatched to your WhatsApp. We look forward to hosting you in Indiranagar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Right Column: Venue Info & FAQs */}
          <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
            {/* Live Roastery Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider">
                    Roastery Presence
                  </span>
                  <h3 className="text-lg font-bold text-[#18120F]">{site.name}</h3>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  site.hours.isOpenNow ? 'bg-[#CaEcc0] text-[#186a22]' : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${site.hours.isOpenNow ? 'bg-[#186a22] animate-ping' : 'bg-red-500'}`} />
                  {site.hours.isOpenNow ? 'Open Now' : 'Closed for Today'}
                </span>
              </div>

              {/* Map Thumbnail */}
              <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#E5E2DD] shadow-inner flex items-end p-3">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHrrkPpb7HXk72gUCrU29swJogLVWZgJZksdkJRvgXNQTpv56FwtUDHf0bP4Zw4t4mBZmPafc2oxVNbw9ZghuYPiLAZquSTY_xEKMJGgwtEZjbycbg3IP-xJ1r4T86HYJ-deSaZO0bGXo29Kw4YiQzqg6jqkfjX0LUklC4fs0M1s_OpeONSVA9MZcvV0A_Q-v_SgI0nUHEQlbMmbyPhRL1XuPuKiL1xPCokCbRufU"
                  alt="Location Map Preview"
                  fill
                  className="object-cover"
                />
                <div className="relative z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 text-[#18120F] text-xs font-semibold">
                  <MapPin className="w-4 h-4 text-[#C8652D]" />
                  <span>{site.address.line1}, {site.address.area}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2.5 text-xs text-[#544E49]">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F3EE]">
                  <Clock className="w-4 h-4 text-[#C8652D] shrink-0" />
                  <div>
                    <p className="font-bold text-[#18120F]">Daily Operating Hours</p>
                    <p className="text-[11px]">{site.hours.openTime} – {site.hours.closingTime} ({site.hours.days})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F3EE]">
                  <Car className="w-4 h-4 text-[#C8652D] shrink-0" />
                  <div>
                    <p className="font-bold text-[#18120F]">Valet Assistance</p>
                    <p className="text-[11px]">Complimentary valet parking at front portico</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F3EE]">
                  <Wifi className="w-4 h-4 text-[#C8652D] shrink-0" />
                  <div>
                    <p className="font-bold text-[#18120F]">Creator Amenities</p>
                    <p className="text-[11px]">Gigabit 500Mbps Wi-Fi &amp; Type-C charging hubs</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${site.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#F0EDE9] hover:bg-[#EBE8E3] text-[#18120F] border border-[#E5E2DD] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C8652D]" />
                <span>WhatsApp Hospitality Concierge</span>
              </a>
            </div>

            {/* Curated FAQs */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3">
              <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider">
                Frequently Inquired
              </span>
              <details className="group bg-[#F6F3EE] rounded-xl p-3 border border-[#E5E2DD] cursor-pointer">
                <summary className="flex items-center justify-between text-xs font-bold text-[#18120F] list-none">
                  <span>Can I linger beyond 2 hours?</span>
                  <ChevronDown className="w-4 h-4 text-[#857D77] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-[#544E49] mt-2 pt-2 border-t border-[#E5E2DD] leading-relaxed">
                  Yes! While peak weekends have courtesy holds, guests in our Quiet Creator Corner and Hearth Salon are warmly welcomed to linger with unhurried refills.
                </p>
              </details>

              <details className="group bg-[#F6F3EE] rounded-xl p-3 border border-[#E5E2DD] cursor-pointer">
                <summary className="flex items-center justify-between text-xs font-bold text-[#18120F] list-none">
                  <span>Is the kitchen strictly vegetarian?</span>
                  <ChevronDown className="w-4 h-4 text-[#857D77] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-[#544E49] mt-2 pt-2 border-t border-[#E5E2DD] leading-relaxed">
                  100% egg-free and meat-free pure vegetarian kitchen, with extensive Jain and oat-milk vegan friendly adaptations.
                </p>
              </details>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

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
  AlertCircle,
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
  const [timeMode, setTimeMode] = useState<'curated' | 'custom'>('curated');
  const [customTimeInput, setCustomTimeInput] = useState('17:00');
  const [date, setDate] = useState('2026-11-15');
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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<{ id: string; waUrl: string } | null>(null);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  // Helper date generators for one-click selection
  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getWeekendStr = () => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sunday, 6 is Saturday
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatTimeTo12h = (timeStr: string): string => {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = minStr || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourPadded = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourPadded}:${minutes} ${ampm}`;
  };

  const formatDatePretty = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  useEffect(() => {
    setSite(getClientSiteConfig());
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);

    const syncSite = () => {
      setSite(getClientSiteConfig());
    };
    window.addEventListener('storage', syncSite);
    window.addEventListener('dcd_site_updated', syncSite);
    return () => {
      window.removeEventListener('storage', syncSite);
      window.removeEventListener('dcd_site_updated', syncSite);
    };
  }, []);

  const zones = [
    {
      id: 'veranda',
      name: 'Al Fresco Veranda',
      desc: 'Breezy outdoor canopy, wooden pergolas & sunlit garden patio seating.',
      tag: 'Available for booking',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVjFXx8SV616u_kR_qTEf-QYx8FjHmQ42o7KsvCGB2zlq7oEb7rZDiDD1nDVioA1I08Vk3dtxIEMIuLOFmTp1gApV_Rxp-fwZd1qzFus35D1qPSzTWug4E9O0SFCPm72L5cV2-9E2MqZ8SKac38i5GqzTMu5qIvYaCejoY6QBogVZx07keXz19b_FsDDvG-xjToW8BZ_sup2rXo8Z6Ojq3MGtYGlsqYzy5O_ormwY',
    },
    {
      id: 'hearth',
      name: 'Hearth & Banquette Salon',
      desc: 'Indoor velvet banquettes, warm acoustic hearth lighting & curated dining library.',
      tag: 'Cozy & plush ambiance',
      image:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
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
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Please enter your full name for the table reservation.');
      return;
    }

    const cleanDigits = whatsapp.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setValidationError('Please enter a valid 10-digit WhatsApp contact number.');
      return;
    }
    setValidationError(null);

    const zoneName = zones.find((z) => z.id === zone)?.name || zone;
    const bookingId = 'RES-' + Math.floor(100000 + Math.random() * 900000).toString();
    const newReservation: ReservationRecord = {
      id: bookingId,
      name: trimmedName,
      whatsapp: whatsapp.trim(),
      email: email.trim(),
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

    const waMessage = `*TABLE RESERVATION INQUIRY - DAILY COFFEE DRIP*
Booking Ref: ${bookingId}
Name: ${trimmedName}
WhatsApp: ${whatsapp.trim()}
${email.trim() ? `Email: ${email.trim()}\n` : ''}Party Size: ${partySize} Guests
Seating Sanctuary: ${zoneName}
Date: ${date}
Time Slot: ${timeSlot}
Hospitality Preferences:
• 100% Pure Vegetarian: Yes
${dietaryOptions.strictJain ? '• Strict Jain Preparation: Yes\n' : ''}${dietaryOptions.nutFree ? '• Nut-Free Precaution: Yes\n' : ''}${dietaryOptions.celebration ? '• Special Celebration: Yes\n' : ''}
Please confirm my table reservation. Thank you!`;

    const waUrl = `https://wa.me/${site.contact.whatsappRaw}?text=${encodeURIComponent(waMessage)}`;
    setBookingInfo({ id: bookingId, waUrl });
    setSubmitted(true);

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setBookingInfo(null);
    setName('');
    setWhatsapp('');
    setEmail('');
    setValidationError(null);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* Top Hero Story Ribbon with Multi-Layer Parallax Depth */}
      <section className="relative w-full bg-[#F6F3EE] border-b border-[#E5E2DD] pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden" data-parallax-layers>
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div data-parallax-layer="1" className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-[#C8652D]/10 blur-3xl" />
          <div data-parallax-layer="2" className="absolute top-1/2 -left-16 w-80 h-80 rounded-full bg-[#18120F]/5 blur-2xl" />
          <div data-parallax-layer="float" className="absolute bottom-2 right-12 w-40 h-40 rounded-full bg-[#E8A55B]/15 blur-xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8652D]/10 text-[#C8652D] mb-3 border border-[#C8652D]/20">
            <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Mindful Table Booking
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18120F] tracking-tight leading-tight mb-2.5">
            Reserve Your Table at Daily Coffee Drip
          </h1>
          <p className="text-sm sm:text-base text-[#544E49] max-w-2xl mx-auto leading-relaxed">
            Whether an unhurried morning espresso meeting, a deep-focus work session, or an intimate pure vegetarian weekend brunch.
          </p>

          {/* Clean Trust Badges Strip (Streamlined & Non-Cramped) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            {[
              { title: 'Instant Confirmation', sub: 'via WhatsApp' },
              { title: 'Zero Deposit', sub: 'Free cancellation' },
              { title: '15-Min Courtesy Hold', sub: 'Flexible window' },
              { title: '100% Pure Veg', sub: 'Mindful kitchen' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E2DD] shadow-xs"
              >
                <div className="w-4 h-4 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-[#18120F] whitespace-nowrap">
                  {badge.title}
                </span>
                <span className="text-[11px] text-[#857D77] hidden sm:inline whitespace-nowrap">
                  · {badge.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Booking Form + Cafe Venue Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4-Step Reservation Machine */}
          <form
            onSubmit={handleSubmit}
            className="xl:col-span-8 flex flex-col gap-7 sm:gap-8 bg-white p-6 sm:p-9 rounded-3xl shadow-sm border border-[#E5E2DD]"
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
              <span className="text-xs font-semibold text-[#857D77] uppercase tracking-wider hidden sm:inline">
                Step-by-Step Experience
              </span>
            </div>

            {/* STEP 1: Party Size Selection (Sleek & Light Selector) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C8652D]" />
                  <span>1. Select Party Size</span>
                </label>
                <span className="text-xs font-bold text-[#C8652D]">
                  {partySize === '1-2' ? 'Solo / Duo Table' : `${partySize} Guests`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { id: '1-2', count: '1–2', label: 'Solo / Duo' },
                  { id: '3-4', count: '3–4', label: 'Intimate Table' },
                  { id: '5-8', count: '5–8', label: 'Group Lounge' },
                  { id: '8+', count: '8+', label: 'Private Salon' },
                ].map((item) => {
                  const isSelected = partySize === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPartySize(item.id)}
                      className={`py-3 px-3.5 rounded-2xl flex flex-col items-center justify-center transition-all text-center border cursor-pointer ${
                        isSelected
                          ? 'bg-[#18120F] text-white border-[#18120F] shadow-sm ring-2 ring-[#C8652D]/40'
                          : 'bg-[#FAF7F2] text-[#18120F] border-[#E5E2DD] hover:bg-white hover:border-[#C8652D]/40'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none">
                        {item.count}
                      </span>
                      <span
                        className={`text-xs font-semibold mt-1 ${
                          isSelected ? 'text-[#FFDBCB]' : 'text-[#544E49]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Preferred Dining Zone (Spacious Cards, Complete Readable Descriptions) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#C8652D]" />
                  <span>2. Preferred Dining Sanctuary</span>
                </label>
                <span className="text-xs font-bold text-[#C8652D]">
                  {zones.find((z) => z.id === zone)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {zones.map((z) => {
                  const isSelected = zone === z.id;
                  return (
                    <div
                      key={z.id}
                      onClick={() => setZone(z.id)}
                      className={`group relative p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex gap-3.5 items-center border ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#C8652D] ring-2 ring-[#C8652D]/30 shadow-xs'
                          : 'bg-white border-[#E5E2DD] hover:border-[#C8652D]/40 hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#E5E2DD] border border-[#E5E2DD]/80">
                        <Image
                          src={z.image}
                          alt={z.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[#18120F] leading-tight">
                            {z.name}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected
                                ? 'border-[#C8652D] bg-[#C8652D]'
                                : 'border-[#D4CECA] bg-white group-hover:border-[#C8652D]/60'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#544E49] mt-1 line-clamp-2 leading-relaxed">
                          {z.desc}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8652D]" />
                          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C8652D] truncate">
                            {z.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Date & Arrival Time (Un-Crowded, Spacious, Full Visible Labels) */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C8652D]" />
                  <span>3. Date &amp; Arrival Time</span>
                </label>
                <span className="text-xs font-bold text-[#C8652D]">
                  {formatDatePretty(date)} · {timeSlot}
                </span>
              </div>

              {/* Sub-panel 1: Date of Visit */}
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E5E2DD] flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18120F] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C8652D]" />
                    <span>Select Date of Visit</span>
                  </span>
                  <span className="text-xs font-bold text-[#C8652D] bg-white px-2.5 py-0.5 rounded-md border border-[#E5E2DD] w-fit">
                    {formatDatePretty(date)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Quick Date Selector Pills */}
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {[
                      { label: 'Today', val: getTodayStr() },
                      { label: 'Tomorrow', val: getTomorrowStr() },
                      { label: 'Weekend', val: getWeekendStr() },
                    ].map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setDate(d.val)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          date === d.val
                            ? 'bg-[#18120F] text-white border-[#18120F] shadow-xs'
                            : 'bg-white text-[#544E49] border-[#E5E2DD] hover:bg-[#F2EFEA]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {/* Native Date Picker */}
                  <div className="sm:w-52">
                    <input
                      type="date"
                      value={date}
                      min={getTodayStr()}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-[#E5E2DD] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-panel 2: Arrival Time */}
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E5E2DD] flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18120F] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
                    <span>Select Arrival Time</span>
                  </span>

                  {/* Mode Switcher */}
                  <div className="inline-flex rounded-xl bg-white p-0.5 border border-[#E5E2DD] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setTimeMode('curated')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timeMode === 'curated'
                          ? 'bg-[#18120F] text-white shadow-xs'
                          : 'text-[#544E49] hover:text-[#18120F]'
                      }`}
                    >
                      Curated Slots
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeMode('custom');
                        setTimeSlot(`Custom Time (${formatTimeTo12h(customTimeInput)})`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timeMode === 'custom'
                          ? 'bg-[#18120F] text-white shadow-xs'
                          : 'text-[#544E49] hover:text-[#18120F]'
                      }`}
                    >
                      Custom Time
                    </button>
                  </div>
                </div>

                {timeMode === 'curated' ? (
                  /* Curated Slots: 4 Full-Width Cards with Full Text */
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {slots.map((s) => {
                      const Icon = s.icon;
                      const isSelected = timeSlot.startsWith(s.name);
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => setTimeSlot(`${s.name} ${s.time}`)}
                          className={`p-3 rounded-xl text-left flex flex-col justify-between transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#18120F] text-white border-[#18120F] shadow-xs ring-2 ring-[#C8652D]/40'
                              : 'bg-white text-[#544E49] border-[#E5E2DD] hover:bg-[#F2EFEA] hover:border-[#C8652D]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span
                              className={`text-[11px] font-bold tracking-wide ${
                                isSelected ? 'text-[#FFDBCB]' : 'text-[#857D77]'
                              }`}
                            >
                              {s.name}
                            </span>
                            <Icon className="w-3.5 h-3.5 text-[#C8652D] shrink-0" />
                          </div>
                          <span className="text-sm sm:text-base font-extrabold leading-tight">
                            <span className={isSelected ? 'text-white' : 'text-[#18120F]'}>{s.time}</span>
                          </span>
                          <span
                            className={`text-[10px] mt-1 line-clamp-1 ${
                              isSelected ? 'text-white/70' : 'text-[#857D77]'
                            }`}
                          >
                            {s.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Custom Time Controls */
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {['08:30', '10:00', '11:30', '13:00', '15:30', '17:00', '19:00', '20:30', '22:00'].map((t) => {
                        const label = formatTimeTo12h(t);
                        const isSelected = customTimeInput === t && timeSlot.includes(label);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setCustomTimeInput(t);
                              setTimeSlot(`Custom Time (${label})`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#18120F] text-white border-[#18120F] shadow-xs'
                                : 'bg-white text-[#544E49] border-[#E5E2DD] hover:bg-[#F2EFEA]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#544E49]">Or pick custom exact time:</span>
                      <input
                        type="time"
                        value={customTimeInput}
                        min="07:00"
                        max="23:00"
                        step="900"
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomTimeInput(val);
                          setTimeSlot(`Custom Time (${formatTimeTo12h(val)})`);
                        }}
                        className="bg-white border border-[#E5E2DD] px-3.5 py-1.5 rounded-xl text-sm font-bold text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E5E2DD]/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#857D77] gap-1">
                  <span>Courtesy hold window: <strong className="text-[#18120F]">15 minutes from slot</strong></span>
                  <span>Active selection: <strong className="text-[#C8652D]">{timeSlot}</strong></span>
                </div>
              </div>
            </div>

            {/* STEP 4: Guest Details & Mindful Requests (Sleek Inputs, Airy Pills) */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#18120F] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#C8652D]" />
                <span>4. Guest Details &amp; Mindful Requests</span>
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
                    className="w-full bg-[#FAF7F2] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
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
                    className="w-full bg-[#FAF7F2] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#544E49]">Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@domain.com"
                    className="w-full bg-[#FAF7F2] border border-[#E5E2DD] px-3.5 py-2.5 rounded-xl text-sm text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]"
                  />
                </div>
              </div>

              {/* Mindful Dietary & Celebration Chips */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#544E49] block mb-2">
                  Hospitality &amp; Kitchen Notes (Tap to specify)
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {/* Pure Veg Assurance (Always active) */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#186a22]/10 text-[#186a22] border border-[#186a22]/25 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#186a22]" />
                    <span>100% Pure Vegetarian</span>
                  </div>

                  {/* Strict Jain Preparation */}
                  <button
                    type="button"
                    onClick={() =>
                      setDietaryOptions({ ...dietaryOptions, strictJain: !dietaryOptions.strictJain })
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all border cursor-pointer ${
                      dietaryOptions.strictJain
                        ? 'bg-[#18120F] text-white border-[#18120F] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#544E49] border-[#E5E2DD] hover:border-[#C8652D]'
                    }`}
                  >
                    <span>{dietaryOptions.strictJain ? '✓' : '+'} Strict Jain (No root veg)</span>
                  </button>

                  {/* Nut-Free Allergy Precaution */}
                  <button
                    type="button"
                    onClick={() =>
                      setDietaryOptions({ ...dietaryOptions, nutFree: !dietaryOptions.nutFree })
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all border cursor-pointer ${
                      dietaryOptions.nutFree
                        ? 'bg-[#18120F] text-white border-[#18120F] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#544E49] border-[#E5E2DD] hover:border-[#C8652D]'
                    }`}
                  >
                    <span>{dietaryOptions.nutFree ? '✓' : '+'} Nut-Free Precaution</span>
                  </button>

                  {/* Special Celebration */}
                  <button
                    type="button"
                    onClick={() =>
                      setDietaryOptions({ ...dietaryOptions, celebration: !dietaryOptions.celebration })
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all border cursor-pointer ${
                      dietaryOptions.celebration
                        ? 'bg-[#C8652D] text-white border-[#C8652D] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#544E49] border-[#E5E2DD] hover:border-[#C8652D]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#C8652D]" />
                    <span>{dietaryOptions.celebration ? '✓' : '+'} Celebration (Birthday / Anniversary)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submission Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E2DD]">
              <div className="flex items-center gap-2 text-xs text-[#544E49]">
                <CheckCircle2 className="w-4 h-4 text-[#C8652D]" />
                <span>Zero advance deposit · Instant confirmation via WhatsApp</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Unhurried Table</span>
              </button>
            </div>

            {/* Success Banner */}
            {submitted && bookingInfo && (
              <div className="p-5 rounded-2xl bg-[#18120F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#25D366] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm sm:text-base">Your Table is Reserved!</p>
                      <span className="px-2 py-0.5 rounded-md bg-[#2A201A] border border-[#3E342E] text-[11px] font-mono text-[#D4CECA]">
                        {bookingInfo.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#D4CECA] mt-1">
                      Confirmation dispatched to your WhatsApp. We look forward to hosting you at Daily Coffee Drip.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={bookingInfo.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-[#18120F] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-full bg-[#2A201A] hover:bg-[#3E342E] text-white border border-[#3E342E] font-semibold text-xs transition-all"
                  >
                    Book Another Table
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Right Column: Venue Info & FAQs */}
          <aside className="xl:col-span-4 flex flex-col gap-6 w-full xl:sticky xl:top-28">
            {/* Live Cafe Hospitality Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DD]">
                <div>
                  <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider block">
                    Hospitality &amp; Venue
                  </span>
                  <h3 className="text-lg font-bold text-[#18120F]">{site.name}</h3>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  site.hours.isOpenNow ? 'bg-[#CaEcc0] text-[#186a22]' : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${site.hours.isOpenNow ? 'bg-[#186a22] animate-ping' : 'bg-red-500'}`} />
                  {site.hours.isOpenNow ? 'Open Now' : 'Closed Today'}
                </span>
              </div>

              {/* Unified List with Dividers (Clean & Light) */}
              <div className="divide-y divide-[#E5E2DD]/70 text-xs text-[#544E49]">
                <div className="flex items-start gap-3 py-3 first:pt-0">
                  <div className="w-8 h-8 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Address &amp; Location</p>
                    <p className="text-[11px] text-[#544E49] mt-0.5">{site.address.line1}, {site.address.area}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Daily Operating Hours</p>
                    <p className="text-[11px] text-[#544E49] mt-0.5">{site.hours.openTime} – {site.hours.closingTime} ({site.hours.days})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Valet Assistance</p>
                    <p className="text-[11px] text-[#544E49] mt-0.5">Complimentary valet parking at front portico</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-3 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-[#C8652D]/10 flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Creator Amenities</p>
                    <p className="text-[11px] text-[#544E49] mt-0.5">Gigabit 500Mbps Wi-Fi &amp; Type-C charging hubs</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${site.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#F2EFEA] text-[#18120F] border border-[#E5E2DD] text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-1"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Hospitality Concierge</span>
              </a>
            </div>

            {/* Curated FAQs (Clean & Minimalist) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#E5E2DD] flex flex-col gap-3">
              <span className="text-xs font-bold text-[#C8652D] uppercase tracking-wider">
                Frequently Inquired
              </span>
              <details className="group border-b border-[#E5E2DD] pb-3 cursor-pointer">
                <summary className="flex items-center justify-between text-xs font-bold text-[#18120F] list-none">
                  <span>Can I linger beyond 2 hours?</span>
                  <ChevronDown className="w-4 h-4 text-[#857D77] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-[#544E49] mt-2 leading-relaxed">
                  Yes! While peak weekends have courtesy holds, guests in our Quiet Creator Corner and Hearth Salon are warmly welcomed to linger with unhurried refills.
                </p>
              </details>

              <details className="group pt-1 cursor-pointer">
                <summary className="flex items-center justify-between text-xs font-bold text-[#18120F] list-none">
                  <span>Is the kitchen strictly vegetarian?</span>
                  <ChevronDown className="w-4 h-4 text-[#857D77] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-[#544E49] mt-2 leading-relaxed">
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

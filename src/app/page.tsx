'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowLeft,
  Coffee,
  Heart,
  Sliders,
  Gauge,
  Award,
  Flame,
  FlaskConical,
  CheckCircle2,
  Sparkles,
  Armchair,
  Cookie,
  Star,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/data/menu';
import DishDetailModal from '@/components/DishDetailModal';

export default function HomePage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeCoffeeFilter, setActiveCoffeeFilter] = useState('All Coffee');
  const [activeFlavorFilter, setActiveFlavorFilter] = useState('Chocolate');
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedDishes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items for the main Coffee Collection
  const coffeeCategories = ['All Coffee', 'Cappuccino', 'Latte', 'Cold Coffee', 'Hot Coffee'];
  const coffeeItems = MENU_ITEMS.filter((item) => {
    if (activeCoffeeFilter === 'All Coffee') {
      return item.spotlight || item.categorySlug === 'hot-coffee' || item.categorySlug === 'cold-coffee';
    }
    return item.name.toLowerCase().includes(activeCoffeeFilter.toLowerCase());
  }).slice(0, 8);

  // Filter items for the Flavor Collection
  const flavorPills = ['Chocolate', 'Classic Vanilla', 'Caramel', 'Hazelnut', 'Coconut', 'Cinnamon Spice'];
  const flavorItems = MENU_ITEMS.filter((item) => {
    if (activeFlavorFilter === 'Chocolate') {
      return item.flavor === 'Chocolate' || item.name.toLowerCase().includes('chocolate');
    }
    return item.flavor === activeFlavorFilter || item.name.toLowerCase().includes(activeFlavorFilter.toLowerCase());
  }).slice(0, 4);

  // Discounted Spotlight items
  const discountedItems = MENU_ITEMS.filter((item) => item.discount && item.discount > 0).slice(0, 4);

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full -mt-20 overflow-hidden bg-[#18120F] text-[#FAF7F2]">
        {/* Ambient Backdrop Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDQkxF_O_mWdBw-i9aQfLms8wyRyae-rB_m70nf8dXmy8trPecukOgrLZLQp-4vEPhk0VmjMYhJt79My4-AcYPaaiIOr6w4qx8BYMTG4PiQP-QlXd4-FkcjJ6Kuz5xUBZ7EqQEMHbnmGZ0IYGJa5SKPwezj2Ebp-d-C-yhalYkJ2qkKVS-gYYLvJ240SjozNzbBiSmhqQKkbjvcGhwDND9tpqwyr-oTZubCjwDOi0')`,
          }}
        />
        {/* Roasted Espresso Gradients for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18120F] via-[#18120F]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#18120F]/95 via-[#18120F]/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 sm:pt-44 sm:pb-28 flex flex-col justify-end min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]">
          <div className="max-w-2xl flex flex-col items-start gap-4">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FAF7F2]">
                Artisanal Roastery &amp; Craft Kitchen
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#FAF7F2] tracking-tight leading-[1.1] max-w-xl">
              Pass a Significant Moment with a Perfect Blend
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-[#E5E2DD]/90 max-w-lg leading-relaxed font-normal">
              Experience extraordinary precision at Daily Coffee Drip. Featuring single-origin micro-lots roasted in-house, calibrated extraction, and 100% pure vegetarian handcrafted comfort.
            </p>

            {/* CTA and Dots */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-6 w-full sm:w-auto">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#FAF7F2] text-[#18120F] font-bold text-sm hover:bg-[#C8652D] hover:text-white transition-all shadow-md group min-h-[48px]"
              >
                <span>Drink Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2">
                <span className="w-8 h-2 rounded-full bg-[#C8652D] transition-all" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTERABLE PRODUCT SHOWCASE */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Header */}
          <div className="text-center max-w-2xl flex flex-col items-center gap-2 mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              You can taste all kinds of coffee collection right here
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              Explore our delightful coffee collection, featuring rich micro-lots from artisanal estates. Each cup promises a unique flavor experience.
            </p>
          </div>

          {/* Swipeable Filter Pills on Mobile */}
          <div className="w-full flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 no-scrollbar touch-pan-x mb-8 sm:mb-10">
            {coffeeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCoffeeFilter(cat)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all min-h-[44px] ${
                  activeCoffeeFilter === cat
                    ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EBE8E3] text-[#544E49] hover:bg-[#E5E2DD] hover:text-[#18120F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 4x2 Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {coffeeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="group relative bg-white border border-[#E5E2DD] rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#C8652D]/50 transition-all cursor-pointer"
              >
                {/* Favorite button */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(e, item.id)}
                  aria-label="Save to favorites"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md flex items-center justify-center text-[#544E49] hover:text-[#C8652D] transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${likedDishes[item.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                  />
                </button>

                {/* Dish Photo */}
                <div className="relative w-full aspect-square rounded-xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Info */}
                <div className="flex items-center justify-between pt-4 px-1">
                  <span className="font-bold text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors">
                    {item.name}
                  </span>
                  <span className="font-bold text-lg text-[#C8652D]">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-sm hover:bg-[#C8652D] transition-colors shadow-sm"
            >
              <span>Explore All 140+ Offerings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SPECIALTY COFFEE CRAFT HIGHLIGHT BANNER */}
      <section className="w-full bg-[#18120F] text-[#FAF7F2] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* Left Column: Specialty Coffee Craft Pillars */}
          <div className="lg:col-span-6 px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#FAF7F2] tracking-tight leading-tight mb-4 max-w-md">
              Precision Micro-Lot Roasting &amp; Calibrated Extraction
            </h2>
            <p className="text-sm sm:text-base text-[#D4CECA] max-w-md mb-8 leading-relaxed font-normal">
              Every batch is roasted in micro-lots, brewed with 9 bar pressure at 93.5°C, and served alongside artisanal wood-hearth pure vegetarian bakes.
            </p>

            <div className="mb-8">
              <Link
                href="/roastery"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FAF7F2] text-[#18120F] font-bold text-sm hover:bg-[#C8652D] hover:text-white transition-colors shadow-sm min-h-[44px]"
              >
                <span>Explore Our Roastery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Craft Feature List */}
            <div className="flex flex-col gap-3 max-w-md">
              {[
                { label: 'Precision Micro-Lot Roasting', icon: Sliders },
                { label: 'Calibrated Extraction (9 Bar, 93.5°C)', icon: Gauge },
                { label: 'Single-Origin Estate Traceability', icon: Award },
                { label: 'Artisanal Wood-Hearth Baking', icon: Flame },
                { label: 'Total Dissolved Solids (TDS) Refractometry', icon: FlaskConical },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#FAF7F2]"
                  >
                    <Icon className="w-5 h-5 text-[#C8652D] shrink-0" />
                    <span className="font-semibold text-sm">{feat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Roasted Drink Visual */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center min-h-[340px]"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNZf5bnJQtigp14a1ExGO-VugRV4AXiI6aP1RJFMKMcolwGXX-GLZUpZVBzlLXegF_j942DWk-Dn3osPKQzTMTzuM98PnaYinU3XiI8fF8fW1Cv24okNaxldxGi9VmBnKaRs9U7_ZlZjYmNafrEOV523ULEau7TrOI9f2IQWmTlVNTBmvAj6TLPfWGuSfg3G6wKmOm9UB7Vh1wLS9_s1toHlg_QNCwwoCqK_l-7W4')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#18120F] via-transparent to-transparent hidden lg:block" />
          </div>
        </div>
      </section>

      {/* 4. SECONDARY TASTING GRID ('Different Flavor You can Choose Anytime') */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Header */}
          <div className="text-center max-w-2xl flex flex-col items-center gap-2 mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Different Flavor Notes You can Choose Anytime
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              Discover the diverse coffee flavor profiles available at our roastery, each blend offering a distinct sensorial journey.
            </p>
          </div>

          {/* Flavor Filter Pills */}
          <div className="w-full flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 no-scrollbar touch-pan-x mb-8 sm:mb-10">
            {flavorPills.map((flavor) => (
              <button
                key={flavor}
                type="button"
                onClick={() => setActiveFlavorFilter(flavor)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all min-h-[44px] ${
                  activeFlavorFilter === flavor
                    ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EBE8E3] text-[#544E49] hover:bg-[#E5E2DD] hover:text-[#18120F]'
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>

          {/* 4-Card Specialty Drink Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {flavorItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="group relative bg-white border border-[#E5E2DD] rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#C8652D]/50 transition-all cursor-pointer"
              >
                <button
                  type="button"
                  onClick={(e) => toggleLike(e, item.id)}
                  aria-label="Save to favorites"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md flex items-center justify-center text-[#544E49] hover:text-[#C8652D] transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${likedDishes[item.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                  />
                </button>

                <div className="relative w-full aspect-square rounded-xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 px-1">
                  <span className="font-bold text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors">
                    {item.name}
                  </span>
                  <span className="font-bold text-lg text-[#C8652D]">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUALITY & CRAFT SYMMETRICAL CALLOUT */}
      <section className="w-full py-16 sm:py-20 bg-[#F0EDE9] border-y border-[#E5E2DD] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Split Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-md">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18120F] tracking-tight leading-tight">
                We Never Settle when it Comes to Quality &amp; Upkeep
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3 max-w-sm">
              <p className="text-sm text-[#544E49] md:text-right leading-relaxed">
                At our roastery, we take pride in serving calibrated extractions, ensuring every cup delivers an exceptional, dependable profile.
              </p>
              <Link
                href="/roastery"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-sm hover:bg-[#221A16] hover:text-white transition-colors shadow-sm min-h-[44px]"
              >
                <span>Explore The Process</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Symmetrical 3-Column: Left 3 | Center Splash | Right 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 3 Benefits */}
            <div className="lg:col-span-4 flex flex-col gap-8 sm:gap-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    An ideal combination of cupping testing and attentive craft.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    High-quality beans obtained from certified single-origin estates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <Coffee className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    A dependable flavor you can count on every single visit.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Hero Splash Drink Image */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-4 sm:py-6">
              <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[4/5] flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS0QCbNLVu2SsbK9ph9dATe3YS7RxMjlyCaFXPUNGr3StiPfjOAibAWv9JufewHI_lFAtRIhv-gCzL3VW5AJ8lFIXOM8jf96cJPFn1O-_KffliRG7ybE48qK7T9KCQjVSH1rbsp_oXVF1Ptw8n02Sf1xhOqNDolKPm7Do6SxtYqaF5M9N3UQoIkD9hyBtO0NeCbP8OLVPMKCjFqLnMCrB6tmrl3wC9BbgIEClNPRo"
                  alt="Dynamic splash shot of artisanal iced latte with coffee beans"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 340px"
                />
              </div>
            </div>

            {/* Right 3 Benefits */}
            <div className="lg:col-span-4 flex flex-col gap-8 sm:gap-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <Gauge className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    Precise roast curve monitoring for maximum sweetness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <Armchair className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    A comfortable sanctuary area crafted for slow unwinding.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#18120F] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-sm">
                  <Cookie className="w-5 h-5 text-[#C8652D]" />
                </div>
                <div>
                  <p className="text-base text-[#18120F] font-semibold leading-snug">
                    Deep, rich flavor complemented by a silky, harmonious finish.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MOST POPULAR AND DISCOUNTED COFFEE */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center max-w-2xl flex flex-col items-center gap-2 mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Most Popular and Discounted Coffee You may Like
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              Explore our roastery&apos;s unique coffee blends, each providing a distinct flavor experience with seasonal celebratory discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {discountedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="group relative bg-white border border-[#E5E2DD] rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#C8652D]/50 transition-all cursor-pointer"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#18120F] text-[#FAF7F2] font-bold text-xs">
                  {item.discount}% off
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleLike(e, item.id)}
                  aria-label="Save to favorites"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md flex items-center justify-center text-[#544E49] hover:text-[#C8652D] transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${likedDishes[item.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                  />
                </button>

                <div className="relative w-full aspect-square rounded-xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 px-1">
                  <span className="font-bold text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors">
                    {item.name}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg text-[#C8652D]">₹{item.price}</span>
                    <span className="text-xs text-[#857D77] line-through">
                      ₹{Math.round(item.price * (1 + (item.discount || 15) / 100))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ROASTERY IMAGE GALLERY */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
                Moments Inside Our Roastery
              </h2>
              <p className="text-sm sm:text-base text-[#544E49]">
                Capture the joy of sipping single-origin roasts with friends in Bengaluru&apos;s botanical sanctuary.
              </p>
            </div>
            <Link
              href="/roastery"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-sm hover:bg-[#C8652D] transition-colors shadow-sm shrink-0 min-h-[44px]"
            >
              <span>See All Moments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5-Image Mosaic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR3ec3I9YAVVYVvSKs8OJDkCJBh18N4dIHNxR66dNlXk-ZEWtlXdQjtHPzELuMiYAxh8HnF1DOdiLVqohLlK2-6xO5z_H6M8UMI3F82O89T-uA3zbYgjkTEiMUZTjrdBNg354A4hBpHeOJ2oLfyR3n2F1emeCLkMaZlko2JAnxt_MUtRRcILy-D8O5y89tuRSP2TaOmUUVe81Zl-KxUa-sp0iViTTVwwitM5h44lk"
                alt="Sunlit botanical courtyard patio at Daily Coffee Drip"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="md:col-span-2 h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgB5Dju61f1AZ7w8ZZkunbc_VPRKRw7tF1CcWK56UO3X8JE7-yB85nH1tZrKCOPh-VWK7jkpZqA_GdSsaJw6UySmzgxlkxGofYUL-SkdiK7IbpFC0dI8lylMLtInAWzr2I7UGbeXcs8qd1k3uztGOAl95EdgjxsONqSRAYVJse5XLRBNeyFnruaW1evnwGybvkFkWOidlKlrZhRCQbS0w0RhKiduw4D_c1DNwTgqk"
                alt="Artisan coffee bar interior with pour-over station"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>

            <div className="md:col-span-2 h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC95GcRC66ylQ06e9PGONOq8V1LDFcqECNN7hqDLhOa25cpnr2yNhcORdcs2nSZRaKogcvOTTbSFvwHUOBM08gHhxL3jJLuAX50uvfrqZT6FDkYqa2zg1RfYNwZmkpzjB02wyAWrN_EDJ7JjgIfrtYLDaIsOjYE2hHf027ULWymw-uBYlwkSaV7Px9z_pJsbNrQ_dubqWDTxa7ORmGqeZw3jOi0pIEQ11zVF5r1wmA"
                alt="Attentive head barista crafting espresso"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>

            <div className="md:col-span-2 h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNpPP_ko97XuvRcN5t7w0f4KzB3mF7VfqiVW_SmZIgsWr6Ne_-3XzHgR5wJO_1dlpob6DBI9WevfPGUEydADRVgmk8-CZ-TLqZ9rhHJjWM8WGh-u5k5kdcDqew0Y4fS9gCp2ahGG6K_XCpX16R0pRg9iEKhR1QMKAMXNzRR7t0uzfj9uVv4Sh9yDuq6MpjTqa61xU0cBtz1vGY-RImycGjo-zR0gXXVeODKZ2JVBM"
                alt="Botanical stairway with cascading plants"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>

            <div className="md:col-span-2 h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHbU1SitFmrXgBFPy8tb_PAQw95Na-CSEE6WhDrcCJ9H9b2i5gW5Dj9iXwoYpdQy4eYW8mYEQLLZsOQi3olKuBT4D0I8G8L-3H-k8KevNzGx67ectn24sO6V1wO_Ys6B7N8wDJJosZRCMeqf5h5Y1D42rko9b9r0xIcOSFcqRObSCXB62ySPVit06AM_8amTYfxNFHwJuRQdSuhYKBu_LdLIRChD-fTAI25v3rMtw"
                alt="Guest savoring morning cup in the al fresco veranda"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2] pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center max-w-xl flex flex-col items-center gap-2 mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Customer Experiences
            </h2>
            <p className="text-sm sm:text-base text-[#544E49]">
              Our roastery is a delightful spot to enjoy calibrated brews and authentic vegetarian hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
            {/* Review 1 */}
            <div className="bg-white border border-[#E5E2DD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shadow-inner relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1Y4JWHR4G8Novk9zPiCzyn3KI3_CAHMFq02CSRqh_FOhYOX1EyWZWM5HE3WXkMDwm3FeF4hMirvFqwx8lILgWn6FdZu5FHQyI7LVc3XxVbTNIhFl6GrHZK4TZ7H9YeFMjdh1gc19p_kWvwX-OvfL9hL9vTQDXoQPuRZY1GBpDwQSM06g1jE2rFrQyCLDKx7rYBqwEamqCZMSS7_tuLJCD9oHeeeQH5i3PuzhbB4"
                    alt="Emma Wilson"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="mt-2 text-center text-sm font-bold text-[#18120F]">Emma Wilson</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm sm:text-base text-[#18120F] leading-relaxed">
                  &ldquo;The coffee is rich, smooth, and full of flavor. The 100% pure veg sourdough pizza was a wonderful surprise. It&apos;s my favorite spot in Indiranagar.&rdquo;
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[#C8652D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8652D]" />
                  ))}
                  <span className="text-sm text-[#18120F] font-bold ml-1">5.0</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-[#E5E2DD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shadow-inner relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbvPgWKhwNdDV4mviWxmR1SACzHj4LUbfjhwKMRdCYxAm_FFQm0k4-WC-AhfWFLOPprqlbQNb_mTtlTl9LpoXS0fgoJpHTSupv75zgBabO6r_zcRnFgCclu-t_HKZgXIRH3To1-FyvZpE_PQFfu2ZW-bUiauHX_4QV_8N_sP2CXTDNxhplI_UUbTSRP9W7Zpr6iLFcXmiYHCD3iSYNYfWKZ1U8die_RnkzEyOvlXY"
                    alt="Rohan Kapoor"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="mt-2 text-center text-sm font-bold text-[#18120F]">Rohan Kapoor</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm sm:text-base text-[#18120F] leading-relaxed">
                  &ldquo;From the first sip of the Lotus Biscoff cappuccino to the warm hearth acoustics, this is world-class specialty coffee craft.&rdquo;
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[#C8652D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8652D]" />
                  ))}
                  <span className="text-sm text-[#18120F] font-bold ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dish Detail Modal / Mobile Bottom Sheet */}
      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}

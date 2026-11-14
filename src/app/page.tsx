'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  Sliders,
  Gauge,
  Award,
  Flame,
  FlaskConical,
  Armchair,
  Cookie,
  Star,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/data/menu';
import { getWhatsAppOrderUrl } from '@/config/site';
import DishDetailModal from '@/components/DishDetailModal';

// 4 Signature Rotational Showcase Dishes matching the interactive culinary reference
const HERO_ROTATIONAL_DISHES = [
  {
    id: 'chikmagalur-pourover',
    number: '01',
    categoryLabel: '01 / CHIKMAGALUR ELEVATION 1,350M',
    titleLight: 'CHIKMAGALUR',
    titleBold: 'POUR OVER',
    subTitle: 'A little taste of mountain origin.',
    shortName: 'Pour over',
    overview: 'Single-origin shade-grown Arabica from 1,350m elevation in the Western Ghats. Calibrated 93.5°C water pull through Japanese copper V60, revealing wild honey and roasted cocoa nuances.',
    ingredients: '100% Single-Origin Arabica, Calibrated 120ppm Mineral Water, Gentle Convection Light Roast.',
    price: 180,
    prepTime: '4 mins',
    badgeColor: 'bg-[#E8A55B] text-[#18120F]',
    ribbonColor1: '#C8652D',
    ribbonColor2: '#E6D7C7',
    plateImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'hc-1',
  },
  {
    id: 'wood-fired-margherita',
    number: '02',
    categoryLabel: '02 / STONE HEARTH ARTISANAL PIZZA',
    titleLight: 'WOOD-FIRED',
    titleBold: 'MARGHERITA',
    subTitle: '48-hour cold fermented sourdough alchemy.',
    shortName: 'Margherita pizza',
    overview: 'San Marzano sweet plum tomato reduction, hand-torn fresh mozzarella, cold-pressed extra virgin olive oil, and organic garden Genovese basil fired at 450°C in our stone oven.',
    ingredients: 'Stone-Milled Semolina Flour, San Marzano Plum Tomatoes, Fresh Fior di Latte, Cold-Pressed Olive Oil, Garden Basil.',
    price: 320,
    prepTime: '11 mins',
    badgeColor: 'bg-[#98B06F] text-[#18120F]',
    ribbonColor1: '#7A9A5B',
    ribbonColor2: '#E8E4D9',
    plateImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'pz-1',
  },
  {
    id: 'vanilla-cloud-coldbrew',
    number: '03',
    categoryLabel: '03 / 18-HOUR COLD EXTRACTION',
    titleLight: 'VANILLA CLOUD',
    titleBold: 'COLD BREW',
    subTitle: 'Silky micro-foam over crystal slow drip.',
    shortName: 'Cloud cold brew',
    overview: 'Slow-drip single-origin cold brew steeped for 18 hours in mountain spring water, crowned with thick Madagascar bourbon vanilla bean foam and raw Demerara sugar crystals.',
    ingredients: 'Single-Origin Coarse Grounds, Chikmagalur Spring Water, Madagascar Bourbon Vanilla, Oat Cream Float, Demerara Crystals.',
    price: 240,
    prepTime: '2 mins',
    badgeColor: 'bg-[#E3964A] text-[#18120F]',
    ribbonColor1: '#D6833E',
    ribbonColor2: '#F0E2D0',
    plateImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'cb-1',
  },
  {
    id: 'truffle-mushroom-toast',
    number: '04',
    categoryLabel: '04 / WOOD-HEARTH ROASTED TOAST',
    titleLight: 'TRUFFLE HERBED',
    titleBold: 'MUSHROOM TOAST',
    subTitle: 'Earth & hearth in mindful harmony.',
    shortName: 'Mushroom toast',
    overview: 'Thick charred sourdough toast, whipped lemon-herb ricotta, pan-roasted wild button & shiitake mushrooms, toasted pine nuts, and aromatic white truffle glaze.',
    ingredients: 'Wood-Fired Sourdough, Herbed Ricotta, Sautéed Shiitake & Button Mushrooms, White Truffle Glaze, Thyme, Pine Nuts.',
    price: 280,
    prepTime: '8 mins',
    badgeColor: 'bg-[#BFA588] text-[#18120F]',
    ribbonColor1: '#8C6D53',
    ribbonColor2: '#EBE1D5',
    plateImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'sn-3',
  },
];

export default function HomePage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeCoffeeFilter, setActiveCoffeeFilter] = useState('All Coffee');
  const [activeFlavorFilter, setActiveFlavorFilter] = useState('Chocolate');
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroCardTab, setHeroCardTab] = useState<'overview' | 'ingredients'>('overview');
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-rotation timer (5.5s)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_ROTATIONAL_DISHES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentHeroDish = HERO_ROTATIONAL_DISHES[heroIndex];

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev === 0 ? HERO_ROTATIONAL_DISHES.length - 1 : prev - 1));
  };

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_ROTATIONAL_DISHES.length);
  };

  const handleOpenDishModal = (dishRefId: string) => {
    const found = MENU_ITEMS.find((item) => item.id === dishRefId);
    if (found) {
      setSelectedDish(found);
    } else {
      setSelectedDish({
        id: currentHeroDish.id,
        name: `${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`,
        category: 'Roastery Signature',
        categorySlug: 'hot-coffee',
        price: currentHeroDish.price,
        description: currentHeroDish.overview,
        story: currentHeroDish.subTitle,
        prepTime: currentHeroDish.prepTime,
        tags: ['vegetarian', 'chef-special'],
        image: currentHeroDish.plateImage,
      });
    }
  };

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
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE ROTATIONAL SHOWCASE HERO (MATCHING USER VIDEO REFERENCE) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#F2EEE9] text-[#18120F] min-h-[720px] lg:min-h-[820px] flex flex-col justify-between pt-6 sm:pt-8 pb-4 border-b border-[#E5E2DD]">
        
        {/* Dynamic Organic Sweeping Color Arc (matching video frames) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <svg
            className="w-full h-full object-cover scale-110 sm:scale-100 transition-all duration-1000 ease-in-out"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-150,260 C250,560 850,490 1650,40"
              stroke="url(#curvedRibbonGradient)"
              strokeWidth="240"
              strokeLinecap="round"
              opacity="0.32"
            />
            <defs>
              <linearGradient id="curvedRibbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentHeroDish.ribbonColor1} stopOpacity="0.45" />
                <stop offset="45%" stopColor={currentHeroDish.ribbonColor2} stopOpacity="0.9" />
                <stop offset="100%" stopColor={currentHeroDish.ribbonColor1} stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top Header Label & Left Vertical Index */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between pb-2">
          {/* Subdued Brand Name (matching KITCHEN KING ') */}
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-[#544E49]">
              DAILY COFFEE DRIP &apos;
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C8652D]"></span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#857D77] uppercase tracking-wider">
              Artisanal Roastery &amp; Craft Kitchen
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#544E49]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E5E2DD] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-ping"></span>
              {currentHeroDish.number} / 04 Selected
            </span>
          </div>
        </div>

        {/* Centerpiece Split Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-4 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left & Center: Rotational Circular Dish + Huge Typography + Carousel */}
            <div className="lg:col-span-8 flex flex-col md:flex-row items-center md:items-start lg:items-center gap-8 lg:gap-10">
              
              {/* Circular Overhead Gourmet Plate */}
              <div className="relative shrink-0">
                {/* Main Plate Container with realistic drop shadow & ceramic border */}
                <div
                  key={currentHeroDish.id}
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden shadow-[0_30px_70px_-15px_rgba(24,18,15,0.38)] border-4 sm:border-8 border-[#FAF7F2] ring-1 ring-black/5 relative group cursor-pointer transition-all duration-700 ease-out animate-in fade-in zoom-in-90"
                  onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                >
                  <Image
                    src={currentHeroDish.plateImage}
                    alt={`${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 352px, 420px"
                  />
                  {/* Subtle specular vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Left Vertical Index (01 / 04) on Desktop */}
                <div className="hidden lg:flex flex-col items-center gap-2 absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-bold text-[#857D77]">
                  <span>{currentHeroDish.number}</span>
                  <div className="w-0.5 h-10 bg-[#C8652D]/40"></div>
                  <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 0 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                  <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 1 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                  <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 2 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                  <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 3 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                </div>
              </div>

              {/* Dish Titles, Action Links & Carousel Slider */}
              <div className="flex flex-col items-start text-left flex-1 min-w-0">
                {/* Category eyebrow */}
                <span className="text-xs sm:text-sm font-bold text-[#C8652D] tracking-widest uppercase mb-1">
                  {currentHeroDish.categoryLabel}
                </span>

                {/* Massive 2-Tone Headline */}
                <h1 className="flex flex-col tracking-tight leading-none text-[#18120F] mb-4">
                  <span className="font-light text-3xl sm:text-4xl lg:text-5xl tracking-wider uppercase text-[#544E49]">
                    {currentHeroDish.titleLight}
                  </span>
                  <span className="font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase text-[#18120F] tracking-tighter mt-1">
                    {currentHeroDish.titleBold}
                  </span>
                </h1>

                {/* Action Links Strip (matching reference "▷ View reference | ◬ Explore dish") */}
                <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-bold text-[#18120F] mb-6">
                  <button
                    type="button"
                    onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                    className="flex items-center gap-1.5 hover:text-[#C8652D] transition-colors group"
                  >
                    <span className="text-[#C8652D] text-xs">▷</span>
                    <span className="group-hover:underline">View Craft Story</span>
                  </button>

                  <a
                    href={getWhatsAppOrderUrl(
                      `${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`,
                      currentHeroDish.price
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#C8652D] hover:underline"
                  >
                    <span>◬ Explore Dish &amp; Order</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Carousel Horizontal Thumbnails Selector */}
                <div className="flex items-center gap-2 sm:gap-3 pt-2 w-full">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={handlePrevHero}
                    aria-label="Previous offering"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* 4 Circular Thumbnails */}
                  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
                    {HERO_ROTATIONAL_DISHES.map((item, idx) => {
                      const isActive = idx === heroIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setHeroIndex(idx)}
                          className={`cursor-pointer transition-all duration-300 flex flex-col items-center ${
                            isActive
                              ? 'bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border border-[#C8652D]/40 scale-105'
                              : 'opacity-70 hover:opacity-100 p-1.5'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 shadow-sm relative shrink-0 ${
                              isActive ? 'border-[#C8652D]' : 'border-white'
                            }`}
                          >
                            <Image
                              src={item.thumbImage}
                              alt={item.shortName}
                              fill
                              className="object-cover"
                              sizes="52px"
                            />
                          </div>
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                              isActive ? 'text-[#18120F]' : 'text-[#857D77]'
                            }`}
                          >
                            {item.shortName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextHero}
                    aria-label="Next offering"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Hanging Lamp + Right Details Card */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end relative">
              {/* Sleek Hanging Pendant Lamp (matching reference) */}
              <div className="hidden lg:flex flex-col items-center absolute -top-16 right-10 z-20 pointer-events-none">
                <div className="w-0.5 h-32 bg-[#18120F]"></div>
                <div className="w-8 h-10 bg-[#18120F] rounded-b-xl shadow-lg"></div>
              </div>

              {/* Right Architectural Glass Detail Card */}
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E5E2DD] flex flex-col gap-4 relative z-10 transition-all duration-300">
                
                {/* Card Top Tabs: Overview / Ingredients */}
                <div className="flex items-center gap-6 border-b border-[#E5E2DD] pb-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setHeroCardTab('overview')}
                    className={`transition-colors relative pb-1 ${
                      heroCardTab === 'overview'
                        ? 'text-[#18120F] border-b-2 border-[#18120F]'
                        : 'text-[#857D77] hover:text-[#18120F]'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroCardTab('ingredients')}
                    className={`transition-colors relative pb-1 ${
                      heroCardTab === 'ingredients'
                        ? 'text-[#18120F] border-b-2 border-[#18120F]'
                        : 'text-[#857D77] hover:text-[#18120F]'
                    }`}
                  >
                    Ingredients
                  </button>
                </div>

                {/* Number Badge (01 / ★) */}
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${currentHeroDish.badgeColor} font-black text-2xl flex flex-col items-center justify-center shadow-sm`}>
                    <span className="leading-none">{currentHeroDish.number}</span>
                    <span className="text-xs">★</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#C8652D]">₹{currentHeroDish.price}</span>
                    <span className="block text-[10px] text-[#857D77] font-medium">inclusive of taxes</span>
                  </div>
                </div>

                {/* Headline & Description */}
                <div>
                  <h3 className="text-lg font-bold text-[#18120F] leading-snug">
                    {currentHeroDish.subTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                    {heroCardTab === 'overview'
                      ? currentHeroDish.overview
                      : currentHeroDish.ingredients}
                  </p>
                </div>

                {/* 1-Tap Direct Order CTA */}
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={getWhatsAppOrderUrl(
                      `${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`,
                      currentHeroDish.price
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] w-full rounded-full bg-[#18120F] hover:bg-[#C8652D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Order on WhatsApp (₹{currentHeroDish.price})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                    className="min-h-[40px] w-full rounded-full bg-[#F0EDE9] text-[#18120F] hover:bg-[#EBE8E3] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#E5E2DD]"
                  >
                    <span>View Nutritional &amp; Craft Profile</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Foreground Kitchen Counter Bar Visual (matching showroom perspective) */}
        <div className="relative z-0 w-full mt-4">
          <div className="w-full h-8 sm:h-10 bg-gradient-to-r from-white via-[#FAF7F2] to-white border-t border-white/80 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] flex items-center justify-between px-8"></div>
        </div>

        {/* Bottom Ticker / Status Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between text-xs text-[#544E49] pt-2">
          {/* Left: Our Menu Link */}
          <Link
            href="/menu"
            className="flex items-center gap-2 font-bold text-[#18120F] hover:text-[#C8652D] transition-colors"
          >
            <Utensils className="w-4 h-4 text-[#C8652D]" />
            <span>Our Menu (140+ Items)</span>
          </Link>

          {/* Center: Roastery Motto */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#857D77]">
            <ShieldCheck className="w-4 h-4 text-[#186a22]" />
            <span>100% Pure Vegetarian Kitchen • Indiranagar Bengaluru</span>
          </div>

          {/* Right: Play / Pause Auto-Cycle Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause showcase cycle' : 'Play showcase cycle'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E2DD] shadow-sm hover:bg-[#F6F3EE] transition-colors text-xs font-bold text-[#18120F]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#C8652D]" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#C8652D]" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FILTERABLE PRODUCT SHOWCASE */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 3. ROASTING & EXTRACTION HIGHLIGHT */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 4. SECONDARY TASTING GRID ('Different Flavor You can Choose Anytime') */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 5. QUALITY & TASTE PROMISE BANNER */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#F6F3EE] border-y border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18120F] tracking-tight leading-tight">
                Our roastery crafts coffee with a rich taste and exquisite aroma that delights the senses.
              </h2>
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

      {/* ========================================================================= */}
      {/* 6. MOST POPULAR AND DISCOUNTED COFFEE */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 7. ROASTERY IMAGE GALLERY */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 8. CUSTOMER TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2] pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm sm:text-base text-[#544E49]">
              What our Bengaluru community says about their unhurried coffee &amp; pure vegetarian hearth experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

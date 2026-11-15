'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  Heart,
  ArrowRight,
  Flame,
  Leaf,
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem, getClientMenuItems } from '@/data/menu';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';
import DishDetailModal from '@/components/DishDetailModal';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietFilter, setSelectedDietFilter] = useState<'all' | 'pure-jain' | 'vegan-friendly' | 'chef-special'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const syncData = () => {
      setMenuItems(getClientMenuItems());
      setSite(getClientSiteConfig());
    };
    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('dcd_menu_updated', syncData);
    window.addEventListener('dcd_site_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('dcd_menu_updated', syncData);
      window.removeEventListener('dcd_site_updated', syncData);
    };
  }, []);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedDishes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Dietary filter
      if (selectedDietFilter !== 'all') {
        if (!item.tags.includes(selectedDietFilter)) return false;
      }
      // 2. Category filter
      if (activeCategory !== 'all') {
        if (item.categorySlug !== activeCategory) return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesStory = item.story?.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesStory) {
          return false;
        }
      }
      return true;
    });
  }, [menuItems, searchQuery, selectedDietFilter, activeCategory]);

  // Group items by category for structured browsing
  const groupedCategories = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [filteredItems]);

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* Top Announcement Ribbon */}
      <div className="w-full bg-[#EBE8E3] py-2.5 px-4 sm:px-6 lg:px-8 border-b border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#544E49]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8652D]"></span>
            <span className="text-[#18120F] font-bold">{site.tickerText}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#C8652D] font-bold">{menuItems.length} Handcrafted Offerings</span>
          </div>
        </div>
      </div>

      {/* Page Header & Bento Metrics with Multi-Layer Parallax Depth */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6" data-parallax-layers>
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div data-parallax-layer="1" className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#C8652D]/10 blur-3xl" />
          <div data-parallax-layer="2" className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-[#E8A55B]/10 blur-2xl" />
          <div data-parallax-layer="float" className="absolute bottom-2 right-1/4 w-48 h-48 rounded-full bg-[#18120F]/5 blur-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Slow-Living Kitchen</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#18120F] tracking-tight leading-tight">
              The Full Artisanal Menu
            </h1>
            <p className="text-base sm:text-lg text-[#544E49] max-w-2xl leading-relaxed">
              From micro-lot espresso extractions and cloud-topped ceremonial matchas to stone-baked sourdough pizzas and handcrafted Indiranagar comfort bakes.
            </p>
          </div>

          {/* Quick Metrics Bento */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DD] shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8652D]">Pure Veg</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#18120F] mt-1">100%</span>
              <span className="text-xs text-[#544E49]">Zero compromise</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DD] shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8652D]">Dishes</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#18120F] mt-1">142</span>
              <span className="text-xs text-[#544E49]">Distinct tastes</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DD] shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8652D]">Altitude</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#18120F] mt-1">1,350m</span>
              <span className="text-xs text-[#544E49]">Western Ghats</span>
            </div>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-[#F0EDE9] border border-[#E5E2DD] shadow-sm space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#544E49] w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, matcha, sourdough pizza, paneer, shakes, cold brews..."
              className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 rounded-full bg-white text-[#18120F] placeholder:text-[#857D77] text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40 transition-all border border-[#E5E2DD]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#EBE8E3] hover:bg-[#E5E2DD] text-[#18120F] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDietFilter('all')}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                  selectedDietFilter === 'all'
                    ? 'bg-[#18120F] text-white'
                    : 'bg-white text-[#18120F] hover:bg-[#EBE8E3]'
                }`}
              >
                <span>All 142 Items</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDietFilter('pure-jain')}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                  selectedDietFilter === 'pure-jain'
                    ? 'bg-[#18120F] text-white'
                    : 'bg-white text-[#18120F] hover:bg-[#EBE8E3]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#186a22]" />
                <span>Pure Jain Available</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDietFilter('vegan-friendly')}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                  selectedDietFilter === 'vegan-friendly'
                    ? 'bg-[#18120F] text-white'
                    : 'bg-white text-[#18120F] hover:bg-[#EBE8E3]'
                }`}
              >
                <Leaf className="w-4 h-4 text-[#186a22]" />
                <span>Oat / Vegan Friendly</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDietFilter('chef-special')}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                  selectedDietFilter === 'chef-special'
                    ? 'bg-[#18120F] text-white'
                    : 'bg-white text-[#18120F] hover:bg-[#EBE8E3]'
                }`}
              >
                <Flame className="w-4 h-4 text-[#C8652D]" />
                <span>Chef&apos;s Signatures</span>
              </button>
            </div>

            <span className="text-xs font-bold text-[#C8652D] bg-white px-3 py-1.5 rounded-full border border-[#E5E2DD]">
              Showing {filteredItems.length} Offerings
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Category Strip */}
      <div className="sticky top-16 sm:top-20 z-30 w-full glass-nav border-y border-[#E5E2DD] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                  : 'bg-[#F0EDE9] text-[#544E49] hover:bg-[#EBE8E3] hover:text-[#18120F]'
              }`}
            >
              <span>All Categories</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                {menuItems.length}
              </span>
            </button>

            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#F0EDE9] text-[#544E49] hover:bg-[#EBE8E3] hover:text-[#18120F]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#E5E2DD] text-[#18120F]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E2DD] p-8">
            <p className="text-xl font-bold text-[#18120F]">No handcrafted offerings match your criteria.</p>
            <p className="text-sm text-[#544E49] mt-2">Try clearing your search query or dietary filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDietFilter('all');
                setActiveCategory('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] text-sm font-semibold hover:bg-[#C8652D] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          Array.from(groupedCategories.entries()).map(([categoryName, items]) => (
            <section key={categoryName} className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E5E2DD] gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
                    Authentic Craft Kitchen
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18120F] tracking-tight mt-0.5">
                    {categoryName}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#857D77]">
                  {items.length} {items.length === 1 ? 'Offering' : 'Offerings'}
                </span>
              </div>

              {/* Grid of Dishes with Smooth Animated Entrance */}
              <div data-reveal-grid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className={`dish-card-reveal image-lift-card group bg-white border border-[#E5E2DD] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(200,101,45,0.16)] hover:border-[#C8652D]/60 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer relative ${
                      dish.inStock === false ? 'opacity-70 bg-stone-50' : ''
                    }`}
                  >
                    {/* Top Row: Dish Photo + Info */}
                    <div className="flex items-start gap-4">
                      {/* Dish Photo */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 relative bg-[#FAF7F2] border border-[#E5E2DD] shadow-inner image-zoom-frame">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover scroll-parallax-img scale-105 group-hover:scale-112 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                        <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#186a22] ring-2 ring-white z-10"></div>
                      </div>

                      {/* Dish Name & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors leading-snug line-clamp-2">
                            {dish.name}
                          </h3>
                          <span className="font-extrabold text-base sm:text-lg text-[#C8652D] shrink-0">
                            ₹{dish.price}
                          </span>
                        </div>

                        {dish.inStock === false && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}

                        <p className="text-xs text-[#544E49] mt-1.5 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action strip */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E2DD]/60">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#544E49]">
                        <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
                        <span>{dish.prepTime}</span>
                        {dish.tags.includes('pure-jain') && (
                          <span className="px-2 py-0.5 rounded-full bg-[#CaEcc0] text-[#186a22] text-[10px] font-bold">
                            Jain
                          </span>
                        )}
                        {dish.tags.includes('chef-special') && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFDBCB] text-[#944516] text-[10px] font-bold">
                            Chef Special
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleLike(e, dish.id)}
                          aria-label="Save dish"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#857D77] hover:text-[#C8652D] transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${likedDishes[dish.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                          />
                        </button>
                        <span className="text-xs font-bold text-[#C8652D] group-hover:underline flex items-center gap-1">
                          <span>Craft Story</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Slide-Up Bottom Sheet / Modal */}
      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}

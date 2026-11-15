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
  ChevronDown,
  ChevronUp,
  Coffee,
  Utensils,
  Pizza,
  Sandwich,
  Cookie,
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem, getClientMenuItems } from '@/data/menu';
import { DEFAULT_SITE_CONFIG, getClientSiteConfig, SiteConfig } from '@/config/site';
import DishDetailModal from '@/components/DishDetailModal';

// Artisanal category descriptions for editorial presentation
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Hot Coffee': 'Double-pull extractions with single-origin shade-grown Chikmagalur Arabica and velvety textured milk.',
  'Cold Coffee & Brews': '18-hour cold steeped brews, velvety cloud foams, and iced artisanal espresso creations.',
  'Matcha Bar': 'Ceremonial Uji matcha hand-whisked to order with velvety oat and almond milk pairings.',
  'Coolers & Iced Teas': 'Hand-crushed botanical infusions, fresh citrus spritzes, and sparkling summer coolers.',
  'Gourmet Milkshakes': 'Rich Belgian cocoa, Lotus Biscoff, and slow-churned thick milkshakes topped with artisanal crumbles.',
  'Pizzas & Pastas': '48-hour slow-fermented sourdough crusts, San Marzano tomato sauce, and fresh fior di latte.',
  'Burgers & Sandwiches': 'Golden brioche buns, panko-crusted cottage cheese patties, and house-churned smoky aiolis.',
  'Snacks, Subs & Chaat': 'Artisanal cafe bites, loaded spiced potato dippers, and crispy sourdough baguettes.',
  'Teas & Hot Chocolate': 'Single-estate Darjeeling whole leaf teas and melted 70% dark Belgian sipping chocolate.',
  'Artisanal Salads': 'Crisp garden greens, toasted pumpkin seeds, and cold-pressed extra virgin olive oil vinaigrettes.',
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietFilter, setSelectedDietFilter] = useState<'all' | 'pure-jain' | 'vegan-friendly' | 'chef-special'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});
  
  // Track expanded state for each category section (default collapsed to 1 line / 3 items)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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

  const toggleCategoryExpand = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Whether user is searching or has applied a specific filter
  const isSearching = searchQuery.trim().length > 0 || selectedDietFilter !== 'all';

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
      <div className="w-full bg-[#EBE8E3]/80 py-2.5 px-4 sm:px-6 lg:px-8 border-b border-[#E5E2DD]">
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

      {/* Refined Artisanal Header (Spacious & Clean) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Slow-Living Kitchen</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18120F] tracking-tight leading-tight">
            The Artisanal Menu
          </h1>

          <p className="text-sm sm:text-base text-[#544E49] leading-relaxed max-w-2xl mx-auto">
            From micro-lot espresso extractions and cloud-topped ceremonial matchas to stone-baked sourdough pizzas and handcrafted comfort bakes.
          </p>

          {/* Key Identity Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E5E2DD] text-xs font-bold text-[#18120F] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#186a22]" />
              <span>100% Pure Vegetarian</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E5E2DD] text-xs font-bold text-[#18120F] shadow-xs">
              <Coffee className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>{menuItems.length} Distinct Dishes</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E5E2DD] text-xs font-bold text-[#18120F] shadow-xs">
              <Flame className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>1,350m Shade-Grown Chikmagalur</span>
            </span>
          </div>
        </div>

        {/* Floating Search & Dietary Filter */}
        <div className="mt-8 max-w-3xl mx-auto space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#857D77] w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, matcha, sourdough pizza, smash burgers, cold brews..."
              className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 rounded-full bg-white text-[#18120F] placeholder:text-[#857D77] text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40 transition-all border border-[#E5E2DD]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EBE8E3] text-[#18120F] flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedDietFilter('all')}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                selectedDietFilter === 'all'
                  ? 'bg-[#18120F] text-white shadow-sm'
                  : 'bg-white text-[#544E49] hover:text-[#18120F] hover:bg-[#F0EDE9] border border-[#E5E2DD]'
              }`}
            >
              <span>All Items</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDietFilter('pure-jain')}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                selectedDietFilter === 'pure-jain'
                  ? 'bg-[#18120F] text-white shadow-sm'
                  : 'bg-white text-[#544E49] hover:text-[#18120F] hover:bg-[#F0EDE9] border border-[#E5E2DD]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#186a22]" />
              <span>Pure Jain Available</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDietFilter('vegan-friendly')}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                selectedDietFilter === 'vegan-friendly'
                  ? 'bg-[#18120F] text-white shadow-sm'
                  : 'bg-white text-[#544E49] hover:text-[#18120F] hover:bg-[#F0EDE9] border border-[#E5E2DD]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-[#186a22]" />
              <span>Oat / Vegan Friendly</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDietFilter('chef-special')}
              className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                selectedDietFilter === 'chef-special'
                  ? 'bg-[#18120F] text-white shadow-sm'
                  : 'bg-white text-[#544E49] hover:text-[#18120F] hover:bg-[#F0EDE9] border border-[#E5E2DD]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C8652D]" />
              <span>Chef&apos;s Signatures</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Category Strip with active black pill styling */}
      <div className="sticky top-16 sm:top-20 z-30 w-full glass-nav border-y border-[#E5E2DD] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 min-h-[38px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                  : 'bg-white text-[#544E49] border border-[#E5E2DD] hover:bg-[#F0EDE9] hover:text-[#18120F]'
              }`}
            >
              <span>All Categories</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#E5E2DD] text-[#18120F]'
                }`}
              >
                {filteredItems.length}
              </span>
            </button>

            {MENU_CATEGORIES.map((cat) => {
              const catCount = menuItems.filter((i) => i.categorySlug === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 min-h-[38px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                      : 'bg-white text-[#544E49] border border-[#E5E2DD] hover:bg-[#F0EDE9] hover:text-[#18120F]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#E5E2DD] text-[#18120F]'
                    }`}
                  >
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Sections (Only 1 Line per Section + View More Button) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E2DD] p-8 shadow-xs">
            <p className="text-xl font-bold text-[#18120F]">No handcrafted offerings match your criteria.</p>
            <p className="text-sm text-[#544E49] mt-2">Try clearing your search query or dietary filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDietFilter('all');
                setActiveCategory('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] text-sm font-semibold hover:bg-[#C8652D] transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          Array.from(groupedCategories.entries()).map(([categoryName, items]) => {
            // Check if section is expanded:
            // 1. User toggled expand manually
            // 2. Or actively searching (show all matching results)
            // 3. Or a single specific category is selected in the sticky strip
            const isManuallyExpanded = !!expandedCategories[categoryName];
            const isSingleCategoryView = activeCategory !== 'all';
            const isExpanded = isManuallyExpanded || isSearching || isSingleCategoryView;

            // Only 1 line shown initially: exactly 3 items on desktop
            const displayedItems = isExpanded ? items : items.slice(0, 3);
            const hasMore = items.length > 3;
            const remainingCount = items.length - 3;
            const description = CATEGORY_DESCRIPTIONS[categoryName];

            return (
              <section key={categoryName} className="space-y-6">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E5E2DD] gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#C8652D]"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
                        Authentic Craft Kitchen
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18120F] tracking-tight">
                      {categoryName}
                    </h2>
                    {description && (
                      <p className="text-xs sm:text-sm text-[#544E49] mt-1 max-w-2xl leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-[#857D77] px-3 py-1 rounded-full bg-white border border-[#E5E2DD]">
                      {items.length} {items.length === 1 ? 'Offering' : 'Offerings'}
                    </span>
                    {hasMore && !isSearching && !isSingleCategoryView && (
                      <button
                        type="button"
                        onClick={() => toggleCategoryExpand(categoryName)}
                        className="text-xs font-bold text-[#C8652D] hover:text-[#944516] flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Collapse' : `View all ${items.length}`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid of Dishes (Smooth Entrance & Hover Polish) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedItems.map((dish) => (
                    <div
                      key={dish.id}
                      onClick={() => setSelectedDish(dish)}
                      className={`group bg-white border border-[#E5E2DD] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-[0_16px_36px_rgba(200,101,45,0.14)] hover:border-[#C8652D]/60 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer relative ${
                        dish.inStock === false ? 'opacity-70 bg-stone-50' : ''
                      }`}
                    >
                      {/* Top Row: Dish Photo + Info */}
                      <div className="flex items-start gap-4">
                        {/* Dish Photo */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 relative bg-[#FAF7F2] border border-[#E5E2DD] shadow-inner">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 80px, 96px"
                          />
                          <div
                            className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#186a22] ring-2 ring-white z-10"
                            title="100% Pure Veg"
                          ></div>
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
                          {dish.tags.includes('vegan-friendly') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold">
                              Vegan
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => toggleLike(e, dish.id)}
                            aria-label={`Save ${dish.name} to favorites`}
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

                {/* "View More" / "Show Fewer" Button (Displayed when category has > 3 items) */}
                {hasMore && !isSearching && !isSingleCategoryView && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleCategoryExpand(categoryName)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-[#F6F3EE] border border-[#E5E2DD] hover:border-[#C8652D]/40 text-xs sm:text-sm font-bold text-[#18120F] flex items-center justify-center gap-2.5 transition-all shadow-xs group cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Fewer Items</span>
                          <div className="w-5 h-5 rounded-full bg-[#FAF7F2] group-hover:bg-[#18120F] group-hover:text-white flex items-center justify-center text-[#18120F] transition-colors">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </div>
                        </>
                      ) : (
                        <>
                          <span>View All {items.length} {categoryName} Offerings (+{remainingCount} more)</span>
                          <div className="w-5 h-5 rounded-full bg-[#FAF7F2] group-hover:bg-[#C8652D] group-hover:text-white flex items-center justify-center text-[#C8652D] transition-colors">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>

      {/* Slide-Up Bottom Sheet / Modal */}
      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingBag,
  Clock,
  Camera,
  Upload,
  X,
  MessageCircle,
  Sparkles,
  Pizza,
  Sandwich,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/data/menu';
import {
  DEFAULT_SITE_CONFIG,
  getClientSiteConfig,
  getWhatsAppOrderUrl,
  SiteConfig,
} from '@/config/site';
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
    overview: 'San Marzano sweet plum tomato reduction, hand-torn fresh mozzarella, cold-pressed extra virgin olive oil, and organic garden Genovese basil fired at 420°C in our stone oven.',
    ingredients: 'Stone-Milled Semolina Flour, San Marzano Plum Tomatoes, Fresh Fior di Latte, Cold-Pressed Olive Oil, Garden Basil.',
    price: 310,
    prepTime: '12 mins',
    badgeColor: 'bg-[#98B06F] text-[#18120F]',
    ribbonColor1: '#7A9A5B',
    ribbonColor2: '#E8E4D9',
    plateImage: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'pp-1',
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

// Cafe Categories for the main interactive food & drink menu showcase
const CAFE_SHOWCASE_TABS = [
  '✨ All Bestsellers',
  '🍕 Pizzas & Pastas',
  '🍔 Burgers & Sandwiches',
  '🍟 Loaded Fries & Snacks',
  '🥤 Shakes & Coolers',
  '☕ Specialty Coffee',
];

export default function HomePage() {
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('✨ All Bestsellers');
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Gallery Upload Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImagePreview, setUploadImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<
    Array<{ url: string; alt: string; author?: string; caption?: string }>
  >([
    {
      url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
      alt: 'Fresh wood-fired Margherita Pizza at Daily Coffee Drip',
      caption: 'Stone-Baked Margherita',
    },
    {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      alt: 'Gourmet Spicy Paneer Smash Burger with Peri Peri Fries',
      caption: 'Handcrafted Smash Burger',
    },
    {
      url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
      alt: 'Crispy Peri Peri Crinkle Fries with dipping sauce',
      caption: 'Loaded Peri Peri Fries',
    },
    {
      url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
      alt: 'Decadent Lotus Biscoff Milkshake with cookie crumble',
      caption: 'Lotus Biscoff Thickshake',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3ec3I9YAVVYVvSKs8OJDkCJBh18N4dIHNxR66dNlXk-ZEWtlXdQjtHPzELuMiYAxh8HnF1DOdiLVqohLlK2-6xO5z_H6M8UMI3F82O89T-uA3zbYgjkTEiMUZTjrdBNg354A4hBpHeOJ2oLfyR3n2F1emeCLkMaZlko2JAnxt_MUtRRcILy-D8O5y89tuRSP2TaOmUUVe81Zl-KxUa-sp0iViTTVwwitM5h44lk',
      alt: 'Sunlit botanical courtyard patio at Daily Coffee Drip',
      caption: 'Al Fresco Courtyard Vibe',
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSite(getClientSiteConfig());
  }, []);

  // Auto-rotation timer (5.5s)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_ROTATIONAL_DISHES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentHeroDish = HERO_ROTATIONAL_DISHES[heroIndex];
  const nextHeroDish = HERO_ROTATIONAL_DISHES[(heroIndex + 1) % HERO_ROTATIONAL_DISHES.length];

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
        category: 'Roastery & Kitchen Signature',
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

  // Handle Photo Upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadImagePreview) {
      alert('Please select a photo to share.');
      return;
    }

    setGalleryImages((prev) => [
      {
        url: uploadImagePreview,
        alt: uploadCaption || 'Guest moment at Daily Coffee Drip',
        author: uploadName || 'Valued Patron',
        caption: uploadCaption || 'Shared Roastery Moment',
      },
      ...prev,
    ]);

    setGalleryModalOpen(false);
    setUploadName('');
    setUploadCaption('');
    setUploadImagePreview(null);
  };

  // Filter items for the main Cafe Food & Drink Showcase
  const displayedCafeItems = MENU_ITEMS.filter((item) => {
    if (activeCategoryFilter === '✨ All Bestsellers') {
      return (
        item.id === 'pp-1' || // Margherita Pizza
        item.id === 'bs-3' || // Spicy Paneer Smash Burger
        item.id === 'sn-1' || // Peri Peri Crinkle Fries
        item.id === 'gs-1' || // Lotus Biscoff Shake
        item.id === 'pp-6' || // Penne Arrabiata
        item.id === 'cb-1' || // Vanilla Cloud Cold Brew
        item.id === 'hc-14' || // Lotus Biscoff Cappuccino
        item.id === 'sn-4' // Cheesy Garlic Breadsticks
      );
    }
    if (activeCategoryFilter === '🍕 Pizzas & Pastas') {
      return item.categorySlug === 'pizza-pasta';
    }
    if (activeCategoryFilter === '🍔 Burgers & Sandwiches') {
      return item.categorySlug === 'burgers-sandwiches';
    }
    if (activeCategoryFilter === '🍟 Loaded Fries & Snacks') {
      return item.categorySlug === 'snacks-subs';
    }
    if (activeCategoryFilter === '🥤 Shakes & Coolers') {
      return item.categorySlug === 'gourmet-shakes' || item.categorySlug === 'coolers-mojitos';
    }
    if (activeCategoryFilter === '☕ Specialty Coffee') {
      return item.categorySlug === 'hot-coffee' || item.categorySlug === 'cold-coffee';
    }
    return true;
  }).slice(0, 8);

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: DIAGONAL TOP-RIGHT GLIDE DISH SHOWCASE (CLEAN & SPACIOUS) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#F2EEE9] text-[#18120F] min-h-[720px] lg:min-h-[820px] flex flex-col justify-between pt-6 sm:pt-8 pb-4 border-b border-[#E5E2DD]">
        
        {/* Dynamic Sweeping Organic Curved Arc (matching Pinterest reference) */}
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
              100% Pure Vegetarian Cafe, Roastery &amp; Fast Food Kitchen
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#544E49]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-[#E5E2DD] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-ping"></span>
              {currentHeroDish.number} / 04 Selected
            </span>
          </div>
        </div>

        {/* Centerpiece Split Layout (Clean, Uncluttered, with Diagonal Incoming Plate) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            
            {/* Left Column: Bold Dual-Weight Title, Action Pills & Carousel Selector */}
            <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
              
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18120F]/5 border border-[#C8652D]/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C8652D]"></span>
                <span className="text-xs font-extrabold text-[#C8652D] tracking-wider uppercase">
                  {currentHeroDish.categoryLabel}
                </span>
              </div>

              {/* Massive 2-Tone Headline */}
              <h1 className="flex flex-col tracking-tight leading-none text-[#18120F] mb-4">
                <span className="font-light text-3xl sm:text-4xl lg:text-5xl tracking-wider uppercase text-[#544E49]">
                  {currentHeroDish.titleLight}
                </span>
                <span className="font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase text-[#18120F] tracking-tighter mt-1">
                  {currentHeroDish.titleBold}
                </span>
              </h1>

              {/* Dish Overview & Price */}
              <p className="text-sm sm:text-base text-[#544E49] leading-relaxed max-w-lg mb-4">
                {currentHeroDish.overview}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#C8652D]">
                  ₹{currentHeroDish.price}
                </span>
                <span className="text-xs text-[#857D77] font-medium bg-white px-2.5 py-1 rounded-full border border-[#E5E2DD]">
                  Prep: {currentHeroDish.prepTime} • 100% Pure Veg • Made Fresh to Order
                </span>
              </div>

              {/* Clean Action Links Strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-[#18120F] mb-8">
                <button
                  type="button"
                  onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18120F] text-white hover:bg-[#C8652D] transition-colors shadow-sm"
                >
                  <span className="text-[#C8652D]">▷</span>
                  <span>View Recipe &amp; Craft</span>
                </button>

                <a
                  href={site.links.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#E23744] border border-[#E5E2DD] hover:border-[#E23744] transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Zomato</span>
                </a>

                <a
                  href={site.links.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#FC8019] border border-[#E5E2DD] hover:border-[#FC8019] transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Swiggy</span>
                </a>

                <a
                  href={getWhatsAppOrderUrl(
                    `${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`,
                    currentHeroDish.price
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#25D366]/10 text-[#186a22] border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>

              {/* Horizontal Thumbnail Carousel Strip */}
              <div className="flex items-center gap-2 sm:gap-3 pt-1 w-full max-w-lg">
                <button
                  type="button"
                  onClick={handlePrevHero}
                  aria-label="Previous offering"
                  className="w-9 h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
                  {HERO_ROTATIONAL_DISHES.map((item, idx) => {
                    const isActive = idx === heroIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setHeroIndex(idx)}
                        className={`cursor-pointer transition-all duration-300 flex flex-col items-center ${
                          isActive
                            ? 'bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border border-[#C8652D]/50 scale-105'
                            : 'opacity-70 hover:opacity-100 p-1.5'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 shadow-sm relative shrink-0 ${
                            isActive ? 'border-[#C8652D]' : 'border-white'
                          }`}
                        >
                          <Image
                            src={item.thumbImage}
                            alt={item.shortName}
                            fill
                            className="object-cover"
                            sizes="48px"
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

                <button
                  type="button"
                  onClick={handleNextHero}
                  aria-label="Next offering"
                  className="w-9 h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Stage with Diagonal Incoming Plate & Hanging Lamp */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[500px]">
              
              {/* Sleek Hanging Pendant Lamp (top right) */}
              <div className="hidden lg:flex flex-col items-center absolute -top-12 right-12 z-30 pointer-events-none">
                <div className="w-0.5 h-28 bg-[#18120F]"></div>
                <div className="w-7 h-9 bg-[#18120F] rounded-b-xl shadow-lg"></div>
              </div>

              {/* 1. UPCOMING QUEUE DISH: Peeking at Top-Right Corner / Edge along the arc */}
              <div
                onClick={handleNextHero}
                title={`Next: ${nextHeroDish.titleLight} ${nextHeroDish.titleBold}`}
                className="absolute -top-10 -right-8 sm:-top-8 sm:right-0 lg:top-0 lg:right-4 z-10 cursor-pointer group transition-transform hover:scale-105"
              >
                <div className="relative">
                  <div className="w-32 h-32 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/90 ring-1 ring-black/5 opacity-85 group-hover:opacity-100 transition-opacity animate-queue-plate">
                    <Image
                      src={nextHeroDish.plateImage}
                      alt={nextHeroDish.shortName}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  {/* Subtle Badge */}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E2DD] text-[10px] font-bold text-[#544E49] shadow-sm whitespace-nowrap">
                    Next up ↗
                  </span>
                </div>
              </div>

              {/* 2. ACTIVE FOCAL DISH: Gliding smoothly Diagonally from Top-Right into the Middle */}
              <div
                key={currentHeroDish.id}
                onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                className="relative z-20 cursor-pointer animate-glide-diagonal"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden shadow-[0_32px_75px_-12px_rgba(24,18,15,0.42)] border-4 sm:border-8 border-[#FAF7F2] ring-1 ring-black/5 group relative transition-transform duration-500 ease-out hover:scale-105">
                  <Image
                    src={currentHeroDish.plateImage}
                    alt={`${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 384px, 420px"
                  />
                  {/* Specular vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none"></div>

                  {/* 1-Tap Overlay Cue */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-1 rounded-full bg-white/95 text-[#18120F] text-xs font-bold shadow-md">
                    Tap to view craft story
                  </div>
                </div>
              </div>

              {/* Left Vertical Index (01 / 04) on Desktop */}
              <div className="hidden lg:flex flex-col items-center gap-2 absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-[#857D77] z-10">
                <span>{currentHeroDish.number}</span>
                <div className="w-0.5 h-10 bg-[#C8652D]/40"></div>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 0 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 1 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 2 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 3 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
              </div>

            </div>

          </div>
        </div>

        {/* Foreground Kitchen Counter Marble Top */}
        <div className="relative z-10 w-full mt-2">
          <div className="w-full h-8 sm:h-9 bg-gradient-to-r from-white via-[#FAF7F2] to-white border-t border-white/90 shadow-[0_-8px_20px_rgba(0,0,0,0.03)] flex items-center justify-between px-8"></div>
        </div>

        {/* Bottom Ticker / Status Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between text-xs text-[#544E49] pt-2">
          {/* Left: Our Menu Link */}
          <Link
            href="/menu"
            className="flex items-center gap-2 font-bold text-[#18120F] hover:text-[#C8652D] transition-colors"
          >
            <Utensils className="w-4 h-4 text-[#C8652D]" />
            <span>Full Cafe &amp; Fast Food Menu (142 Items)</span>
          </Link>

          {/* Center: Roastery Delivery & Pure Veg Motto */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#857D77]">
            <ShieldCheck className="w-4 h-4 text-[#186a22]" />
            <span>100% Pure Vegetarian Cafe • Stone Pizzas, Smash Burgers, Fries &amp; Artisan Brews</span>
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
      {/* 2. ORDER ONLINE ON DELIVERY APPS (ZOMATO, SWIGGY & WHATSAPP) */}
      {/* ========================================================================= */}
      <section className="w-full py-14 sm:py-16 bg-white border-b border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Doorstep Kitchen Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Order Cafe Comforts &amp; Fast Food to Your Door
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] mt-2 leading-relaxed">
              Hot wood-fired pizzas, crispy smash burgers, loaded fries, thick milkshakes, and chilled cold brews delivered in 25–35 mins across Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zomato Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#E23744]/40 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#E23744] text-white text-xs font-black tracking-wider uppercase">
                    Zomato
                  </div>
                  <span className="text-xs font-bold text-[#544E49] bg-white px-2.5 py-1 rounded-full border border-[#E5E2DD]">
                    ★ 4.8 Rating
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#18120F] group-hover:text-[#E23744] transition-colors">
                  Order on Zomato
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  25–35 mins average delivery. 100% pure vegetarian tamper-sealed packaging for pizzas, burgers, fries &amp; brews.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DD]">
                <a
                  href={site.links.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] rounded-full bg-[#E23744] hover:bg-[#c92f3b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Order on Zomato</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Swiggy Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#FC8019]/40 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#FC8019] text-white text-xs font-black tracking-wider uppercase">
                    Swiggy
                  </div>
                  <span className="text-xs font-bold text-[#544E49] bg-white px-2.5 py-1 rounded-full border border-[#E5E2DD]">
                    Swiggy One
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#18120F] group-hover:text-[#FC8019] transition-colors">
                  Order on Swiggy
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  Fast delivery across Indiranagar, Domlur, HAL, &amp; Koramangala. Crisp crusts &amp; chilled shakes protected.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DD]">
                <a
                  href={site.links.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] rounded-full bg-[#FC8019] hover:bg-[#e07014] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Order on Swiggy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* WhatsApp Direct Barista Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#25D366]/40 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-black tracking-wider uppercase">
                    WhatsApp Direct
                  </div>
                  <span className="text-xs font-bold text-[#186a22] bg-white px-2.5 py-1 rounded-full border border-[#E5E2DD]">
                    Zero Markup
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#18120F] group-hover:text-[#186a22] transition-colors">
                  Direct Kitchen Chat
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  Customize toppings, specify pure Jain / vegan preparation, and order direct takeaway packages.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DD]">
                <a
                  href={getWhatsAppOrderUrl('Cafe Fast Food & Brew Feast', 350)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] rounded-full bg-[#18120F] hover:bg-[#186a22] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Chat &amp; Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FULL CAFE & FAST FOOD SHOWCASE (NOT JUST COFFEE!) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Header celebrating full cafe menu */}
          <div className="text-center max-w-3xl flex flex-col items-center gap-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8652D]/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#C8652D]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Cafe &amp; Fast Food Kitchen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Artisanal Pizzas, Smash Burgers, Loaded Fries &amp; Specialty Brews
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
              We craft far more than exceptional coffee. Explore our 100% pure vegetarian kitchen featuring hot stone-baked pizzas, crispy smash burgers, seasoned fries, creamy pastas, and gourmet shakes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="w-full flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 no-scrollbar touch-pan-x mb-8 sm:mb-10">
            {CAFE_SHOWCASE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategoryFilter(tab)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                  activeCategoryFilter === tab
                    ? 'bg-[#18120F] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EBE8E3] text-[#544E49] hover:bg-[#E5E2DD] hover:text-[#18120F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 4x2 Responsive Grid of Cafe Food & Drinks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {displayedCafeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="group relative bg-white border border-[#E5E2DD] rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#C8652D]/50 transition-all duration-300 cursor-pointer"
              >
                {/* Favorite button */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(e, item.id)}
                  aria-label="Save to favorites"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#544E49] hover:text-[#C8652D] transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${likedDishes[item.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                  />
                </button>

                {/* Dish Photo */}
                <div className="relative w-full aspect-square rounded-2xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-2 border border-[#E5E2DD]/70">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                    {item.category}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="pt-3 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="font-extrabold text-lg text-[#C8652D] shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-xs text-[#544E49] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5E2DD]/60 text-[11px] font-semibold text-[#857D77]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
                      {item.prepTime}
                    </span>
                    <span className="text-[#C8652D] font-bold group-hover:underline">
                      View Craft Story ↗
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-sm hover:bg-[#C8652D] transition-colors shadow-sm"
            >
              <span>Explore All 142 Cafe &amp; Kitchen Offerings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#E5E2DD] text-[#18120F] font-semibold text-sm hover:bg-[#EBE8E3] transition-colors shadow-sm"
            >
              <span>Book a Table on Dedicated Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STONE HEARTH ALCHEMY & ROASTERY PRECISION (KITCHEN CRAFT PILLARS) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#18120F] text-[#FAF7F2] overflow-hidden py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Kitchen & Roastery Philosophy */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-white/15 mb-3 w-fit">
                <Flame className="w-3.5 h-3.5" />
                <span>Wood-Hearth &amp; Roastery Alchemy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#FAF7F2] tracking-tight leading-tight mb-4">
                Where Stone Hearth Heat Meets Roastery Precision
              </h2>
              <p className="text-sm sm:text-base text-[#D4CECA] mb-8 leading-relaxed font-normal">
                Every pizza is fired on 420°C hot stone for an airy blistered crust. Every smash burger is seared fresh to order with house sauces. And every coffee is calibrated with 9 bar extraction at 93.5°C.
              </p>

              {/* 5 Distinct Kitchen Craft Features */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: '48-Hour Cold Fermented Sourdough',
                    desc: 'San Marzano plum tomatoes, fresh mozzarella & airy cornicione.',
                    icon: Pizza,
                  },
                  {
                    title: 'Gourmet Smash Burgers & Paninis',
                    desc: 'Crispy potato & paneer smash patties with truffle aioli on brioche.',
                    icon: Sandwich,
                  },
                  {
                    title: 'Crispy Peri-Peri Fries & Street Chaat',
                    desc: 'Crinkle-cut seasoned potatoes, cheesy garlic sticks & loaded nachos.',
                    icon: Utensils,
                  },
                  {
                    title: 'Micro-Lot Single Origin Roasting',
                    desc: 'Western Ghats shade-grown Arabica extracted at 93.5°C with 9 bar pressure.',
                    icon: Coffee,
                  },
                  {
                    title: 'Decadent Thickshakes & Refreshing Coolers',
                    desc: 'Lotus Biscoff, Belgian dark cocoa & fresh passionfruit mint coolers.',
                    icon: Cookie,
                  },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#FAF7F2]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#C8652D]/20 text-[#C8652D] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{feat.title}</h4>
                        <p className="text-xs text-[#D4CECA] mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visual Collage of Food & Drinks */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 sm:h-72 rounded-3xl overflow-hidden relative shadow-lg border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80"
                    alt="Wood-Fired Margherita Pizza"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white">Wood-Fired Pizza</span>
                  </div>
                </div>

                <div className="h-44 sm:h-52 rounded-3xl overflow-hidden relative shadow-lg border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80"
                    alt="Peri Peri Fries"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white">Peri Peri Fries</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="h-44 sm:h-52 rounded-3xl overflow-hidden relative shadow-lg border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
                    alt="Paneer Smash Burger"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white">Smash Burger</span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 rounded-3xl overflow-hidden relative shadow-lg border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                    alt="Pour Over Coffee"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white">Single-Origin Roast</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CROWD-FAVORITE CAFE COMBOS & FEASTS */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#F6F3EE] border-b border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2">
              <Utensils className="w-3.5 h-3.5" />
              <span>Perfect Cafe Pairings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Crowd-Favorite Cafe Combos
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] mt-2">
              Specially curated food &amp; drink pairings crafted for unhurried dining and instant satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'The Indiranagar Smash Feast',
                items: 'Spicy Paneer Smash Burger + Peri Peri Crinkle Fries + Vanilla Cloud Cold Brew',
                price: 520,
                tag: 'Chef Bestseller',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
              },
              {
                title: 'Stone-Hearth Italian Feast',
                items: 'Wood-Fired Margherita Pizza + Cheesy Garlic Breadsticks + Lotus Biscoff Shake',
                price: 680,
                tag: 'Weekend Special',
                image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
              },
              {
                title: 'High-Tea Crunch & Sip',
                items: 'Truffle Mushroom Toast + Loaded Cheese Nachos + Lotus Biscoff Cappuccino',
                price: 640,
                tag: 'Evening Favorite',
                image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
              },
              {
                title: 'Late Night Pasta & Fizz',
                items: 'Penne Arrabiata + Corn & Cheese Panini + Passionfruit Mint Mojito',
                price: 590,
                tag: 'Comfort Pick',
                image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
              },
            ].map((combo, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-[#E5E2DD] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-[#E5E2DD]">
                    <Image
                      src={combo.image}
                      alt={combo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#18120F] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {combo.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#18120F] group-hover:text-[#C8652D] transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-[#544E49] mt-2 leading-relaxed">
                    {combo.items}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E5E2DD] flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#C8652D]">₹{combo.price}</span>
                  <a
                    href={getWhatsAppOrderUrl(combo.title, combo.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#18120F] text-white hover:bg-[#C8652D] text-xs font-bold transition-colors"
                  >
                    Order Combo ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CUSTOMER TESTIMONIALS (HOME PAGE REVIEWS ABOUT US) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-white border-b border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8652D]/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#C8652D]/20 mb-3">
              <Star className="w-3.5 h-3.5 fill-[#C8652D]" />
              <span>4.9 ★ Rating • 1,240+ Verified Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
              Customer Reviews from Bengaluru
            </h2>
            <p className="text-sm sm:text-base text-[#544E49]">
              What our neighborhood patrons say about our stone-baked sourdough pizzas, smash burgers, peri-peri fries, and third-wave brews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-[#FAF7F2] border border-[#E5E2DD] rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-inner relative border border-[#E5E2DD]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1Y4JWHR4G8Novk9zPiCzyn3KI3_CAHMFq02CSRqh_FOhYOX1EyWZWM5HE3WXkMDwm3FeF4hMirvFqwx8lILgWn6FdZu5FHQyI7LVc3XxVbTNIhFl6GrHZK4TZ7H9YeFMjdh1gc19p_kWvwX-OvfL9hL9vTQDXoQPuRZY1GBpDwQSM06g1jE2rFrQyCLDKx7rYBqwEamqCZMSS7_tuLJCD9oHeeeQH5i3PuzhbB4"
                    alt="Emma Wilson"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="mt-2 text-center text-sm font-bold text-[#18120F]">Emma Wilson</span>
                <span className="text-[11px] text-[#857D77]">Coffee &amp; Food Enthusiast</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[#C8652D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8652D]" />
                  ))}
                  <span className="text-sm text-[#18120F] font-bold ml-1">5.0</span>
                </div>
                <p className="text-sm sm:text-base text-[#18120F] leading-relaxed">
                  &ldquo;The coffee is rich and calibrated, but the food blew me away! The 100% pure veg wood-fired sourdough pizza and the peri-peri fries are easily the best in Indiranagar.&rdquo;
                </p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FAF7F2] border border-[#E5E2DD] rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-inner relative border border-[#E5E2DD]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbvPgWKhwNdDV4mviWxmR1SACzHj4LUbfjhwKMRdCYxAm_FFQm0k4-WC-AhfWFLOPprqlbQNb_mTtlTl9LpoXS0fgoJpHTSupv75zgBabO6r_zcRnFgCclu-t_HKZgXIRH3To1-FyvZpE_PQFfu2ZW-bUiauHX_4QV_8N_sP2CXTDNxhplI_UUbTSRP9W7Zpr6iLFcXmiYHCD3iSYNYfWKZ1U8die_RnkzEyOvlXY"
                    alt="Rohan Kapoor"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="mt-2 text-center text-sm font-bold text-[#18120F]">Rohan Kapoor</span>
                <span className="text-[11px] text-[#857D77]">Bengaluru Foodie</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[#C8652D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8652D]" />
                  ))}
                  <span className="text-sm text-[#18120F] font-bold ml-1">4.9</span>
                </div>
                <p className="text-sm sm:text-base text-[#18120F] leading-relaxed">
                  &ldquo;The Spicy Paneer Smash Burger and the Lotus Biscoff Shake are legendary. It has that rare combination of top-tier specialty brews and serious fast food craft.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={site.links.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18120F] text-white hover:bg-[#C8652D] text-xs font-bold shadow-sm transition-all"
            >
              <Star className="w-4 h-4 fill-[#C8652D] text-[#C8652D]" />
              <span>Leave a Review on Google (4.9 ★)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ROASTERY IMAGE GALLERY & MOMENT UPLOAD SECTION */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2] pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Patron &amp; Food Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
                Moments Inside Our Roastery &amp; Cafe
              </h2>
              <p className="text-sm sm:text-base text-[#544E49]">
                Stone oven aromas, sizzling smash patties, precision cold drips, and unhurried courtyard conversations.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setGalleryModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8652D] text-white font-semibold text-xs hover:bg-[#B45309] transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Share Your Food &amp; Cafe Photo</span>
              </button>

              <Link
                href="/roastery"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-xs hover:bg-[#C8652D] transition-colors shadow-sm"
              >
                <span>Full Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mosaic Grid of Moments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
            {galleryImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className={`${
                  i === 0 ? 'md:col-span-4' : 'md:col-span-2'
                } h-72 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-sm group border border-[#E5E2DD] relative`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-xs font-bold">{img.caption || img.alt}</span>
                  {img.author && <span className="text-[10px] text-white/80">Photo by {img.author}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Photo Upload Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E2DD] space-y-4 relative">
            <button
              type="button"
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#544E49] hover:text-[#18120F]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-[#18120F]">Share Your Food &amp; Cafe Moment</h3>
              <p className="text-xs text-[#544E49] mt-1">
                Upload your favourite photograph from Daily Coffee Drip to feature in our community reel.
              </p>
            </div>

            <form onSubmit={handleGalleryUploadSubmit} className="space-y-4">
              {/* Photo Input Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D4CECA] hover:border-[#C8652D] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#FAF7F2]"
              >
                {uploadImagePreview ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden">
                    <Image
                      src={uploadImagePreview}
                      alt="Upload preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#544E49]">
                    <Camera className="w-8 h-8 text-[#C8652D]" />
                    <span className="text-xs font-bold text-[#18120F]">Click to choose a photo from device</span>
                    <span className="text-[11px] text-[#857D77]">JPEG, PNG, WebP supported</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Ananya Rao"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-medium text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-1">
                  Caption / Moment Note
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Sourdough Margherita &amp; Cold Brew Feast"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-medium text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#EBE8E3] text-[11px] text-[#544E49]">
                Tag us on Instagram <strong className="text-[#18120F]">@dailycoffeedrip</strong> with hashtag{' '}
                <strong className="text-[#C8652D]">#DailyCoffeeDripIndiranagar</strong>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] rounded-full bg-[#18120F] hover:bg-[#C8652D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Publish to Roastery Moments</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dish Detail Modal / Mobile Bottom Sheet */}
      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}

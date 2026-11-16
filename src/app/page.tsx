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
  MapPin,
  Compass,
  Car,
  Phone,
  Navigation,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/data/menu';
import {
  DEFAULT_SITE_CONFIG,
  getClientSiteConfig,
  getWhatsAppOrderUrl,
  SiteConfig,
} from '@/config/site';
import DishDetailModal from '@/components/DishDetailModal';
import PolaroidLineCarousel from '@/components/PolaroidLineCarousel';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { CircularCarousel, CarouselItem } from '@/components/ui/circular-carousel';

// Customer Reviews Carousel Items
const CUSTOMER_REVIEWS: CarouselItem[] = [
  {
    id: 'rev-1',
    title: 'Emma Wilson',
    role: 'Coffee & Food Enthusiast',
    rating: 5.0,
    tag: '5.0 ★ Verified',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCE1Y4JWHR4G8Novk9zPiCzyn3KI3_CAHMFq02CSRqh_FOhYOX1EyWZWM5HE3WXkMDwm3FeF4hMirvFqwx8lILgWn6FdZu5FHQyI7LVc3XxVbTNIhFl6GrHZK4TZ7H9YeFMjdh1gc19p_kWvwX-OvfL9hL9vTQDXoQPuRZY1GBpDwQSM06g1jE2rFrQyCLDKx7rYBqwEamqCZMSS7_tuLJCD9oHeeeQH5i3PuzhbB4',
    description:
      'The coffee is rich and calibrated, but the food blew me away! The 100% pure veg wood-fired sourdough pizza and the peri-peri fries are easily the best in Indiranagar.',
  },
  {
    id: 'rev-2',
    title: 'Rohan Kapoor',
    role: 'Bengaluru Foodie',
    rating: 4.9,
    tag: '4.9 ★ Verified',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbvPgWKhwNdDV4mviWxmR1SACzHj4LUbfjhwKMRdCYxAm_FFQm0k4-WC-AhfWFLOPprqlbQNb_mTtlTl9LpoXS0fgoJpHTSupv75zgBabO6r_zcRnFgCclu-t_HKZgXIRH3To1-FyvZpE_PQFfu2ZW-bUiauHX_4QV_8N_sP2CXTDNxhplI_UUbTSRP9W7Zpr6iLFcXmiYHCD3iSYNYfWKZ1U8die_RnkzEyOvlXY',
    description:
      'The Spicy Paneer Smash Burger and the Lotus Biscoff Shake are legendary. It has that rare combination of top-tier specialty brews and serious fast food craft.',
  },
  {
    id: 'rev-3',
    title: 'Ananya Iyer',
    role: 'Indiranagar Resident & Architect',
    rating: 5.0,
    tag: '5.0 ★ Verified',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description:
      'The sunlit courtyard veranda with shaded wooden pergolas is incredible. We host weekend design meets here over Japanese V60s and truffle mushroom sourdough toast.',
  },
  {
    id: 'rev-4',
    title: 'Vikram Shenoy',
    role: 'Specialty Q-Grader',
    rating: 5.0,
    tag: '5.0 ★ Verified',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description:
      'Proper SCA cupping standards right in Bengaluru. The single-origin Chikmagalur pour-over has clean stone-fruit clarity, roasted in genuine sub-10kg micro-lots.',
  },
  {
    id: 'rev-5',
    title: 'Priya Nair',
    role: 'Tech Lead & Daily Remote Pro',
    rating: 4.9,
    tag: '4.9 ★ Verified',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    description:
      'Quiet Creator Corner with gigabit Wi-Fi and brass desk lamps made this my everyday work haven. Plus the avocado smash sandwich and iced oat latte keep me fueled.',
  },
  {
    id: 'rev-6',
    title: 'Kabir Mehta',
    role: 'Culinary Blogger',
    rating: 5.0,
    tag: '5.0 ★ Verified',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    description:
      '100% pure vegetarian fast food done with Michelin-level precision. Stone-baked crusts, house-churned dips, and velvety cloud cold brews. Absolutely unmatched.',
  },
];

// 4 Signature Rotational Showcase Dishes matching the interactive culinary reference
const HERO_ROTATIONAL_DISHES = [
  {
    id: 'chikmagalur-pourover',
    number: '01',
    categoryLabel: '01 / CHIKMAGALUR ELEVATION 1,350M',
    titleLight: 'CHIKMAGALUR',
    titleBold: 'POUR OVER',
    subTitle: 'A little taste of mountain origin.',
    summary: 'Golden amber pour, wild floral notes. Pure elevation.',
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
    subTitle: 'A taste of stone hearth alchemy.',
    summary: 'San Marzano plum tomatoes, fresh mozzarella, sweet Genovese basil.',
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
    id: 'spicy-paneer-burger',
    number: '03',
    categoryLabel: '03 / GOURMET SMASH BURGER',
    titleLight: 'SPICY PANEER',
    titleBold: 'SMASH BURGER',
    subTitle: 'A taste of handcrafted street craft.',
    summary: 'Panko malai paneer, smoked paprika aioli, and brioche crunch.',
    shortName: 'Smash burger',
    overview: 'Double spiced malai paneer patty crusted in panko crumb, melted artisanal smoked cheddar, house-pickled cucumbers, and fire-roasted sriracha aioli inside a butter-toasted golden brioche bun.',
    ingredients: 'Artisanal Malai Paneer, Panko Breadcrumbs, Toasted Brioche Bun, Sriracha Aioli, House Pickles, Crisp Iceberg, Smoked Cheddar.',
    price: 240,
    prepTime: '7 mins',
    badgeColor: 'bg-[#E3723E] text-[#FAF7F2]',
    ribbonColor1: '#D96B27',
    ribbonColor2: '#F4E6D8',
    plateImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'bs-3',
  },
  {
    id: 'lotus-biscoff-shake',
    number: '04',
    categoryLabel: '04 / BELGIAN SPECULOOS THICKSHAKE',
    titleLight: 'LOTUS BISCOFF',
    titleBold: 'THICK SHAKE',
    subTitle: 'A taste of velvety decadence.',
    summary: 'Creamy churned vanilla dairy, Belgian Biscoff spread, and crushed biscuit sand.',
    shortName: 'Biscoff shake',
    overview: 'Thick churned farm-fresh dairy gelato blended with velvety Belgian Lotus Biscoff caramel spread, topped with slow-whipped vanilla bean cream and crunchy spiced caramelised biscuit crumb.',
    ingredients: 'Belgian Lotus Biscoff Spread, Farm Cream Gelato, Crushed Biscoff Biscuits, Pure Vanilla Bean, Caramelized Sugar Rim.',
    price: 260,
    prepTime: '4 mins',
    badgeColor: 'bg-[#C27C44] text-[#FAF7F2]',
    ribbonColor1: '#A66027',
    ribbonColor2: '#EFE5DA',
    plateImage: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    thumbImage: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=80',
    dishRefId: 'gs-1',
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
  const [heroInfoTab, setHeroInfoTab] = useState<'overview' | 'ingredients'>('overview');

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
      url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
      alt: 'Crispy Peri Peri Crinkle Fries with dipping sauce',
      caption: 'Loaded Peri Peri Fries',
    },
    {
      url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
      alt: 'Decadent Lotus Biscoff Milkshake with cookie crumble',
      caption: 'Lotus Biscoff Thickshake',
    },
    {
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      alt: 'Chikmagalur Pour-Over Coffee V60 Extraction',
      caption: 'Chikmagalur Pour-Over',
    },
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      alt: 'Sunlit courtyard patio at Daily Coffee Drip',
      caption: 'Al Fresco Courtyard Vibe',
    },
  ]);

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const syncData = () => {
      setSite(getClientSiteConfig());
    };
    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('dcd_site_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('dcd_site_updated', syncData);
    };
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
        category: 'Cafe & Kitchen Signature',
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
        caption: uploadCaption || 'Shared Cafe Moment',
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
      {/* 1. HERO SECTION WITH OSMO MULTI-LAYER DEPTH PARALLAX */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#F2EEE9] text-[#18120F] min-h-[660px] lg:min-h-[740px] flex flex-col justify-between pt-6 sm:pt-8 pb-8 sm:pb-12 border-b border-[#E5E2DD]">
        
        {/* Dynamic Sweeping Organic Curved Arc & Ambient Layers (Osmo Multi-Layer Depth) */}
        <div data-parallax-layers className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Layer 1: Warm ambient glow (yPercent: 70) */}
          <div
            data-parallax-layer="1"
            className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full bg-[#C8652D]/12 blur-3xl"
          />

          {/* Layer 2: Sweeping Organic Ribbon Arc (yPercent: 55) */}
          <div data-parallax-layer="2" className="absolute inset-0 w-full h-full">
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

          {/* Layer 3: Floating warmth & golden glow accent (yPercent: -35) */}
          <div
            data-parallax-layer="float"
            className="hidden sm:block absolute top-1/4 right-12 w-64 h-64 rounded-full bg-[#E8A55B]/10 blur-2xl"
          />
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
              100% Pure Vegetarian Cafe, Restaurant &amp; Craft Kitchen
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#544E49]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-[#E5E2DD] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-ping"></span>
              {currentHeroDish.number} / 04 Selected
            </span>
          </div>
        </div>

        {/* Centerpiece Split Layout (Clean, Breathable & Kitchen King Inspired) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
            
            {/* 1. Left Column: Large Commanding Focal Dish (Arrives from Top-Right and Grows Big) */}
            <div className="lg:col-span-5 order-1 flex items-center justify-center relative min-h-[300px] sm:min-h-[420px] lg:min-h-[500px]">
              
              {/* Left Vertical Index (01 / 04) on Desktop */}
              <div className="hidden xl:flex flex-col items-center gap-2 absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-[#857D77] z-10">
                <span>{currentHeroDish.number}</span>
                <div className="w-0.5 h-10 bg-[#C8652D]/40"></div>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 0 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 1 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 2 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
                <span className={`w-1.5 h-1.5 rounded-full ${heroIndex === 3 ? 'bg-[#C8652D]' : 'bg-[#D4CECA]'}`}></span>
              </div>

              {/* FOCAL DISH: Swoops in diagonally from top-right and expands */}
              <div
                key={currentHeroDish.id}
                onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                className="relative z-20 cursor-pointer animate-glide-diagonal"
              >
                <div className="w-64 h-64 sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] lg:w-[440px] lg:h-[440px] xl:w-[490px] xl:h-[490px] rounded-full overflow-hidden shadow-[0_36px_90px_-15px_rgba(24,18,15,0.42)] border-4 sm:border-8 border-[#FAF7F2] ring-1 ring-black/5 group relative transition-transform duration-500 ease-out hover:scale-105">
                  <Image
                    src={currentHeroDish.plateImage}
                    alt={`${currentHeroDish.titleLight} ${currentHeroDish.titleBold}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 420px, 500px"
                  />
                  {/* Subtle specular vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

                  {/* 1-Tap Overlay Cue */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-4 py-1.5 rounded-full bg-white/95 text-[#18120F] text-xs font-bold shadow-lg whitespace-nowrap">
                    Tap to order now
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Middle Column: Minimalist Editorial Title, Action Links & Dish Selector */}
            <div className="lg:col-span-4 order-2 flex flex-col items-start text-left z-20">
              
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18120F]/5 border border-[#C8652D]/20 mb-2 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C8652D]"></span>
                <span className="text-[11px] sm:text-xs font-extrabold text-[#C8652D] tracking-wider uppercase">
                  {currentHeroDish.categoryLabel}
                </span>
              </div>

              {/* Massive 2-Tone Headline */}
              <h1 className="flex flex-col tracking-tight leading-none text-[#18120F] mb-4 sm:mb-5">
                <span className="font-light text-2xl sm:text-4xl lg:text-4xl xl:text-5xl tracking-wider uppercase text-[#544E49]">
                  {currentHeroDish.titleLight}
                </span>
                <span className="font-extrabold text-3xl sm:text-5xl lg:text-5xl xl:text-6xl uppercase text-[#18120F] tracking-tighter mt-1">
                  {currentHeroDish.titleBold}
                </span>
              </h1>

              {/* Clean, Subtle Action Links */}
              <div className="flex items-center gap-4 text-xs sm:text-sm font-bold text-[#18120F] mb-5 sm:mb-6">
                <button
                  type="button"
                  onClick={() => handleOpenDishModal(currentHeroDish.dishRefId)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18120F] text-white hover:bg-[#C8652D] transition-colors shadow-xs group cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  href="/menu"
                  className="flex items-center gap-1.5 text-[#544E49] hover:text-[#C8652D] transition-colors px-2 py-2"
                >
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Horizontal Thumbnail Carousel Strip */}
              <div className="flex items-center gap-2 sm:gap-2.5 pt-1 w-full max-w-md">
                <button
                  type="button"
                  onClick={handlePrevHero}
                  aria-label="Previous offering"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {HERO_ROTATIONAL_DISHES.map((item, idx) => {
                    const isActive = idx === heroIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setHeroIndex(idx)}
                        className={`cursor-pointer transition-all duration-300 flex flex-col items-center ${
                          isActive
                            ? 'bg-white rounded-2xl p-1.5 sm:p-2 shadow-md border border-[#C8652D]/50 scale-105'
                            : 'opacity-70 hover:opacity-100 p-1'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 shadow-sm relative shrink-0 ${
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
                          className={`text-[9px] sm:text-[10px] font-bold mt-1 whitespace-nowrap ${
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
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E5E2DD] shadow-sm flex items-center justify-center text-[#18120F] hover:bg-[#EBE8E3] active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Right Column: Floating Glassmorphic Info Card & Cafe Interior Stage */}
            <div className="lg:col-span-3 order-3 relative flex flex-col items-start justify-center">
              
              {/* Minimalist Hanging Pendant Lamp (top right) */}
              <div className="hidden lg:flex flex-col items-center absolute -top-16 right-6 z-30 pointer-events-none">
                <div className="w-0.5 h-28 bg-[#18120F]"></div>
                <div className="w-7 h-9 bg-[#18120F] rounded-b-xl shadow-lg"></div>
              </div>

              {/* Floating White Card (Overview / Ingredients) */}
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(24,18,15,0.08)] border border-[#E5E2DD] relative z-20">
                
                {/* Segmented Tabs */}
                <div className="flex items-center gap-5 border-b border-[#E5E2DD] pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setHeroInfoTab('overview')}
                    className={`transition-colors pb-1 relative cursor-pointer ${
                      heroInfoTab === 'overview'
                        ? 'text-[#18120F] font-extrabold border-b-2 border-[#18120F]'
                        : 'text-[#857D77] hover:text-[#18120F]'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroInfoTab('ingredients')}
                    className={`transition-colors pb-1 relative cursor-pointer ${
                      heroInfoTab === 'ingredients'
                        ? 'text-[#18120F] font-extrabold border-b-2 border-[#18120F]'
                        : 'text-[#857D77] hover:text-[#18120F]'
                    }`}
                  >
                    Ingredients
                  </button>
                </div>

                {/* Number Badge with Star */}
                <div
                  className={`mt-4 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl ${currentHeroDish.badgeColor} font-black text-sm shadow-xs`}
                >
                  <span>{currentHeroDish.number}</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>

                {/* Subtitle / Story Headline */}
                <h3 className="text-sm sm:text-base font-extrabold text-[#18120F] mt-3">
                  {currentHeroDish.subTitle}
                </h3>
                <p className="text-[11px] text-[#857D77] font-medium mt-1">
                  {currentHeroDish.summary}
                </p>

                {/* Body Text (Switches smoothly based on active tab) */}
                <p className="text-xs text-[#544E49] leading-relaxed mt-3 pt-3 border-t border-[#F2EEE9]">
                  {heroInfoTab === 'overview'
                    ? currentHeroDish.overview
                    : currentHeroDish.ingredients}
                </p>
              </div>

            </div>

          </div>
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

          <div data-reveal-grid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zomato Card */}
            <div className="dish-card-reveal image-lift-card p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#E23744]/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
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
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed min-h-[48px] sm:min-h-[56px]">
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
            <div className="dish-card-reveal image-lift-card p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#FC8019]/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
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
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed min-h-[48px] sm:min-h-[56px]">
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
            <div className="dish-card-reveal image-lift-card p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#E5E2DD] hover:border-[#25D366]/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
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
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed min-h-[48px] sm:min-h-[56px]">
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
          <div data-reveal-grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {displayedCafeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDish(item)}
                className="group relative bg-white border border-[#E5E2DD] rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(200,101,45,0.16)] hover:border-[#C8652D]/60 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer dish-card-reveal image-lift-card"
              >
                {/* Favorite button */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(e, item.id)}
                  aria-label="Save to favorites"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#544E49] hover:text-[#C8652D] group-hover:scale-110 transition-all shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${likedDishes[item.id] ? 'fill-[#C8652D] text-[#C8652D]' : ''}`}
                  />
                </button>

                {/* Dish Photo with Scroll Parallax & Zoom */}
                <div className="relative w-full aspect-square rounded-2xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-2 border border-[#E5E2DD]/70 shadow-xs image-zoom-frame">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover scroll-parallax-img scale-105 group-hover:scale-112 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Atmospheric hover sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18120F]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold z-10 shadow-xs">
                    {item.category}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="pt-3 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-[#18120F] group-hover:text-[#C8652D] transition-colors line-clamp-2 min-h-[44px] sm:min-h-[48px] flex items-center">
                        {item.name}
                      </h3>
                      <span className="font-extrabold text-lg text-[#C8652D] shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-xs text-[#544E49] mt-1 line-clamp-2 leading-relaxed min-h-[34px]">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5E2DD]/60 text-[11px] font-semibold text-[#857D77]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
                      {item.prepTime}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDish(item);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#18120F] group-hover:bg-[#C8652D] text-[#FAF7F2] text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Order Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
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
            
            {/* Left Column: Kitchen & Brew Philosophy */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-white/15 mb-3 w-fit">
                <Flame className="w-3.5 h-3.5" />
                <span>Wood-Hearth &amp; Specialty Brew Alchemy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#FAF7F2] tracking-tight leading-tight mb-4">
                Where Stone Hearth Heat Meets Barista Craft Precision
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

            {/* Right Column: Visual Showcase of Food & Drinks (Clean Aligned 2x2 Grid) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-4">
              {/* Card 1: Pizza */}
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80"
                  alt="Wood-Fired Margherita Pizza"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                  <span className="text-xs sm:text-sm font-bold text-white">Wood-Fired Pizza</span>
                </div>
              </div>

              {/* Card 2: Smash Burger */}
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
                  alt="Paneer Smash Burger"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                  <span className="text-xs sm:text-sm font-bold text-white">Smash Burger</span>
                </div>
              </div>

              {/* Card 3: Peri Peri Fries */}
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80"
                  alt="Peri Peri Fries"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                  <span className="text-xs sm:text-sm font-bold text-white">Peri Peri Fries</span>
                </div>
              </div>

              {/* Card 4: Single-Origin Roast */}
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                  alt="Pour Over Coffee"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                  <span className="text-xs sm:text-sm font-bold text-white">Single-Origin Roast</span>
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

                  <h3 className="font-bold text-base text-[#18120F] group-hover:text-[#C8652D] transition-colors min-h-[44px] flex items-center">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-[#544E49] mt-1 leading-relaxed min-h-[36px] line-clamp-2">
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
      {/* 5B. ABOUT US & THE FOUNDERS STORY (OUR CAFE & KITCHEN ROOTS) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5E2DD] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-sm border border-[#E5E2DD] flex flex-col lg:flex-row gap-10 items-center">
            {/* Left: Story & Quote */}
            <div className="lg:w-1/2 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8652D]/10 text-[#C8652D] text-xs font-bold uppercase tracking-wider w-fit border border-[#C8652D]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About Our Cafe &amp; Restaurant</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18120F] tracking-tight leading-tight">
                Crafted for Bengaluru, Rooted in Honest Food &amp; Precision Brews
              </h2>

              <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
                Founded by Kabir &amp; Ananya on 12th Main Indiranagar, Daily Coffee Drip was born to create a warm neighborhood gathering space where world-class single-origin coffee meets serious artisanal dining.
              </p>

              <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
                We believe you shouldn&apos;t have to settle for bland quick-service meals. That&apos;s why our kitchen is 100% pure vegetarian, slow-fermenting 48-hour sourdough pizzas, hand-crafting panko malai paneer smash burgers, and pulling calibrated pour-overs from 1,350m elevation Chikmagalur estates.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E2DD]">
                  <span className="text-2xl font-black text-[#C8652D]">100%</span>
                  <p className="text-xs font-bold text-[#18120F] mt-0.5">Pure Vegetarian</p>
                  <p className="text-[11px] text-[#857D77]">Jain customizations available</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E2DD]">
                  <span className="text-2xl font-black text-[#18120F]">1,350m</span>
                  <p className="text-xs font-bold text-[#18120F] mt-0.5">Chikmagalur Elevation</p>
                  <p className="text-[11px] text-[#857D77]">Direct single-origin micro-lots</p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18120F] text-[#FAF7F2] hover:bg-[#C8652D] text-xs font-bold shadow-sm transition-all"
                >
                  <span>Meet the Founders &amp; Read Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#18120F] hover:text-[#C8652D] transition-colors"
                >
                  <span>Book a Table →</span>
                </Link>
              </div>
            </div>

            {/* Right: Founders & Kitchen Image Showcase (Clean 2x2 Aligned Grid) */}
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-3.5 sm:gap-4">
              {/* Founder 1: Kabir Mehta */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#E5E2DD] shadow-sm group image-zoom-frame border border-[#E5E2DD]">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                  alt="Kabir Mehta - Co-Founder & Coffee Roaster"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 sm:p-2.5 rounded-xl bg-black/65 backdrop-blur-md text-white">
                  <p className="font-bold text-xs truncate">Kabir Mehta</p>
                  <p className="text-[10px] text-white/80">Co-Founder &amp; Roaster</p>
                </div>
              </div>

              {/* Founder 2: Ananya Iyer */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#E5E2DD] shadow-sm group image-zoom-frame border border-[#E5E2DD]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt="Ananya Iyer - Co-Founder & Executive Chef"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 sm:p-2.5 rounded-xl bg-black/65 backdrop-blur-md text-white">
                  <p className="font-bold text-xs truncate">Ananya Iyer</p>
                  <p className="text-[10px] text-white/80">Co-Founder &amp; Chef</p>
                </div>
              </div>

              {/* Craft 1: Pour-Over Brewing */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5E2DD] shadow-sm group image-zoom-frame border border-[#E5E2DD]">
                <Image
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                  alt="Manual V60 Pour-over brewing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white">Specialty Extraction</span>
                </div>
              </div>

              {/* Craft 2: Wood-Fired Pizza */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5E2DD] shadow-sm group image-zoom-frame border border-[#E5E2DD]">
                <Image
                  src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80"
                  alt="Wood-fired stone-baked sourdough pizza"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white">Wood-Fired Hearth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CUSTOMER TESTIMONIALS (ANIMATED CIRCULAR CAROUSEL) */}
      {/* ========================================================================= */}
      <section
        className="w-full py-16 sm:py-20 bg-white border-b border-[#E5E2DD] overflow-hidden relative z-10"
        style={{ isolation: 'isolate' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
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

          {/* 3D Circular Orbit Carousel Animation */}
          <div className="w-full max-w-5xl mx-auto my-4">
            <CircularCarousel
              items={CUSTOMER_REVIEWS}
              activeIndex={activeReviewIndex}
              onActiveChange={setActiveReviewIndex}
              theme="cafe"
              autoPlay={true}
              autoPlayInterval={2800}
            />
          </div>

          <div className="mt-8 text-center">
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
      {/* 7. CAFE PHOTO GALLERY (POLAROID LINE CAROUSEL ANIMATION) */}
      {/* ========================================================================= */}
      <section
        className="w-full py-16 sm:py-20 bg-[#FAF7F2] pb-24 sm:pb-28 overflow-hidden relative z-10"
        style={{ isolation: 'isolate' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Patron &amp; Food Polaroid Line</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
                Moments Inside Our Cafe &amp; Restaurant
              </h2>
              <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
                Drag or swipe the line — instant polaroid prints swaying on wooden pegs in the Bengaluru breeze.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-bold text-xs sm:text-sm hover:bg-[#C8652D] transition-colors shadow-xs"
              >
                <span>Full Story &amp; Spaces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Polaroid Line Carousel Component */}
          <div className="w-full my-4">
            <PolaroidLineCarousel
              height="500px"
              cardWidth={270}
              sag={46}
              swing={1.1}
              autoplay={4500}
              string="#9E866B"
              background="#F6F3EE"
              ink="#18120F"
              slides={galleryImages.map((img) => ({
                image: img.url,
                title: img.caption || img.alt,
                caption: img.author ? `Shared by ${img.author}` : 'Daily Coffee Drip Cafe & Kitchen',
                alt: img.alt,
              }))}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CAFE LOCATION & GOOGLE MAPS */}
      {/* ========================================================================= */}
      <section
        className="w-full py-16 sm:py-24 bg-white border-t border-[#E5E2DD] relative z-10"
        style={{ isolation: 'isolate' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location &amp; Visit Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
                Find Us in Indiranagar, Bengaluru
              </h2>
              <p className="text-sm sm:text-base text-[#544E49] max-w-2xl">
                Centrally located on 12th Main Road, HAL 2nd Stage. Join us for shade-grown artisanal coffee, wood-fired sourdough pizzas, and cozy al fresco dining.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={site.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18120F] text-[#FAF7F2] font-semibold text-xs hover:bg-[#C8652D] transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[#C8652D]" />
                <span>Get Directions (Google Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8652D] text-white font-semibold text-xs hover:bg-[#B45309] transition-all shadow-sm"
              >
                <span>Book a Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Main Grid: Google Map View + Venue Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Google Map Container */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col lg:h-full">
              <div className="relative w-full h-[380px] sm:h-[460px] lg:h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full rounded-3xl overflow-hidden border border-[#E5E2DD] shadow-md group bg-[#E5E2DD] lg:flex-1">
                <Image
                  src={site.address.mapEmbedUrl}
                  alt="Daily Coffee Drip Cafe &amp; Restaurant Location Map Indiranagar Bengaluru"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />

                {/* Top Overlay Badge: Live Cafe Identity */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border border-[#E5E2DD] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#18120F] flex items-center justify-center text-[#FAF7F2] shrink-0">
                    <Coffee className="w-4 h-4 text-[#C8652D]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#18120F] leading-tight">
                      {site.name}
                    </h3>
                    <p className="text-[11px] text-[#544E49] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C8652D]" />
                      <span>{site.address.line1}, {site.address.area}</span>
                    </p>
                  </div>
                </div>

                {/* Top Right: Open Status Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
                    site.hours.isOpenNow
                      ? 'bg-white/95 text-[#186a22] border border-[#186a22]/30'
                      : 'bg-white/95 text-red-700 border border-red-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${site.hours.isOpenNow ? 'bg-[#186a22] animate-ping' : 'bg-red-500'}`} />
                    {site.hours.isOpenNow ? 'Open Now • Until 11:00 PM' : 'Closed for Today'}
                  </span>
                </div>

                {/* Bottom Center / Floating Location Bar */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#E5E2DD]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#18120F] truncate min-w-0">
                    <MapPin className="w-4 h-4 text-[#C8652D] shrink-0" />
                    <span className="truncate">{site.address.full}</span>
                  </div>
                  <a
                    href={site.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#18120F] hover:bg-[#C8652D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Venue Details & Accessibility */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-[#FAF7F2] p-6 sm:p-7 rounded-3xl border border-[#E5E2DD] shadow-sm gap-5 h-full">
              <div>
                <span className="text-[11px] font-bold text-[#C8652D] uppercase tracking-wider block mb-1">
                  Location &amp; Visit Details
                </span>
                <h3 className="text-xl font-extrabold text-[#18120F]">
                  At the Heart of Indiranagar
                </h3>
                <p className="text-xs text-[#544E49] mt-1 leading-relaxed">
                  Easily accessible from 100ft Road and CMH Road with dedicated valet and peaceful alfresco seating.
                </p>
              </div>

              {/* Information Rows */}
              <div className="flex flex-col gap-3 text-xs text-[#544E49]">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E5E2DD]/80 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Address &amp; Landmark</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed">{site.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E5E2DD]/80 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Daily Hours</p>
                    <p className="text-[11px] mt-0.5">{site.hours.openTime} – {site.hours.closingTime} • {site.hours.days}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E5E2DD]/80 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Complimentary Valet</p>
                    <p className="text-[11px] mt-0.5">Dedicated valet parking team at the front entrance portico</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E5E2DD]/80 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#C8652D] shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#18120F]">Metro &amp; Transit</p>
                    <p className="text-[11px] mt-0.5">600m from Indiranagar Metro Station (Purple Line)</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2">
                <a
                  href={`https://wa.me/${site.contact.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-white hover:bg-[#F0EDE9] text-[#18120F] border border-[#E5E2DD] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${site.contact.phoneRaw}`}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#18120F] hover:bg-[#C8652D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8652D]" />
                  <span>Call Cafe Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Photo Upload Modal */}
      {galleryModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          style={{ zIndex: 150 }}
        >
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
                <span>Publish to Cafe Moments</span>
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

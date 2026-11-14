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
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Camera,
  Upload,
  X,
  MessageCircle,
  Sparkles,
  Phone,
  MapPin,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/data/menu';
import {
  DEFAULT_SITE_CONFIG,
  getClientSiteConfig,
  getWhatsAppOrderUrl,
  getClientReservations,
  saveClientReservations,
  ReservationRecord,
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
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeCoffeeFilter, setActiveCoffeeFilter] = useState('All Coffee');
  const [activeFlavorFilter, setActiveFlavorFilter] = useState('Chocolate');
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Home Reservation Widget State
  const [reservePartySize, setReservePartySize] = useState('1-2');
  const [reserveZone, setReserveZone] = useState('Al Fresco Veranda');
  const [reserveDate, setReserveDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [reserveTimeSlot, setReserveTimeSlot] = useState('Morning Roast (08:30 AM)');
  const [reserveGuestName, setReserveGuestName] = useState('');
  const [reserveGuestPhone, setReserveGuestPhone] = useState('');
  const [reserveSuccessRecord, setReserveSuccessRecord] = useState<ReservationRecord | null>(null);

  // Gallery Upload Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImagePreview, setUploadImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<
    Array<{ url: string; alt: string; author?: string; caption?: string }>
  >([
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3ec3I9YAVVYVvSKs8OJDkCJBh18N4dIHNxR66dNlXk-ZEWtlXdQjtHPzELuMiYAxh8HnF1DOdiLVqohLlK2-6xO5z_H6M8UMI3F82O89T-uA3zbYgjkTEiMUZTjrdBNg354A4hBpHeOJ2oLfyR3n2F1emeCLkMaZlko2JAnxt_MUtRRcILy-D8O5y89tuRSP2TaOmUUVe81Zl-KxUa-sp0iViTTVwwitM5h44lk',
      alt: 'Sunlit botanical courtyard patio at Daily Coffee Drip',
      caption: 'Al Fresco Morning Sunshine',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgB5Dju61f1AZ7w8ZZkunbc_VPRKRw7tF1CcWK56UO3X8JE7-yB85nH1tZrKCOPh-VWK7jkpZqA_GdSsaJw6UySmzgxlkxGofYUL-SkdiK7IbpFC0dI8lylMLtInAWzr2I7UGbeXcs8qd1k3uztGOAl95EdgjxsONqSRAYVJse5XLRBNeyFnruaW1evnwGybvkFkWOidlKlrZhRCQbS0w0RhKiduw4D_c1DNwTgqk',
      alt: 'Artisan coffee bar interior with pour-over station',
      caption: 'Manual V60 Station',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC95GcRC66ylQ06e9PGONOq8V1LDFcqECNN7hqDLhOa25cpnr2yNhcORdcs2nSZRaKogcvOTTbSFvwHUOBM08gHhxL3jJLuAX50uvfrqZT6FDkYqa2zg1RfYNwZmkpzjB02wyAWrN_EDJ7JjgIfrtYLDaIsOjYE2hHf027ULWymw-uBYlwkSaV7Px9z_pJsbNrQ_dubqWDTxa7ORmGqeZw3jOi0pIEQ11zVF5r1wmA',
      alt: 'Attentive head barista crafting espresso',
      caption: '9 Bar Extraction Dial',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNpPP_ko97XuvRcN5t7w0f4KzB3mF7VfqiVW_SmZIgsWr6Ne_-3XzHgR5wJO_1dlpob6DBI9WevfPGUEydADRVgmk8-CZ-TLqZ9rhHJjWM8WGh-u5k5kdcDqew0Y4fS9gCp2ahGG6K_XCpX16R0pRg9iEKhR1QMKAMXNzRR7t0uzfj9uVv4Sh9yDuq6MpjTqa61xU0cBtz1vGY-RImycGjo-zR0gXXVeODKZ2JVBM',
      alt: 'Botanical stairway with cascading plants',
      caption: 'Verdant Indiranagar Stairway',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHbU1SitFmrXgBFPy8tb_PAQw95Na-CSEE6WhDrcCJ9H9b2i5gW5Dj9iXwoYpdQy4eYW8mYEQLLZsOQi3olKuBT4D0I8G8L-3H-k8KevNzGx67ectn24sO6V1wO_Ys6B7N8wDJJosZRCMeqf5h5Y1D42rko9b9r0xIcOSFcqRObSCXB62ySPVit06AM_8amTYfxNFHwJuRQdSuhYKBu_LdLIRChD-fTAI25v3rMtw',
      alt: 'Guest savoring morning cup in the al fresco veranda',
      caption: 'Unhurried Weekend Connection',
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

  // Handle Home Reservation Booking Submit
  const handleHomeReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveGuestName.trim() || !reserveGuestPhone.trim()) {
      alert('Please enter your name and phone number to reserve a table.');
      return;
    }

    const newRecord: ReservationRecord = {
      id: `RES-${Date.now().toString().slice(-6)}`,
      name: reserveGuestName,
      whatsapp: reserveGuestPhone,
      email: '',
      partySize: `${reservePartySize} Guests`,
      zone: reserveZone,
      date: reserveDate,
      timeSlot: reserveTimeSlot,
      dietaryOptions: {
        pureVeg: true,
        strictJain: false,
        nutFree: false,
        celebration: false,
      },
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const currentList = getClientReservations();
    saveClientReservations([newRecord, ...currentList]);
    setReserveSuccessRecord(newRecord);
    setReserveGuestName('');
    setReserveGuestPhone('');
  };

  // Handle Local Photo Selection Preview
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

  // Handle Add Photo to Gallery
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
              100% Pure Vegetarian Roastery &amp; Craft Kitchen
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
                  Prep: {currentHeroDish.prepTime} • 100% Pure Veg
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
                  <span>View Craft Story</span>
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
            <span>Our Menu (142 Offerings)</span>
          </Link>

          {/* Center: Roastery Delivery & Pure Veg Motto */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#857D77]">
            <ShieldCheck className="w-4 h-4 text-[#186a22]" />
            <span>100% Pure Vegetarian Kitchen • Online Delivery on Zomato &amp; Swiggy</span>
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
      {/* 2. ORDER ONLINE ON DELIVERY APPS (ZOMATO & SWIGGY & WHATSAPP) */}
      {/* ========================================================================= */}
      <section className="w-full py-14 sm:py-18 bg-white border-b border-[#E5E2DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Doorstep Roastery Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight">
              Craving Daily Coffee Drip at Home?
            </h2>
            <p className="text-sm sm:text-base text-[#544E49] mt-2 leading-relaxed">
              Order fresh single-origin brews, cloud cold brews, and wood-fired sourdough pizzas straight to your door across Indiranagar &amp; Central Bengaluru.
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
                  Order via Zomato
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  25–35 mins average delivery. 100% pure vegetarian spill-proof cups with tamper-evident seal.
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
                  Order via Swiggy
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  Fast delivery across Indiranagar, Domlur, HAL, &amp; Koramangala. Hot bakes &amp; iced brews protected.
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
                  Direct with Barista
                </h3>
                <p className="text-xs sm:text-sm text-[#544E49] mt-2 leading-relaxed">
                  Specify customized grind sizes, dietary preferences (Jain/Oat), and whole bean coffee bag deliveries.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DD]">
                <a
                  href={getWhatsAppOrderUrl('Specialty Roastery Order', 250)}
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
      {/* 3. INTERACTIVE TABLE RESERVATION SECTION DIRECTLY ON HOMEPAGE */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hospitality Narrative & Zone Guide */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8652D]/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#C8652D]/20">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Your Table</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#18120F] tracking-tight leading-tight">
                Unhurried Hospitality in Indiranagar
              </h2>
              <p className="text-sm sm:text-base text-[#544E49] leading-relaxed">
                Whether you seek sunlit courtyard conversations, a focused workspace with high-speed fiber, or an evening tasting flight by the stone hearth, reserve your spot in advance.
              </p>

              {/* Seating Zones Quick Visual */}
              <div className="space-y-3 pt-2">
                {[
                  { name: '🌿 Al Fresco Veranda', desc: 'Breezy outdoor garden canopy & pergolas' },
                  { name: '🔥 Hearth & Banquette', desc: 'Plush velvet banquettes & acoustic warmth' },
                  { name: '☕ Backlit Arch Bar', desc: 'Front-row sensory view of barista extractions' },
                  { name: '💻 Quiet Creator Corner', desc: 'Dedicated brass task lights & power plugs' },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setReserveZone(item.name.replace(/^[^\w\s]+\s*/, ''))}
                    className="p-3 rounded-2xl bg-white border border-[#E5E2DD] hover:border-[#C8652D]/50 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#18120F]">{item.name}</h4>
                      <p className="text-[11px] text-[#857D77]">{item.desc}</p>
                    </div>
                    <span className="text-xs text-[#C8652D] font-bold">Select</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/reservation"
                  className="text-xs font-bold text-[#C8652D] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>View full reservation details &amp; group policies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Instant Booking Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5E2DD]">
                <div className="flex items-center justify-between border-b border-[#E5E2DD] pb-4 mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#18120F]">Instant Table Request</h3>
                    <p className="text-xs text-[#857D77] mt-0.5">Complimentary reservation • Confirmed within 15 mins</p>
                  </div>
                  <span className="text-xs font-bold text-[#186a22] bg-[#CaEcc0]/40 px-3 py-1 rounded-full border border-[#186a22]/20">
                    Pure Veg Kitchen
                  </span>
                </div>

                <form onSubmit={handleHomeReservationSubmit} className="space-y-5">
                  {/* Party Size Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                      Party Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1-2', label: '1–2 Cozy' },
                        { id: '3-4', label: '3–4 Group' },
                        { id: '5-8', label: '5–8+ Feast' },
                      ].map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setReservePartySize(size.id)}
                          className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            reservePartySize === size.id
                              ? 'bg-[#18120F] text-white border-[#18120F]'
                              : 'bg-[#FAF7F2] text-[#18120F] border-[#E5E2DD] hover:bg-[#EBE8E3]'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seating Zone Select */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                        Preferred Zone
                      </label>
                      <select
                        value={reserveZone}
                        onChange={(e) => setReserveZone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-semibold text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                      >
                        <option value="Al Fresco Veranda">Al Fresco Veranda (Garden)</option>
                        <option value="Hearth & Banquette Salon">Hearth &amp; Banquette Salon</option>
                        <option value="Backlit Arch Bar">Backlit Arch Bar (Espresso View)</option>
                        <option value="Quiet Creator Corner">Quiet Creator Corner (Wi-Fi &amp; Plugs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-semibold text-[#18120F] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                      />
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                      Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Morning Roast (08:30 AM)',
                        'Midday Drip (12:30 PM)',
                        'Golden Hour (05:00 PM)',
                        'Evening Hearth (08:00 PM)',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setReserveTimeSlot(slot)}
                          className={`min-h-[38px] p-2 rounded-xl text-[11px] font-bold text-center transition-all border ${
                            reserveTimeSlot === slot
                              ? 'bg-[#18120F] text-white border-[#18120F]'
                              : 'bg-[#FAF7F2] text-[#18120F] border-[#E5E2DD] hover:bg-[#EBE8E3]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reserveGuestName}
                        onChange={(e) => setReserveGuestName(e.target.value)}
                        placeholder="e.g. Vikram Sen"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-medium text-[#18120F] placeholder:text-[#857D77] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544E49] mb-2">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={reserveGuestPhone}
                        onChange={(e) => setReserveGuestPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-medium text-[#18120F] placeholder:text-[#857D77] focus:outline-none focus:ring-2 focus:ring-[#C8652D]/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Table Reservation</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reservation Success Modal */}
      {reserveSuccessRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5E2DD] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#CaEcc0] text-[#186a22] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#18120F]">Reservation Received!</h3>
            <p className="text-xs sm:text-sm text-[#544E49] leading-relaxed">
              Thank you, <strong className="text-[#18120F]">{reserveSuccessRecord.name}</strong>! Your table for{' '}
              <strong className="text-[#18120F]">{reserveSuccessRecord.partySize}</strong> in the{' '}
              <strong className="text-[#C8652D]">{reserveSuccessRecord.zone}</strong> on{' '}
              <strong>{reserveSuccessRecord.date}</strong> ({reserveSuccessRecord.timeSlot}) has been logged.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/${site.contact.whatsappRaw}?text=${encodeURIComponent(
                  `Hello Daily Coffee Drip! I just booked a table for ${reserveSuccessRecord.name} (${reserveSuccessRecord.partySize}) on ${reserveSuccessRecord.date} at ${reserveSuccessRecord.timeSlot} in ${reserveSuccessRecord.zone}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1ebd59] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Instantly on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setReserveSuccessRecord(null)}
                className="min-h-[40px] rounded-full bg-[#FAF7F2] text-[#18120F] text-xs font-semibold hover:bg-[#EBE8E3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FILTERABLE PRODUCT SHOWCASE */}
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
              <span>Explore All 142 Offerings on Menu Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROASTING & EXTRACTION HIGHLIGHT */}
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
      {/* 6. SECONDARY TASTING GRID ('Different Flavor Notes You can Choose Anytime') */}
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
      {/* 7. CUSTOMER TESTIMONIALS (HOME PAGE REVIEWS ABOUT US) */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-white border-y border-[#E5E2DD]">
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
              What our neighborhood patrons say about our third-wave brews, sourdough hearth pizzas, and unhurried hospitality.
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
                <span className="text-[11px] text-[#857D77]">Coffee Enthusiast</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[#C8652D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8652D]" />
                  ))}
                  <span className="text-sm text-[#18120F] font-bold ml-1">5.0</span>
                </div>
                <p className="text-sm sm:text-base text-[#18120F] leading-relaxed">
                  &ldquo;The coffee is rich, smooth, and full of flavor. The 100% pure veg sourdough pizza was a wonderful surprise. It&apos;s my favorite spot in Indiranagar.&rdquo;
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
                  &ldquo;From the first sip of the Lotus Biscoff cappuccino to the warm hearth acoustics, this is world-class specialty coffee craft.&rdquo;
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
      {/* 8. ROASTERY IMAGE GALLERY & MOMENT UPLOAD SECTION */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#FAF7F2] pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18120F]/5 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Patron &amp; Roastery Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18120F] tracking-tight mb-2">
                Moments Inside Our Roastery
              </h2>
              <p className="text-sm sm:text-base text-[#544E49]">
                Sunlit courtyards, precision extraction, and community connection in Indiranagar.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setGalleryModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8652D] text-white font-semibold text-xs hover:bg-[#B45309] transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Share Your Roastery Photo</span>
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
              <h3 className="text-xl font-extrabold text-[#18120F]">Share Your Roastery Moment</h3>
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
                  placeholder="e.g. Sunday Morning Pour-Over in the Veranda"
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

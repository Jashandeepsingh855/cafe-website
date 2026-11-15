'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coffee,
  SlidersHorizontal,
  CalendarCheck,
  Settings,
  Search,
  Plus,
  Check,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem, getClientMenuItems, saveClientMenuItems } from '@/data/menu';
import {
  DEFAULT_SITE_CONFIG,
  getClientSiteConfig,
  saveClientSiteConfig,
  getClientReservations,
  saveClientReservations,
  ReservationRecord,
  SiteConfig,
  getWhatsAppBookingConfirmationUrl,
} from '@/config/site';

type AdminTab = 'menu' | 'reservations' | 'store';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  // Menu items state
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Reservations state
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [reservationFilter, setReservationFilter] = useState<'all' | 'Pending' | 'Confirmed' | 'Seated'>('all');

  // Site config state
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [configSaved, setConfigSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize client state
  useEffect(() => {
    const syncAll = () => {
      setItems(getClientMenuItems());
      setReservations(getClientReservations());
      setConfig(getClientSiteConfig());
    };
    syncAll();

    window.addEventListener('storage', syncAll);
    window.addEventListener('dcd_menu_updated', syncAll);
    window.addEventListener('dcd_reservations_updated', syncAll);
    window.addEventListener('dcd_site_updated', syncAll);

    return () => {
      window.removeEventListener('storage', syncAll);
      window.removeEventListener('dcd_menu_updated', syncAll);
      window.removeEventListener('dcd_reservations_updated', syncAll);
      window.removeEventListener('dcd_site_updated', syncAll);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- MENU MANAGEMENT HANDLERS ---
  const toggleStock = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = item.inStock === false ? true : false;
        return { ...item, inStock: nextState };
      }
      return item;
    });
    setItems(updated);
    saveClientMenuItems(updated);
    showToast('Dish stock status updated');
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, price: newPrice };
      }
      return item;
    });
    setItems(updated);
    saveClientMenuItems(updated);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: MenuItem[];
    const exists = items.some((i) => i.id === editingItem.id);
    if (exists) {
      updated = items.map((i) => (i.id === editingItem.id ? editingItem : i));
      showToast(`Updated "${editingItem.name}"`);
    } else {
      updated = [editingItem, ...items];
      showToast(`Added new dish "${editingItem.name}"`);
    }

    setItems(updated);
    saveClientMenuItems(updated);
    setIsDrawerOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      saveClientMenuItems(updated);
      showToast(`Removed "${name}"`);
    }
  };

  const handleResetMenu = () => {
    if (window.confirm('Reset all menu items, custom prices, and stock statuses back to factory defaults?')) {
      localStorage.removeItem('dcd_menu_items');
      setItems(MENU_ITEMS);
      showToast('Menu reset to factory defaults');
    }
  };

  const handleOpenAddDrawer = () => {
    const newItem: MenuItem = {
      id: 'dish-' + Date.now().toString().slice(-6),
      name: '',
      category: 'Hot Coffee',
      categorySlug: 'hot-coffee',
      price: 180,
      description: '',
      story: '',
      prepTime: '5 mins',
      tags: ['vegetarian'],
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      inStock: true,
    };
    setEditingItem(newItem);
    setIsDrawerOpen(true);
  };

  // --- RESERVATION HANDLERS ---
  const handleUpdateReservationStatus = (id: string, status: ReservationRecord['status']) => {
    const updated = reservations.map((res) => {
      if (res.id === id) {
        return { ...res, status };
      }
      return res;
    });
    setReservations(updated);
    saveClientReservations(updated);
    showToast(`Reservation #${id} updated to ${status}`);
  };

  // --- SITE CONFIG HANDLERS ---
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveClientSiteConfig(config);
    setConfigSaved(true);
    showToast('Store settings saved successfully across the site');
    setTimeout(() => setConfigSaved(false), 3000);
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((dish) => {
      if (selectedCategory !== 'all' && dish.categorySlug !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    if (reservationFilter === 'all') return reservations;
    return reservations.filter((r) => r.status === reservationFilter);
  }, [reservations, reservationFilter]);

  // Summary counts
  const totalDishes = items.length;
  const inStockDishes = items.filter((i) => i.inStock !== false).length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 md:pb-16 flex flex-col">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#18120F] text-[#FAF7F2] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#C8652D]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Bar */}
      <section className="w-full bg-[#18120F] text-[#FAF7F2] py-8 sm:py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C8652D] flex items-center justify-center text-white shadow-md">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
                    Café Operations Management
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#CaEcc0]">
                    Local Mode • No DB Needed
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                  {config.name} Owner Portal
                </h1>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-[#D4CECA] block">Active Menu</span>
                <span className="text-lg font-extrabold text-[#FAF7F2]">
                  {inStockDishes} <span className="text-xs font-normal text-[#857D77]">/ {totalDishes}</span>
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-[#D4CECA] block">Pending Tables</span>
                <span className="text-lg font-extrabold text-[#C8652D]">{pendingReservationsCount}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-[#D4CECA] block">Store Live</span>
                <span className={`text-xs font-bold block mt-1 ${config.hours.isOpenNow ? 'text-[#CaEcc0]' : 'text-red-400'}`}>
                  {config.hours.isOpenNow ? '● OPEN' : '○ CLOSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/10 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`min-h-[44px] px-5 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === 'menu'
                  ? 'border-[#C8652D] text-white bg-white/10'
                  : 'border-transparent text-[#D4CECA] hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C8652D]" />
              <span>Menu &amp; Price Manager</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold">
                {items.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reservations')}
              className={`min-h-[44px] px-5 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === 'reservations'
                  ? 'border-[#C8652D] text-white bg-white/10'
                  : 'border-transparent text-[#D4CECA] hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-[#C8652D]" />
              <span>Table Reservations</span>
              {pendingReservationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#C8652D] text-white text-xs font-bold">
                  {pendingReservationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`min-h-[44px] px-5 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === 'store'
                  ? 'border-[#C8652D] text-white bg-white/10'
                  : 'border-transparent text-[#D4CECA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 text-[#C8652D]" />
              <span>Store &amp; Links Control</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ========================================================= */}
        {/* TAB 1: MENU & PRICE MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Top Toolbar: Search, Add Dish, Reset */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E5E2DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857D77]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 140+ dishes, beverages, ingredients..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] placeholder:text-[#857D77] focus:outline-none focus:border-[#C8652D]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857D77] hover:text-[#18120F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleResetMenu}
                  title="Reset to factory menu defaults"
                  className="min-h-[44px] px-4 py-2 rounded-full border border-[#E5E2DD] text-xs font-bold text-[#544E49] hover:bg-[#F6F3EE] hover:text-[#18120F] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddDrawer}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Category Filter Horizontal Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#18120F] text-white'
                    : 'bg-white text-[#544E49] border border-[#E5E2DD] hover:bg-[#F6F3EE]'
                }`}
              >
                All Categories ({items.length})
              </button>
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#18120F] text-white'
                      : 'bg-white text-[#544E49] border border-[#E5E2DD] hover:bg-[#F6F3EE]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items Table / Cards Grid */}
            <div className="bg-white rounded-3xl border border-[#E5E2DD] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E2DD] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#544E49]">
                  Showing {filteredItems.length} Offerings
                </span>
                <span className="text-xs text-[#857D77]">
                  Prices and stock changes save immediately to your browser.
                </span>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-12 text-center text-[#544E49]">
                  <p className="font-bold text-base">No items match your search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-3 text-xs font-bold text-[#C8652D] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E2DD]">
                  {filteredItems.map((dish) => {
                    const isSoldOut = dish.inStock === false;
                    return (
                      <div
                        key={dish.id}
                        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                          isSoldOut ? 'bg-stone-50/70' : 'hover:bg-[#FAF7F2]/60'
                        }`}
                      >
                        {/* Dish Details */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#EBE8E3] shrink-0 border border-[#E5E2DD]">
                            <Image
                              src={dish.image}
                              alt={dish.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider text-center p-1 leading-tight">
                                Sold Out
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#186a22] shrink-0" />
                              <h3 className="font-bold text-base text-[#18120F] truncate">
                                {dish.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-[#F0EDE9] text-[#544E49] text-[10px] font-bold">
                                {dish.category}
                              </span>
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
                            <p className="text-xs text-[#544E49] mt-1 line-clamp-1">
                              {dish.description}
                            </p>
                            {dish.story && (
                              <p className="text-[11px] text-[#857D77] italic mt-0.5 line-clamp-1">
                                &ldquo;{dish.story}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controls: Stock Toggle, Price Editor, Edit & Delete */}
                        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E2DD]">
                          {/* Stock Toggle Switch */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#544E49] hidden sm:inline">
                              {isSoldOut ? 'Sold Out' : 'In Stock'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleStock(dish.id)}
                              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                                isSoldOut ? 'bg-red-200' : 'bg-[#25D366]'
                              }`}
                              title={isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                                  isSoldOut ? 'translate-x-0' : 'translate-x-6'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Inline Rupee Price Editor */}
                          <div className="flex items-center gap-1.5 bg-[#F6F3EE] px-3 py-1.5 rounded-xl border border-[#E5E2DD]">
                            <span className="font-extrabold text-xs text-[#C8652D]">₹</span>
                            <input
                              type="number"
                              value={dish.price}
                              onChange={(e) => handlePriceChange(dish.id, parseInt(e.target.value) || 0)}
                              className="w-16 bg-transparent font-bold text-sm text-[#18120F] focus:outline-none"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(dish);
                                setIsDrawerOpen(true);
                              }}
                              className="w-9 h-9 rounded-full bg-[#F0EDE9] hover:bg-[#EBE8E3] text-[#18120F] flex items-center justify-center transition-colors"
                              title="Edit dish details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(dish.id, dish.name)}
                              className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                              title="Delete dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TABLE RESERVATIONS */}
        {/* ========================================================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-3xl border border-[#E5E2DD] shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['all', 'Pending', 'Confirmed', 'Seated'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setReservationFilter(filter)}
                    className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      reservationFilter === filter
                        ? 'bg-[#18120F] text-white shadow-sm'
                        : 'bg-[#F0EDE9] text-[#544E49] hover:bg-[#EBE8E3]'
                    }`}
                  >
                    {filter === 'all' ? 'All Bookings' : filter} (
                    {filter === 'all'
                      ? reservations.length
                      : reservations.filter((r) => r.status === filter).length}
                    )
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#544E49] font-medium">
                Tip: Click <span className="font-bold text-[#25D366]">Confirm on WhatsApp</span> to send instant booking confirmations directly to guests.
              </div>
            </div>

            {/* Reservations List */}
            {filteredReservations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5E2DD] p-12 text-center text-[#544E49]">
                <CalendarCheck className="w-12 h-12 text-[#C8652D] mx-auto mb-3 opacity-60" />
                <p className="font-bold text-lg text-[#18120F]">No reservations found under this filter.</p>
                <p className="text-sm mt-1">Bookings submitted from the /reservation page appear here in real time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredReservations.map((res) => {
                  const whatsappConfirmUrl = getWhatsAppBookingConfirmationUrl(
                    res.whatsapp,
                    res.name,
                    res.partySize,
                    res.date,
                    res.timeSlot,
                    res.zone
                  );

                  return (
                    <div
                      key={res.id}
                      className="bg-white rounded-3xl border border-[#E5E2DD] p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#C8652D]/50 transition-colors"
                    >
                      {/* Left: Guest & Seating Info */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0EDE9] flex items-center justify-center text-[#C8652D] shrink-0 font-extrabold text-sm border border-[#E5E2DD]">
                          {res.id.slice(-4)}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-lg text-[#18120F]">{res.name}</h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                res.status === 'Confirmed'
                                  ? 'bg-[#CaEcc0] text-[#186a22]'
                                  : res.status === 'Pending'
                                  ? 'bg-[#FFDBCB] text-[#944516]'
                                  : res.status === 'Seated'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              ● {res.status}
                            </span>
                            <span className="text-xs text-[#857D77]">• Booking #{res.id}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#544E49]">
                            <span className="flex items-center gap-1 font-semibold text-[#18120F]">
                              <Clock className="w-3.5 h-3.5 text-[#C8652D]" />
                              {res.date} • {res.timeSlot}
                            </span>
                            <span>👥 {res.partySize}</span>
                            <span>🌿 {res.zone}</span>
                          </div>

                          {/* Contact Details */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            <a
                              href={`tel:${res.whatsapp.replace(/[^0-9]/g, '')}`}
                              className="text-[#18120F] font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-[#C8652D]" />
                              {res.whatsapp}
                            </a>
                            {res.email && <span className="text-[#857D77]">✉ {res.email}</span>}
                          </div>

                          {/* Dietary & Requests */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {res.dietaryOptions?.strictJain && (
                              <span className="px-2 py-0.5 rounded-full bg-[#CaEcc0] text-[#186a22] text-[10px] font-bold">
                                Strict Jain
                              </span>
                            )}
                            {res.dietaryOptions?.nutFree && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Nut-Free
                              </span>
                            )}
                            {res.dietaryOptions?.celebration && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                                🎉 Celebration
                              </span>
                            )}
                            {res.specialRequests && (
                              <span className="text-xs italic text-[#857D77]">
                                Note: &ldquo;{res.specialRequests}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Actions & 1-Tap WhatsApp Confirm */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E5E2DD]">
                        {/* Status Select Buttons */}
                        <div className="flex items-center gap-1 bg-[#F6F3EE] p-1 rounded-2xl border border-[#E5E2DD]">
                          {(['Pending', 'Confirmed', 'Seated'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleUpdateReservationStatus(res.id, st)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                res.status === st
                                  ? 'bg-[#18120F] text-white shadow-sm'
                                  : 'text-[#544E49] hover:text-[#18120F]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* WhatsApp Confirm Action Button */}
                        <a
                          href={whatsappConfirmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Confirm on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: STORE & LINKS CONTROL */}
        {/* ========================================================= */}
        {activeTab === 'store' && (
          <form onSubmit={handleSaveConfig} className="space-y-8 max-w-4xl">
            {/* Live Status & Ticker */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E2DD] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E2DD] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#18120F]">Live Operations &amp; Announcement</h2>
                  <p className="text-xs text-[#544E49] mt-0.5">Control live badge status and top site ticker.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F0EDE9] text-[#18120F] text-xs font-bold">
                  Instant Site-Wide Update
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Open Now Toggle */}
                <div className="p-4 rounded-2xl bg-[#F6F3EE] border border-[#E5E2DD] flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-[#18120F] block">Store Operational Status</label>
                    <span className="text-xs text-[#544E49]">
                      {config.hours.isOpenNow ? 'Currently accepting guests & orders' : 'Marked closed for the day'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        hours: { ...config.hours, isOpenNow: !config.hours.isOpenNow },
                      })
                    }
                    className={`w-14 h-7 rounded-full transition-colors relative focus:outline-none ${
                      config.hours.isOpenNow ? 'bg-[#25D366]' : 'bg-red-400'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                        config.hours.isOpenNow ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Closing Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Daily Closing Time</label>
                  <input
                    type="text"
                    value={config.hours.closingTime}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hours: { ...config.hours, closingTime: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>
              </div>

              {/* Ticker Text */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Top Announcement Ticker</label>
                <input
                  type="text"
                  value={config.tickerText}
                  onChange={(e) => setConfig({ ...config, tickerText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>
            </div>

            {/* Direct Contact Numbers */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E2DD] shadow-sm space-y-6">
              <div className="border-b border-[#E5E2DD] pb-4">
                <h2 className="text-xl font-extrabold text-[#18120F]">Direct Contact &amp; Concierge</h2>
                <p className="text-xs text-[#544E49] mt-0.5">Used for 1-tap WhatsApp ordering, calls, and concierge chat.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">WhatsApp Raw Number (No +)</label>
                  <input
                    type="text"
                    value={config.contact.whatsappRaw}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: { ...config.contact, whatsappRaw: e.target.value },
                      })
                    }
                    placeholder="914085550120"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Direct Calling Phone Number</label>
                  <input
                    type="text"
                    value={config.contact.phone}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: { ...config.contact, phone: e.target.value },
                      })
                    }
                    placeholder="(408) 555-0120"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>
              </div>
            </div>

            {/* External Links & Delivery */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E2DD] shadow-sm space-y-6">
              <div className="border-b border-[#E5E2DD] pb-4">
                <h2 className="text-xl font-extrabold text-[#18120F]">Delivery &amp; Review URLs</h2>
                <p className="text-xs text-[#544E49] mt-0.5">Connected across the dish details modal, footer, and quick links.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Zomato Store URL</label>
                  <input
                    type="text"
                    value={config.links.zomato}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        links: { ...config.links, zomato: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Swiggy Store URL</label>
                  <input
                    type="text"
                    value={config.links.swiggy}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        links: { ...config.links, swiggy: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Direct Google Review URL</label>
                  <input
                    type="text"
                    value={config.links.googleReview}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        links: { ...config.links, googleReview: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3EE] border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="min-h-[48px] px-8 py-3 rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Store Settings</span>
              </button>

              {configSaved && (
                <span className="text-xs font-bold text-[#186a22] flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved to browser localStorage
                </span>
              )}
            </div>
          </form>
        )}
      </main>

      {/* ========================================================= */}
      {/* SLIDE-OVER DRAWER: ADD / EDIT DISH */}
      {/* ========================================================= */}
      {isDrawerOpen && editingItem && (
        <div
          className="fixed inset-0 z-[150] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
          style={{ zIndex: 150 }}
          onClick={() => {
            setIsDrawerOpen(false);
            setEditingItem(null);
          }}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl border-l border-[#E5E2DD] flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DD]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8652D]">
                  Menu Catalog Editor
                </span>
                <h2 className="text-xl font-extrabold text-[#18120F]">
                  {items.some((i) => i.id === editingItem.id) ? 'Edit Offering' : 'Add New Offering'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setEditingItem(null);
                }}
                className="w-10 h-10 rounded-full bg-[#F0EDE9] hover:bg-[#EBE8E3] flex items-center justify-center text-[#18120F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-5 pt-6 flex-1">
              {/* Dish Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Dish / Drink Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Vanilla Bean Cloud Cold Brew"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Category</label>
                  <select
                    value={editingItem.categorySlug}
                    onChange={(e) => {
                      const found = MENU_CATEGORIES.find((c) => c.id === e.target.value);
                      setEditingItem({
                        ...editingItem,
                        categorySlug: e.target.value,
                        category: found?.name || editingItem.category,
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  >
                    {MENU_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                  />
                </div>
              </div>

              {/* Prep Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Preparation Time</label>
                <input
                  type="text"
                  value={editingItem.prepTime}
                  onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                  placeholder="e.g. 5 mins"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Menu Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Ingredients, extraction method, sensory flavor notes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>

              {/* Kitchen & Brew Craft Story */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">The Craft Story</label>
                <textarea
                  rows={2}
                  value={editingItem.story}
                  onChange={(e) => setEditingItem({ ...editingItem, story: e.target.value })}
                  placeholder="e.g. Steeped for 18 hours in cold Chikmagalur spring water..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49]">Photo URL</label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E2DD] text-sm text-[#18120F] focus:outline-none focus:border-[#C8652D]"
                />
              </div>

              {/* Badges / Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#544E49] block">Badges &amp; Tags</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2.5 text-xs text-[#18120F] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.tags.includes('pure-jain')}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...editingItem.tags, 'pure-jain']
                          : editingItem.tags.filter((t) => t !== 'pure-jain');
                        setEditingItem({ ...editingItem, tags: newTags as any });
                      }}
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span>Pure Jain Adaptable (No root veggies / onion / garlic)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-[#18120F] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.tags.includes('chef-special')}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...editingItem.tags, 'chef-special']
                          : editingItem.tags.filter((t) => t !== 'chef-special');
                        setEditingItem({ ...editingItem, tags: newTags as any });
                      }}
                      className="accent-[#C8652D] w-4 h-4 rounded"
                    />
                    <span>Chef&apos;s Special Signature Badge</span>
                  </label>
                </div>
              </div>

              {/* Submit Drawer */}
              <div className="pt-6 border-t border-[#E5E2DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setEditingItem(null);
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#E5E2DD] text-xs font-bold text-[#544E49] hover:bg-[#F0EDE9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#C8652D] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Dish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
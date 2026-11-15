'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  avatar?: string;
  rating?: number;
  role?: string;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  theme?: 'dark' | 'light' | 'cafe';
}

const VISIBLE_COUNT = 5;

function getItemPosition(
  index: number,
  activeIndex: number,
  total: number,
  radiusX: number,
  radiusY: number
) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  if (Math.abs(adjustedOffset) > half * 2) return null;

  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const x = Math.sin(angle) * radiusX;
  const y = -Math.cos(angle) * radiusY;

  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 1;
  const scale = Math.max(0, 1 - (distance / maxDistance) * 0.28);
  const opacity = Math.max(0.35, 1 - (distance / maxDistance) * 0.65);
  const zIndex = VISIBLE_COUNT - distance;

  return { x, y, scale, opacity, zIndex, adjustedOffset };
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
  theme = 'cafe',
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  // Responsive radius calculation for 375px mobile vs 1440px desktop
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = containerWidth < 500;
  const radiusX = isMobile ? Math.min(145, Math.max(115, containerWidth * 0.35)) : 220;
  const radiusY = isMobile ? 70 : 100;

  const goTo = useCallback(
    (index: number) => {
      const newIndex = ((index % total) + total) % total;
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex);
      }
      onActiveChange?.(newIndex);
    },
    [total, controlledIndex, onActiveChange]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const el = containerRef.current;
    el?.addEventListener('keydown', handler);
    return () => el?.removeEventListener('keydown', handler);
  }, [next, prev]);

  const activeItem = items[activeIndex];

  const isCafeTheme = theme === 'cafe';
  const isDarkTheme = theme === 'dark';

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Reviews Circular Carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-8 outline-none select-none w-full max-w-4xl mx-auto overflow-hidden py-4',
        className
      )}
    >
      {/* Circular Orbit Track */}
      <div className="relative h-[290px] sm:h-[320px] w-full max-w-2xl flex items-center justify-center">
        {/* Subtle Ambient Orbit Ring */}
        <div
          className={cn(
            'absolute inset-0 m-auto rounded-[50%] pointer-events-none border border-dashed transition-opacity duration-300',
            isCafeTheme
              ? 'border-[#C8652D]/20 opacity-60'
              : 'border-white/10 opacity-40'
          )}
          style={{
            width: radiusX * 2 + 10,
            height: radiusY * 2 + 20,
          }}
        />

        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const pos = getItemPosition(i, activeIndex, total, radiusX, radiusY);
            if (!pos) return null;

            const isActive = i === activeIndex;

            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => goTo(i)}
                aria-label={item.title}
                aria-selected={isActive}
                role="option"
                className={cn(
                  'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-between rounded-2xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-300 text-left',
                  isMobile ? 'h-36 w-44' : 'h-36 w-52 sm:w-56',
                  isCafeTheme
                    ? isActive
                      ? 'bg-white border-2 border-[#C8652D] shadow-[0_16px_36px_rgba(200,101,45,0.18)]'
                      : 'bg-[#FAF7F2]/90 border border-[#E5E2DD] shadow-sm hover:border-[#C8652D]/40 hover:shadow-md'
                    : isDarkTheme
                    ? isActive
                      ? 'border border-white/20 bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)]'
                      : 'border border-white/10 bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.4)]'
                    : isActive
                    ? 'bg-white border-2 border-[#C8652D] shadow-lg'
                    : 'bg-white/80 border border-neutral-200'
                )}
                style={{ transformOrigin: 'center center' }}
              >
                {/* Header: Tag + Rating */}
                <div className="w-full flex items-center justify-between gap-1">
                  {item.tag && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider',
                        isCafeTheme
                          ? isActive
                            ? 'bg-[#C8652D] text-white shadow-xs'
                            : 'bg-[#18120F]/5 text-[#C8652D] border border-[#E5E2DD]'
                          : 'bg-white/10 text-white/70'
                      )}
                    >
                      {item.tag}
                    </span>
                  )}

                  {item.rating && (
                    <div className="flex items-center gap-0.5 text-[#C8652D]">
                      <Star className="w-3 h-3 fill-[#C8652D]" />
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          isCafeTheme ? 'text-[#18120F]' : 'text-white'
                        )}
                      >
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Author Info + Avatar (if present) */}
                <div className="w-full flex items-center gap-2.5 my-1">
                  {item.avatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5E2DD] bg-[#E5E2DD]">
                      <Image
                        src={item.avatar}
                        alt={item.title}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        'font-bold leading-tight truncate transition-colors duration-300 text-xs sm:text-sm',
                        isCafeTheme
                          ? isActive
                            ? 'text-[#18120F]'
                            : 'text-[#18120F]/80'
                          : isActive
                          ? 'text-white'
                          : 'text-white/80'
                      )}
                    >
                      {item.title}
                    </h3>
                    {item.role && (
                      <p
                        className={cn(
                          'text-[10px] truncate',
                          isCafeTheme ? 'text-[#857D77]' : 'text-white/40'
                        )}
                      >
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Snippet Description */}
                <div className="w-full">
                  <p
                    className={cn(
                      'line-clamp-2 text-[11px] leading-relaxed transition-colors duration-300',
                      isCafeTheme
                        ? isActive
                          ? 'text-[#544E49]'
                          : 'text-[#857D77]'
                        : isActive
                        ? 'text-white/70'
                        : 'text-white/40'
                    )}
                  >
                    &ldquo;{item.description}&rdquo;
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Center Spotlight Counter / Badge */}
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <div
              className={cn(
                'w-16 h-16 rounded-full flex flex-col items-center justify-center border shadow-xs backdrop-blur-xs',
                isCafeTheme
                  ? 'bg-white/80 border-[#E5E2DD] text-[#18120F]'
                  : 'bg-zinc-900/60 border-white/10 text-white'
              )}
            >
              <span
                className={cn(
                  'text-lg font-black tracking-tight leading-none',
                  isCafeTheme ? 'text-[#C8652D]' : 'text-white'
                )}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'text-[9px] uppercase font-bold tracking-wider mt-0.5',
                  isCafeTheme ? 'text-[#857D77]' : 'text-white/40'
                )}
              >
                / {String(total).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls: Prev, Dots, Next */}
      <div className="flex items-center gap-4 z-10">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label="Previous review"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border transition-all cursor-pointer',
            isCafeTheme
              ? 'border-[#E5E2DD] bg-white text-[#18120F] shadow-sm hover:border-[#C8652D] hover:bg-[#FAF7F2]'
              : 'border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                i === activeIndex
                  ? isCafeTheme
                    ? 'w-7 bg-[#C8652D]'
                    : 'w-6 bg-white/80'
                  : isCafeTheme
                  ? 'w-2 bg-[#E5E2DD] hover:bg-[#C8652D]/50'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              )}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          aria-label="Next review"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border transition-all cursor-pointer',
            isCafeTheme
              ? 'border-[#E5E2DD] bg-white text-[#18120F] shadow-sm hover:border-[#C8652D] hover:bg-[#FAF7F2]'
              : 'border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;

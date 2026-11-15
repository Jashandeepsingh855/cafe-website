'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

function getItemPosition(
  index: number,
  activeIndex: number,
  total: number,
  containerWidth: number
) {
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth < 1024;

  const rawOffset = index - activeIndex;
  let offset = rawOffset;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;

  const absOffset = Math.abs(offset);

  // Responsive step values for horizontal spacing
  const stepX = isMobile
    ? Math.min(160, Math.max(130, containerWidth * 0.42))
    : isTablet
    ? 270
    : 340;

  // Gentle subtle vertical arc for 3D depth
  const stepY = isMobile ? 8 : 14;

  const x = offset * stepX;
  const y = absOffset * stepY;

  let scale = 1;
  let opacity = 1;
  let zIndex = 30 - absOffset * 10;
  let isVisible = true;

  if (absOffset === 0) {
    scale = 1;
    opacity = 1;
    zIndex = 40;
  } else if (absOffset === 1) {
    scale = isMobile ? 0.8 : 0.86;
    opacity = isMobile ? 0.4 : 0.6;
    zIndex = 30;
  } else if (absOffset === 2) {
    if (isMobile) {
      isVisible = false;
      opacity = 0;
      scale = 0.6;
      zIndex = 10;
    } else {
      scale = 0.72;
      opacity = 0.25;
      zIndex = 20;
    }
  } else {
    isVisible = false;
    opacity = 0;
    scale = 0.55;
    zIndex = 10;
  }

  return { x, y, scale, opacity, zIndex, isVisible, offset };
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4500,
  className,
  theme = 'cafe',
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

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

  const isMobile = containerWidth < 640;
  const isCafeTheme = theme === 'cafe';

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Customer Reviews Carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-6 outline-none select-none w-full max-w-6xl mx-auto overflow-hidden py-2',
        className
      )}
    >
      {/* 3D Orbit Stage */}
      <div className="relative h-[260px] sm:h-[280px] w-full flex items-center justify-center">
        {/* Subtle Ambient Curved Guide Ring */}
        <div
          className={cn(
            'absolute inset-0 m-auto rounded-[50%] pointer-events-none border border-dashed transition-opacity duration-300',
            isCafeTheme ? 'border-[#C8652D]/20 opacity-50' : 'border-white/10 opacity-30'
          )}
          style={{
            width: isMobile ? '92%' : '80%',
            height: isMobile ? 80 : 120,
          }}
        />

        {/* All cards permanently mounted to eliminate image flicker and decode lag */}
        {items.map((item, i) => {
          const pos = getItemPosition(i, activeIndex, total, containerWidth);
          const isActive = i === activeIndex;

          return (
            <motion.div
              key={item.id}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                pointerEvents: pos.isVisible ? 'auto' : 'none',
                transformOrigin: 'center center',
              }}
              onClick={() => goTo(i)}
              aria-label={item.title}
              aria-selected={isActive}
              role="option"
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col justify-between rounded-3xl p-5 sm:p-6 text-left transition-shadow duration-300',
                isMobile ? 'w-[290px] h-[215px]' : 'w-[360px] sm:w-[400px] h-[225px] sm:h-[235px]',
                isCafeTheme
                  ? isActive
                    ? 'bg-white border-2 border-[#C8652D] shadow-[0_20px_50px_rgba(200,101,45,0.18)]'
                    : 'bg-[#FAF7F2] border border-[#E5E2DD] shadow-md hover:border-[#C8652D]/50 hover:shadow-lg'
                  : isActive
                  ? 'border border-white/20 bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 shadow-2xl'
                  : 'border border-white/10 bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 shadow-md'
              )}
            >
              {/* Top Row: Verified Badge & Stars */}
              <div className="w-full flex items-center justify-between gap-2 border-b border-[#E5E2DD]/70 pb-2.5">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider',
                    isCafeTheme
                      ? isActive
                        ? 'bg-[#C8652D] text-white shadow-xs'
                        : 'bg-[#18120F]/5 text-[#C8652D] border border-[#E5E2DD]'
                      : 'bg-white/10 text-white/70'
                  )}
                >
                  {item.tag || 'Verified Patron'}
                </span>

                {item.rating && (
                  <div className="flex items-center gap-1 text-[#C8652D]">
                    {[...Array(5)].map((_, sI) => (
                      <Star key={sI} className="w-3.5 h-3.5 fill-[#C8652D]" />
                    ))}
                    <span className="text-xs font-extrabold text-[#18120F] ml-1">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Middle Row: Full Testimonial Quote */}
              <div className="w-full my-2 flex-1 flex items-center">
                <p
                  className={cn(
                    'text-xs sm:text-sm leading-relaxed italic transition-colors line-clamp-3 sm:line-clamp-4',
                    isCafeTheme
                      ? isActive
                        ? 'text-[#18120F] font-medium'
                        : 'text-[#544E49]'
                      : isActive
                      ? 'text-white'
                      : 'text-white/60'
                  )}
                >
                  &ldquo;{item.description}&rdquo;
                </p>
              </div>

              {/* Bottom Row: Avatar, Name & Role */}
              <div className="w-full flex items-center gap-3 pt-2.5 border-t border-[#E5E2DD]/70">
                {item.avatar && (
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#FAF7F2] shadow-xs bg-[#E5E2DD]">
                    <img
                      src={item.avatar}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      'font-bold text-sm sm:text-base leading-tight truncate',
                      isCafeTheme
                        ? 'text-[#18120F]'
                        : 'text-white'
                    )}
                  >
                    {item.title}
                  </h3>
                  {item.role && (
                    <p
                      className={cn(
                        'text-xs truncate mt-0.5',
                        isCafeTheme ? 'text-[#857D77]' : 'text-white/50'
                      )}
                    >
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls Bar: Prev, Counter, Dots, Next */}
      <div className="flex items-center gap-4 sm:gap-5 z-20 mt-1">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label="Previous review"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E5E2DD] bg-white text-[#18120F] shadow-sm hover:border-[#C8652D] hover:bg-[#FAF7F2] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#18120F]" />
        </motion.button>

        {/* Counter Badge */}
        <div className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5E2DD] text-xs font-bold text-[#18120F] font-mono tracking-wider">
          <span className="text-[#C8652D]">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="text-[#857D77] mx-1">/</span>
          <span className="text-[#857D77]">{String(total).padStart(2, '0')}</span>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer',
                i === activeIndex
                  ? 'w-6 sm:w-8 bg-[#C8652D]'
                  : 'w-2 sm:w-2.5 bg-[#E5E2DD] hover:bg-[#C8652D]/50'
              )}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          aria-label="Next review"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E5E2DD] bg-white text-[#18120F] shadow-sm hover:border-[#C8652D] hover:bg-[#FAF7F2] transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-[#18120F]" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;

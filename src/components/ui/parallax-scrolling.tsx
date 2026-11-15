'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { getLenis } from '@/lib/lenis-gsap';

export type ParallaxLayerItem = {
  layer: string;
  yPercent: number;
  src?: string;
  alt?: string;
  content?: React.ReactNode;
  className?: string;
};

export type ParallaxComponentProps = {
  title?: string;
  subtitle?: string;
  tag?: string;
  layers?: ParallaxLayerItem[];
  children?: React.ReactNode;
  theme?: 'dark' | 'light';
  height?: string;
  className?: string;
};

const DEFAULT_CAFE_LAYERS: ParallaxLayerItem[] = [
  {
    layer: '1',
    yPercent: 70,
    src: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=80',
    alt: 'Chikmagalur shade-grown coffee canopy background',
    className: 'opacity-40 mix-blend-luminosity scale-110 object-cover',
  },
  {
    layer: '2',
    yPercent: 55,
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=80',
    alt: 'Golden roast atmospheric warmth & light rays',
    className: 'opacity-30 mix-blend-screen scale-105 object-cover',
  },
  {
    layer: '3',
    yPercent: 40,
  },
  {
    layer: '4',
    yPercent: 10,
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=80',
    alt: 'Foreground botanical branch & coffee steam',
    className: 'opacity-25 mix-blend-overlay scale-100 object-cover',
  },
];

export function ParallaxComponent({
  title = 'Artisanal Roastery & Craft Kitchen',
  subtitle = 'Western Ghats Single-Origin Micro-Lots • 100% Pure Vegetarian Stone-Hearth Craft',
  tag = 'Mindful Botanical Sanctuary',
  layers = DEFAULT_CAFE_LAYERS,
  children,
  theme = 'dark',
  height = '80vh',
  className = '',
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');
    let timeline: gsap.core.Timeline | null = null;

    if (triggerElement) {
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`
        );
        if (targets.length > 0) {
          timeline?.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: 'none',
              force3D: true,
            },
            idx === 0 ? undefined : '<'
          );
        }
      });
    }

    // Reuse existing global Lenis instance or initialize if standalone
    let localLenis: Lenis | null = getLenis();
    let tickerCb: ((time: number) => void) | null = null;

    if (!localLenis && typeof window !== 'undefined') {
      localLenis = new Lenis({
        duration: 0.7,
        smoothWheel: true,
      });
      localLenis.on('scroll', ScrollTrigger.update);
      tickerCb = (time: number) => {
        localLenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      timeline?.kill();
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      if (tickerCb) {
        gsap.ticker.remove(tickerCb);
      }
    };
  }, [layers]);

  return (
    <div
      className={`parallax ${theme === 'dark' ? 'parallax--dark' : ''} ${className}`}
      ref={parallaxRef}
    >
      <section className="parallax__header" style={{ minHeight: height }}>
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            {layers.map((l) => {
              // Title / text layer (Layer 3 or custom content)
              if (l.layer === '3' || l.content) {
                return (
                  <div
                    key={l.layer}
                    data-parallax-layer={l.layer}
                    className="parallax__layer-title"
                  >
                    {l.content || (
                      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
                        {tag && (
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C8652D] text-xs font-bold uppercase tracking-widest border border-white/15 mb-4 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-[#C8652D] animate-pulse" />
                            <span>{tag}</span>
                          </div>
                        )}
                        <h2 className="parallax__title text-center text-white drop-shadow-md">
                          {title}
                        </h2>
                        {subtitle && (
                          <p className="text-sm sm:text-base text-[#D4CECA] max-w-2xl text-center mt-3 font-medium leading-relaxed drop-shadow-sm">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Visual Image Layer
              if (l.src) {
                return (
                  <img
                    key={l.layer}
                    src={l.src}
                    alt={l.alt || ''}
                    loading="eager"
                    data-parallax-layer={l.layer}
                    className={`parallax__layer-img ${l.className || ''}`}
                  />
                );
              }

              return null;
            })}
          </div>
          <div className="parallax__fade" />
        </div>
      </section>

      {children && (
        <section className="parallax__content">
          {children}
        </section>
      )}
    </div>
  );
}

export default ParallaxComponent;

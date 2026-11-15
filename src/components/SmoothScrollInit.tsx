'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initSmoothScroll, destroySmoothScroll, gsap, ScrollTrigger } from '@/lib/lenis-gsap';

export default function SmoothScrollInit() {
  const pathname = usePathname();
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis with snappy, responsive scroll settings
    const lenis = initSmoothScroll();

    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return () => {
        destroySmoothScroll();
      };
    }

    // Small delay to ensure Next.js route DOM is settled
    const timer = setTimeout(() => {
      // Revert previous GSAP context to prevent duplicate or orphaned ScrollTriggers
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // Wrap all route animations in gsap.context for bulletproof lifecycle cleanup
      ctxRef.current = gsap.context(() => {
        // -------------------------------------------------------------
        // 1. Global Page Reading / Scroll Progress Bar (Top 3px line)
        // -------------------------------------------------------------
        const progressBar = document.getElementById('global-scroll-progress');
        if (progressBar) {
          gsap.fromTo(
            progressBar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.1,
              },
            }
          );
        }

        // -------------------------------------------------------------
        // 2. Ambient Background Parallax Only (.parallax-bg)
        // Subtle, non-distorting vertical drift for background ribbons/textures only
        // -------------------------------------------------------------
        const bgElements = document.querySelectorAll<HTMLElement>('.parallax-bg');
        bgElements.forEach((bg) => {
          const parent = bg.parentElement || bg;
          gsap.fromTo(
            bg,
            {
              yPercent: -6,
              force3D: true,
            },
            {
              yPercent: 6,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: parent,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3,
              },
            }
          );
        });

        // -------------------------------------------------------------
        // 3. Subtle Editorial Section Reveal Fade (.reveal-fade)
        // Clean opacity transition without pushing elements out of their grid/layout
        // -------------------------------------------------------------
        const revealElements = document.querySelectorAll<HTMLElement>('.reveal-fade');
        revealElements.forEach((el) => {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 16,
              force3D: true,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // -------------------------------------------------------------
        // 4. Osmo Multi-Layer Parallax Engine ([data-parallax-layers])
        // Enables smooth multi-depth scroll parallax across all pages
        // -------------------------------------------------------------
        const triggerElements = document.querySelectorAll<HTMLElement>('[data-parallax-layers]');
        triggerElements.forEach((triggerElement) => {
          const isNearTop = triggerElement.getBoundingClientRect().top < 250;
          const startVal = triggerElement.getAttribute('data-parallax-start') || (isNearTop ? '0% 0%' : 'top bottom');
          const endVal = triggerElement.getAttribute('data-parallax-end') || (isNearTop ? '100% 0%' : 'bottom top');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerElement,
              start: startVal,
              end: endVal,
              scrub: 0,
            },
          });

          const layers = [
            { layer: '1', yPercent: 70 },
            { layer: '2', yPercent: 55 },
            { layer: '3', yPercent: 40 },
            { layer: '4', yPercent: 10 },
            { layer: 'float', yPercent: -35 },
            { layer: 'bg', yPercent: 45 },
          ];

          layers.forEach((layerObj, idx) => {
            const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
            if (targets.length > 0) {
              tl.to(
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
        });

        // -------------------------------------------------------------
        // 5. Scroll-Driven Card Grid Stagger Entrance (.dish-card-reveal)
        // -------------------------------------------------------------
        const revealGrids = document.querySelectorAll<HTMLElement>('[data-reveal-grid]');
        revealGrids.forEach((grid) => {
          const cards = grid.querySelectorAll<HTMLElement>('.dish-card-reveal');
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              {
                opacity: 0,
                y: 35,
                scale: 0.96,
                force3D: true,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                stagger: {
                  each: 0.08,
                  from: 'start',
                },
                ease: 'power2.out',
                force3D: true,
                scrollTrigger: {
                  trigger: grid,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
        });

        const standaloneCards = document.querySelectorAll<HTMLElement>(
          '.dish-card-reveal:not([data-reveal-grid] *)'
        );
        standaloneCards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 28,
              scale: 0.97,
              force3D: true,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // -------------------------------------------------------------
        // 6. Smooth Scroll-Driven Image Parallax (.scroll-parallax-img)
        // Subtle, physical vertical drift inside overflow-hidden frames
        // -------------------------------------------------------------
        const parallaxImages = document.querySelectorAll<HTMLElement>('.scroll-parallax-img');
        parallaxImages.forEach((img) => {
          const container = img.closest('.overflow-hidden') || img.parentElement || img;
          gsap.fromTo(
            img,
            {
              yPercent: -6,
              force3D: true,
            },
            {
              yPercent: 6,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.4,
              },
            }
          );
        });
      });

      // Refresh ScrollTrigger calculations after mounting
      ScrollTrigger.refresh();
    }, 80);

    return () => {
      clearTimeout(timer);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      destroySmoothScroll();
    };
  }, [pathname]);

  return null;
}

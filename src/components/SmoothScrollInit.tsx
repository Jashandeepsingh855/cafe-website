'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initSmoothScroll, destroySmoothScroll, gsap, ScrollTrigger } from '@/lib/lenis-gsap';

export default function SmoothScrollInit() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize Lenis + GSAP ScrollTrigger sync
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

    // Small delay to allow Next.js route DOM to fully mount
    const timer = setTimeout(() => {
      // Clean up any stale ScrollTriggers from previous routes
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // -------------------------------------------------------------
      // A. Global Page Reading / Scroll Progress Bar
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
              scrub: 0.15,
            },
          }
        );
      }

      // -------------------------------------------------------------
      // B. Attribute-Driven Parallax ([data-parallax-y] & [data-parallax-x])
      // -------------------------------------------------------------
      const attrParallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax-y]');
      attrParallaxElements.forEach((el) => {
        const yVal = parseFloat(el.getAttribute('data-parallax-y') || '-30');
        const xVal = parseFloat(el.getAttribute('data-parallax-x') || '0');
        const scrubVal = parseFloat(el.getAttribute('data-parallax-scrub') || '1');

        gsap.fromTo(
          el,
          {
            y: -yVal,
            x: -xVal,
            force3D: true,
          },
          {
            y: yVal,
            x: xVal,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: scrubVal,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // C. Editorial Parallax Images (.parallax-img)
      // -------------------------------------------------------------
      const parallaxImages = document.querySelectorAll<HTMLElement>('.parallax-img');
      parallaxImages.forEach((img) => {
        const parent = img.parentElement || img;
        gsap.fromTo(
          img,
          {
            yPercent: -12,
            scale: 1.08,
            force3D: true,
          },
          {
            yPercent: 12,
            scale: 1.02,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: parent,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // D. Parallax Atmospheric Backgrounds (.parallax-bg)
      // -------------------------------------------------------------
      const bgElements = document.querySelectorAll<HTMLElement>('.parallax-bg');
      bgElements.forEach((bg) => {
        const parent = bg.parentElement || bg;
        gsap.fromTo(
          bg,
          {
            yPercent: -16,
            force3D: true,
          },
          {
            yPercent: 16,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: parent,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // E. Parallax Floating Badges & Accents (.parallax-float-slow / fast)
      // -------------------------------------------------------------
      const slowFloats = document.querySelectorAll<HTMLElement>('.parallax-float-slow');
      slowFloats.forEach((el) => {
        gsap.fromTo(
          el,
          {
            y: -30,
            rotate: -4,
            force3D: true,
          },
          {
            y: 30,
            rotate: 4,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      const fastFloats = document.querySelectorAll<HTMLElement>('.parallax-float-fast');
      fastFloats.forEach((el) => {
        gsap.fromTo(
          el,
          {
            y: -55,
            rotate: 6,
            force3D: true,
          },
          {
            y: 55,
            rotate: -6,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // F. Parallax Staggered Multi-Column Grid Cards (.parallax-card-odd / even)
      // -------------------------------------------------------------
      const oddCards = document.querySelectorAll<HTMLElement>('.parallax-card-odd');
      oddCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            y: -24,
            force3D: true,
          },
          {
            y: 20,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      const evenCards = document.querySelectorAll<HTMLElement>('.parallax-card-even');
      evenCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            y: 24,
            force3D: true,
          },
          {
            y: -20,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // G. Parallax Section Titles (.parallax-header)
      // -------------------------------------------------------------
      const headers = document.querySelectorAll<HTMLElement>('.parallax-header');
      headers.forEach((header) => {
        gsap.fromTo(
          header,
          {
            y: 25,
            opacity: 0.85,
            force3D: true,
          },
          {
            y: -15,
            opacity: 1,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: header,
              start: 'top 95%',
              end: 'bottom 15%',
              scrub: 0.8,
            },
          }
        );
      });

      // -------------------------------------------------------------
      // H. Bidirectional Reveal Fades (.reveal-fade)
      // -------------------------------------------------------------
      const revealElements = document.querySelectorAll<HTMLElement>('.reveal-fade');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 28,
            force3D: true,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse', // Reverses when scrolling back up!
            },
          }
        );
      });

      // Refresh ScrollTrigger calculations
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      destroySmoothScroll();
    };
  }, [pathname]);

  return null;
}

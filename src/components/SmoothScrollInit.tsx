'use client';

import { useEffect } from 'react';
import { initSmoothScroll, destroySmoothScroll, gsap } from '@/lib/lenis-gsap';

export default function SmoothScrollInit() {
  useEffect(() => {
    // 1. Initialize Lenis + GSAP ScrollTrigger sync
    const lenis = initSmoothScroll();

    // 2. Subtle editorial reveal animations for elements with .reveal-fade
    const revealElements = document.querySelectorAll('.reveal-fade');
    if (revealElements.length > 0) {
      gsap.fromTo(
        revealElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: revealElements[0],
            start: 'top 85%',
          },
        }
      );
    }

    return () => {
      destroySmoothScroll();
    };
  }, []);

  return null;
}

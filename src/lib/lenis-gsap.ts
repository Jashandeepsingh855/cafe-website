'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return null;

  // Always reset browser scroll restoration on refresh/load so page opens at the top
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (lenisInstance) {
    return lenisInstance;
  }

  // If user prefers reduced motion, disable smooth scrolling
  if (prefersReducedMotion) {
    return null;
  }

  // Initialize Lenis with crisp, responsive scrolling
  lenisInstance = new Lenis({
    duration: 0.7,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false, // Preserves native touch scrolling on mobile devices
    touchMultiplier: 1.0,
    wheelMultiplier: 1.0,
    infinite: false,
    ...options,
  });

  // Always ensure fresh page visits and reloads start at top
  lenisInstance.scrollTo(0, { immediate: true });

  // Connect Lenis scroll events to GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Sync GSAP's central ticker with Lenis requestAnimationFrame
  tickerCallback = (time: number) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  };
  gsap.ticker.add(tickerCallback);

  // Disable GSAP lag smoothing for frame-perfect animation alignment
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function stopLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function startLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

export function scrollToTop(immediate = true) {
  if (typeof window !== 'undefined') {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroySmoothScroll() {
  if (!lenisInstance) return;

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  lenisInstance.destroy();
  lenisInstance = null;
}

export { lenisInstance as lenis, gsap, ScrollTrigger, ScrollToPlugin };
export default initSmoothScroll;

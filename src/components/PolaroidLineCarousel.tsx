'use client';

import * as React from 'react';

export type Slide = {
  image?: string;
  title?: string;
  caption?: string;
  alt?: string;
};

export type PolaroidLineCarouselProps = {
  slides?: Slide[];
  /** Height of the line area. Default 500px. */
  height?: number | string;
  /** Width of a print in px (it shrinks on narrow screens). */
  cardWidth?: number;
  /** How far the string sags in the middle, px. */
  sag?: number;
  /** How much the prints swing; 0 holds them still. */
  swing?: number;
  /** ms per print; 0 turns autoplay off. */
  autoplay?: number;
  /** Colour of the string. */
  string?: string;
  background?: string;
  ink?: string;
  onChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

// Math helpers
export function wrap(i: number, n: number): number {
  return n ? ((i % n) + n) % n : 0;
}

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

/** Height of a string sagging by `sag` between (0, y0) and (w, y0), at x. */
export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

/** One step of a critically damped spring toward target. */
export function springStep(x: number, v: number, target: number, dt: number, k = 70): [number, number] {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

/** One step of a print's swing on wooden pegs. */
export function swingStep(a: number, w: number, lineVel: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [clamp(a + nw * dt, -0.6, 0.6), nw];
}

const DEFAULT_CAFE_SLIDES: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    title: 'Stone-Baked Margherita',
    caption: '48-hour cold fermented sourdough fired at 420°C on hot stone.',
  },
  {
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    title: 'Spicy Paneer Smash Burger',
    caption: 'Crispy panko malai paneer, sriracha aioli, and brioche crunch.',
  },
  {
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
    title: 'Peri-Peri Crinkle Fries',
    caption: 'Golden seasoned potatoes dusted with house peri-peri spice.',
  },
  {
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    title: 'Lotus Biscoff Thickshake',
    caption: 'Belgian speculoos spread, thick dairy cream, and cookie crumble.',
  },
  {
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    title: 'Chikmagalur Pour-Over',
    caption: '1,350m elevation single-origin Arabica calibrated at 93.5°C.',
  },
  {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    title: 'Botanical Courtyard Veranda',
    caption: 'Sunlit morning bakes and unhurried coffee connection in Indiranagar.',
  },
];

const PL_CSS = `
.pl-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--pl-bg, #FAF7F2);
  color: var(--pl-ink, #18120F);
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
  cursor: grab;
  border-radius: 2rem;
  border: 1px solid #E5E2DD;
  font-family: var(--font-sans, "Plus Jakarta Sans"), system-ui, -apple-system, sans-serif;
}
.pl-root[data-drag='1'] {
  cursor: grabbing;
}
.pl-root:focus-visible {
  box-shadow: inset 0 0 0 2px var(--pl-accent, #C8652D);
}
.pl-string {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 10;
}
.pl-card {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--pl-cw);
  transform-origin: 50% 0;
  will-change: transform;
  cursor: inherit;
}
.pl-print {
  margin-top: 10px;
  background: #FFFFFF;
  padding: 10px 10px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(24,18,15,0.08), 0 20px 32px -12px rgba(24,18,15,0.24);
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), filter 0.4s ease, opacity 0.4s ease;
}
.pl-card[data-on='0'] .pl-print {
  transform: scale(0.91);
  filter: saturate(0.88) brightness(0.97);
  opacity: 0.88;
}
.pl-shot {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #EBE8E3;
  border-radius: 3px;
}
.pl-shot img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.pl-note {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  font-family: var(--font-sans, "Plus Jakarta Sans"), system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: -0.01em;
  color: #18120F;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.pl-peg {
  position: absolute;
  left: 50%;
  top: -2px;
  width: 12px;
  height: 28px;
  margin-left: -6px;
  border-radius: 2px;
  background: linear-gradient(90deg, #b88b58, #e3c498 48%, #a87948);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  z-index: 15;
}
.pl-peg::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 9px;
  width: 2px;
  height: 7px;
  background: rgba(80, 50, 20, 0.6);
  border-radius: 1px;
}
.pl-bar {
  position: absolute;
  left: clamp(16px, 4vw, 48px);
  right: clamp(16px, 4vw, 48px);
  bottom: clamp(16px, 3vh, 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(12px, 2vw, 24px);
  cursor: default;
  z-index: 25;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 12px 20px;
  border-radius: 9999px;
  border: 1px solid #E5E2DD;
  box-shadow: 0 8px 24px rgba(24,18,15,0.06);
  font-family: var(--font-sans, "Plus Jakarta Sans"), system-ui, -apple-system, sans-serif;
}
.pl-cap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.pl-cap > * {
  display: block;
  animation: pl-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.pl-title {
  font-family: var(--font-sans, "Plus Jakarta Sans"), system-ui, -apple-system, sans-serif;
  font-weight: 800;
  font-size: clamp(15px, 1.8vw, 19px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #18120F;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pl-sub {
  margin-top: 2px;
  font-family: var(--font-sans, "Plus Jakarta Sans"), system-ui, -apple-system, sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.3;
  color: #544E49;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pl-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.pl-btn {
  appearance: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #E5E2DD;
  background: #FFFFFF;
  color: #18120F;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
.pl-btn:hover {
  background: #18120F;
  color: #FAF7F2;
  border-color: #18120F;
  transform: scale(1.06);
}
.pl-btn:active {
  transform: scale(0.94);
}
.pl-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes pl-in {
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pl-cap > * {
    animation: none;
  }
  .pl-print {
    transition: none;
  }
}
`;

export default function PolaroidLineCarousel({
  slides = DEFAULT_CAFE_SLIDES,
  height = '500px',
  cardWidth = 270,
  sag = 46,
  swing = 1.1,
  autoplay = 4200,
  string = '#9E866B',
  background = '#FAF7F2',
  ink = '#18120F',
  onChange,
  className,
  style,
  ariaLabel = 'Roastery & Cafe Photo Line Carousel',
}: PolaroidLineCarouselProps) {
  const baseN = slides.length;
  // Repeat enough sets so the string spans seamlessly across any wide viewport without showing seams
  const repeatCount = Math.max(4, Math.ceil(24 / Math.max(1, baseN)));
  const totalCards = baseN * repeatCount;

  const [active, setActive] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState({ w: 1200, h: 500, cw: cardWidth });
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const sim = React.useRef({ off: 0, vel: 0, target: 0, a: [] as number[], w: [] as number[] });
  const drag = React.useRef<{ x: number; off: number; lx: number; lt: number; v: number; moved: boolean } | null>(null);
  const lastTouch = React.useRef(0);
  const activeRef = React.useRef(0);
  const opts = React.useRef({ sag, swing });
  opts.current = { sag, swing };

  const spacing = size.cw * 1.1;
  const totalW = totalCards * spacing;
  const halfTotalW = totalW / 2;

  // Step front (+1) or back (-1) in continuous infinite loop
  const step = React.useCallback(
    (dir: number) => {
      lastTouch.current = performance.now();
      sim.current.target += dir * spacing;
    },
    [spacing]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect();
      const cw = Math.round(Math.max(160, Math.min(cardWidth, r.width * 0.45, r.height * 0.5)));
      setSize({ w: r.width, h: r.height, cw });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [cardWidth]);

  // Keep target aligned on spacing changes (e.g. screen resize)
  React.useEffect(() => {
    sim.current.target = activeRef.current * spacing;
    sim.current.off = activeRef.current * spacing;
  }, [spacing]);

  React.useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  // Real-time animation loop directly updating card transforms & infinite circular line
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || baseN === 0) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;
      const y0 = Math.max(30, h * 0.16);
      const d = drag.current;
      let lineVel: number;

      if (d && d.moved) {
        lineVel = d.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }

      // Periodically normalize S.off and S.target by totalW to prevent any numeric drift
      if (Math.abs(S.off) > totalW) {
        const shift = Math.round(S.off / totalW) * totalW;
        S.off -= shift;
        S.target -= shift;
        if (d) d.off -= shift;
      }

      const o = opts.current;
      const g = reduce ? 0 : o.swing;

      // Position each card along the sagging string in an infinite wrap
      for (let k = 0; k < totalCards; k++) {
        const el = cards.current[k];
        if (!el) continue;

        const rawDist = k * spacing - S.off;
        let dx = ((rawDist % totalW) + totalW) % totalW;
        if (dx > halfTotalW) dx -= totalW;

        const x = w / 2 + dx;

        // Clip offscreen cards to preserve GPU performance
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';

        let a = S.a[k] || 0;
        let av = S.w[k] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, g);
        if (g) a += Math.sin(now / 1300 + k * 1.7) * 0.0009 * g;
        S.a[k] = a;
        S.w[k] = av;

        const y = stringY(x, w, y0, o.sag) - 4;
        el.style.transform = `translate(${(x - cw / 2).toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`;

        const isCentered = Math.abs(dx) < spacing * 0.5;
        el.setAttribute('data-on', isCentered ? '1' : '0');

        const distFromCenter = Math.abs(dx);
        const z = Math.max(1, Math.round(50 - distFromCenter / 40));
        el.style.zIndex = String(z);
      }

      // Sagging string path
      pathRef.current?.setAttribute(
        'd',
        `M0 ${y0} Q${w / 2} ${y0 + 2 * o.sag} ${w} ${y0}`
      );

      // Active slide tracking for the bottom title/caption
      const centeredIndex = Math.round(S.off / spacing);
      const activeBase = ((centeredIndex % baseN) + baseN) % baseN;
      if (activeBase !== activeRef.current) {
        activeRef.current = activeBase;
        setActive(activeBase);
      }

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, totalCards, totalW, halfTotalW, baseN]);

  // Continuous Autoplay looping smoothly forward
  React.useEffect(() => {
    if (!autoplay || baseN < 2) return;
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return;
      sim.current.target += spacing;
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, baseN, spacing]);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.pl-bar')) return;
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      rootRef.current?.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    // Unclamped infinite drag
    sim.current.off = d.off - dx;
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    if (d.moved) {
      setDragging(false);
      sim.current.vel = -d.v * 1000;
      const projected = sim.current.off - d.v * 180;
      sim.current.target = Math.round(projected / spacing) * spacing;
      return;
    }
    // Clicking on a card centers it smoothly
    const card = (e.target as HTMLElement).closest('[data-k]');
    if (card) {
      const k = Number(card.getAttribute('data-k'));
      const rawDist = k * spacing - sim.current.off;
      let dx = ((rawDist % totalW) + totalW) % totalW;
      if (dx > halfTotalW) dx -= totalW;
      sim.current.target = Math.round((sim.current.off + dx) / spacing) * spacing;
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  if (baseN === 0) return null;

  const s = slides[active] || slides[0] || {};

  return (
    <div
      ref={rootRef}
      className={['pl-root', className].filter(Boolean).join(' ')}
      style={{
        height,
        ['--pl-bg' as string]: background,
        ['--pl-ink' as string]: ink,
        ['--pl-accent' as string]: '#C8652D',
        ['--pl-cw' as string]: size.cw + 'px',
        ...style,
      }}
      data-drag={dragging ? '1' : '0'}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{PL_CSS}</style>
      <svg className="pl-string" aria-hidden="true">
        <path ref={pathRef} fill="none" stroke={string} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {Array.from({ length: totalCards }).map((_, k) => {
        const slideIndex = k % baseN;
        const sl = slides[slideIndex];
        return (
          <div
            key={k}
            className="pl-card"
            data-k={k}
            ref={(el) => {
              cards.current[k] = el;
            }}
          >
            <div className="pl-print">
              <div className="pl-shot">
                {sl.image ? (
                  <img
                    src={sl.image}
                    alt={sl.alt || sl.title || ''}
                    draggable={false}
                    loading={k < 8 ? 'eager' : 'lazy'}
                  />
                ) : null}
              </div>
              <div className="pl-note">{sl.title || ''}</div>
            </div>
            <div className="pl-peg" />
          </div>
        );
      })}

      {/* Interactive Bottom Control Bar */}
      <div className="pl-bar">
        <div className="pl-cap" key={active} aria-hidden="true">
          {s.title ? <span className="pl-title">{s.title}</span> : null}
          {s.caption ? <span className="pl-sub">{s.caption}</span> : null}
        </div>
        <div className="pl-actions">
          <button
            type="button"
            className="pl-btn"
            aria-label="Previous photo in loop"
            onClick={() => step(-1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="pl-btn"
            aria-label="Next photo in loop"
            onClick={() => step(1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pl-sr" aria-live="polite">
        {(s.title ? s.title + ': ' : '') + (s.caption || '')}
      </div>
    </div>
  );
}

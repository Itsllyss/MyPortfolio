'use client';

import { useEffect, useRef } from 'react';

// A liquid colour trail that follows the pointer and fades on its own once the
// pointer rests, plus a splash on click. The spectrum skips violet on purpose:
// the colour sweeps blue → cyan → green → yellow → orange → coral and back,
// never wrapping round through the 250–320° band.
const HUES = [205, 188, 168, 140, 92, 52, 30, 10, -8];
const TRAIL_LIFE = 1300;
const IDLE_FADE = 450;
const SPLASH_LIFE = 900;

type Dot = { x: number; y: number; born: number; hue: number };
type Drop = { x: number; y: number; vx: number; vy: number; r: number; hue: number; born: number };
type Ring = { x: number; y: number; born: number; hue: number };

const hueAt = (t: number) => {
  const span = HUES.length - 1;
  const cycle = (t / 900) % (span * 2);
  const pos = cycle <= span ? cycle : span * 2 - cycle; // ping-pong
  const i = Math.min(Math.floor(pos), span - 1);
  const h = HUES[i] + (HUES[i + 1] - HUES[i]) * (pos - i);
  return (h + 360) % 360;
};
const hueFrom = (i: number) => (HUES[((i % HUES.length) + HUES.length) % HUES.length] + 360) % 360;

export default function LiquidCursor({ paused }: { paused: boolean }) {
  const trailRef = useRef<HTMLCanvasElement>(null);
  const splashRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || reduce.matches) return;
    const trail = trailRef.current;
    const splash = splashRef.current;
    if (!trail || !splash) return;
    const tctx = trail.getContext('2d');
    const sctx = splash.getContext('2d');
    if (!tctx || !sctx) return;

    const SCALE = 0.5; // the trail is drawn at half size; the blur hides it
    let dpr = 1;
    const dots: Dot[] = [];
    const drops: Drop[] = [];
    const rings: Ring[] = [];
    let last: { x: number; y: number } | null = null;
    let lastMove = 0;
    let travel = 0; // px moved so far: the colour shifts along the ribbon
    const hueFor = (dist: number, now: number) => hueAt(dist * 6 + now * 0.25);
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      trail.width = Math.ceil(window.innerWidth * SCALE);
      trail.height = Math.ceil(window.innerHeight * SCALE);
      splash.width = Math.ceil(window.innerWidth * dpr);
      splash.height = Math.ceil(window.innerHeight * dpr);
    };
    resize();

    const isLight = () => document.documentElement.dataset.theme === 'light';

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      lastMove = now;
      const p = { x: e.clientX, y: e.clientY };
      // Fill gaps on fast moves so the trail stays one liquid ribbon;
      // a jump across the screen (touch, re-entry) starts a new trail.
      const gap = last ? Math.hypot(p.x - last.x, p.y - last.y) : 0;
      const steps = gap > 420 ? 0 : Math.min(24, Math.floor(gap / 12));
      for (let i = 1; i <= steps; i++) {
        const k = i / (steps + 1);
        dots.push({ x: last!.x + (p.x - last!.x) * k, y: last!.y + (p.y - last!.y) * k, born: now, hue: hueFor(travel + gap * k, now) });
      }
      travel += gap > 420 ? 0 : gap;
      dots.push({ ...p, born: now, hue: hueFor(travel, now) });
      if (dots.length > 220) dots.splice(0, dots.length - 220);
      last = p;
      wake();
    };

    const onLeave = () => {
      last = null;
    };

    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      const base = hueFor(travel, now);
      rings.push({ x: e.clientX, y: e.clientY, born: now, hue: base });
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const speed = 2.2 + Math.random() * 3.2;
        drops.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          r: 2.5 + Math.random() * 3.5,
          hue: hueFrom(i + Math.floor(now / 300)),
          born: now,
        });
      }
      wake();
    };

    function frame(now: number) {
      raf = 0;
      const light = isLight();
      const idle = now - lastMove > IDLE_FADE;

      // Trail
      tctx!.clearRect(0, 0, trail!.width, trail!.height);
      tctx!.globalCompositeOperation = light ? 'source-over' : 'lighter';
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        const age = now - d.born;
        const life = idle ? Math.min(TRAIL_LIFE, now - lastMove + 260) : TRAIL_LIFE;
        if (age > life) {
          dots.splice(i, 1);
          continue;
        }
        const k = 1 - age / life;
        const r = (34 + age * 0.05) * SCALE;
        const a = Math.pow(k, 1.5) * (light ? 0.26 : 0.34);
        const g = tctx!.createRadialGradient(d.x * SCALE, d.y * SCALE, 0, d.x * SCALE, d.y * SCALE, r);
        g.addColorStop(0, `hsla(${d.hue}, 100%, ${light ? 55 : 60}%, ${a})`);
        g.addColorStop(1, `hsla(${d.hue}, 100%, 60%, 0)`);
        tctx!.fillStyle = g;
        tctx!.beginPath();
        tctx!.arc(d.x * SCALE, d.y * SCALE, r, 0, Math.PI * 2);
        tctx!.fill();
      }

      // Splash
      sctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        const t = (now - r.born) / SPLASH_LIFE;
        if (t >= 1) {
          rings.splice(i, 1);
          continue;
        }
        const ease = 1 - Math.pow(1 - t, 3);
        for (let j = 0; j < 2; j++) {
          const tt = Math.max(0, ease - j * 0.18);
          if (tt <= 0) continue;
          sctx!.beginPath();
          sctx!.arc(r.x, r.y, 8 + tt * 90, 0, Math.PI * 2);
          const hue = j ? hueAt(r.born + 2700) : r.hue;
          sctx!.strokeStyle = `hsla(${hue}, 100%, ${light ? 45 : 62}%, ${(1 - t) * 0.7})`;
          sctx!.lineWidth = (1 - t) * (j ? 2 : 3.5);
          sctx!.stroke();
        }
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const t = (now - d.born) / SPLASH_LIFE;
        if (t >= 1) {
          drops.splice(i, 1);
          continue;
        }
        d.vy += 0.16;
        d.vx *= 0.97;
        d.x += d.vx;
        d.y += d.vy;
        sctx!.beginPath();
        sctx!.arc(d.x, d.y, d.r * (1 - t * 0.7), 0, Math.PI * 2);
        sctx!.fillStyle = `hsla(${d.hue}, 100%, ${light ? 48 : 62}%, ${1 - t})`;
        sctx!.fill();
      }

      // Keep drawing only while something is still visible.
      if (dots.length || drops.length || rings.length) raf = requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
      tctx.clearRect(0, 0, trail.width, trail.height);
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, splash.width, splash.height);
    };
  }, [paused]);

  return (
    <div className="liquid" aria-hidden="true">
      <canvas ref={trailRef} className="liquid-trail" />
      <canvas ref={splashRef} className="liquid-splash" />
    </div>
  );
}

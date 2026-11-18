'use client';

import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';

export type Mood = 'idle' | 'thinking' | 'talking' | 'happy';

type Props = {
  mood: Mood;
  size?: number;
  paused?: boolean;
  label?: string;
};

// Frames from the Firefly turn (public/avatar/frames), ordered by head angle:
// 77 → 90 turn toward the viewer's right, 91 faces front, 92 → 96 and 1 → 21
// turn toward the viewer's left.
const SEQ = [
  ...Array.from({ length: 14 }, (_, i) => 77 + i),
  91,
  ...Array.from({ length: 5 }, (_, i) => 92 + i),
  ...Array.from({ length: 21 }, (_, i) => 1 + i),
];
const FRONT = SEQ.indexOf(91);
const RIGHT_STEPS = FRONT;
const LEFT_STEPS = SEQ.length - 1 - FRONT;
const RETURN_AFTER = 2500; // ms without mouse movement before she faces front again

export const frameSrc = (n: number) => `/avatar/frames/frame_${String(n).padStart(3, '0')}.webp`;

// Shared across both avatar instances (home and chat header).
let cache: HTMLImageElement[] | null = null;
function preload() {
  if (!cache) {
    cache = SEQ.map((n) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(n);
      return img;
    });
  }
  return cache;
}
const ready = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;

export default function Avatar({ mood, size, paused = false, label }: Props) {
  const reduce = useReducedMotion();
  const still = paused || !!reduce;
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!box || !canvas || !ctx) return;
    const frames = preload();

    let current = FRONT;
    let target = FRONT;
    let drawn = -1;
    let lastMove = 0;
    let raf = 0;
    let wakeTimer = 0;

    const fit = () => {
      const px = Math.min(480, Math.round(box.clientWidth * Math.min(window.devicePixelRatio || 1, 2)));
      if (canvas.width !== px) {
        canvas.width = canvas.height = px;
        drawn = -1;
      }
    };

    const draw = () => {
      const i = Math.round(current);
      if (i === drawn) return;
      // Fall back to the nearest frame that has loaded.
      for (let d = 0; d < SEQ.length; d++) {
        const j = [i - d, i + d].find((k) => k >= 0 && k < SEQ.length && ready(frames[k]));
        if (j !== undefined) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(frames[j], 0, 0, canvas.width, canvas.height);
          drawn = j === i ? i : -1;
          setLive(true);
          return;
        }
      }
    };

    const tick = (now: number) => {
      raf = 0;
      if (now - lastMove > RETURN_AFTER) target = FRONT;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.02) current = target;
      draw();
      if (current !== target) {
        raf = requestAnimationFrame(tick);
      } else if (target !== FRONT) {
        window.clearTimeout(wakeTimer);
        wakeTimer = window.setTimeout(wake, RETURN_AFTER - (performance.now() - lastMove) + 20);
      }
    };
    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const reach = Math.max(280, window.innerWidth * 0.42);
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / reach));
      // Cursor to the right: she turns toward it (frames 90 → 77); to the left: 92 → 21.
      target = dx >= 0 ? FRONT - dx * RIGHT_STEPS : FRONT + -dx * LEFT_STEPS;
      lastMove = performance.now();
      wake();
    };

    fit();
    // Draw frame 91 as soon as it decodes; until then the <img> below shows it.
    const first = frames[FRONT];
    if (ready(first)) draw();
    else first.addEventListener('load', draw, { once: true });
    const onResize = () => {
      fit();
      draw();
    };
    window.addEventListener('resize', onResize);
    if (!still) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(wakeTimer);
      first.removeEventListener('load', draw);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [still]);

  const motionByMood: Record<Mood, TargetAndTransition> = still
    ? { idle: { y: 0, scale: 1 }, thinking: { y: 0, scale: 1 }, talking: { y: 0, scale: 1 }, happy: { y: 0, scale: 1 } }
    : {
        idle: { y: [0, -2, 0], scale: 1, transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
        thinking: { y: -3, scale: 0.97, transition: { type: 'spring', stiffness: 120, damping: 14 } },
        talking: { y: [0, -3, 0], scale: 1, transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
        happy: { y: 0, scale: [1, 1.07, 1], transition: { duration: 0.6, ease: 'easeOut' } },
      };

  return (
    <div
      ref={boxRef}
      className="avatar"
      data-mood={mood}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label={label ?? `${SITE.firstName}'s avatar`}
    >
      <span className="avatar-disc" aria-hidden="true" />
      <span className="avatar-ring" aria-hidden="true" />
      <motion.span className="avatar-face" aria-hidden="true" animate={motionByMood[mood]}>
        {/* First paint: the front-facing frame 091, before the sequence loads. */}
        <img src={frameSrc(91)} alt="" width={480} height={480} fetchPriority="high" style={{ opacity: live ? 0 : 1 }} />
        <canvas ref={canvasRef} />
      </motion.span>
    </div>
  );
}

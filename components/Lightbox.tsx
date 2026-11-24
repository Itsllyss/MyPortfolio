'use client';

import { ExternalLink, Scan, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const STEP = 1.4;

// Full-screen image viewer. Zoom 1 fits the image to the window's width;
// drag (mouse), scroll or the arrow keys pan; +, - and 0 zoom from the keyboard.
export default function Lightbox({ open, onClose, title, src, alt, width, height }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const keep = useRef<{ fx: number; fy: number } | null>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [max, setMax] = useState(4);
  const [fitW, setFitW] = useState(0);
  const uid = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      const v = view.current;
      if (v) {
        const cw = v.clientWidth;
        const ch = v.clientHeight;
        const top = Math.max(1.5, (width * 2) / cw); // up to 2x the file's own pixels
        // A very wide diagram fitted to a narrow screen is unreadable: start it taller.
        const fittedH = (cw * height) / width;
        const start = fittedH < ch * 0.45 ? Math.min(top, (ch * 0.62) / fittedH) : 1;
        setFitW(cw);
        setMax(top);
        setZoom(start);
        keep.current = null;
        requestAnimationFrame(() => {
          v.scrollLeft = 0;
          v.scrollTop = Math.max(0, (v.scrollHeight - ch) / 2);
          v.focus();
        });
      }
    }
    if (!open && d.open) d.close();
  }, [open, width, height]);

  // Keep the point at the centre of the view in place while zooming.
  const setZoomKept = (next: number) => {
    const v = view.current;
    const z = Math.min(max, Math.max(1, next));
    if (v) {
      keep.current = {
        fx: (v.scrollLeft + v.clientWidth / 2) / v.scrollWidth,
        fy: (v.scrollTop + v.clientHeight / 2) / v.scrollHeight,
      };
    }
    setZoom(z);
  };

  useLayoutEffect(() => {
    const v = view.current;
    const k = keep.current;
    if (!v || !k) return;
    v.scrollLeft = k.fx * v.scrollWidth - v.clientWidth / 2;
    v.scrollTop = k.fy * v.scrollHeight - v.clientHeight / 2;
    keep.current = null;
  }, [zoom]);

  // Trackpad pinch arrives as ctrl + wheel.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoomKept(zoom * Math.exp(-e.deltaY / 200));
    };
    v.addEventListener('wheel', onWheel, { passive: false });
    return () => v.removeEventListener('wheel', onWheel);
  });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !view.current) return;
    drag.current = { x: e.clientX, y: e.clientY, left: view.current.scrollLeft, top: view.current.scrollTop };
    view.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const v = view.current;
    if (!d || !v) return;
    v.scrollLeft = d.left - (e.clientX - d.x);
    v.scrollTop = d.top - (e.clientY - d.y);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const pct = fitW ? Math.round(((fitW * zoom) / width) * 100) : 100;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={ref}
      className="lightbox"
      aria-labelledby={`${uid}-title`}
      onClose={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === '+' || e.key === '=') setZoomKept(zoom * STEP);
        else if (e.key === '-') setZoomKept(zoom / STEP);
        else if (e.key === '0') setZoomKept(1);
        else return;
        e.preventDefault();
      }}
    >
      <div className="lb-bar">
        <h2 id={`${uid}-title`} className="lb-title">
          {title}
        </h2>
        <div className="lb-tools">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setZoomKept(zoom / STEP)}
            disabled={zoom <= 1}
            aria-label="Zoom out"
            title="Zoom out (−)"
          >
            <ZoomOut size={18} aria-hidden="true" />
          </button>
          <span className="lb-pct" aria-live="polite">
            {pct}%
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setZoomKept(zoom * STEP)}
            disabled={zoom >= max}
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            <ZoomIn size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setZoomKept(1)}
            disabled={zoom === 1}
            aria-label="Fit to width"
            title="Fit to width (0)"
          >
            <Scan size={18} aria-hidden="true" />
          </button>
          <a
            className="icon-btn"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the original image in a new tab"
            title="Open original"
          >
            <ExternalLink size={18} aria-hidden="true" />
          </a>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close diagram" title="Close (Esc)">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={view}
        className="lb-view"
        tabIndex={0}
        aria-label={`${title}: drag or scroll to pan`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="lb-canvas" style={{ width: `${zoom * 100}%` }}>
          <img src={src} alt={alt} width={width} height={height} draggable={false} />
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

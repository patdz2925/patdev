import { useEffect, useRef, useState, useCallback } from "react";

/** The halftone cutout portrait asset (has alpha). */
const PROFILE = "/profile.png";
/** Logical portrait size — matches public/profile.png dimensions. */
const LW = 1264;
const LH = 843;

/** Depth layers [yStart, yEnd, parallaxDepth]. Far layers move less; face layers move most. */
const LAYERS = [
  [0.00, 0.34, 0.08], // hair & ears (far)
  [0.34, 0.53, 0.55], // forehead + eyes
  [0.53, 0.78, 0.75], // nose / mouth / chin
  [0.78, 1.00, 0.05], // shoulders & body (stable)
] as const;

/** Eye sockets in portrait logical coordinates. */
const EYE = {
  left:  { x: 560, y: 354, r: 19 },
  right: { x: 716, y: 354, r: 19 },
} as const;
const MAX_PUPIL = 8; // max pupil offset inside each socket
const LERP_EYE = 0.13;
const LERP_HEAD = 0.055;
const MAX_SHIFT = 9; // max parallax shift in px

/** Bound cursor influence to a believable viewing range (0..1). */
const MAX_CURSOR = 0.8;

export function InteractivePortrait() {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const eyeRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<HTMLCanvasElement[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  const target = useRef({ dx: 0, dy: 0 });
  const head = useRef({ dx: 0, dy: 0 });
  const eyePos = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const rafRef = useRef<number>(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Load portrait + precompute parallax layers (one-time).
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvases: HTMLCanvasElement[] = [];
      for (const [y0, y1, _d] of LAYERS) {
        const c = document.createElement("canvas");
        const hh = Math.round((y1 - y0) * LH);
        c.width = LW;
        c.height = hh;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, Math.round(y0 * LH), LW, hh, 0, 0, LW, hh);
        canvases.push(c);
      }
      layersRef.current = canvases;
    };
    img.onerror = () => setLoadError(true);
    img.src = PROFILE;
    return () => {
      cancelAnimationFrame(rafRef.current);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  // Map a pointer event to a normalized direction (-1..1) relative to portrait centre.
  const pointerToDir = useCallback(
    (clientX: number, clientY: number) => {
      const rect = baseRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return { dx: 0, dy: 0 };
      const px = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((clientY - rect.top) / rect.height - 0.5) * 2;
      const len = Math.sqrt(px * px + py * py) || 1;
      const clamped = Math.min(len, MAX_CURSOR) / len;
      return { dx: px * clamped, dy: py * clamped };
    },
    []
  );

  // Global pointer tracking (mouse + touch).
  useEffect(() => {
    const onMove = (x: number, y: number) => {
      target.current = pointerToDir(x, y);
    };
    window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchmove",
      (e) => {
        if (e.touches.length) onMove(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );
    return () => {
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("touchmove", () => {});
    };
  }, [pointerToDir]);

  // Render loop.
  useEffect(() => {
    if (loadError) return;

    const loop = () => {
      const base = baseRef.current;
      const eye = eyeRef.current;
      if (!base || !eye) { rafRef.current = requestAnimationFrame(loop); return; }

      const tdx = reducedMotion ? 0 : target.current.dx;
      const tdy = reducedMotion ? 0 : target.current.dy;

      // Smooth interpolation (eyes lead, head follows).
      const eLerp = reducedMotion ? 1 : LERP_EYE;
      const hLerp = reducedMotion ? 1 : LERP_HEAD;
      eyePos.current.lx += (tdx * MAX_PUPIL - eyePos.current.lx) * eLerp;
      eyePos.current.ly += (tdy * MAX_PUPIL - eyePos.current.ly) * eLerp;
      eyePos.current.rx += (tdx * MAX_PUPIL - eyePos.current.rx) * eLerp;
      eyePos.current.ry += (tdy * MAX_PUPIL - eyePos.current.ry) * eLerp;
      head.current.dx += (tdx * MAX_SHIFT - head.current.dx) * hLerp;
      head.current.dy += (tdy * MAX_SHIFT - head.current.dy) * hLerp;

      const ctx = base.getContext("2d")!;
      ctx.clearRect(0, 0, LW, LH);

      // Composite parallax layers at their correct vertical positions.
      const layers = layersRef.current;
      for (let i = 0; i < LAYERS.length; i++) {
        const layer = layers[i];
        if (!layer) continue;

        const [y0, _y1, depth] = LAYERS[i];
        const ox = Math.round(head.current.dx * depth);
        const oy = Math.round(head.current.dy * depth);

        ctx.drawImage(layer, ox, Math.round(y0 * LH) + oy);
      }

      // Draw eyes on the overlay canvas — eyes ride the mid-depth (face) layer.
      const ectx = eye.getContext("2d")!;
      ectx.clearRect(0, 0, LW, LH);

      const eyeOffX = Math.round(head.current.dx * 0.55);
      const eyeOffY = Math.round(head.current.dy * 0.55);

      const clamp = (v: number) => Math.max(-EYE.left.r - 1, Math.min(EYE.left.r + 1, v));
      const drawEye = (ex: number, ey: number, pupilX: number, pupilY: number) => {
        const r = EYE.left.r;
        // sclera
        ectx.beginPath();
        ectx.arc(ex + eyeOffX, ey + eyeOffY, r, 0, Math.PI * 2);
        ectx.fillStyle = "#ffffff";
        ectx.fill();
        // pupil
        ectx.beginPath();
        ectx.arc(ex + eyeOffX + pupilX, ey + eyeOffY + pupilY, Math.max(1, r * 0.42), 0, Math.PI * 2);
        ectx.fillStyle = "#111111";
        ectx.fill();
        // highlight
        ectx.beginPath();
        ectx.arc(ex + eyeOffX + pupilX * 1.35, ey + eyeOffY + pupilY * 1.35, 2.4, 0, Math.PI * 2);
        ectx.fillStyle = "#ffffff";
        ectx.fill();
      };

      drawEye(EYE.left.x, EYE.left.y, clamp(eyePos.current.lx), clamp(eyePos.current.ly));
      drawEye(EYE.right.x, EYE.right.y, clamp(eyePos.current.rx), clamp(eyePos.current.ry));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loadError]);

  if (loadError) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="font-pixel text-lg text-neutral-400">photo unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Base portrait (parallax layers composited here). */}
      <canvas
        ref={baseRef}
        width={LW}
        height={LH}
        aria-hidden="true"
        className="block w-full"
        style={{ background: "transparent" }}
      />
      {/* Eye-tracking overlay. */}
      <canvas
        ref={eyeRef}
        width={LW}
        height={LH}
        aria-hidden="true"
        className="absolute left-0 top-0 block w-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
}

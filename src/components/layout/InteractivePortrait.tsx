import { useEffect, useRef, useState, useCallback } from "react";

/** Fallback single portrait asset (also the single-mode source). */
const PROFILE = "/profile.png";
/** Directional gaze views live here once generated (see VIEW_DEFS). */
const PORTRAIT_DIR = "/portrait";
/** Logical portrait size — matches public/profile.png dimensions. */
const LW = 1264;
const LH = 843;

type ViewDef = { id: string; file: string; gx: number; gy: number };
type ViewImage = { def: ViewDef; canvas: HTMLCanvasElement };

/**
 * Gaze grid of directional views. Coordinates are gaze space (x: -1 left … +1
 * right, y: -1 up … +1 down). `center` is required for multi-view mode; the
 * rest are progressive enhancements — any subset works, missing files are
 * skipped silently and weights renormalize over what loaded.
 */
const VIEW_DEFS: ViewDef[] = [
  { id: "center", file: `${PORTRAIT_DIR}/center.png`, gx: 0, gy: 0 },
  { id: "left", file: `${PORTRAIT_DIR}/left.png`, gx: -1, gy: 0 },
  { id: "right", file: `${PORTRAIT_DIR}/right.png`, gx: 1, gy: 0 },
  { id: "up", file: `${PORTRAIT_DIR}/up.png`, gx: 0, gy: -1 },
  { id: "down", file: `${PORTRAIT_DIR}/down.png`, gx: 0, gy: 1 },
  { id: "up-left", file: `${PORTRAIT_DIR}/up-left.png`, gx: -1, gy: -1 },
  { id: "up-right", file: `${PORTRAIT_DIR}/up-right.png`, gx: 1, gy: -1 },
  { id: "down-left", file: `${PORTRAIT_DIR}/down-left.png`, gx: -1, gy: 1 },
  { id: "down-right", file: `${PORTRAIT_DIR}/down-right.png`, gx: 1, gy: 1 },
];
const VIEW_ORDER: Record<string, number> = Object.fromEntries(
  VIEW_DEFS.map((d, i) => [d.id, i])
);

/**
 * Bilinear-style blend weights for gaze (gx, gy) over the loaded views.
 * Full 3×3 grid → exact bilinear (≤4 non-zero weights, smooth, no swaps).
 * Partial grid → renormalized falloff over whatever is available.
 */
function blendWeights(gx: number, gy: number, views: ViewImage[]) {
  let total = 0;
  const ws = views.map((view) => {
    const w =
      Math.max(0, 1 - Math.abs(gx - view.def.gx)) *
      Math.max(0, 1 - Math.abs(gy - view.def.gy));
    total += w;
    return { view, w };
  });
  if (total <= 0) return views.length ? [{ view: views[0], w: 1 }] : [];
  return ws
    .filter(({ w }) => w > 0.004)
    .map(({ view, w }) => ({ view, w: w / total }));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

/**
 * Single-image 2.5D rig geometry (fallback when directional views are absent).
 * BODY  = full portrait, near-stable anchor (moves least).
 * HEAD  = hair-through-neck strip with a feathered bottom edge so it can
 *         rotate around the neck pivot without tearing. Moves most.
 */
const HEAD_Y1 = 0.76; // head strip covers y 0..0.76*LH
const FEATHER_Y0 = 0.64; // feather fade starts (fraction of LH)
/** Neck pivot the head rotates around (logical px). Face centre x = (560+716)/2 = 638. */
const PIVOT = { x: 638, y: 600 };

/** Eye sockets in portrait logical coordinates (tuned for /profile.png). */
const EYE = {
  left:  { x: 560, y: 354, r: 19 },
  right: { x: 716, y: 354, r: 19 },
} as const;
const MAX_PUPIL = 8; // max pupil offset inside each socket
const LERP_EYE = 0.13; // eyes lead (fast)
const LERP_HEAD = 0.055; // head follows (slow → inertia/lag)

/** Cursor-to-gaze mapping. */
const GAZE_RADIUS = 0.35; // viewport fraction that maps to full gaze
const DEADZONE = 0.05; // neutral zone around the centre

/** Head-plane look transform limits (subtle, realistic — not cartoon). */
const MAX_ROT = (2.2 * Math.PI) / 180; // ±2.2° around the neck pivot
const HEAD_SHIFT_X = 7; // max head translate (logical px)
const HEAD_SHIFT_Y = 5;
const SKEW_X = 0.03; // micro foreshorten on turns
const SKEW_Y = 0.02;
/** Body-plane drift (same direction, far less → parallax depth vs the head). */
const BODY_SHIFT_X = 1.5;
const BODY_SHIFT_Y = 1;
/** Container 3D tilt limits (degrees). */
const TILT_Y = 5;
const TILT_X = 4;

/** Smooth, saturating gaze curve: linear near centre, bounded at ±1. */
function gazeCurve(v: number) {
  const t = Math.tanh(1.2 * v) / Math.tanh(1.2);
  if (Math.abs(t) < DEADZONE) return 0;
  return Math.max(-1, Math.min(1, t));
}

export function InteractivePortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const eyeRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  // Multi-view path.
  const viewsRef = useRef<ViewImage[]>([]);
  const modeRef = useRef<"single" | "multi">("single");
  // Single-image rig planes.
  const bodyRef = useRef<HTMLCanvasElement | null>(null);
  const headRef = useRef<HTMLCanvasElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  const target = useRef({ dx: 0, dy: 0 });
  const head = useRef({ dx: 0, dy: 0 });
  const eyePos = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const lightSign = useRef(0);
  const gazeStamp = useRef("");
  const modeStamp = useRef("");
  const rafRef = useRef<number>(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Load assets (one-time): single-image planes from /profile.png, then the
  // directional view set as a progressive upgrade (silent if absent).
  useEffect(() => {
    let cancelled = false;

    const buildPlanes = (img: HTMLImageElement) => {
      // BODY: full portrait, stable anchor.
      const body = document.createElement("canvas");
      body.width = LW;
      body.height = LH;
      body.getContext("2d")!.drawImage(img, 0, 0, LW, LH);
      bodyRef.current = body;

      // HEAD: hair-through-neck strip, bottom edge feathered for blending.
      const hh = Math.round(HEAD_Y1 * LH);
      const headC = document.createElement("canvas");
      headC.width = LW;
      headC.height = hh;
      const hctx = headC.getContext("2d")!;
      hctx.drawImage(img, 0, 0, LW, hh, 0, 0, LW, hh);
      hctx.globalCompositeOperation = "destination-in";
      const fade = hctx.createLinearGradient(0, FEATHER_Y0 * LH, 0, hh);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      hctx.fillStyle = fade;
      hctx.fillRect(0, 0, LW, hh);
      hctx.globalCompositeOperation = "source-over";
      headRef.current = headC;
    };

    const load = async () => {
      try {
        buildPlanes(await loadImage(PROFILE));
      } catch {
        if (!cancelled) setLoadError(true);
        return;
      }
      if (cancelled) return;
      // Directional views: center unlocks multi-view mode, the rest stream in.
      try {
        const center = await loadImage(VIEW_DEFS[0].file);
        if (cancelled) return;
        viewsRef.current = [{ def: VIEW_DEFS[0], canvas: (() => {
          const c = document.createElement("canvas");
          c.width = LW;
          c.height = LH;
          c.getContext("2d")!.drawImage(center, 0, 0, LW, LH);
          return c;
        })() }];
        modeRef.current = "multi";
        const rest = await Promise.allSettled(
          VIEW_DEFS.slice(1).map(async (def) => {
            const img = await loadImage(def.file);
            const c = document.createElement("canvas");
            c.width = LW;
            c.height = LH;
            c.getContext("2d")!.drawImage(img, 0, 0, LW, LH);
            return { def, canvas: c };
          })
        );
        if (cancelled) return;
        for (const r of rest) {
          if (r.status === "fulfilled") viewsRef.current.push(r.value);
        }
        viewsRef.current.sort((x, y) => VIEW_ORDER[x.def.id] - VIEW_ORDER[y.def.id]);
      } catch {
        // No directional views on the server — stay in single-image mode.
      }
    };
    load();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Map a pointer position to gaze direction (-1..1) relative to portrait centre,
  // normalized by viewport size so screen edges read as full look (bryllim-style).
  const pointerToDir = useCallback((clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { dx: 0, dy: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (clientX - cx) / (window.innerWidth * GAZE_RADIUS);
    const ny = (clientY - cy) / (window.innerHeight * GAZE_RADIUS);
    return { dx: gazeCurve(nx), dy: gazeCurve(ny) };
  }, []);

  // Global pointer tracking (mouse + touch). Leaving returns to neutral.
  useEffect(() => {
    const onMove = (x: number, y: number) => {
      target.current = pointerToDir(x, y);
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      target.current = { dx: 0, dy: 0 };
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) onLeave();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseout", onMouseOut as EventListener);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseout", onMouseOut as EventListener);
      window.removeEventListener("blur", onLeave);
    };
  }, [pointerToDir]);

  // Render loop.
  useEffect(() => {
    if (loadError) return;

    const loop = () => {
      const base = baseRef.current;
      const eye = eyeRef.current;
      const wrap = wrapRef.current;
      if (!base || !eye || !wrap) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const tdx = reducedMotion ? 0 : target.current.dx;
      const tdy = reducedMotion ? 0 : target.current.dy;

      // Smooth interpolation (eyes lead, head follows → inertia/lag).
      const eLerp = reducedMotion ? 1 : LERP_EYE;
      const hLerp = reducedMotion ? 1 : LERP_HEAD;
      eyePos.current.lx += (tdx * MAX_PUPIL - eyePos.current.lx) * eLerp;
      eyePos.current.ly += (tdy * MAX_PUPIL - eyePos.current.ly) * eLerp;
      eyePos.current.rx += (tdx * MAX_PUPIL - eyePos.current.rx) * eLerp;
      eyePos.current.ry += (tdy * MAX_PUPIL - eyePos.current.ry) * eLerp;
      head.current.dx += (tdx - head.current.dx) * hLerp;
      head.current.dy += (tdy - head.current.dy) * hLerp;
      const shx = head.current.dx;
      const shy = head.current.dy;

      const ctx = base.getContext("2d")!;
      const ectx = eye.getContext("2d")!;
      const views = viewsRef.current;
      const multi = modeRef.current === "multi" && views.length > 0;

      if (multi) {
        // PRIMARY: crossfade directional views (true perspective change).
        // Bilinear weights keep ≤4 views active and motion continuous.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, LW, LH);
        const active = blendWeights(shx, shy, views);
        for (const { view, w } of active) {
          ctx.globalAlpha = w;
          ctx.drawImage(view.canvas, shx * BODY_SHIFT_X, shy * BODY_SHIFT_Y);
        }
        ctx.globalAlpha = 1;
        // Views carry their own gaze-directed eyes — no synthetic overlay.
        ectx.clearRect(0, 0, LW, LH);
      } else {
        // FALLBACK: single-image 2.5D rig (no directional assets on server).
        // Head-plane affine: rotate about the neck pivot + micro skew/scale.
        // M = T(pivot+shift) · Scale · Skew · Rot · T(-pivot). Affine-only, so
        // the face keeps its exact identity/proportions — it turns, never warps.
        const th = shx * MAX_ROT;
        const cos = Math.cos(th);
        const sin = Math.sin(th);
        const skx = shx * SKEW_X;
        const sky = shy * SKEW_Y;
        const gx = 1 + Math.abs(shx) * 0.006;
        const gy = 1 + shy * 0.012;
        const a = gx * (cos + skx * sin);
        const b = gy * (sky * cos + sin);
        const c = gx * (-sin + skx * cos);
        const d = gy * (-sky * sin + cos);
        const shiftX = shx * HEAD_SHIFT_X;
        const shiftY = shy * HEAD_SHIFT_Y;
        const e = PIVOT.x + shiftX - (a * PIVOT.x + c * PIVOT.y);
        const f = PIVOT.y + shiftY - (b * PIVOT.x + d * PIVOT.y);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, LW, LH);

        // BODY: near-stable anchor (drifts slightly with gaze → depth vs head).
        const body = bodyRef.current;
        if (body) {
          ctx.drawImage(body, shx * BODY_SHIFT_X, shy * BODY_SHIFT_Y);
        }
        // HEAD: turns toward the cursor around the neck pivot.
        const headC = headRef.current;
        if (headC) {
          ctx.setTransform(a, b, c, d, e, f);
          ctx.drawImage(headC, 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Eyes ride the same head matrix so they stay glued to the face,
        // while pupils look toward the cursor.
        ectx.clearRect(0, 0, LW, LH);
        const clamp = (v: number) => Math.max(-EYE.left.r - 1, Math.min(EYE.left.r + 1, v));
        const drawEye = (ex: number, ey: number, pupilX: number, pupilY: number) => {
          const hx = a * ex + c * ey + e;
          const hy = b * ex + d * ey + f;
          const r = EYE.left.r;
          // sclera
          ectx.beginPath();
          ectx.arc(hx, hy, r, 0, Math.PI * 2);
          ectx.fillStyle = "#ffffff";
          ectx.fill();
          // pupil (look direction)
          ectx.beginPath();
          ectx.arc(hx + pupilX, hy + pupilY, Math.max(1, r * 0.42), 0, Math.PI * 2);
          ectx.fillStyle = "#111111";
          ectx.fill();
          // highlight
          ectx.beginPath();
          ectx.arc(hx + pupilX * 1.35, hy + pupilY * 1.35, 2.4, 0, Math.PI * 2);
          ectx.fillStyle = "#ffffff";
          ectx.fill();
        };
        drawEye(EYE.left.x, EYE.left.y, clamp(eyePos.current.lx), clamp(eyePos.current.ly));
        drawEye(EYE.right.x, EYE.right.y, clamp(eyePos.current.rx), clamp(eyePos.current.ry));
      }

      // Container 3D tilt — the whole composite tips toward the cursor.
      wrap.style.transform =
        `perspective(900px) rotateY(${(shx * TILT_Y).toFixed(2)}deg) ` +
        `rotateX(${(-shy * TILT_X).toFixed(2)}deg)`;

      // Directional shading: faint shadow falls on the far side of a turn.
      const light = lightRef.current;
      if (light) {
        const mag = Math.min(0.12, Math.abs(shx) * 0.12 + Math.abs(shy) * 0.05);
        light.style.opacity = mag.toFixed(3);
        const sign = shx < 0 ? -1 : 1;
        if (sign !== lightSign.current) {
          lightSign.current = sign;
          light.style.transform = sign < 0 ? "scaleX(-1)" : "scaleX(1)";
        }
      }

      // Test/AT hooks: smoothed gaze + active mode (throttled to changes).
      const stamp = `${shx.toFixed(2)},${shy.toFixed(2)}`;
      if (stamp !== gazeStamp.current) {
        gazeStamp.current = stamp;
        wrap.dataset.gaze = stamp;
      }
      const mstamp = `${modeRef.current}:${viewsRef.current.length}`;
      if (mstamp !== modeStamp.current) {
        modeStamp.current = mstamp;
        wrap.dataset.mode = modeRef.current;
        wrap.dataset.views = String(viewsRef.current.length);
      }

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
    <div
      ref={wrapRef}
      id="interactive-portrait"
      className="relative mx-auto w-full max-w-[320px]"
      style={{ transform: "perspective(900px)", willChange: "transform" }}
    >
      {/* Base portrait (directional views, or body anchor + turning head). */}
      <canvas
        ref={baseRef}
        width={LW}
        height={LH}
        aria-hidden="true"
        className="block w-full"
        style={{ background: "transparent" }}
      />
      {/* Eye-tracking overlay (single-image mode; views carry their own eyes). */}
      <canvas
        ref={eyeRef}
        width={LW}
        height={LH}
        aria-hidden="true"
        className="absolute left-0 top-0 block w-full"
        style={{ background: "transparent" }}
      />
      {/* Faint directional shading for depth. */}
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.10), transparent 55%)",
          opacity: 0,
        }}
      />
    </div>
  );
}

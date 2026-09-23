import { useEffect, useRef, useState } from "react";

/**
 * Cursor-reactive portrait built from the 9 directional PNG views.
 *
 * The pointer position relative to the portrait's bounding box maps to a
 * normalized gaze vector (−1..1 per axis). Bilinear weights over the 3×3 view
 * grid crossfade the layers every animation frame — refs + CSS opacity only,
 * so pointer movement never triggers React renders and never moves the
 * portrait itself.
 *
 * All 9 source canvases are mapped into one fixed box (center's 509x534
 * frame) using per-view geometry measured from the actual pixels — uniform
 * scale, no distortion — so the shoulders, baseline, and body width stay
 * pixel-locked while only the gaze direction changes.
 */

type ViewDef = {
  id: string;
  /** Tried in order: exact on-disk name first, then the lowercase alias. */
  srcs: string[];
  /** Gaze grid position: x −1 left … +1 right, y −1 up … +1 down. */
  gx: number;
  gy: number;
  /**
   * Uniform-frame geometry: rendered size/offset as % of the portrait box.
   * Measured (never guessed): every view is uniformly scaled so its shoulder
   * width matches center's, then shifted so its shoulder baseline and
   * shoulder center-x coincide with center's. Center therefore reduces to
   * exactly 100/100/0/0. All layers share one coordinate system, so blends
   * read as one portrait turning its head — the body never moves.
   */
  box: { w: number; h: number; x: number; y: number };
};

/**
 * Source measurements (alpha threshold 64; shoulder width = median opaque-run
 * width over the bottom 11 rows; head width = widest dark run in top 45%):
 *
 *  view         canvas      shoulder px   baseline px   shoulder cx px
 *  center        509 x  534    450           481           255
 *  left          509 x  534    459           482           255
 *  right         509 x  534    455           484           257
 *  up            509 x  534    440           448           254
 *  down          509 x  534    443           452           255
 *  up-left      1535 x 1024   1089          1023           751
 *  up-right     1535 x 1024   1096          1023           801
 *  down-left    1535 x 1024   1117          1023           763
 *  down-right   1535 x 1024   1115          1023           786
 *
 * Diagnosis: the canvases genuinely differ (509x534 cardinals vs 1535x1024
 * diagonals) AND the subject fills ~88% of the cardinal canvases but only
 * ~71-73% of the diagonal ones, with diagonal subjects sitting flush on the
 * canvas bottom edge while center keeps a ~10% bottom margin. Rendering every
 * canvas full-bleed therefore rescales and shifts the body between views.
 * The box values below normalize exactly that away — uniform scale, no
 * distortion, no per-image aesthetic tweaks.
 */
const VIEWS: ViewDef[] = [
  { id: "center", srcs: ["/mascots/center.png"], gx: 0, gy: 0, box: { w: 100, h: 100, x: 0, y: 0 } },
  { id: "left", srcs: ["/mascots/left.png"], gx: -1, gy: 0, box: { w: 98.039, h: 98.039, x: 0.982, y: 1.583 } },
  { id: "right", srcs: ["/mascots/right.png"], gx: 1, gy: 0, box: { w: 98.901, h: 98.901, x: 0.162, y: 0.434 } },
  { id: "up", srcs: ["/mascots/up.png"], gx: 0, gy: -1, box: { w: 102.273, h: 102.273, x: -0.938, y: 4.273 } },
  { id: "down", srcs: ["/mascots/down.png"], gx: 0, gy: 1, box: { w: 101.58, h: 101.58, x: -0.792, y: 4.093 } },
  {
    id: "up-left",
    srcs: ["/mascots/up-left.PNG", "/mascots/up-left.png"],
    gx: -1,
    gy: -1,
    box: { w: 124.616, h: 79.24, x: -10.87, y: 10.912 },
  },
  {
    id: "up-right",
    srcs: ["/mascots/up-right.PNG", "/mascots/up-right.png"],
    gx: 1,
    gy: -1,
    box: { w: 123.821, h: 78.734, x: -14.514, y: 11.418 },
  },
  {
    id: "down-left",
    srcs: ["/mascots/down-left.PNG", "/mascots/down-left.png"],
    gx: -1,
    gy: 1,
    box: { w: 121.493, h: 77.253, x: -10.292, y: 12.897 },
  },
  {
    id: "down-right",
    srcs: ["/mascots/down-right.PNG", "/mascots/down-right.png"],
    gx: 1,
    gy: 1,
    box: { w: 121.711, h: 77.392, x: -12.224, y: 12.758 },
  },
];

/**
 * Positions one layer inside the shared box coordinate system. Percentages
 * keep the mapping exact at any rendered size; maxWidth neutralizes the
 * preflight img rule so layers wider than the box are not clamped.
 */
const boxStyle = (box: ViewDef["box"]) => ({
  position: "absolute" as const,
  width: `${box.w}%`,
  height: `${box.h}%`,
  left: `${box.x}%`,
  top: `${box.y}%`,
  maxWidth: "none",
});

/** Portrait-box widths from centre that map to a full-gaze vector (mouse). */
const REACH = 0.6;
/** Finger-drag pixels from the touch anchor that map to full gaze (touch). */
const TOUCH_RANGE = 130;
/** Neutral zone so the centre view dominates near the middle. */
const DEADZONE = 0.08;
/** Per-frame easing toward the target — subtle inertia, no snapping. */
const EASE = 0.085;
/** Skip opacity writes smaller than this — avoids churn and ghosting. */
const WEIGHT_EPSILON = 0.004;

/** Saturating −1..1 shaping with a dead zone around centre. */
function shapeAxis(v: number): number {
  const c = v < -1 ? -1 : v > 1 ? 1 : v;
  const a = Math.abs(c);
  if (a < DEADZONE) return 0;
  return (c < 0 ? -1 : 1) * ((a - DEADZONE) / (1 - DEADZONE));
}

export type InteractivePortraitProps = {
  /** Accessible label for the portrait. */
  label?: string;
  /** Shown if every directional asset fails to load. */
  fallbackSrc?: string;
  className?: string;
};

export function InteractivePortrait({
  label = "Portrait",
  fallbackSrc = "/profile.png",
  className = "",
}: InteractivePortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  /** Layer images indexed like VIEWS — [0] is the in-flow centre image. */
  const layersRef = useRef<(HTMLImageElement | null)[]>([]);
  /** Per-view index into ViewDef.srcs. */
  const attemptsRef = useRef<number[]>(VIEWS.map(() => 0));
  const failedRef = useRef<Set<string>>(new Set());

  const [base, setBase] = useState<"views" | "fallback" | "error">("views");

  // Capability: fine-pointer desktops with motion allowed get cursor tracking
  // immediately; touch devices arm the same tracking on first touch (see
  // touch effect below). Reduced-motion users always keep a static centre.
  const [capable, setCapable] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });
  // Touch devices start static (overlays not even downloaded); the first
  // touch arms the full interactive layers.
  const [touchReady, setTouchReady] = useState(false);
  // Shared gaze target so the loop, pointer handlers, and touch handlers all
  // read/write one vector without re-rendering.
  const targetRef = useRef({ x: 0, y: 0 });
  // Active touch-drag anchor (relative trackpad-style control). Null fields
  // mean "no finger down".
  const touchDragRef = useRef({ active: false, ax: 0, ay: 0 });
  const motionMQRef = useRef<MediaQueryList | null>(null);

  // Keep capability live — only the media-query change handlers write state.
  useEffect(() => {
    const hoverMQ = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const motionMQ = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!hoverMQ || !motionMQ) return;
    motionMQRef.current = motionMQ;
    const update = () => setCapable(hoverMQ.matches && !motionMQ.matches);
    hoverMQ.addEventListener("change", update);
    motionMQ.addEventListener("change", update);
    return () => {
      hoverMQ.removeEventListener("change", update);
      motionMQ.removeEventListener("change", update);
    };
  }, []);

  // If tracking becomes unavailable mid-session (e.g. reduced motion enabled
  // while the gaze was turned), the loop stops — restore the centre view so
  // the portrait can never be left stuck at a low opacity.
  useEffect(() => {
    if (capable) return;
    const center = layersRef.current[0];
    if (center) center.style.opacity = "1";
  }, [capable, base]);

  // Graceful degradation: try the next path alias, then drop the view from the
  // blend set (weights renormalize over what loaded). Losing centre → profile
  // photo → placeholder, so a missing asset never breaks the hero.
  const handleLayerError = (index: number) => {
    const def = VIEWS[index];
    const attempts = attemptsRef.current;
    const next = attempts[index] + 1;
    if (next < def.srcs.length) {
      attempts[index] = next;
      const el = layersRef.current[index];
      if (el) el.src = def.srcs[next];
      return;
    }
    failedRef.current.add(def.id);
    const el = layersRef.current[index];
    if (el) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
    }
    if (def.id === "center") setBase("fallback");
  };

  // Pointer tracking + blend loop. All hot state lives in refs/closures —
  // pointer events and frames never cause a React render.
  useEffect(() => {
    if (base !== "views" || (!capable && !touchReady)) return;

    const target = targetRef.current;
    const current = { x: 0, y: 0 };
    const last = new Array<number>(VIEWS.length).fill(-1);
    const weights = new Array<number>(VIEWS.length).fill(0);
    let raf = 0;

    // Normalized cursor vector relative to the portrait's bounding box.
    const track = (clientX: number, clientY: number) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width * REACH);
      const ny =
        (clientY - (rect.top + rect.height / 2)) / (rect.height * REACH);
      target.x = shapeAxis(nx);
      target.y = shapeAxis(ny);
    };

    // Leaving the viewport/tab smoothly returns the portrait to centre.
    const reset = () => {
      target.x = 0;
      target.y = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      // Touch uses relative drag-from-anchor control (works anywhere on the
      // page and stays controllable on small screens); mouse keeps absolute
      // cursor-relative tracking.
      if (e.pointerType === "touch") {
        const d = touchDragRef.current;
        if (!d.active || !e.isPrimary) return;
        target.x = shapeAxis((e.clientX - d.ax) / TOUCH_RANGE);
        target.y = shapeAxis((e.clientY - d.ay) / TOUCH_RANGE);
        return;
      }
      track(e.clientX, e.clientY);
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) reset();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("mouseleave", reset);
    document.addEventListener("mouseout", onMouseOut);

    const loop = () => {
      // Ease toward the target (inertia — the gaze follows, never snaps).
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      if (Math.abs(target.x - current.x) < 0.0004) current.x = target.x;
      if (Math.abs(target.y - current.y) < 0.0004) current.y = target.y;

      // Bilinear weights over the 3×3 grid: at most 4 adjacent views are ever
      // visible together, and centre dominates while the cursor stays close.
      const layers = layersRef.current;
      const failed = failedRef.current;
      let total = 0;
      for (let i = 0; i < VIEWS.length; i++) {
        const def = VIEWS[i];
        const el = layers[i];
        const w =
          el && !failed.has(def.id)
            ? Math.max(0, 1 - Math.abs(current.x - def.gx)) *
              Math.max(0, 1 - Math.abs(current.y - def.gy))
            : 0;
        weights[i] = w;
        total += w;
      }
      if (total > 0) {
        for (let i = 0; i < VIEWS.length; i++) {
          const el = layers[i];
          if (!el) continue;
          const w = weights[i] / total;
          if (Math.abs(w - last[i]) > WEIGHT_EPSILON) {
            last[i] = w;
            el.style.opacity = w.toFixed(3);
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("mouseleave", reset);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [base, capable, touchReady]);

  // Touch support (phones/tablets): touching anywhere anchors a relative
  // drag — the gaze follows finger displacement from the anchor, like a
  // trackpad, so control never depends on where the portrait sits. Lifting
  // the finger eases back to centre. A scroll-takeover freeze (pointercancel)
  // intentionally holds the last pose instead of snapping home; the
  // guaranteed touchend/touchcancel below always recenters on lift.
  // Never arms under prefers-reduced-motion.
  useEffect(() => {
    if (base !== "views") return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return;
      if (motionMQRef.current?.matches) return;
      touchDragRef.current = {
        active: true,
        ax: e.clientX,
        ay: e.clientY,
      };
      setTouchReady(true);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return;
      touchDragRef.current.active = false;
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };
    // Touch Events (not Pointer Events) always fire on lift, even after a
    // scroll-takeover cancelled the pointer stream.
    const onTouchEnd = () => {
      touchDragRef.current.active = false;
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [base]);

  if (base === "error") {
    return (
      <div
        className={`flex aspect-[509/534] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 ${className} dark:border-neutral-800 dark:bg-neutral-900`}
      >
        <span className="font-pixel text-lg text-neutral-400">
          photo unavailable
        </span>
      </div>
    );
  }

  if (base === "fallback") {
    return (
      <div
        ref={wrapRef}
        role="img"
        aria-label={label}
        className={`relative mx-auto w-full select-none ${className}`}
      >
        <img
          src={fallbackSrc}
          alt=""
          width={509}
          height={534}
          decoding="async"
          draggable={false}
          className="block h-auto w-full"
          onError={() => setBase("error")}
        />
      </div>
    );
  }

  return (
    // Touch-control surface: pointer-events-auto + touch-none keeps the
    // browser from hijacking portrait gestures for scroll/selection, so the
    // full pointermove stream reaches us. Touches starting anywhere else on
    // the page still scroll normally. Callout disabled so long-presses don't
    // pop up image menus either.
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={`pointer-events-auto relative mx-auto aspect-[509/534] w-full touch-none select-none overflow-hidden ${className}`}
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* Centre view — same uniform frame as every layer. Its measured
          geometry is exactly full-bleed, which is what fixes the box aspect
          for the other eight views. */}
      <img
        ref={(el) => {
          layersRef.current[0] = el;
        }}
        src={VIEWS[0].srcs[0]}
        alt=""
        width={509}
        height={534}
        decoding="async"
        draggable={false}
        style={boxStyle(VIEWS[0].box)}
        onError={() => handleLayerError(0)}
      />
      {/* Directional overlays — each mapped from its own measured source
          geometry into the identical box, so crossfades read as one coherent
          portrait. Mounted for cursor tracking, or on touch devices from
          the first touch on (untouched phones never download them). */}
      {(capable || touchReady) &&
        VIEWS.slice(1).map((def, k) => {
          const i = k + 1;
          return (
            <img
              key={def.id}
              ref={(el) => {
                layersRef.current[i] = el;
              }}
              src={def.srcs[0]}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable={false}
              style={{ ...boxStyle(def.box), opacity: 0 }}
              onError={() => handleLayerError(i)}
            />
          );
        })}
    </div>
  );
}

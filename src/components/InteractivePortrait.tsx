import { useEffect, useRef, useState } from "react";

/**
 * Cursor-reactive portrait built from the 9 directional PNG views.
 *
 * The pointer position relative to the portrait's bounding box maps to a
 * normalized gaze vector (−1..1 per axis). Bilinear weights over the 3×3 view
 * grid crossfade the layers every animation frame — refs + CSS opacity only,
 * so pointer movement never triggers React renders and never moves the
 * portrait itself.
 */

type ViewDef = {
  id: string;
  /** Tried in order: exact on-disk name first, then the lowercase alias. */
  srcs: string[];
  /** Gaze grid position: x −1 left … +1 right, y −1 up … +1 down. */
  gx: number;
  gy: number;
};

const VIEWS: ViewDef[] = [
  { id: "center", srcs: ["/mascots/center.png"], gx: 0, gy: 0 },
  { id: "left", srcs: ["/mascots/left.png"], gx: -1, gy: 0 },
  { id: "right", srcs: ["/mascots/right.png"], gx: 1, gy: 0 },
  { id: "up", srcs: ["/mascots/up.png"], gx: 0, gy: -1 },
  { id: "down", srcs: ["/mascots/down.png"], gx: 0, gy: 1 },
  {
    id: "up-left",
    srcs: ["/mascots/up-left.PNG", "/mascots/up-left.png"],
    gx: -1,
    gy: -1,
  },
  {
    id: "up-right",
    srcs: ["/mascots/up-right.PNG", "/mascots/up-right.png"],
    gx: 1,
    gy: -1,
  },
  {
    id: "down-left",
    srcs: ["/mascots/down-left.PNG", "/mascots/down-left.png"],
    gx: -1,
    gy: 1,
  },
  {
    id: "down-right",
    srcs: ["/mascots/down-right.PNG", "/mascots/down-right.png"],
    gx: 1,
    gy: 1,
  },
];

/** Portrait-box widths from centre that map to a full-gaze vector. */
const REACH = 0.6;
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

  // Capability: fine-pointer desktops with motion allowed get cursor tracking;
  // touch/coarse pointers and reduced-motion users keep a static centre view.
  const [capable, setCapable] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  // Keep capability live — only the media-query change handlers write state.
  useEffect(() => {
    const hoverMQ = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const motionMQ = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!hoverMQ || !motionMQ) return;
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
    if (base !== "views" || !capable) return;

    const target = { x: 0, y: 0 };
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
    const onPointerMove = (e: PointerEvent) => track(e.clientX, e.clientY);
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
  }, [base, capable]);

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
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={`pointer-events-none relative mx-auto w-full select-none ${className}`}
    >
      {/* Centre view — in-flow so it alone defines the portrait's box. */}
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
        className="block h-auto w-full"
        onError={() => handleLayerError(0)}
      />
      {/* Directional overlays — cover-cropped to the centre view's frame so
          crossfades read as one coherent portrait. Mounted only when cursor
          tracking is active (touch devices never download them). */}
      {capable &&
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
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0 }}
              onError={() => handleLayerError(i)}
            />
          );
        })}
    </div>
  );
}

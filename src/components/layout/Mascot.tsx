import { useEffect, useRef, useState, useCallback } from "react"
import type { CSSProperties } from "react"

const DIRECTIONS = [
  "up-left",
  "up",
  "up-right",
  "left",
  "center",
  "right",
  "down-left",
  "down",
  "down-right",
] as const

const REACTIONS = [
  "blink",
  "heart",
  "sparkle",
  "surprised",
  "wink",
  "bashful",
  "sleepy",
  "dizzy",
  "delighted",
] as const

type Direction = (typeof DIRECTIONS)[number]
type Reaction = (typeof REACTIONS)[number]

// Clockwise from the right, matching atan2 with y pointing down.
const CLOCKWISE: Direction[] = [
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
  "up",
  "up-right",
]
const SECTOR = (Math.PI * 2) / CLOCKWISE.length
const HYSTERESIS = 0.12
const DEAD_ZONE = 70

const PAYOFFS: Reaction[] = ["heart", "sparkle", "delighted"]
const BOOP_PAYOFF = 120
const BOOP_END = 560
const SQUASH_MS = 420
const DIZZY_AFTER = 4
const DIZZY_WINDOW = 1600
const DIZZY_END = 1100

const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
]

function cell(index: number): CSSProperties {
  return { backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` }
}

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle))
}

const layer: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "300% 300%",
  backgroundRepeat: "no-repeat",
}

export type MascotProps = {
  directions: string
  reactions: string
  size?: number
  className?: string
  label?: string
}

/**
 * Cursor-reactive page mascot.
 *
 * Smoothly interpolates between the 9 directional sectors using
 * an angle-based lerp each frame. Returns to center when the cursor
 * leaves the dead-zone. Supports reduced-motion and touch devices.
 */
export function Mascot(props: MascotProps) {
  const { directions, reactions, size = 140, className, label = "mascot" } = props

  const buttonRef = useRef<HTMLButtonElement>(null)
  const squashRef = useRef<HTMLSpanElement>(null)
  const timersRef = useRef<number[]>([])
  const boopsRef = useRef({ count: 0, at: 0 })

  const [displayDir, setDisplayDir] = useState<Direction>("center")
  const [reaction, setReaction] = useState<Reaction | null>(null)

  const targetAngleRef = useRef(0)
  const currentAngleRef = useRef(0)
  const currentSectorRef = useRef(-1)
  const rafRef = useRef<number>(0)

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const prefersHover =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const btn = buttonRef.current
      if (!btn) return

      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        currentSectorRef.current = -1
        targetAngleRef.current = 0
        return
      }

      const angle = Math.atan2(dy, dx)

      if (
        currentSectorRef.current !== -1 &&
        Math.abs(wrap(angle - currentSectorRef.current * SECTOR)) <
          SECTOR / 2 + HYSTERESIS
      ) {
        return
      }

      currentSectorRef.current =
        (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length
      targetAngleRef.current = angle
    },
    []
  )

  // Interpolation loop.
  useEffect(() => {
    if (!prefersHover) {
      setDisplayDir("center")
      return
    }

    const loop = () => {
      if (reducedMotion) {
        const sector = (Math.round(targetAngleRef.current / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length
        setDisplayDir(CLOCKWISE[sector])
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const speed = 0.08
      let diff = targetAngleRef.current - currentAngleRef.current
      if (diff > Math.PI) diff -= 2 * Math.PI
      if (diff < -Math.PI) diff += 2 * Math.PI

      currentAngleRef.current += diff * speed

      if (Math.abs(diff) < 0.03) {
        const snappedSector = Math.round(currentAngleRef.current / SECTOR)
        currentAngleRef.current = snappedSector * SECTOR
      }

      const sector =
        (Math.round(currentAngleRef.current / SECTOR) + CLOCKWISE.length) %
        CLOCKWISE.length
      setDisplayDir(CLOCKWISE[sector])

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafRef.current)
  }, [prefersHover, reducedMotion])

  // Pointer events.
  useEffect(() => {
    if (!prefersHover) return

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [prefersHover, onPointerMove])

  // Return to center when pointer leaves the window or tab loses focus.
  useEffect(() => {
    const onLeave = () => {
      targetAngleRef.current = 0
      currentSectorRef.current = -1
    }

    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("blur", onLeave)
    document.addEventListener("mouseout", (e: MouseEvent) => {
      if (!(e.relatedTarget as Node)) onLeave()
    })

    return () => {
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("blur", onLeave)
      document.removeEventListener("mouseout", () => {})
    }
  }, [])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout)
    }
  }, [])

  const boop = () => {
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []

    const later = (ms: number, next: Reaction | null) => {
      timersRef.current.push(window.setTimeout(() => setReaction(next), ms))
    }

    const now = Date.now()
    const boops = boopsRef.current
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1
    boops.at = now

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0
      setReaction("dizzy")
      later(DIZZY_END, null)
    } else {
      setReaction("blink")
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length])
      later(BOOP_END, null)
    }

    if (reducedMotion) return
    squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: "linear" })
  }

  const dirIndex = DIRECTIONS.indexOf(displayDir)
  const reactionIndex = REACTIONS.indexOf(reaction ?? "blink")

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={boop}
      aria-label={`Boop the ${label}`}
      className={className}
      style={{
        position: "relative",
        display: "block",
        flexShrink: 0,
        width: size,
        height: size,
        padding: 0,
        border: 0,
        background: "transparent",
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        ref={squashRef}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          transformOrigin: "50% 78%",
        }}
      >
        <span
          style={{
            ...layer,
            backgroundImage: `url(${directions})`,
            ...cell(dirIndex),
            opacity: reaction ? 0 : 1,
          }}
        />
        <span
          style={{
            ...layer,
            backgroundImage: `url(${reactions})`,
            ...cell(reactionIndex),
            opacity: reaction ? 1 : 0,
          }}
        />
      </span>
    </button>
  )
}

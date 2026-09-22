import { useMemo } from "react";
import { socials } from "../../data/socials";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

/**
 * Decorative contribution-style dot grid (original, deterministic — no API calls).
 * Links to GitHub so it's honest, not fake data.
 */
export function GithubStrip() {
  const github = socials.find((s) => s.icon === "github" && s.href)?.href ?? "https://github.com";

  const cells = useMemo(() => {
    // Deterministic pseudo-levels (no API, no randomness) so output is stable.
    return Array.from({ length: 7 * 26 }, (_, i) => {
      const h = ((i * 2654435761) % 1000) / 1000;
      const level = h > 0.86 ? 3 : h > 0.62 ? 2 : h > 0.35 ? 1 : 0;
      return { i, level };
    });
  }, []);

  const size = (l: number) => (l === 0 ? 2.2 : l === 1 ? 5.4 : l === 2 ? 7.6 : 9.6);
  const opacity = (l: number) => (l === 0 ? 0.12 : 0.92);

  return (
    <section aria-labelledby="github-h" className="py-12">
      <Reveal>
        <SectionHeading index="10" title="github" />
        <h3 id="github-h" className="sr-only">
          GitHub activity
        </h3>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          aria-label="Open GitHub profile (stylized activity illustration)"
        >
          <svg
            viewBox="0 0 689 91"
            role="img"
            aria-hidden="true"
            className="h-auto w-full text-neutral-900 transition-opacity group-hover:opacity-80 dark:text-neutral-100"
            preserveAspectRatio="xMidYMid meet"
          >
            {cells.map(({ i, level }) => {
              const col = Math.floor(i / 7);
              const row = i % 7;
              return (
                <circle
                  key={i}
                  cx={6.5 + col * 13}
                  cy={6.5 + row * 13}
                  r={size(level) / 2}
                  fill="currentColor"
                  opacity={opacity(level)}
                />
              );
            })}
          </svg>
          <span className="mt-2 block font-mono text-[11px] text-neutral-400">
            Stylized illustration — see live contributions on GitHub ↗
          </span>
        </a>
      </Reveal>
    </section>
  );
}

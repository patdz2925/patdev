import { Award, BadgeCheck } from "lucide-react";
import { achievements, testimonials } from "../../data/achievements";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function Achievements() {
  return (
    <section id="achievements" aria-labelledby="ach-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="08" title="achievements" />
        <h3 id="ach-h" className="sr-only">
          Achievements
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {achievements.map((a) => {
            const inner = (
              <>
                <Award className="h-5 w-5 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
                <h4 className="mt-3 text-[13px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                  {a.title}
                </h4>
                <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-neutral-400">
                  {a.issuer} · {a.date}
                </p>
                {a.description ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {a.description}
                  </p>
                ) : null}
                {a.url ? (
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verify
                  </span>
                ) : null}
              </>
            );
            const cls =
              "group relative flex flex-col rounded-xl bg-gradient-to-b from-neutral-50 to-white px-4 py-5 shadow-[0_8px_22px_-14px_rgba(10,10,10,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.4)] dark:from-neutral-900 dark:to-neutral-950";
            return a.url ? (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800`}
              >
                {inner}
              </a>
            ) : (
              <div
                key={a.id}
                className={`${cls} border border-neutral-100 dark:border-neutral-800/60`}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h4 className="mb-4 mt-10 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          Kind words
        </h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-xl bg-gradient-to-b from-neutral-50 to-white p-5 shadow-[0_8px_22px_-16px_rgba(10,10,10,0.2)] dark:from-neutral-900 dark:to-neutral-950"
            >
              <svg className="h-5 w-5 text-neutral-200 dark:text-neutral-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 7H6a3 3 0 00-3 3v1a3 3 0 003 3h1v1a2 2 0 01-2 2H4v2h1a4 4 0 004-4V7zm11 0h-3a3 3 0 00-3 3v1a3 3 0 003 3h1v1a2 2 0 01-2 2h-1v2h1a4 4 0 004-4V7z" />
              </svg>
              <blockquote className="rec-quote mt-2 line-clamp-5 flex-1 text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <div
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-mono text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-neutral-900 dark:text-neutral-100">{t.name}</div>
                  <div className="truncate font-mono text-[9px] uppercase tracking-wider text-neutral-400">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

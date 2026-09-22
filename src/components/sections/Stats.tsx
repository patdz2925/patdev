import { ArrowUpRight } from "lucide-react";
import { profile } from "../../data/profile";
import { Reveal } from "../layout/Reveal";

/** Reference-style stat strip: pixel value + mono label, divided grid. */
export function Stats() {
  return (
    <Reveal>
      <section
        aria-label="Highlights"
        className="grid grid-cols-2 divide-x divide-y divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4 sm:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800"
      >
        {profile.stats.map((s) => (
          <div key={s.label} className="py-6 pr-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
            <a href={s.href ?? "#about"} className="group block text-left">
              <span className="flex items-center gap-1">
                <span className="font-pixel text-lg leading-none text-neutral-900 dark:text-neutral-100">
                  {s.value}
                </span>
                <ArrowUpRight
                  className="h-3 w-3 -translate-y-1 text-neutral-300 transition-all group-hover:-translate-y-1.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100">
                {s.label}
              </span>
            </a>
          </div>
        ))}
      </section>
    </Reveal>
  );
}

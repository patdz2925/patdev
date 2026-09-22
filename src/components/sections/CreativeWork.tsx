import { Clapperboard, ArrowUpRight } from "lucide-react";
import { creativeWork } from "../../data/achievements";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function CreativeWork() {
  return (
    <section id="creative" aria-labelledby="creative-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="06" title="creative / edits" />
        <h3 id="creative-h" className="sr-only">
          Creative work
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {creativeWork.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.35)] dark:border-neutral-800 dark:bg-neutral-950"
            >
              <Clapperboard className="h-5 w-5 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">{c.kind}</p>
              <h4 className="mt-1 text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">{c.title}</h4>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {c.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-fit items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Watch <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-neutral-400">
          Paste YouTube / Drive links into <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">src/data/achievements.ts → creativeWork</code> to make cards link out.
        </p>
      </Reveal>
    </section>
  );
}

import { experience } from "../../data/experience";
import { stackHighlights } from "../../data/skills";
import { SectionHeading, SectionLink } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="04" title="experience" action={<SectionLink href="#contact">full history →</SectionLink>} />
        <h3 id="exp-h" className="sr-only">
          Experience
        </h3>
        <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {experience.map((e) => (
            <div
              key={e.id}
              className="group grid grid-cols-12 items-baseline gap-x-3 gap-y-1 py-3.5 transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-900/60"
            >
              <div className="col-span-3 font-mono text-[11px] text-neutral-400 sm:col-span-2">{e.period}</div>
              <div className="col-span-9 text-[14px] font-medium text-neutral-900 sm:col-span-6 dark:text-neutral-100">
                {e.role}
                {e.summary ? (
                  <span className="mt-0.5 block text-[13px] font-normal leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {e.summary}
                  </span>
                ) : null}
              </div>
              <div className="col-span-12 text-[13px] text-neutral-500 sm:col-span-4 sm:text-right dark:text-neutral-400">
                {e.org}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="mb-4 flex items-baseline justify-between">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Stack</h4>
            <SectionLink href="#skills">view all →</SectionLink>
          </div>
          <div className="flex flex-wrap gap-2">
            {stackHighlights.map((s) => (
              <span
                key={s}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[12px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

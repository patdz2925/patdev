import { skillGroups } from "../../data/skills";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="02" title="skills" />
        <h3 id="skills-h" className="sr-only">
          Skills
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div
              key={g.id}
              className="rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-5 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950"
            >
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                {g.title}
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[12px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-neutral-400">
          Honest levels: comfortable with web basics, learning in public with AI + CS fundamentals.
          Edit this in <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">src/data/skills.ts</code>.
        </p>
      </Reveal>
    </section>
  );
}

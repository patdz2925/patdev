import { GraduationCap } from "lucide-react";
import { education } from "../../data/experience";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function Education() {
  return (
    <section id="education" aria-labelledby="edu-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="05" title="education" />
        <h3 id="edu-h" className="sr-only">
          Education
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {education.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-5 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950"
            >
              <div className="flex items-center gap-2 text-neutral-400">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider">{e.period}</span>
              </div>
              <h4 className="mt-3 text-[14px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                {e.program}
              </h4>
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">{e.school}</p>
              {e.details ? (
                <p className="mt-3 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {e.details}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

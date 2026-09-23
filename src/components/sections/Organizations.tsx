import { Users } from "lucide-react";
import { organizations } from "../../data/experience";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function Organizations() {
  return (
    <section id="organizations" aria-labelledby="orgs-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="07" title="organizations" />
        <h3 id="orgs-h" className="sr-only">
          Organizations and leadership
        </h3>
        <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {organizations.map((o) => (
            <div key={o.id} className="flex items-start gap-4 py-4">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                {o.logo ? (
                  <img
                    src={o.logo}
                    alt={`${o.name} logo`}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">{o.name}</h4>
                  <span className="font-mono text-[11px] text-neutral-400">{o.period}</span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">{o.role}</p>
                {o.description ? (
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {o.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

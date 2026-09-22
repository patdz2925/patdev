import { profile } from "../../data/profile";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="01" title="about" />
        <h3 id="about-h" className="sr-only">
          About {profile.name}
        </h3>
        <div className="space-y-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          <p>
            I'm a student who likes making things on the web — and lately, learning how{" "}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
              generative AI
            </strong>{" "}
            fits into that. My projects are small on purpose: each one teaches me one new thing I can
            actually explain.
          </p>
          <p>
            Outside code I edit video for school orgs, which taught me pacing, deadlines, and designing
            for an audience. I want this site to grow with me — from student work now to university,
            professional, and creator work later.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              Currently
            </h4>
            <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              {profile.currently.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              Interests
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.interests.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[12px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Best way to reach me is email — I reply within a couple of days.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { projects, projectCategories, type Project } from "../../data/projects";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";
import { ProjectCard } from "../projects/ProjectCard";
import { ProjectModal } from "../projects/ProjectModal";

/** Spotlight fan of featured projects (reference deck pattern, original code). */
function ProjectDeck({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const [center, setCenter] = useState(0);
  if (items.length === 0) return null;

  const pos = (i: number) => {
    const n = items.length;
    const d = (i - center + n) % n;
    if (d === 0) return "is-center";
    // With 3 items: next = right, prev = left. With more, split halves.
    if (d === 1 || (n > 3 && d < n / 2)) return "is-right";
    return "is-left";
  };
  const go = (dir: 1 | -1) => setCenter((c) => (c + dir + items.length) % items.length);

  return (
    <div>
      <div className="deck" role="group" aria-label="Featured projects">
        {items.map((p, i) => (
          <article
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={`Show ${p.title}`}
            onClick={() => (i === center ? onOpen(p) : setCenter(i))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (i === center) onOpen(p);
                else setCenter(i);
              }
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
            className={`deck-card ${pos(i)} rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950`}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {p.badge ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white dark:bg-neutral-100 dark:text-neutral-900">
                  ✦ {p.badge}
                </span>
              ) : null}
              <span className="rounded-full border border-neutral-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                {p.category}
              </span>
            </div>
            <h3 className="mt-4 font-pixel text-base leading-tight text-neutral-900 dark:text-neutral-100">
              {p.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {p.description}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              {p.technologies.slice(0, 3).join(" · ")}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous featured project"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:hover:text-neutral-100"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="Choose featured project">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === center}
              aria-label={p.title}
              onClick={() => setCenter(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === center ? "w-6 bg-neutral-900 dark:bg-neutral-100" : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next featured project"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:hover:text-neutral-100"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const featured = useMemo(() => projects.filter((p) => p.featured).slice(0, 5), []);
  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" aria-labelledby="projects-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="03" title="projects" />
        <h3 id="projects-h" className="sr-only">
          Projects
        </h3>
        {featured.length > 0 ? (
          <ProjectDeck items={featured.length >= 3 ? featured.slice(0, 3) : featured} onOpen={setSelected} />
        ) : null}
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {projectCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full border px-3 py-1.5 font-mono text-[12px] transition ${
                filter === c
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
            <FolderOpen className="h-6 w-6 text-neutral-300" aria-hidden="true" />
            <p className="mt-3 font-pixel text-sm text-neutral-500">No projects in this category yet</p>
            <p className="mt-1 max-w-xs text-[13px] text-neutral-400">
              Add one in <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">src/data/projects.ts</code> — it appears here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setSelected} />
            ))}
          </div>
        )}
      </Reveal>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

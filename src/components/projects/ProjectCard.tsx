import { ArrowUpRight, Globe, CalendarDays } from "lucide-react";
import { GithubIcon } from "../layout/BrandIcons";
import type { Project } from "../../data/projects";

const statusColor: Record<Project["status"], string> = {
  Live: "bg-emerald-500",
  "In progress": "bg-amber-500",
  Archived: "bg-neutral-400",
  Concept: "bg-sky-500",
};

/** Project banner when one is set — otherwise the gradient initial thumb. */
function Thumb({ project }: { project: Project }) {
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w.replace(/[^A-Za-z]/g, "")[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-400 dark:border-neutral-700"
    >
      {project.image ? (
        <img
          src={project.image}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="halftone halftone-dense absolute inset-0 opacity-20" />
          <span className="relative font-pixel text-2xl text-white">{initials || "✦"}</span>
        </>
      )}
      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-900">
        {project.category}
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.35)] dark:border-neutral-800 dark:bg-neutral-950">
      <Thumb project={project} />

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {project.badge ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white dark:bg-neutral-100 dark:text-neutral-900">
            ✦ {project.badge}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[project.status]}`} aria-hidden="true" />
          {project.status}
        </span>
      </div>

      <h3 className="mt-3 font-pixel text-base leading-tight text-neutral-900 dark:text-neutral-100">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-400">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          {project.date}
        </span>
        <div className="flex items-center gap-1">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            Details <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

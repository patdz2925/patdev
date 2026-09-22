import { useEffect } from "react";
import { X, Globe, CalendarDays, Tag } from "lucide-react";
import { GithubIcon } from "../layout/BrandIcons";
import type { Project } from "../../data/projects";

/**
 * Accessible detail modal for a project.
 * Escape closes, backdrop click closes, focus moves to the dialog on open.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.getElementById("project-modal-title")?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-neutral-950/50 backdrop-blur-sm"
      />
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              {project.category} · {project.status}
            </p>
            <h3
              id="project-modal-title"
              tabIndex={-1}
              className="mt-1 font-pixel text-xl leading-tight text-neutral-900 outline-none dark:text-neutral-100"
            >
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:hover:text-neutral-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          {project.longDescription ?? project.description}
        </p>

        {project.highlights?.length ? (
          <ul className="mt-4 space-y-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-2 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300"
              >
                <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-4 font-mono text-[12px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {project.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" /> {project.technologies.join(" · ")}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
            >
              <Globe className="h-4 w-4" aria-hidden="true" /> Live demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-300"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" /> Source code
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

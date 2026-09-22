import { ArrowUp } from "lucide-react";
import { profile } from "../../data/profile";
import { socials, iconMap } from "../../data/socials";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-200 py-10 dark:border-neutral-800">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-pixel text-[13px] text-neutral-900 dark:text-neutral-100">{profile.name}</p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {profile.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials
              .filter((s) => s.href)
              .map((s) => {
                const Icon = iconMap[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                );
              })}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href="#home"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <p className="font-mono text-[11px] text-neutral-400">
            © {year} {profile.name} · Built with React + Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Mail } from "lucide-react";
import { primaryNav, secondaryNav } from "../../data/navigation";
import { profile } from "../../data/profile";
import { featuredSocials, iconMap } from "../../data/socials";
import { ThemeSwitch } from "./ThemeSwitch";

/**
 * Fixed left sidebar on lg+ screens (reference pattern).
 * Groups: primary anchors with icons, secondary anchors plain, contact footer.
 */
export function Sidebar({ active }: { active: string }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-neutral-200 bg-white px-7 py-8 lg:flex dark:border-neutral-800 dark:bg-neutral-950"
    >
      <a
        href="#home"
        className="shrink-0 font-pixel text-[15px] leading-none text-neutral-900 hover:opacity-60 dark:text-neutral-100"
      >
        {profile.name}
      </a>

      <div className="mt-9 flex flex-1 flex-col gap-4 overflow-y-auto font-mono text-[13px]">
        <div className="flex flex-col gap-2.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative inline-flex w-fit items-center gap-2.5 transition-colors ${
                  isActive
                    ? "font-medium text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }`}
              >
                {Icon ? <Icon className="h-[1.15em] w-[1.15em] shrink-0" aria-hidden="true" /> : null}
                {item.label}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neutral-900 dark:bg-neutral-100"
                  />
                ) : null}
              </a>
            );
          })}
        </div>

        <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

        <div className="flex flex-col gap-2.5">
          {secondaryNav.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative inline-flex w-fit items-center gap-2.5 transition-colors ${
                  isActive
                    ? "font-medium text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <ThemeSwitch />
        <span className="font-mono text-[10px] text-neutral-400">
          <span className="pulse-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          {profile.availability.split(",")[0]}
        </span>
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <p className="text-[12px] leading-relaxed text-neutral-400">
          For work, collabs &amp; everything else, reach me at
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-1.5 inline-flex w-fit items-center gap-2 font-mono text-[13px] text-neutral-900 hover:text-neutral-500 dark:text-neutral-100 dark:hover:text-neutral-400"
        >
          <Mail className="h-[1.15em] w-[1.15em] shrink-0" aria-hidden="true" />
          <span className="break-all">{profile.email}</span>
        </a>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-neutral-400">
          {featuredSocials.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">{s.label}</span>
                <span aria-hidden="true">{s.label.toLowerCase()} ↗</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

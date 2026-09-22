import { MapPin } from "lucide-react";
import { profile } from "../../data/profile";
import { featuredSocials } from "../../data/socials";

/** Initials fallback when no photo is set */
function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950"
    >
      <div className="text-center">
        <div className="font-pixel text-5xl text-neutral-900 dark:text-neutral-100">{initials}</div>
        <div className="halftone halftone-wide mask-fade-x mt-4 h-6 w-32 opacity-20" />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
          add photo at /profile.jpg
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-name" className="relative scroll-mt-20 pt-14 pb-12 sm:pt-20">
      <div className="grid gap-9 sm:grid-cols-[16rem_1fr] sm:items-start sm:gap-10">
        <div className="reveal d1 mx-auto w-full max-w-[16rem] sm:mx-0">
          <div className="relative">
            <img
              src={profile.avatarSrc}
              alt={profile.avatarAlt}
              width={288}
              height={360}
              loading="eager"
              onError={(e) => {
                // Graceful fallback: hide broken img, show initials instead
                (e.target as HTMLImageElement).style.display = "none";
                document.getElementById("avatar-fallback")?.classList.remove("hidden");
              }}
              className="aspect-[4/5] w-full rounded-2xl border border-neutral-200 object-cover dark:border-neutral-800"
            />
            <div id="avatar-fallback" className="hidden">
              <InitialsAvatar name={profile.name} />
            </div>
            <div
              aria-hidden="true"
              className="halftone-fine mask-bl pointer-events-none absolute -bottom-8 -left-6 h-24 w-32 opacity-25"
            />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-neutral-400 sm:justify-start">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {profile.location}
          </p>
        </div>

        <div>
          <p className="reveal d1 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {profile.availability}
          </p>
          <h1 id="hero-name" className="reveal d2 mt-4 font-pixel text-3xl leading-none text-neutral-900 sm:text-[2.6rem] dark:text-neutral-50">
            {profile.name}
          </h1>
          <p className="reveal d3 mt-2 font-mono text-[12px] uppercase tracking-wider text-neutral-400">
            {profile.role}
          </p>

          {profile.intro.map((p, i) => (
            <p
              key={i}
              className={`reveal ${i === 0 ? "d3" : "d4"} mt-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300`}
            >
              {p}
            </p>
          ))}

          <div className="reveal d5 mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[12px] text-neutral-500 dark:text-neutral-400">
            {featuredSocials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {s.label.toLowerCase()} ↗
              </a>
            ))}
          </div>

          <div className="reveal d5 mt-6 flex flex-wrap gap-2.5">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { primaryNav, secondaryNav } from "../../data/navigation";
import { profile } from "../../data/profile";
import { ThemeSwitch } from "./ThemeSwitch";

export function MobileHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-md lg:hidden dark:border-neutral-800/70 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <a href="#home" className="font-pixel text-[14px] text-neutral-900 dark:text-neutral-100">
          {profile.name}
        </a>
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open menu"
          className="-mr-1 p-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() =>
        document.getElementById("mobileNav")?.classList.add("is-open")
      );
    } else if (visible) {
      document.getElementById("mobileNav")?.classList.remove("is-open");
      const t = setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = "";
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open, visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!visible && !open) return null;

  return (
    <div
      id="mobileNav"
      className={`${open ? "flex" : "hidden"} fixed inset-0 z-[60] flex-col bg-white lg:hidden dark:bg-neutral-950`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-3 dark:border-neutral-800">
        <a href="#home" onClick={onClose} className="font-pixel text-[14px] text-neutral-900 dark:text-neutral-100">
          {profile.name}
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-1 p-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8 font-mono text-[16px]">
        <nav aria-label="Mobile" className="mnav-group flex flex-col gap-4" style={{ transitionDelay: "0.05s" }}>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="relative inline-flex w-fit items-center gap-3 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
              >
                {Icon ? <Icon className="h-[1.15em] w-[1.15em]" aria-hidden="true" /> : null}
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="my-5 h-px bg-neutral-200 dark:bg-neutral-800" />
        <nav aria-label="Mobile more" className="mnav-group flex flex-col gap-4" style={{ transitionDelay: "0.12s" }}>
          {secondaryNav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="relative inline-flex w-fit items-center gap-3 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="my-5 h-px bg-neutral-200 dark:bg-neutral-800" />
        <div className="mnav-group flex flex-col gap-5" style={{ transitionDelay: "0.18s" }}>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
          </div>
          <div>
            <p className="text-[12px] leading-relaxed text-neutral-400">
              For work, collabs &amp; everything else, reach me at
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-1.5 inline-flex w-fit items-center gap-2 text-[14px] text-neutral-900 hover:text-neutral-500 dark:text-neutral-100"
            >
              <Mail className="h-[1.15em] w-[1.15em]" aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

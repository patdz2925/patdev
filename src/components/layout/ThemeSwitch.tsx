import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const options = [
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
] as const;

export function ThemeSwitch() {
  const { pref, setPref } = useTheme();
  return (
    <div
      className="inline-flex items-center gap-[1px] rounded-full border border-neutral-200 p-[2px] dark:border-neutral-800"
      role="group"
      aria-label="Theme"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPref(value)}
          title={label}
          aria-label={label}
          aria-pressed={pref === value}
          className={`inline-flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full transition-colors ${
            pref === value
              ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
              : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          <Icon className="h-[13px] w-[13px]" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

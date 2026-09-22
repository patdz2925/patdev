/**
 * Numbered section heading in the reference style: pixel, gray, "01 — about".
 */
export function SectionHeading({
  index,
  title,
  action,
}: {
  index: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <h2 className="font-pixel text-sm text-neutral-400 dark:text-neutral-500">
        {index} — {title}
      </h2>
      {action}
    </div>
  );
}

export function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    >
      {children}
    </a>
  );
}

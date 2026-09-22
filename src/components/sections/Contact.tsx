import { useState } from "react";
import { Copy, Check, Mail, Download, Send } from "lucide-react";
import { profile } from "../../data/profile";
import { socials, iconMap } from "../../data/socials";
import { SectionHeading } from "../layout/SectionHeading";
import { Reveal } from "../layout/Reveal";

/** Build a plain-text resume from site data so "Download CV" always works. */
function buildResumeText(): string {
  const lines = [
    profile.name,
    profile.role,
    `${profile.location} · ${profile.email}`,
    "",
    "ABOUT",
    ...profile.intro,
    "",
    "CURRENTLY",
    ...profile.currently.map((c) => `- ${c}`),
    "",
    "INTERESTS",
    profile.interests.join(", "),
    "",
    "LINKS",
    ...socials.filter((s) => s.href).map((s) => `- ${s.label}: ${s.href}`),
    "",
    `Generated from ${profile.name}'s portfolio. Edit src/data/*.ts to customize.`,
  ];
  return lines.join("\n");
}

export function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions) — select fallback
      window.prompt("Copy your email:", profile.email);
    }
  };

  const downloadResume = () => {
    // If a real PDF is provided, use it. Otherwise generate a .txt from data.
    if (profile.resumeUrl) {
      const a = document.createElement("a");
      a.href = profile.resumeUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    const blob = new Blob([buildResumeText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = profile.resumeFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /** Send the message straight to the inbox via FormSubmit (no mail app needed). */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    const from = name.trim();
    if (!text || status === "sending") return;
    setStatus("sending");
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${profile.email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: from || "Portfolio visitor",
            message: text,
            _subject: `Portfolio inquiry${from ? ` from ${from}` : ""}`,
            _template: "table",
            _captcha: "false",
          }),
          signal: ctrl.signal,
        }
      );
      if (!res.ok) throw new Error(`send failed: ${res.status}`);
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-h" className="scroll-mt-20 py-12">
      <Reveal>
        <SectionHeading index="09" title="contact" />
        <h3 id="contact-h" className="font-pixel text-xl leading-none text-neutral-900 dark:text-neutral-100">
          Say hello
        </h3>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          The fastest way to reach me is email. Use the form and it opens your mail app
          pre-filled — nothing is sent to a server.
        </p>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Email</p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-w-0 items-center gap-2 font-mono text-[13px] text-neutral-900 hover:text-neutral-500 dark:text-neutral-100"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="break-all">{profile.email}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email"}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:hover:text-neutral-100"
              >
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            </div>
            {copied ? (
              <p role="status" className="mt-1 font-mono text-[11px] text-emerald-600">
                Copied to clipboard
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {socials
                .filter((s) => s.href && s.icon !== "email")
                .map((s) => {
                  const Icon = iconMap[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 font-mono text-[12px] text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {s.label}
                    </a>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={downloadResume}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CV
            </button>
            <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-neutral-400">
              {profile.resumeUrl
                ? "Downloads your PDF from /public."
                : "No PDF yet — generates a tidy .txt from your data files. Add public/resume.pdf + set resumeUrl to use a designed CV."}
            </p>
          </div>

          <form
            onSubmit={sendMessage}
            className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-5 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950"
          >
            <label htmlFor="contact-name" className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              Your name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Jane from the hackathon"
              autoComplete="name"
              maxLength={60}
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <label htmlFor="contact-msg" className="mt-4 block font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              Message
            </label>
            <textarea
              id="contact-msg"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Hi! I saw your study-buddy project and…"
              rows={5}
              required
              maxLength={2000}
              className="mt-2 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <button
              type="submit"
              disabled={status === "sending" || !message.trim()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-900 bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
            >
              {status === "sending" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
                  />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send message
                </>
              )}
            </button>
            {status === "sent" ? (
              <p role="status" className="mt-2.5 flex items-center gap-1.5 font-mono text-[12px] text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Sent — I&apos;ll get back to you soon.
              </p>
            ) : null}
            {status === "error" ? (
              <p role="alert" className="mt-2.5 font-mono text-[12px] text-red-500">
                Couldn&apos;t send just now. Try again, or email me directly at{" "}
                <a href={`mailto:${profile.email}`} className="underline">
                  {profile.email}
                </a>
                .
              </p>
            ) : null}
          </form>
        </div>
      </Reveal>
    </section>
  );
}

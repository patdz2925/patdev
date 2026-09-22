/**
 * EDIT ME — this is your personal info hub.
 * Change anything here and the whole site updates.
 * No need to touch components to update your name, bio, photo, or stats.
 *
 * TIP for future AI edits: keep this file as the single source of truth
 * for identity content.
 */

export interface ProfileStat {
  value: string;
  label: string;
  /** Optional anchor to scroll to, or external URL */
  href?: string;
}

export const profile = {
  // Shown in sidebar, hero, footer, and <title> fallback
  name: "Your Name",
  firstName: "Your",

  // Short role line under your name
  role: "Aspiring CS / IT Student · Student Developer",

  // Location + availability badge in hero
  location: "Philippines",
  availability: "Open to internships, collabs & student projects",

  // Hero paragraphs — keep them short and personal, 2–3 sentences each.
  intro: [
    "I'm a student developer learning by building. I make small web apps and experiment with generative AI — turning class ideas into things people can actually click.",
    "Right now I'm focused on fundamentals: TypeScript, React, and how to use AI tools well. I also do creative edits on the side.",
  ],

  // Profile photo: put your photo at public/profile.jpg, then set this to "/profile.jpg".
  // Falls back to initials avatar if the file is missing.
  avatarSrc: "/profile.jpg",
  avatarAlt: "Portrait of Your Name",

  email: "you@example.com",

  // Resume: the site generates a printable resume from this data (see Contact section).
  // Optionally link a PDF: put it at public/resume.pdf and set resumeUrl to "/resume.pdf".
  resumeUrl: "",
  resumeFileName: "Your-Name-Resume.txt",

  // One-line summary used for SEO / footer
  tagline: "Student developer building web projects, GenAI experiments, and creative edits.",

  // Four stats under the hero (reference-style). Keep values short.
  stats: [
    { value: "10+", label: "projects built", href: "#projects" },
    { value: "3+", label: "years coding", href: "#experience" },
    { value: "5+", label: "orgs & teams", href: "#organizations" },
    { value: "∞", label: "things learning", href: "#skills" },
  ] as ProfileStat[],

  // "Currently" line in About — update it often, it makes the site feel alive.
  currently: [
    "Studying core CS: data structures, web dev, and databases",
    "Building a GenAI study-buddy side project",
    "Editing shorts / highlight reels for school orgs",
  ],

  interests: ["Web dev", "Generative AI", "Video editing", "UI design", "Hackathons"],
} as const;

export type Profile = typeof profile;

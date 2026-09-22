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
  name: "Patrick Dela Cruz",
  firstName: "Patrick",

  // Short role line under your name
  role: "Grade 12 STEM Student · Developer & Creative",

  // Location + availability badge in hero
  location: "Philippines",
  availability: "Open to collabs & student projects",

  // Hero paragraphs — keep them short and personal, 2–3 sentences each.
  intro: [
    "I'm Patrick, a Grade 12 STEM student at Assumpta Technical High School. I build school projects with GenAI-assisted web development — plus UI design, posters, and infographics.",
    "I also edit short films and run media coverage: photography, reels, and photobooth operations for school events.",
  ],

  // Profile photo: transparent B&W halftone cutout at public/profile.png.
  // Falls back to initials avatar if the file is missing.
  avatarSrc: "/profile.png",
  avatarAlt: "Portrait of Patrick Dela Cruz",

  email: "contact@patrickz.top",

  // Resume: the site generates a printable resume from this data (see Contact section).
  // Optionally link a PDF: put it at public/resume.pdf and set resumeUrl to "/resume.pdf".
  resumeUrl: "",
  resumeFileName: "Patrick-Dela-Cruz-Resume.txt",

  // One-line summary used for SEO / footer
  tagline: "Grade 12 STEM student building school tech projects, designs, and creative edits.",

  // Four stats under the hero. Keep values short and honest.
  stats: [
    { value: "10+", label: "school projects", href: "#projects" },
    { value: "6+", label: "leadership roles", href: "#organizations" },
    { value: "3 yrs", label: "honors", href: "#achievements" },
    { value: "∞", label: "things learning", href: "#skills" },
  ] as ProfileStat[],

  // "Currently" line in About — update it often, it makes the site feel alive.
  currently: [
    "Grade 12 STEM at Assumpta Technical High School",
    "President of the ATecHS Society (SY 2026–2027)",
    "Running school tech + media: Media Bank, reels, photobooths",
  ],

  interests: ["Web dev via GenAI", "UI design", "Posters & infographics", "Short films", "Photography"],
} as const;

export type Profile = typeof profile;

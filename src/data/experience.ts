/**
 * EDIT ME — experience, education, and organizations.
 * Each list renders in its own section. Dates are plain strings on purpose.
 */

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  org: string;
  /** 1–2 lines shown in the row / timeline */
  summary?: string;
  tags?: string[];
}

export interface EducationItem {
  id: string;
  period: string;
  school: string;
  program: string;
  details?: string;
}

export interface OrganizationItem {
  id: string;
  name: string;
  role: string;
  period: string;
  description?: string;
}

export const experience: ExperienceItem[] = [
  {
    id: "freelance-edits",
    period: "2025",
    role: "Freelance Video Editor",
    org: "School orgs & small clients",
    summary: "Edit event recaps and shorts; deliver captioned, platform-ready cuts on deadline.",
    tags: ["Premiere Pro", "CapCut", "Shorts"],
  },
  {
    id: "org-dev",
    period: "2025",
    role: "Web Team Volunteer",
    org: "School organization",
    summary: "Built and maintained the org website; shipped event pages and announcements UI.",
    tags: ["React", "Tailwind"],
  },
  {
    id: "self-directed",
    period: "2024",
    role: "Self-directed Builder",
    org: "Personal projects",
    summary: "Shipped small web apps and GenAI experiments; learned Git, TypeScript, and prompt design.",
    tags: ["TypeScript", "GenAI", "Git"],
  },
];

export const education: EducationItem[] = [
  {
    id: "shs",
    period: "2024 – 2026",
    school: "Your Senior High School",
    program: "STEM / ICT Strand — replace with your school",
    details: "Relevant coursework: programming, research, media arts. Update with honors when they apply.",
  },
  {
    id: "university-goal",
    period: "Goal",
    school: "Target University (e.g. BS Computer Science)",
    program: "Intended: BS CS / IT — replace with your plan",
    details: "This block shows direction, not credentials. Keep it honest: say what you're aiming for.",
  },
];

export const organizations: OrganizationItem[] = [
  {
    id: "coding-club",
    name: "Coding / Robotics Club",
    role: "Member — Projects",
    period: "2024 – present",
    description: "Build demos for exhibits; help run intro-to-code workshops for juniors.",
  },
  {
    id: "media-team",
    name: "School Media Team",
    role: "Video Editor",
    period: "2025 – present",
    description: "Own the edit pipeline for event coverage: ingest, selects, captions, export.",
  },
  {
    id: "community",
    name: "Local Dev Community",
    role: "Volunteer",
    period: "2025 – present",
    description: "Help with setup, registration, and recap edits at meetups and hackathons.",
  },
];

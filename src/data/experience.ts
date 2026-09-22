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
    id: "atechs-president",
    period: "2026",
    role: "President",
    org: "ATecHS Society",
    summary: "Lead the society's tech and media projects; mentor members and run operations.",
    tags: ["Leadership", "Tech projects", "Media"],
  },
  {
    id: "design-editor",
    period: "2023",
    role: "Graphic Designer & Video Editor",
    org: "School projects",
    summary: "Posters, banners, photobooths, logos, shirts, reels, and short films for school needs.",
    tags: ["Design", "Premiere Pro", "Photography"],
  },
  {
    id: "bigkis-writer",
    period: "2024",
    role: "News Writer",
    org: "Bigkis School Publication",
    summary: "News writing in Grade 10, including coverage during an athletic meet.",
    tags: ["News writing", "Coverage"],
  },
  {
    id: "atechs-vp",
    period: "2025",
    role: "Vice President",
    org: "ATecHS Society",
    summary: "Supported society programs and tech projects as Grade 11 VP.",
    tags: ["Leadership", "Programs"],
  },
  {
    id: "badminton-president",
    period: "2024",
    role: "President",
    org: "JHS Badminton Boys Club",
    summary: "Led the club in Grade 10 after serving as VP in Grade 9; named Outstanding Club Member.",
    tags: ["Leadership", "Athletics"],
  },
];

export const education: EducationItem[] = [
  {
    id: "shs",
    period: "2026 – present",
    school: "Assumpta Technical High School",
    program: "Senior High School — STEM, Grade 12 (SY 2026–2027)",
    details: "Currently serving as ATecHS Society President while building school tech and media projects.",
  },
  {
    id: "jhs",
    period: "2023 – 2025",
    school: "Assumpta Technical High School",
    program: "Junior High School — Grades 9 – 10",
    details: "Honors (G9), Honors (G10). Badminton Boys Club VP → President, class officer, Bigkis news writer.",
  },
];

export const organizations: OrganizationItem[] = [
  {
    id: "atechs-society",
    name: "ATecHS Society",
    role: "President — Grade 12, SY 2026–2027 (VP, Grade 11, SY 2025–2026)",
    period: "2025 – present",
    description:
      "Lead school tech and media: Project PiTechs, PrinTECHS, TUKLAS, Media Bank, and photobooth operations. Mentor Grade 10 Computer Programming students.",
  },
  {
    id: "badminton-club",
    name: "JHS Badminton Boys Club",
    role: "President — Grade 10, SY 2024–2025 (VP, Grade 9, SY 2023–2024)",
    period: "2023 – 2025",
    description: "Club leadership plus play — named Outstanding Club Member in Grade 10. Badminton athlete with school athletic involvement.",
  },
  {
    id: "programming",
    name: "Computer Programming",
    role: "President",
    period: "2024 – present",
    description: "Lead programming work and mentor Grade 10 Computer Programming students.",
  },
  {
    id: "class-officer",
    name: "Class Officer",
    role: "Peace Officer → Auditor → Secretary",
    period: "2023 – present",
    description: "Served across class officer roles from JHS into SHS.",
  },
  {
    id: "bigkis",
    name: "Bigkis School Publication",
    role: "News Writer — Grade 10, SY 2024–2025",
    period: "2024 – 2025",
    description: "News writing including coverage during an athletic meet.",
  },
];

/**
 * EDIT ME — add a new project by copying one block below.
 * Everything renders automatically: deck, grid, filters, and detail modal.
 */

export type ProjectCategory = "Web" | "AI" | "Creative" | "Mobile" | "Other";
export type ProjectStatus = "Live" | "In progress" | "Archived" | "Concept";

export interface Project {
  id: string;
  title: string;
  /** One-line pitch */
  description: string;
  /** Longer story shown in the detail modal */
  longDescription?: string;
  category: ProjectCategory;
  technologies: string[];
  /** e.g. "2026" or "Jan 2026" */
  date: string;
  status: ProjectStatus;
  liveUrl?: string;
  githubUrl?: string;
  /** Shown in the spotlight deck at the top of Projects */
  featured?: boolean;
  /** Short badge shown on the card, e.g. "#1 School Tool" */
  badge?: string;
  highlights?: string[];
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Web",
  "AI",
  "Creative",
  "Mobile",
  "Other",
];

export const projects: Project[] = [
  {
  id: "pitechs",
  title: "Project PiTechs",
  description: "School technology project combining programming and creative media.",
  longDescription:
    "One of our school technology projects under the ATecHS Society. Built with a GenAI-assisted workflow — from planning and UI design to the working build. Full write-up to follow.",
  category: "Other",
  technologies: ["GenAI", "Web", "UI Design"],
  date: "2025 – 2026",
  status: "In progress",
  featured: true,
  badge: "School tech",
  highlights: ["GenAI-assisted build", "UI design + programming", "Built with the ATecHS Society"],
  image: "/projects/pitechs.gif",
},
  {
    id: "media-bank",
    title: "Media Bank",
    description: "Shared media library and production pipeline for school projects.",
    longDescription:
      "Our central library for school media: raw footage, photos, graphics, and finished edits — organized so any org project can find what it needs. I help run it alongside photobooth operations and event coverage. Full write-up to follow.",
    category: "Other",
    technologies: ["Media ops", "Photography", "Video"],
    date: "2025 – 2026",
    status: "Live",
    featured: true,
    badge: "Live ops",
    highlights: ["Central media library", "Supports org + class projects", "Tied to event coverage"],
  },
  {
    id: "atechs-reels",
    title: "ATecHS Reels",
    description: "Photography and short-form reels covering school events.",
    longDescription:
      "Event coverage for Assumpta Technical High School: on-the-ground photography plus fast-turnaround reels. Covers games, programs, and org activities — shot, captioned, and posted around the school calendar.",
    category: "Creative",
    technologies: ["Photography", "CapCut", "Premiere Pro"],
    date: "2024 – 2026",
    status: "Live",
    featured: true,
    badge: "Creative",
    highlights: ["Event photography", "Short-form reels", "Captions + fast turnaround"],
  },
  {
    id: "printechs",
    title: "PrinTECHS",
    description: "School technology project — programming with a creative finish.",
    longDescription:
      "A school technology project in the same line as PiTechs: programmed builds with designed presentation. Full write-up to follow.",
    category: "Other",
    technologies: ["GenAI", "Web", "Design"],
    date: "2025 – 2026",
    status: "In progress",
    highlights: ["School technology project", "Design + code"],
  },
  {
    id: "tuklas",
    title: "TUKLAS",
    description: "School technology project exploring new tools and ideas.",
    longDescription:
      "A discovery-driven school technology project — trying new tools and turning them into something the school can use. Full write-up to follow.",
    category: "Other",
    technologies: ["GenAI", "Programming"],
    date: "2025 – 2026",
    status: "In progress",
    highlights: ["Experimental school project", "New tools + ideas"],
  },
  {
    id: "posters-infographics",
    title: "Posters & Infographics",
    description: "Posters, banners, logos, shirts, and infographics for school needs.",
    longDescription:
      "Graphic design for school life: event posters, banners, photobooth backdrops, logos, class shirts, and infographics for class projects. Designed to print well and read fast.",
    category: "Creative",
    technologies: ["Graphic design", "Layout", "Print"],
    date: "2023 – 2026",
    status: "Live",
    highlights: ["Posters, banners, photobooths", "Logos + shirts", "Infographics for class"],
  },
  {
    id: "short-films",
    title: "Short Films",
    description: "Edited short films for school projects and org features.",
    longDescription:
      "Short films cut for school projects: selects, pacing, sound, and captions. Built in Premiere Pro / CapCut with attention to story arc within a few minutes.",
    category: "Creative",
    technologies: ["Premiere Pro", "CapCut", "Story"],
    date: "2024 – 2026",
    status: "Live",
    highlights: ["School short films", "Pacing + sound + captions"],
  },
  {
    id: "photobooth-ops",
    title: "Photobooth Operations",
    description: "Photobooth setup, backdrops, and on-site operations for school events.",
    longDescription:
      "End-to-end photobooth work for school events: backdrop and layout design, setup, shooting, and handover of photos. Runs alongside Media Bank and event coverage.",
    category: "Other",
    technologies: ["Photography", "Design", "Events"],
    date: "2025 – 2026",
    status: "Live",
    highlights: ["Backdrop + layout design", "On-site shooting", "Photo handover"],
  },
];

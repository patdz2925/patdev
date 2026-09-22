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
    id: "study-buddy-ai",
    title: "Study Buddy — AI Quiz Maker",
    description: "Paste class notes, get flashcards and practice quizzes generated on-device-first.",
    longDescription:
      "A study tool I built to stop re-reading notes. Paste a lesson, pick a quiz style, and it generates flashcards + multiple-choice questions. Built with React + TypeScript, with a clean prompt pipeline I can swap between local mock data and a real LLM API later. Next: spaced repetition and shareable decks.",
    category: "AI",
    technologies: ["React", "TypeScript", "Tailwind", "GenAI"],
    date: "2026",
    status: "In progress",
    githubUrl: "https://github.com/yourname",
    featured: true,
    badge: "Featured build",
    highlights: ["Prompt pipeline with swappable providers", "Flashcards + quiz modes", "Local-first mock data"],
  },
  {
    id: "class-portal",
    title: "Class Portal — Org Website",
    description: "Responsive org site with events, members, and announcements.",
    longDescription:
      "Website for a school org: hero, events list, member directory, and a simple announcements feed. I focused on clean typography, mobile nav, and content the org can edit without touching code (data-driven sections).",
    category: "Web",
    technologies: ["React", "Vite", "Tailwind CSS"],
    date: "2025",
    status: "Live",
    liveUrl: "#projects",
    githubUrl: "https://github.com/yourname",
    featured: true,
    badge: "Shipped",
    highlights: ["Data-driven content", "Mobile-first nav", "Accessible components"],
  },
  {
    id: "highlight-reels",
    title: "Highlight Reels — Creative Edits",
    description: "Short-form edits: school events, hype reels, and mini-docs.",
    longDescription:
      "Collection of my editing work: event recaps, hype reels, and a 2-minute mini-doc. Tools: CapCut / Premiere, with attention to pacing, captions, and sound. Each piece below links out when I publish it — for now the cards describe the style and tools so the section is useful even before links exist.",
    category: "Creative",
    technologies: ["Premiere Pro", "CapCut", "After Effects"],
    date: "2024 – 2026",
    status: "Live",
    featured: true,
    badge: "Creative",
    highlights: ["Event recaps", "Captions + sound design", "Thumbnail + hook system"],
  },
  {
    id: "pomodoro-timer",
    title: "Focus Timer — Pomodoro Web App",
    description: "Minimal focus timer with tasks, streaks, and keyboard shortcuts.",
    longDescription:
      "A pomodoro timer I actually use: tasks, session history in localStorage, and keyboard shortcuts (space to start/pause). Small codebase on purpose — easy to read and extend.",
    category: "Web",
    technologies: ["TypeScript", "React", "localStorage"],
    date: "2025",
    status: "Live",
    githubUrl: "https://github.com/yourname",
    highlights: ["Keyboard-first", "Offline, no backend", "Streak tracking"],
  },
  {
    id: "ai-prompt-gallery",
    title: "Prompt Gallery — GenAI Playground",
    description: "A curated gallery of reusable prompts for school + code + content.",
    longDescription:
      "My personal library of prompts that actually work: summarize lessons, debug code, brainstorm video hooks. Each card shows the prompt, when to use it, and what model settings I used. Good example of my GenAI workflow.",
    category: "AI",
    technologies: ["GenAI", "Markdown", "React"],
    date: "2025",
    status: "In progress",
    githubUrl: "https://github.com/yourname",
    highlights: ["40+ tested prompts", "Copy-one-click UX", "Use-case tags"],
  },
  {
    id: "portfolio-v1",
    title: "This Portfolio — Design System",
    description: "This site: sidebar layout, halftone texture, and a reusable project system.",
    longDescription:
      "The site you're reading. React + Vite + TypeScript + Tailwind + Motion + Lucide. Content lives in src/data so future edits don't require touching components. Includes light/dark/system theme, mobile menu, scroll-spy nav, and a project deck + modal system.",
    category: "Web",
    technologies: ["React", "Tailwind", "Motion", "TypeScript"],
    date: "2026",
    status: "Live",
    highlights: ["Centralized data files", "Deck + grid + modal", "Accessible + responsive"],
  },
];

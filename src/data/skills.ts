/**
 * EDIT ME — skills grouped for the Skills section.
 * Keep each group to ~4–8 items so the badges stay readable.
 */

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "web",
    title: "Web development",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vite", "Tailwind CSS", "Git & GitHub"],
  },
  {
    id: "ai",
    title: "GenAI workflow",
    skills: ["Prompt design", "ChatGPT / Claude", "RAG basics", "AI-assisted coding", "Eval by hand"],
  },
  {
    id: "creative",
    title: "Creative & editing",
    skills: ["Premiere Pro", "CapCut", "Captions", "Sound basics", "Thumbnails", "Story pacing"],
  },
  {
    id: "core",
    title: "CS fundamentals",
    skills: ["Python", "Data structures", "Basic SQL", "Problem solving"],
  },
];

/** Flat list used in Experience section ("Stack" strip) */
export const stackHighlights = [
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Python",
  "Git",
  "GenAI",
  "Premiere Pro",
  "CapCut",
];

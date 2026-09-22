/**
 * EDIT ME — achievements, certifications, and creative spotlights.
 * Honest > impressive. Student-level wins belong here.
 */

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  url?: string;
}

export const achievements: Achievement[] = [
  {
    id: "hackathon-finalist",
    title: "Hackathon Finalist",
    issuer: "School / Local Hackathon — replace me",
    date: "2025",
    description: "Built a study-tool prototype in 24 hours with a team of 4.",
  },
  {
    id: "honor-roll",
    title: "Honor Roll",
    issuer: "Your School — replace me",
    date: "2024 – 2025",
    description: "Consistent academic standing while shipping side projects.",
  },
  {
    id: "cert-web",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp (example) — replace me",
    date: "2025",
    description: "HTML/CSS fundamentals + 5 practice projects.",
    url: "https://freecodecamp.org",
  },
];

export interface CreativeItem {
  id: string;
  title: string;
  kind: string;
  tools: string[];
  description: string;
  url?: string;
}

export const creativeWork: CreativeItem[] = [
  {
    id: "event-recap",
    title: "Event Recap Reel",
    kind: "Short-form edit",
    tools: ["Premiere Pro", "Captions"],
    description: "60-second energy cut: hooks in 2s, beat-synced selects, burned-in captions.",
  },
  {
    id: "mini-doc",
    title: "Mini Documentary",
    kind: "2-min story",
    tools: ["Premiere Pro", "Sound"],
    description: "Interview-led story with B-roll, natural sound, and a clean arc.",
  },
  {
    id: "hype-edit",
    title: "Team Hype Edit",
    kind: "Sports / org hype",
    tools: ["CapCut", "After Effects"],
    description: "Fast hype edit for games and practices; built a reusable title + transition kit.",
  },
];

export const testimonials = [
  {
    id: "t1",
    quote: "Dependable with deadlines and quick to learn whatever the project needs.",
    name: "Teacher / Adviser",
    role: "Replace with a real quote when you have one",
  },
  {
    id: "t2",
    quote: "Good eye for pacing — our event recap finally looked intentional.",
    name: "Org President",
    role: "Replace with a real quote when you have one",
  },
  {
    id: "t3",
    quote: "Asks sharp questions and documents the answer so the next person is faster.",
    name: "Teammate",
    role: "Replace with a real quote when you have one",
  },
];

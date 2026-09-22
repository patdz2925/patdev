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
    id: "g11-high-honors",
    title: "Consistent With High Honors",
    issuer: "Assumpta Technical High School — Grade 11",
    date: "SY 2025–2026",
    description: "High honors standing across the Grade 11 school year.",
  },
  {
    id: "g10-honors",
    title: "Honors",
    issuer: "Assumpta Technical High School — Grade 10",
    date: "SY 2024–2025",
    description: "Honor roll while leading the Badminton Boys Club and writing for Bigkis.",
  },
  {
    id: "g9-honors",
    title: "Honors",
    issuer: "Assumpta Technical High School — Grade 9",
    date: "SY 2023–2024",
    description: "Honor roll while serving as Badminton Boys Club VP.",
  },
  {
    id: "outstanding-member",
    title: "Outstanding Club Member",
    issuer: "JHS Badminton Boys Club — Grade 10",
    date: "SY 2024–2025",
    description: "Recognized for leadership and commitment as club president.",
  },
  {
    id: "hau-tech-talk",
    title: "Tech Talk 2025",
    issuer: "HAU CSC–SoC",
    date: "2025",
    description: "Attended the computing tech talk; leadership training exposure.",
  },
  {
    id: "accenture-seminar",
    title: "Coding Seminar",
    issuer: "Accenture",
    date: "2025",
    description: "Coding seminar alongside leadership trainings.",
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
    id: "atechs-reels",
    title: "ATecHS Reels & Photography",
    kind: "Event coverage",
    tools: ["Photography", "CapCut", "Premiere Pro"],
    description: "Photo + reel coverage of school events: games, programs, and org activities.",
  },
  {
    id: "posters-print",
    title: "Posters, Banners & Merch",
    kind: "Graphic design",
    tools: ["Posters", "Banners", "Logos"],
    description: "Posters, banners, photobooth backdrops, logos, and class shirts for school needs.",
  },
  {
    id: "short-films",
    title: "Short Films",
    kind: "Edited films",
    tools: ["Premiere Pro", "CapCut", "Story"],
    description: "Edited short films for school projects — pacing, sound, and captions included.",
  },
];

export const testimonials = [
  {
    id: "t1",
    quote: "Coming Soon.",
    name: "Name",
    role: "",
  },
  {
    id: "t2",
    quote: "Coming Soon.",
    name: "Name",
    role: "",
  },
  {
    id: "t3",
    quote: "Coming Soon.",
    name: "Name",
    role: "",
  },
];

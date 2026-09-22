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
    skills: ["Web dev via GenAI", "UI design", "HTML", "CSS", "JavaScript"],
  },
  {
    id: "creative",
    title: "Design & media",
    skills: ["Posters", "Infographics", "Banners & logos", "Shirts & photobooths", "Photography", "ATecHS Reels"],
  },
  {
    id: "video",
    title: "Video & production",
    skills: ["Video editing", "Short films", "Premiere Pro", "CapCut", "Photobooth ops", "Media Bank"],
  },
  {
    id: "leadership",
    title: "Leadership & comms",
    skills: ["Team leadership", "Mentoring", "News writing", "Event coverage"],
  },
];

/** Flat list used in Experience section ("Stack" strip) */
export const stackHighlights = [
  "GenAI",
  "UI Design",
  "Posters",
  "Video Editing",
  "Photography",
  "Programming",
  "Leadership",
  "News Writing",
];

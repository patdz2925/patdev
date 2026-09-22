import {
  Home,
  User,
  FolderGit2,
  Briefcase,
  Mail,
  Sparkles,
  GraduationCap,
  Trophy,
  Clapperboard,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Navigation model — sidebar + mobile menu + scroll-spy read from here.
 * `href` values are in-page anchors; keep them in sync with section ids in App.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavGroup {
  id: string;
  items: NavItem[];
}

export const primaryNav: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: Home },
  { id: "about", label: "About", href: "#about", icon: User },
  { id: "projects", label: "Projects", href: "#projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", href: "#experience", icon: Briefcase },
  { id: "contact", label: "Contact", href: "#contact", icon: Mail },
];

export const secondaryNav: NavItem[] = [
  { id: "skills", label: "Skills", href: "#skills", icon: Sparkles },
  { id: "education", label: "Education", href: "#education", icon: GraduationCap },
  { id: "creative", label: "Creative", href: "#creative", icon: Clapperboard },
  { id: "organizations", label: "Organizations", href: "#organizations", icon: Users },
  { id: "achievements", label: "Achievements", href: "#achievements", icon: Trophy },
];

/** All section ids observed for scroll-spy */
export const sectionIds = [
  "home",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "creative",
  "organizations",
  "achievements",
  "contact",
];

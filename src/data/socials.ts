import { Mail, Globe, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "../components/layout/BrandIcons";

/**
 * EDIT ME — social + contact links.
 * Add / remove entries here. Icons map by `icon` name below.
 * Set `href` to "" to hide an entry without deleting it.
 */

export type SocialIconName =
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube"
  | "email"
  | "website";

export interface Social {
  label: string;
  href: string;
  icon: SocialIconName;
  /** Show in hero link row */
  featured?: boolean;
}

type IconComp = ComponentType<{ className?: string }>;

export const iconMap: Record<SocialIconName, IconComp> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  email: Mail as unknown as IconComp,
  website: Globe as unknown as IconComp,
};

// Re-export for components that type icons as Lucide (compat not needed elsewhere)
export type { LucideIcon };

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/yourname", icon: "github", featured: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourname", icon: "linkedin", featured: true },
  { label: "Instagram", href: "https://instagram.com/yourname", icon: "instagram", featured: true },
  { label: "X", href: "https://x.com/yourname", icon: "x", featured: true },
  { label: "YouTube", href: "", icon: "youtube" },
  { label: "Email", href: "mailto:you@example.com", icon: "email" },
  { label: "Website", href: "", icon: "website" },
];

/** Hero inline links (github ↗ linkedin ↗ …) */
export const featuredSocials = socials.filter((s) => s.featured && s.href);

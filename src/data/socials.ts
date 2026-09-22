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
  { label: "Instagram", href: "https://www.instagram.com/patrickviraydc", icon: "instagram", featured: true },
  { label: "Email", href: "mailto:contact@patrickz.top", icon: "email", featured: true },
  { label: "GitHub", href: "", icon: "github" },
  { label: "LinkedIn", href: "", icon: "linkedin" },
  { label: "X", href: "", icon: "x" },
  { label: "YouTube", href: "", icon: "youtube" },
  { label: "Website", href: "", icon: "website" },
];

/** Hero inline links (instagram ↗ email ↗ …) */
export const featuredSocials = socials.filter((s) => s.featured && s.href);

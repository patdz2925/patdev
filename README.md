# Personal Portfolio

Single-page personal portfolio — React + Vite + TypeScript + Tailwind CSS v4 + Motion + Lucide.

Design reference: fixed left sidebar, pixel/mono typography pairing, halftone dot texture,
numbered sections, and a spotlight project deck. All reference *content* was replaced with
placeholder personal content.

## Run it

```powershell
npm install
npm run dev      # local dev
npm run build    # typecheck + production build
npm run preview  # serve dist/
```

## Customize (start here)

Almost everything you edit regularly lives in `src/data/` — no component knowledge needed:

| File | What to change |
|---|---|
| `src/data/profile.ts` | Name, role, bio, photo (`/profile.jpg`), email, stats, interests |
| `src/data/socials.ts` | Social links — set `href: ""` to hide one |
| `src/data/projects.ts` | Add a project by copying a block — deck, grid, filters, modal update automatically |
| `src/data/experience.ts` | Experience, education, organizations |
| `src/data/skills.ts` | Skill groups + stack strip |
| `src/data/achievements.ts` | Achievements, creative work, testimonials |
| `src/data/navigation.ts` | Sidebar / mobile menu / scroll-spy sections |
| `index.html` | Title, meta description, OG tags, fonts |

Photos: put `profile.jpg` in `public/`. Resume: put `resume.pdf` in `public/` and set
`resumeUrl: "/resume.pdf"` in `profile.ts` (otherwise the Contact section generates a `.txt` from your data).

## Structure

```
src/
  data/          # all editable content (see table above)
  hooks/         # useTheme (light/dark/system), useActiveSection (scroll-spy)
  components/
    layout/      # Sidebar, MobileNav, Footer, ThemeSwitch, SectionHeading, Reveal, BrandIcons
    projects/    # ProjectCard (reusable), ProjectModal (accessible detail dialog)
    sections/    # Hero, Stats, About, Projects, Skills, Experience, Education,
                 # CreativeWork, Organizations, Achievements, GithubStrip, Contact
  App.tsx        # section order + shell (sidebar offset, halftone backdrop)
  main.tsx       # ThemeProvider mount
```

Notes for future edits (human or AI):

- Sections are anchored (`id="projects"` …) — keep ids in sync with `src/data/navigation.ts`.
- Brand icons live in `components/layout/BrandIcons.tsx` (lucide-react no longer ships them).
- Animations are intentionally subtle (one fade-up per section + deck physics). Respect
  `prefers-reduced-motion` — already handled in CSS and via `Reveal`.
- No backend: the contact form opens the visitor's mail app; the CV button downloads
  generated text unless a real PDF is provided. Don't present either as server-sent.

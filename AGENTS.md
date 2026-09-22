# AGENTS.md — Portfolio Agent Workflow

Project: personal portfolio in `C:\Users\patdz\Documents\portfolio`
Stack: React + Vite + TypeScript + Tailwind CSS v4 + Motion + Lucide.
Editable content lives in `src/data/` (`profile.ts`, `socials.ts`, `projects.ts`,
`experience.ts`, `skills.ts`, `achievements.ts`, `navigation.ts`). See `README.md`
for the customization map. Brand icons live in
`src/components/layout/BrandIcons.tsx` (lucide-react no longer ships them).

## Git and Deployment Workflow

Whenever the user requests a modification, feature, bug fix, content update,
design change, or other update to this portfolio:

1. Make the requested changes.
2. Review the changes for obvious issues.
3. Run:
   - `npm run build`
   - `npm run lint`
4. If both commands pass, automatically commit and push the changes to the
   GitHub repository:
   - Working directory: `C:\Users\patdz\Documents\portfolio`
   - Branch: `main`
   - Remote: `origin`
5. Use an appropriate concise commit message describing the change.
6. Run:
   - `git add .`
   - `git commit -m "<appropriate message>"`
   - `git push origin main`
7. If the build or lint check fails, DO NOT commit or push. Fix the issue
   first and rerun the checks.
8. After successfully pushing, report that the changes were pushed to GitHub
   and are ready for Cloudflare Pages to deploy.
9. Do not push unrelated changes that were not part of the request.
10. Do not force-push, reset, rebase, or delete remote history unless
    explicitly requested.

The goal workflow is:

User requests a website update → implement it → test it → commit it → push it
→ Cloudflare Pages automatically deploys it.

Do not ask the user to manually run the Git commands after every successful
update unless the Git operation itself encounters an error.

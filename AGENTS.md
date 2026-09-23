# AGENTS.md — Portfolio Agent Workflow

Project: personal portfolio in `C:\Users\UserPC\Documents\patdev`

Stack: React + Vite + TypeScript + Tailwind CSS v4 + Motion + Lucide.

Editable content lives in `src/data/` (`profile.ts`, `socials.ts`, `projects.ts`,
`experience.ts`, `skills.ts`, `achievements.ts`, `navigation.ts`). See `README.md`
for the customization map.

Brand icons live in `src/components/layout/BrandIcons.tsx`
(`lucide-react` no longer ships them).

---

## Conversational Workflow

The assistant should behave as a conversational coding partner rather than an
autonomous agent.

The user should remain in control of decisions and implementation.

### Before Making Changes

When the user asks about a problem, feature, bug, design change, content
update, or other modification:

1. Understand the user's request first.
2. Inspect only the relevant files needed to understand the issue.
3. Explain what was found.
4. Explain the proposed solution.
5. Identify the files that would be changed.
6. Ask the user for confirmation before modifying files.

Do NOT immediately implement a requested change simply because the user
described it.

Use a conversational style similar to a helpful coding assistant.

For example:

> I found the issue in `src/components/Navbar.tsx`. The current mobile
> menu is using X, which is why the animation behaves this way.
>
> I recommend changing the menu state handling while keeping the existing
> design intact. This would affect `Navbar.tsx` and its associated styles.
>
> Would you like me to proceed?

Wait for the user's confirmation before making the changes.

---

## User Decision and Approval

The user has final control over implementation decisions.

When multiple approaches are possible:

* Explain the relevant options.
* Briefly describe the advantages and disadvantages.
* Recommend an approach when appropriate.
* Let the user decide before implementing.

Do not make major architectural, design, dependency, or structural decisions
without discussing them with the user first.

---

## File Changes

Before modifying files:

* Tell the user which files will be changed.
* Explain what will be changed.
* Keep changes focused on the requested task.
* Do not rewrite unrelated code.
* Preserve existing functionality unless the user explicitly requests otherwise.

Do not modify files until the user confirms the proposed implementation.

---

## Commands

Do not execute unnecessary commands.

Before running commands that are:

* destructive,
* expensive,
* project-wide,
* capable of modifying many files,
* capable of changing Git history,
* or capable of affecting deployment,

explain what the command does and obtain confirmation when appropriate.

Safe inspection commands may be executed when necessary to understand the
project.

Never execute destructive commands such as:

* `git reset --hard`
* `git clean`
* force pushes
* history deletion
* destructive file deletion

unless explicitly requested by the user.

---

## Git and Deployment Workflow

After the user explicitly confirms a proposed implementation and the requested
changes have been completed:

1. Review the changes for obvious issues.
2. Run:

   * `npm run build`
   * `npm run lint`
3. If both commands pass, ask the user for confirmation before committing
   and pushing.
4. If the user confirms, use:

   * `git add .`
   * `git commit -m "<appropriate message>"`
   * `git push origin main`
5. Working directory:
   `C:\Users\UserPC\Documents\patdev`
6. Branch:
   `main`
7. Remote:
   `origin`
8. Use an appropriate concise commit message describing the change.
9. If the build or lint check fails:

   * Do NOT commit.
   * Do NOT push.
   * Explain the failure.
   * Propose a fix.
   * Ask the user for confirmation before making the fix.
10. After successfully pushing, report that the changes were pushed to GitHub
    and are ready for Cloudflare Pages to deploy.
11. Do not push unrelated changes that were not part of the user's request.
12. Do not force-push, reset, rebase, or delete remote history unless
    explicitly requested.

---

## Secrets and Environment Variables

Never expose, print, or disclose secrets.

Do not unnecessarily read or modify `.env.local`.

Never include API keys, passwords, tokens, or other credentials in responses,
commits, or generated code.

If environment variables are required for a task, use them without exposing
their secret values.

---

## Code Quality

Follow the existing project's architecture and conventions.

Prefer:

* small, focused changes;
* reusable components;
* existing utilities and components;
* existing design patterns;
* accessible UI;
* responsive behavior;
* TypeScript types;
* clean and maintainable code.

Do not introduce new dependencies when an existing dependency or project
utility can accomplish the task.

---

## Design and Content Preferences

Keep the portfolio's design clean, modern, minimal, and consistent with its
existing visual style.

Do not introduce unnecessary visual elements, redesigns, or UI changes that
were not requested.

### No Emojis

Do NOT use emojis anywhere in the portfolio unless the user explicitly asks
for them.

This applies to:

* navigation
* buttons
* headings
* labels
* descriptions
* cards
* badges
* notifications
* tooltips
* placeholder text
* website copy
* decorative elements
* generated content
* UI elements

When an icon is needed, use the project's existing icon system, such as
Lucide icons or existing custom/brand icons.

Do not replace proper icons with emojis.

For example, if a navigation item needs an icon, use an appropriate Lucide
icon rather than an emoji.

Only use emojis when the user explicitly requests them for a specific feature
or piece of content.

---

## After Implementation

After a confirmed implementation:

1. Explain what was changed.
2. List the affected files.
3. Report build/lint results.
4. If Git operations were approved and completed, report the commit and push.
5. Mention any remaining issues or decisions the user should know about.

Do not simply say "done" without explaining what changed.

---

## Overall Workflow

The intended workflow is:

User describes a request

→ Assistant analyzes the relevant code

→ Assistant explains what it found

→ Assistant proposes a solution

→ Assistant identifies affected files

→ Assistant asks for confirmation

→ User confirms

→ Assistant implements the change

→ Assistant reviews the changes

→ Assistant runs build/lint

→ Assistant reports results

→ Assistant asks for Git push confirmation

→ User confirms

→ Assistant commits and pushes

→ Cloudflare Pages deploys

The user should always remain in control of significant changes.

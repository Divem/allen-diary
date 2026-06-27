# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project also has an `AGENTS.md` with overlapping operational notes. When they conflict, prefer this file; otherwise treat them as consistent.

## Commands

| Task | Command | Notes |
|---|---|---|
| Dev server | `npm run dev` | Next.js + Turbopack on `http://localhost:3000` |
| Build | `npm run build` | Static export to `dist/` (Turbopack) |
| Type-check | `npx tsc --noEmit` | Preferred quick correctness check (no test runner exists) |
| Regenerate data | `npm run parse` | Reparses `gzallen.md` → `src/data/{diary,diary-grouped,stats}.json` |
| Lint | **Avoid** | `npm run lint` runs `next lint`, which is deprecated and drops into an interactive ESLint setup prompt — it will hang in automation |

No test framework is configured; `npm test` does not exist.

## Architecture

**Single-purpose static site**: renders 张小龙's Fanfou diary (`gzallen.md`) as a filterable feed + swipe-card view, deployed to GitHub Pages.

### Data flow (critical to understand)

```
gzallen.md  ──(scripts/parse.js)──▶  src/data/diary.json           ← flat list
                                     src/data/diary-grouped.json   ← grouped by YYYY-MM
                                     src/data/stats.json           ← tag list + year range
                                            │
                                            ▼
                         src/app/page.tsx & src/app/swipe/page.tsx (import JSON directly)
```

- `src/data/*.json` are **generated artifacts** — edit `scripts/parse.js` and re-run `npm run parse`, don't hand-edit the JSON.
- Pages use static `import diaryData from '@/data/diary.json'`, which means the dataset is baked into the bundle at build time. The `output: 'export'` in `next.config.js` turns the whole app into a static site in `dist/`.
- `scripts/parse.js` runs as ESM because `package.json` has `"type": "module"`. Don't introduce `require(...)`.

### Tag system (three sources must stay in sync)

Adding, renaming, or removing a tag touches **three** places:

1. `scripts/parse.js` → `tagRules` array (defines detection rules)
2. `src/app/globals.css` → `.tag-<name>` classes for both light and dark mode
3. `src/app/page.tsx` and `src/app/swipe/page.tsx` → `tagClassMap` (Chinese tag → CSS class) and `src/components/ShareCard.tsx` → `getTagColor` (hex colors for exported PNG)

After changing `tagRules`, run `npm run parse` and commit the regenerated JSON alongside your change.

### Pages

- `src/app/page.tsx` — home feed: month/tag/search filters, mobile filter drawer, per-card share button.
- `src/app/swipe/page.tsx` — Tinder-style card browser; iterates `diaryData.slice().reverse()`. Swipe logic distinguishes vertical scroll from horizontal drag (see recent commits around swipe gestures before changing that behavior).
- `src/components/ShareCard.tsx` — renders a standalone PNG via `html2canvas` (dynamic import; `scale: 4` for retina quality). The card uses inline styles, not Tailwind, so html2canvas captures a consistent visual regardless of theme.

### Theming

- `next-themes` with `class` strategy; root CSS variables in `src/app/globals.css` switch on `.dark`.
- Components should reference `var(--background)`, `var(--foreground)`, `var(--primary)`, etc. — not hard-coded colors — so both themes keep working.
- Tailwind v4 is configured CSS-first via `@import "tailwindcss"` in `globals.css`; `tailwind.config.js` still exists for the custom `primary` palette and font variables.

## Conventions

- TS strict mode on. 2-space indent, single quotes, **no semicolons** in `.ts`/`.tsx` — match the existing style.
- Use `@/*` alias for `src/` imports.
- Preserve light + dark theme behavior when changing styles.

## Deploy

`.github/workflows/deploy.yml` builds with `next build` and publishes `./dist` to GitHub Pages on every push to `main`. There is no staging branch.

# AGENTS.md

Operational guidance for agentic coding assistants in `allen-diary`.

## Project Snapshot
- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4.
- Package manager: `npm` (`package-lock.json` exists).
- Main UI: `src/app/page.tsx`.
- Shared layout/providers: `src/app/layout.tsx`, `src/components/ThemeProvider.tsx`.
- Theme toggle: `src/components/ThemeToggle.tsx`.
- Share/export modal: `src/components/ShareCard.tsx`.
- Generated data: `src/data/*.json`.
- Data source and parser: `gzallen.md` -> `scripts/parse.js`.

## Build / Lint / Test Commands

### Install
- `npm install`

### Dev server
- `npm run dev`
- Default URL: `http://localhost:3000`

### Production build
- `npm run build`
- Includes compile + type checks.
- Current known issue: fails on strict type mismatch in `src/app/page.tsx` when iterating imported JSON data.

### Production start
- `npm run start`
- Requires successful build output.

### Regenerate app data
- `npm run parse`
- Rewrites:
- `src/data/diary.json`
- `src/data/diary-grouped.json`
- `src/data/stats.json`

### Lint
- `npm run lint`
- Current behavior: interactive ESLint setup prompt (no lint config committed yet).
- In non-interactive environments, avoid relying on this until ESLint config is added.

### Type-check only (recommended quick check)
- `npx tsc --noEmit`

## Testing Status (Important)
- No test framework is currently configured.
- No `test` script exists in `package.json`.
- `npm test` will not work in current state.

## Running a Single Test (Important)
- Current repo: **not available yet** (no runner configured).
- If Vitest is added later:
- `npx vitest run path/to/file.test.ts`
- `npx vitest run path/to/file.test.ts -t "test name"`
- If Jest is added later:
- `npx jest path/to/file.test.ts`
- `npx jest path/to/file.test.ts -t "test name"`

## Cursor / Copilot Rules
- Checked: `.cursor/rules/`
- Checked: `.cursorrules`
- Checked: `.github/copilot-instructions.md`
- Result: none found in this repository.
- Therefore this file is the primary agent instruction source.

## Code Style Guidelines

### General
- Use TypeScript for app code (`.ts` / `.tsx`).
- Keep JS script style in `scripts/parse.js` consistent unless intentionally migrating.
- Respect existing file-level conventions before introducing new patterns.

### Formatting
- 2-space indentation.
- Single quotes in TS/TSX.
- No semicolons in TS/TSX files.
- Keep JSX props multiline when lines become long.
- Avoid noisy comments; add comments only for non-obvious logic.

### Imports
- Preferred order:
- 1) React / Next / external packages.
- 2) Internal alias imports (`@/...`).
- 3) Relative imports and side-effect imports (e.g., CSS).
- Prefer `@/*` alias over deep `../../..` paths.
- Use `import type` for type-only imports when applicable.

### React and component patterns
- Use function components.
- Use `'use client'` only when hooks/browser APIs are required.
- Keep hooks at top-level, never in branches/loops.
- Use `useMemo` for non-trivial derived/filtering logic.
- Keep state names explicit (`selectedMonth`, `isLoading`, `isDownloading`).
- Handlers should be verb-based (`toggleTag`, `clearFilters`, `handleDownload`).

### Types and data safety
- TypeScript `strict` is enabled; avoid `any`.
- Define explicit interfaces/types for props and core entities.
- Prefer union types for constrained values (e.g., entry type flags).
- Imported JSON may widen literals to `string`; normalize/validate before strict use.
- Prefer safe parsing/normalization over unsafe type assertions.

### Naming conventions
- Components/types: `PascalCase`.
- Variables/functions: `camelCase`.
- Booleans: `is*`, `has*`, `can*`.
- Event handlers: `handle*`, `toggle*`, `clear*`.
- Constants/maps: `camelCase` locally, `UPPER_SNAKE_CASE` for true globals.

### Styling and UI
- Use Tailwind utilities for local component styling.
- Use `src/app/globals.css` for shared classes/tokens.
- Reuse existing classes (`.tag`, `.diary-card`, `.month-item`) where possible.
- Preserve both light and dark theme behavior when changing styles.

### Error handling
- Use guard clauses for invalid state and duplicate actions.
- Wrap async browser operations in `try/catch`.
- Log technical context with `console.error`.
- Provide user-facing failure text that is short and actionable.
- Ensure loading flags reset in success and failure branches.

## Data Pipeline Rules
- Treat `src/data/*.json` as generated artifacts.
- Prefer changing `scripts/parse.js` over manual JSON editing.
- If parser logic changes, run `npm run parse` and commit regenerated JSON together.

## Agent Workflow Expectations
- Keep changes scoped to the task request.
- Avoid broad refactors unless explicitly asked.
- Do not edit `.next/` or `node_modules/`.
- Update docs/scripts together when adding lint/test tooling.
- Call out known blockers clearly in PR notes or handoff.

## Quick Self-Check Before Handoff
- `npm run dev` starts and page loads.
- `npx tsc --noEmit` runs (or explain current blockers).
- If parser changed: `npm run parse` and verify JSON diff sanity.
- Verify theme toggle and share card still function.
- Confirm no unrelated files were modified.

## Known Repository Caveats
- `npm run lint` is interactive until ESLint config is committed.
- `npm run build` currently fails due strict typing mismatch with imported JSON.
- `next.config.js` currently shows `MODULE_TYPELESS_PACKAGE_JSON` warning.

## If You Add Tests Later
- Preferred stack: Vitest + Testing Library.
- Add scripts:
- `"test": "vitest"`
- `"test:run": "vitest run"`
- `"test:watch": "vitest"`
- Update this file with concrete single-test commands once setup lands.

# AGENTS.md

Operational guidance for agentic coding assistants in `allen-diary`.

## Project Snapshot
- Stack: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4.
- Static export configured (`output: 'export'`, `distDir: 'dist'`).
- Package manager: `npm`.
- Main UI: `src/app/page.tsx`. Extra route: `src/app/swipe/page.tsx`.
- Generated data: `src/data/*.json` produced by `scripts/parse.js` from `gzallen.md`.

## Commands

| Task | Command | Notes |
|---|---|---|
| Dev server | `npm run dev` | Turbopack enabled. URL: `http://localhost:3000` |
| Build | `npm run build` | Works. Exports static site to `dist/` |
| Type-check | `npx tsc --noEmit` | Reliable quick check; currently passes |
| Regenerate data | `npm run parse` | Rewrites `src/data/*.json` from `gzallen.md` |
| Lint | `npm run lint` | **Avoid in automation.** `next lint` is deprecated and enters an interactive ESLint setup prompt |

## Testing
- No test runner is configured. `npm test` does not exist.

## CI / Deploy
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys the `dist` folder to GitHub Pages on every push to `main`.

## Data Pipeline
- Treat `src/data/*.json` as generated artifacts.
- Prefer editing `scripts/parse.js` over manual JSON changes.
- If parser logic changes, run `npm run parse` and commit the regenerated JSON.
- **Gotcha:** `package.json` has `"type": "module"`, so `scripts/parse.js` uses ESM syntax. If you see CommonJS leftovers (`require`), convert them to `import` before running the script.

## Code Conventions
- TypeScript `strict` is enabled.
- Existing code uses 2-space indentation, single quotes, and no semicolons in TS/TSX.
- Use `@/*` alias for `src/` imports.
- Preserve both light and dark theme behavior when changing styles.

# Mobile PWA and Mini Program Design

## Context

`allen-diary` is a static Next.js 15 site for reading Zhang Xiaolong's Fanfou diary entries. The current project already has mobile-friendly pieces: a responsive main list, a `/swipe` card-reading route, mobile search, a filter drawer, dark mode, and share-card image generation.

This design defines the shared mobile product direction first, then scopes the first implementation phase to Web/PWA. A WeChat Mini Program can reuse the same content model and interaction decisions later, but it is not part of the first implementation phase.

## Goals

- Make the mobile experience feel like a focused reading product, not a shrunken desktop archive.
- Use four clear mobile entry points: `今日`, `卡片`, `全部`, and `搜索`.
- Keep the first phase compatible with static export and GitHub Pages.
- Preserve the existing data pipeline from `gzallen.md` through `scripts/parse.js` into `src/data/*.json`.
- Prepare clean product and data boundaries so a later Mini Program can follow the same structure.

## Non-Goals

- No account system.
- No cloud sync.
- No comments or social feed.
- No backend API.
- No content editing backend.
- No Mini Program project in the first phase.
- No personalized recommendation service.

## Recommended Approach

Use a staged path:

1. Build the shared mobile product shape in the existing Next.js project.
2. Add PWA installability and mobile metadata.
3. Keep data and content-selection logic platform-neutral where practical.
4. Use the same spec later to create a separate WeChat Mini Program project.

This minimizes risk because the current app is already static, mobile-aware, and deployable. It also avoids introducing a second build stack before the mobile experience is validated.

## Product Structure

The mobile product has four primary tabs:

- `今日`: the default home page. Shows a stable daily entry and lets users explore more with `换一条`.
- `卡片`: immersive swipe-based reading, based on the existing `/swipe` route.
- `全部`: content-first reading feed for all entries.
- `搜索`: focused search surface for keyword lookup and result navigation.

The default path should be:

1. User opens the app.
2. User sees `今日` with one prominent diary entry.
3. User can tap `换一条`, share the entry, or continue into `卡片`.
4. User can use `全部` for continuous browsing.
5. User can use `搜索` for precise lookup.

## Page Designs

### 今日

`今日` is the mobile home page. It should show one diary entry as the dominant object on the screen.

Required elements:

- Top app bar with `今日`.
- A small `每日一条` indicator.
- Large readable quote card.
- Date, tags, and source metadata as secondary information.
- Primary action: `换一条`.
- Secondary actions: share and enter card mode.
- Bottom tab bar with `今日` active.

Behavior:

- The daily entry is stable for the same date.
- `换一条` selects another entry in the current session.
- `换一条` avoids recently shown entries until the pool is exhausted.
- Share opens the share preview flow.

### 卡片

`卡片` is a focused, immersive reading mode.

Required elements:

- Top bar with page title `卡片`.
- Compact progress, such as `128 / 2289`.
- Thin progress bar.
- Large swipe card with readable content.
- Share action.
- Previous and next controls.
- Bottom tab bar with `卡片` active.

Behavior:

- Horizontal swipe changes entries.
- Long text inside the card can scroll vertically.
- Vertical reading should not be hijacked by horizontal swipe.
- Existing long-press continuous switching may remain if it feels stable on touch devices.

### 全部

`全部` is a content-first reading feed. The revised direction is intentionally simpler than the first visual draft.

Required elements:

- Top app bar with `全部`.
- One subtle search/filter action.
- Lightweight summary row, such as `2289 条思考`.
- Single-column reading feed.
- Diary content as the highest visual priority.
- Date, entry number, type, and time compressed into one muted metadata line.
- Tags as small subdued chips after content.
- Bottom tab bar with `全部` active.

Layout rules:

- Do not use a left date column.
- Do not use a dense timeline layout.
- Do not let metadata compete with content.
- Avoid nested cards.
- Use light dividers or very subtle surfaces.
- Keep generous vertical rhythm for continuous reading.

Behavior:

- Filtering is secondary and should open from a lightweight control.
- Month and tag selection are positioning aids, not a reason to make the content stream feel like a database table.
- Search from this page may route to the dedicated `搜索` tab.

### 搜索

`搜索` is a dedicated mobile search experience.

Required elements:

- Top app bar with `搜索`.
- Prominent search input with 16px-equivalent font size to avoid iOS zoom.
- Result count, such as `找到 86 条`.
- Compact previous and next result navigation.
- Result cards or feed items with highlighted matched text.
- Tags and entry metadata as secondary information.
- Entry action to open in card mode.
- Bottom tab bar with `搜索` active.

Behavior:

- Opening the page focuses the search input where supported.
- Clearing the query restores the empty state or suggestions.
- Matched text is highlighted.
- Result navigation scrolls to the active result.

### 分享预览

The share preview is a full-screen overlay or modal.

Required elements:

- Top bar with close action and title `分享预览`.
- Centered share-card preview.
- Clear actions: `保存图片`, `复制文字`, and `返回阅读`.
- Optional hint: `长按图片也可保存`.

Behavior:

- Share-card generation failure should show a clear error and keep the user in reading context.
- The preview should be screenshot-friendly and thumb-accessible.
- The current `html2canvas` approach can remain in the first phase if it continues to work with static export.

## Visual Direction

Use a quiet, content-first mobile reading style:

- Background: near-white `#FAFAFA`.
- Cards/surfaces: white or near-white.
- Accent: current sky blue `#0EA5E9`.
- Metadata: slate/gray.
- Tags: soft muted colors.
- Typography: system UI stack, with diary content larger than metadata.
- Avoid purple-heavy gradients, decorative blobs, dashboard density, and desktop sidebars.

Generated visual references are currently under:

- `/Users/dawinyuan/.codex/generated_images/019ee576-32bc-7dc1-b3e8-e4a9ea3afb21/ig_05283c7fae945efc016a36c25b8f5c81939718949e628548d1.png` for `今日`.
- `/Users/dawinyuan/.codex/generated_images/019ee576-32bc-7dc1-b3e8-e4a9ea3afb21/ig_05283c7fae945efc016a36c28d3b5c8193a0c6a305393e357e.png` for `卡片`.
- `/Users/dawinyuan/.codex/generated_images/019ee576-32bc-7dc1-b3e8-e4a9ea3afb21/ig_0cce617896bb75e5016a36c410c1f4819783297f17bfdd1a3d.png` for the revised `全部`.
- `/Users/dawinyuan/.codex/generated_images/019ee576-32bc-7dc1-b3e8-e4a9ea3afb21/ig_05283c7fae945efc016a36c2fd36dc8193a41b9c185bdcbf91.png` for `搜索`.
- `/Users/dawinyuan/.codex/generated_images/019ee576-32bc-7dc1-b3e8-e4a9ea3afb21/ig_05283c7fae945efc016a36c33b7f548193a6b04301377d003d.png` for `分享预览`.

These images are visual references only. They are not project assets yet.

## Architecture

Keep the first phase inside the existing Next.js app.

Suggested structure:

- `src/app/page.tsx`: redirect or render the mobile-first `今日` experience.
- `src/app/swipe/page.tsx`: keep as the card route, or align route naming later if tab routing changes.
- `src/components/*`: extract shared mobile components from the current large page files.
- `src/lib/diary.ts`: platform-neutral content helpers.
- `src/data/*.json`: generated data, unchanged as the content source.

Suggested helper boundaries:

- `getDailyEntry(entries, date)`: returns the stable daily entry for a date.
- `getRandomEntry(entries, excludeIds)`: returns a non-recent random entry.
- `filterEntries(entries, query)`: shared keyword filtering.
- `groupEntriesByMonth(entries)`: shared month grouping.
- `getEntryMetadata(entry)`: formats display metadata in one place.

The exact file names can be adjusted during implementation, but the intent is to stop adding unrelated responsibilities to `src/app/page.tsx`.

## Data Flow

The data flow remains static:

1. `gzallen.md` is the source content.
2. `npm run parse` runs `scripts/parse.js`.
3. The parser writes `src/data/diary.json`, `src/data/diary-grouped.json`, and `src/data/stats.json`.
4. Pages import JSON at build time.
5. `npm run build` exports the static app to `dist/`.

The daily-entry selection should not require a backend. It can be computed from the current local date and the static entry list. The implementation should make the date input injectable so the behavior can be tested and reasoned about.

## PWA Scope

First phase PWA work should include:

- Web app manifest.
- App name and short name.
- Mobile icons.
- Theme color.
- Apple mobile metadata where practical.
- Static-export-compatible setup.

Do not add a service worker unless it has a clear, low-risk static caching purpose. The app already works as static content, and an unnecessary service worker can create stale-content problems.

## Mini Program Scope

The Mini Program is a second phase.

The later Mini Program should reuse:

- The same entry shape.
- The same tab model: `今日`, `卡片`, `全部`, `搜索`.
- The same daily-entry and random-entry semantics.
- The same content-first rule for `全部`.
- The same share-preview concept, adapted to WeChat capabilities.

The later Mini Program will need separate work for:

- Project scaffolding.
- Component rewriting.
- Mini Program routing.
- WeChat sharing and image generation constraints.
- Review and publishing requirements.

## Error Handling

- Empty data: show a clear empty state and keep navigation usable.
- Daily-entry failure: fall back to the first valid entry.
- Random pool exhausted: reset the seen set and continue.
- Search with no results: show an empty state and a clear action to reset.
- Share image generation failure: show a clear message and let the user return to reading.
- Missing PWA icon or manifest issue: should not break the core reading experience.

## Accessibility and Mobile Usability

- Use 16px-equivalent font size for mobile search inputs.
- Keep touch targets at least 44px where possible.
- Keep bottom tab labels short and stable.
- Ensure long diary content wraps correctly.
- Preserve light and dark theme behavior where existing theme support applies.
- Avoid overlapping fixed header, sticky search controls, and bottom navigation.

## Verification

Use the commands supported by this project:

```bash
npx tsc --noEmit
npm run build
```

Do not rely on `npm run lint` in automation because this project documents that `next lint` is deprecated and can enter an interactive ESLint setup prompt.

Manual visual checks should cover mobile viewports for:

- `今日` first screen.
- `换一条` behavior.
- `卡片` swipe and long-text reading.
- `全部` content-first feed.
- `搜索` input, highlights, and result navigation.
- `分享预览` generation and failure state.
- Light and dark theme behavior.

## First Implementation Phase Acceptance Criteria

- Mobile users land on a `今日` experience.
- Bottom navigation exposes `今日`, `卡片`, `全部`, and `搜索`.
- `今日` shows a stable daily entry and supports `换一条`.
- `全部` is simplified into a content-first feed with metadata visually reduced.
- `搜索` is a dedicated mobile-friendly surface.
- Existing share-card functionality remains available from relevant pages.
- Static export still succeeds.
- Type checking passes.
- No Mini Program code is introduced in this phase.

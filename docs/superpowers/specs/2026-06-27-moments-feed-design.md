# Moments Feed Design

## Context

`allen-diary` is a static Next.js 15 reading app for Zhang Xiaolong's Fanfou diary entries. The current mobile product already has four reading surfaces: `今日`, `卡片`, `全部`, and `搜索`.

The user provided a WeChat Moments-style reference and selected direction B: a feed where each diary entry reads like an individual Moments post with avatar, author name, content, metadata, tags, and lightweight actions.

This design scopes the change to the shared feed presentation. It should make continuous browsing feel more like Moments without turning the app into a social product.

## Goals

- Redesign the diary list item as a WeChat Moments-like post.
- Apply the new post style anywhere `DiaryFeedItem` is used, especially `/all` and `/search`.
- Preserve existing filtering, search highlighting, result navigation, sharing, and dark mode behavior.
- Keep the content readable and dense enough for archive browsing.
- Keep the implementation compatible with static export and the existing generated JSON data.

## Non-Goals

- No user accounts.
- No likes, comments, reply boxes, or social interactions.
- No manual edits to `src/data/*.json`.
- No parser changes.
- No route restructure.
- No change to the `今日` quote-card page.
- No change to the `/swipe` card-reading interaction.

## Recommended Approach

Use the existing shared `DiaryFeedItem` component as the main implementation boundary.

This keeps the change small and consistent:

- `/all` inherits the Moments-style stream because it already renders `DiaryFeedItem`.
- `/search` inherits the same result style and keeps search highlighting.
- Page-level filter drawers, result locators, and share overlays remain owned by their current pages.
- Data helpers in `src/lib/diary.ts` do not need to change unless a small display helper is needed.

The design should not introduce a new page or duplicate list component unless the shared component becomes too branch-heavy.

## Feed Item Design

Each item should be rendered as a single Moments-like post:

- Left column: fixed square avatar using the existing public app image, preferably `/frog-logo.png`.
- Right column: author name `张小龙` in muted WeChat-like blue.
- Body: diary content as the primary text, with existing search highlighting preserved.
- Metadata: compact line below the content with date, entry number, type, and time.
- Tags: optional subdued chips below metadata.
- Actions: page-provided actions such as `分享` and `进入卡片`, visually secondary and aligned near the metadata/action area.

Layout rules:

- Use a simple two-column row, avatar left and content right.
- Avoid large cards around every item.
- Use light dividers between posts.
- Keep the avatar size stable so long content does not shift layout.
- Keep long words and Chinese text wrapping inside the right column.
- Avoid nested card surfaces.
- Keep button text inside compact controls without overflow.

## Page Behavior

### `/all`

`/all` should continue to provide:

- Entry count summary.
- Month/tag filter drawer.
- Filter locator for previous/next target result.
- Share action for each entry.

The feed itself should look like a Moments stream rather than a generic article list.

### `/search`

`/search` should continue to provide:

- Search input and clear action.
- Result count and previous/next result navigation.
- Highlighted matched text inside the feed item.
- `进入卡片` and `分享` actions.
- Empty state when no results are found.

Search results should use the same Moments post component so the experience stays coherent.

## Visual Direction

Use a restrained WeChat-inspired style, not a literal clone:

- Background: existing `var(--background)`.
- Post background: transparent or very subtle `var(--card-bg)` only where needed.
- Divider: `var(--border)` at low visual weight.
- Author color: muted blue, compatible with dark mode.
- Metadata: `var(--secondary)`.
- Tags: existing tag color system, slightly subdued.
- Avatar: existing app/frog image with a small rounded square shape.

Dark mode must remain legible:

- Author color should not become too low contrast.
- Metadata and dividers should remain secondary.
- Tags should keep current dark-mode mappings.

## Component Boundaries

Primary component:

- `src/components/DiaryEntryView.tsx`
  - Update `DiaryFeedItem` markup and classes.
  - Keep `HighlightText` behavior unchanged.
  - Continue to accept `entry`, `query`, and `actions`.

Potential supporting changes:

- `src/app/globals.css`
  - Add only small reusable CSS if Tailwind utility classes become repetitive or if a stable custom color variable is cleaner.
- `.gitignore`
  - Ignore `.superpowers/` visual brainstorming artifacts.

No generated data files should be edited.

## Data Flow

The data flow remains unchanged:

1. `gzallen.md` is parsed by `scripts/parse.js`.
2. `src/data/*.json` is generated.
3. Pages import JSON at build time.
4. The static export writes to `dist/`.

This feature uses existing entry fields:

- `content`
- `timestamp`
- `date`
- `num`
- `type`
- `tags`
- `extraInfo` if already included by `formatEntryMetadata`

## Error Handling

- Empty content should still render without breaking the row layout.
- Missing tags should simply omit the tag row.
- Missing action nodes should omit the action area.
- Long content should wrap and keep the avatar column fixed.
- Search highlighting should not break if the query is empty.

## Testing

Run:

- `npx tsc --noEmit`
- `npm run build`

Do not run `npm run lint` in automation because the project notes say `next lint` enters an interactive setup prompt.

Manual browser verification should cover:

- `/all` on mobile width.
- `/search` with and without a query.
- Search highlighting in the new feed item.
- Share action still opens the existing share card.
- Dark mode visual contrast.

## Acceptance Criteria

- `/all` visually reads as a WeChat Moments-style stream.
- `/search` results use the same Moments-style item.
- Existing filter, locator, search, share, and card navigation behavior still works.
- TypeScript check passes.
- Static build passes.
- No generated JSON is manually changed.

# 张小龙饭否日记 · Design Tokens

本文件从现有代码（`src/app/globals.css`、`tailwind.config.js`、`src/components/ShareCard.tsx`、各页面组件）中提炼，作为产品的「单一事实来源」(single source of truth)。机器可读版本见同目录 [`design-tokens.json`](./design-tokens.json)。

> 命名采用三层结构（参考 W3C Design Tokens Format Module）：
> - **Primitive**：无语义的原子值（色板、字号刻度）
> - **Semantic**：随主题/用途变化的语义值（`--background`、`--primary`）
> - **Component**：组件级组合值（标签色、卡片阴影）

---

## 1. Color

### 1.1 品牌主色（Primitive · Sky 色板）

定义于 `tailwind.config.js` 的 `theme.extend.colors.primary`。整套 `primary` 源自 Tailwind **Sky** 系列，品牌锚点为 `primary-500 = #0ea5e9`。

| Token | HEX | 用途 |
|---|---|---|
| `primary-50` | `#f0f9ff` | 最浅底色 / hover |
| `primary-100` | `#e0f2fe` | 浅底 |
| `primary-200` | `#bae6fd` | — |
| `primary-300` | `#7dd3fc` | — |
| `primary-400` | `#38bdf8` | — |
| **`primary-500`** | **`#0ea5e9`** | **品牌色 / `--primary` / `viewport.themeColor`** |
| `primary-600` | `#0284c7` | 按下 / 强调 |
| `primary-700` | `#0369a1` | — |
| `primary-800` | `#075985` | — |
| `primary-900` | `#0c4a6e` | 最深 |

### 1.2 语义色（Semantic · 主题变量）

定义于 `globals.css` 的 `:root`（浅色）与 `.dark`（深色）。组件应引用 `var(--*)` 而非硬编码。`--primary` / `--secondary` 在深色模式不重写，跨主题沿用浅色值。

| Token | 浅色 | 深色 | 用途 |
|---|---|---|---|
| `--background` | `#fafafa` | `#0a0a0a` | 页面背景 |
| `--foreground` | `#1a1a1a` | `#e5e5e5` | 正文文字 |
| `--card-bg` | `#ffffff` | `#1a1a1a` | 卡片背景 |
| `--card-hover` | `#f8f9fa` | `#262626` | 卡片/列表项 hover |
| `--border` | `#e5e5e5` | `#262626` | 分隔线 / 卡片描边 / 滚动条 |
| `--primary` | `#0ea5e9` | `#0ea5e9` | 选中态 / 激活 / 强调 |
| `--secondary` | `#64748b` | `#64748b` | 次要文字 / 滚动条 hover |

**ShareCard 内固定的文本灰阶**（PNG 导出，不随主题变化）：

| 用途 | HEX |
|---|---|
| 主标题（用户名） | `#111827` |
| 正文 | `#1F2937` |
| 次要文字（日期 / 副标题） | `#9CA3AF` |
| 分隔线 | `#E5E7EB` |
| 卡片底渐变 | `linear-gradient(180deg, #ffffff 0%, #fafafa 100%)` |

### 1.3 强调渐变（Accent Gradient · 分享卡品牌视觉）

分享卡顶部彩条与头像统一使用「粉→橙」渐变，是产品在导出场景里的视觉签名。

| Token | 值 | 用途 |
|---|---|---|
| `accent-gradient` | `linear-gradient(135deg, #F472B6, #FB923C)` | 头像、顶部 accent bar |
| `accent-from` | `#F472B6` | pink-400 |
| `accent-to` | `#FB923C` | orange-400 |

### 1.4 标签色（Component · Tag）

14 个内容标签 + 1 个兜底。每个标签在「信息流卡片」与「分享卡 PNG」中分别使用不同的色组：

- **信息流卡片**（`globals.css` `.tag-*`）：浅色底 + 深色字（柔和、可读），深色模式改为半透明同色相底 + 浅色字。
- **分享卡**（`ShareCard.getTagColor`）：饱和的实心底 + 白字（PNG 中需高对比）。

| key | 中文标签 | 浅底 | 浅字 | 深底 | 深字 | 分享卡 HEX |
|---|---|---|---|---|---|---|
| `product` | 产品哲学 | `#eff6ff` | `#1d4ed8` | `rgb(30 58 138 / .3)` | `#93c5fd` | `#FF6B6B` |
| `insight` | 用户洞察 | `#faf5ff` | `#6b21a8` | `rgb(88 28 135 / .3)` | `#d8b4fe` | `#4ECDC4` |
| `internet` | 互联网思考 | `#f0fdf4` | `#166534` | `rgb(22 101 52 / .3)` | `#86efac` | `#45B7D1` |
| `tech` | 技术观点 | `#ecfeff` | `#164e63` | `rgb(22 78 99 / .3)` | `#a5f3fc` | `#96CEB4` |
| `book` | 读书笔记 | `#fffbeb` | `#78350f` | `rgb(120 53 15 / .3)` | `#fde69a` | `#F59E0B` |
| `life` | 生活随笔 | `#f9fafb` | `#374151` | `rgb(31 41 55)` | `#d1d5db` | `#DDA0DD` |
| `humor` | 幽默段子 | `#fdf2f8` | `#be185d` | `rgb(190 24 93 / .3)` | `#fbcfe8` | `#FF8C94` |
| `repost` | 转发引用 | `#eef2ff` | `#4338ca` | `rgb(55 48 163 / .3)` | `#c4b5fd` | `#60A5FA` |
| `fanfou` | 饭否相关 | `#ffedd5` | `#c2410c` | `rgb(194 65 12 / .3)` | `#fdba74` | `#FB923C` |
| `apple` | 苹果相关 | `#f8fafc` | `#334155` | `rgb(30 41 59)` | `#cbd5e1` | `#6B7280` |
| `google` | Google | `#fef2f2` | `#b91c1c` | `rgb(127 29 29 / .3)` | `#fecaca` | `#EF4444` |
| `wechat` | 微信相关 | `#ecfdf5` | `#059669` | `rgb(6 95 70 / .3)` | `#a7f3d0` | `#10B981` |
| `philosophy` | 哲学思考 | `#faf5ff` | `#6d28d9` | `rgb(88 28 135 / .3)` | `#d8b4fe` | `#8B5CF6` |
| `management` | 管理思考 | `#f0fdfa` | `#0f766e` | `rgb(19 78 74 / .3)` | `#99f6e4` | `#14B8A6` |
| `default` | （兜底） | — | — | — | — | `#6B7280` |

> ⚠️ 标签色三处需保持同步（见 `CLAUDE.md` Tag system）：`scripts/parse.js`（`tagRules`）、`globals.css`（`.tag-*`）、`ShareCard.tsx`（`getTagColor`）。改 token 时三处一起改。

---

## 2. Typography

### 2.1 字体族（Font Family）

| Token | 栈 | 来源 |
|---|---|---|
| `font-sans` | `var(--font-geist-sans), system-ui, sans-serif` | Tailwind 配置 |
| `font-mono` | `var(--font-geist-mono), monospace` | Tailwind 配置 |
| `body`（实际渲染） | `system-ui, -apple-system, sans-serif` | `globals.css` `body` |
| `share-card` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | `ShareCard.tsx` 内联 |

### 2.2 字号刻度（Type Scale）

采用 Tailwind 默认刻度（根字号 16px）：

| Token | rem | px | 典型用途 |
|---|---|---|---|
| `text-xs` | 0.75 | 12 | 标签、时间戳、辅助说明 |
| `text-sm` | 0.875 | 14 | 次要正文、月份项 |
| `text-base` | 1 | 16 | 正文基准 |
| `text-lg` | 1.125 | 18 | 标题 |
| `text-xl` | 1.25 | 20 | 二级标题 |
| `text-2xl` | 1.5 | 24 | 一级标题 |
| `text-3xl` | 1.875 | 30 | 大标题 |

分享卡（PNG）使用独立内联字号：`11 / 12 / 15 / 17 px`。

### 2.3 字重（Font Weight）

`400 normal` · `500 medium`（标签/正文强调）· `600 semibold`（标题/移动端正文加粗）· `700 bold`。

### 2.4 行高 / 字距

| Token | 值 | 用途 |
|---|---|---|
| `leading-body` | 1.6 | 全站正文默认 |
| `leading-card-content` | 1.75 | 分享卡正文 |
| `leading-tight` | 1.3 | 分享卡标题/副标题 |
| `tracking-content` | 0.01em | 分享卡正文字距 |

---

## 3. Spacing

4px 基础栅格（Tailwind 默认）。实际使用的高频刻度：

| Token | px | 典型用途 |
|---|---|---|
| `space-1` | 4 | `gap-1` |
| `space-2` | 8 | `gap-2`（最高频） |
| `space-3` | 12 | `gap-3` |
| `space-4` | 16 | `gap-4`、卡片 padding（移动） |
| `space-6` | 24 | `gap-6`、卡片 padding（`sm+`：`1.5rem`） |
| `space-7` | 28 | 分享卡 padding `28px` |
| `space-8` | 32 | — |

组件 padding 约定：
- 日记卡片：`1rem` → `1.5rem`（`@sm`）
- 标签：`0.25rem 0.625rem`（4/10）→ 移动端 `0.2rem 0.5rem`
- 月份项：`0.5rem 1rem`（8/16）

---

## 4. Radius

| Token | 值 | 用途 |
|---|---|---|
| `radius-pill` | `9999px` | 标签、圆形按钮、头像 |
| `radius-card` | `0.75rem` (12px) | 日记卡片（`diary-card`） |
| `radius-md` | `0.5rem` (8px) | 月份导航项 |
| `radius-xl` | `0.75rem` (12px) | 按钮 `rounded-xl` |
| `radius-2xl` | `1rem` (16px) | `rounded-2xl` |
| `radius-share` | `20px` | 分享卡 |
| `radius-scrollbar` | `4px` | 滚动条 thumb |

---

## 5. Shadow

| Token | 值 | 用途 |
|---|---|---|
| `shadow-card-mobile` | `0 1px 3px rgb(0 0 0 / 0.05)` | 卡片（移动端默认） |
| `shadow-card-hover` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | 卡片 hover（桌面） |
| `shadow-share` | `0 20px 60px rgba(0,0,0,0.15)` | 分享卡 |
| `shadow-sm` / `shadow-xl` | Tailwind 内建 | 通用 |

---

## 6. Breakpoints

Tailwind 默认断点；CSS 中实际的媒体查询切换点为 **639px / 640px / 1023px**：

| 断点 | 宽度 | 含义 |
|---|---|---|
| `sm` | ≥ 640px | 卡片 padding 加大、标签常规尺寸 |
| `md` | ≥ 768px | — |
| `lg` | ≥ 1024px | 桌面：卡片 hover 上浮、移动端加粗取消 |
| `xl` | ≥ 1280px | — |
| `2xl` | ≥ 1536px | — |

> CSS 显式写的是 `<640px`（标签缩小）、`<1024px`（移动端卡片阴影/加粗）、`≥640px`（卡片 padding）。

---

## 7. Motion

| Token | 值 | 用途 |
|---|---|---|
| `duration-fast` | `200ms` | hover / 通用过渡 |
| `duration-base` | `300ms` | 主题切换、卡片过渡、`fadeIn` |
| `duration-slide` | `320ms` | 滑卡入场 |
| `ease-out` | `ease-out` | `fadeIn`、通用 |
| `ease-slide` | `cubic-bezier(0.33, 1, 0.68, 1)` | 滑卡入场（类 easeOutExpo） |
| `press-scale` | `0.995` | 移动端按下缩放 |

关键帧：
- `fadeIn`：`translateY(10px) + opacity 0→1`，`0.3s ease-out`
- `slideInFromRight` / `slideInFromLeft`：`translateX(±100%) rotate(±12deg) → 0`，`320ms`

---

## 8. Z-index

| Token | 值 | 用途 |
|---|---|---|
| `z-overlay` | `100` | 分享卡全屏遮罩 |

---

## 9. Layout

| Token | 值 | 用途 |
|---|---|---|
| `container-feed` | `max-w-2xl` (672px) | 信息流主容器 |
| `container-md` | `max-w-md` (448px) | 中等容器 |
| `container-wide` | `max-w-7xl` (1280px) | 宽容器 |
| `share-card-width` | `360px` | 分享卡固定宽 |
| `scrollbar` | `8px` | 滚动条宽/高 |

---

## 10. Theme

| Token | 值 |
|---|---|
| 策略 | `class`（`.dark`） |
| 默认主题 | `light` |
| `viewport.themeColor` | `#0ea5e9` |
| 主题库 | `next-themes` |

---

## 维护约定

1. **改 token 先改本文件 + `design-tokens.json`**，再同步到代码。
2. **标签色三处同步**：`scripts/parse.js` · `globals.css` · `ShareCard.tsx`。
3. **主题变量优先**：组件用 `var(--*)` 而非硬编码颜色，保证深浅色都正确。
4. **分享卡例外**：`ShareCard` 为 `html2canvas` 导出使用内联硬编码色，不随主题变化（这是有意为之）。

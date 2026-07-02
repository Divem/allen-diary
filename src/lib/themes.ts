export type ThemeId = 'light' | 'dark' | 'sepia' | 'forest'

export interface ThemeOption {
  id: ThemeId
  label: string
  icon: string
}

// 可选主题列表。新增主题时：
// 1. 在此处追加；
// 2. 在 globals.css 中为 `.theme-id` 编写 CSS 变量；
// 3. 若为深色系主题，把对应的 `.dark .tag-*` 选择器补充上新 class。
export const THEMES: ThemeOption[] = [
  { id: 'light', label: '浅色', icon: '☀️' },
  { id: 'dark', label: '深色', icon: '🌙' },
  { id: 'sepia', label: '护眼', icon: '📜' },
  { id: 'forest', label: '墨绿', icon: '🌲' },
]

export const THEME_IDS: ThemeId[] = THEMES.map((t) => t.id)

export function getThemeOption(id: string | undefined): ThemeOption {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

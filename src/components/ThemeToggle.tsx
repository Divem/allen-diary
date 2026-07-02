'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { THEMES, getThemeOption } from '@/lib/themes'

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 点击外部或按 Esc 关闭菜单
  useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full bg-[var(--card-hover)] border border-[var(--border)] flex items-center justify-center">
        <span className="text-lg">🌓</span>
      </button>
    )
  }

  // 未显式选择主题时（跟随系统），用 resolvedTheme 做高亮回退
  const activeId = theme ?? resolvedTheme
  const current = getThemeOption(activeId)

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-[var(--card-hover)] border border-[var(--border)] flex items-center justify-center hover:scale-105 transition-transform"
        title={`主题：${current.label}`}
        aria-label="选择主题"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-lg" role="img" aria-label={current.label}>
          {current.icon}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-32 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-lg overflow-hidden z-50 animate-fade-in"
        >
          {THEMES.map((t) => {
            const active = t.id === activeId
            return (
              <button
                key={t.id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'hover:bg-[var(--card-hover)]'
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full bg-[var(--card-hover)] border border-[var(--border)] flex items-center justify-center">
        <span className="text-lg">🌓</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full bg-[var(--card-hover)] border border-[var(--border)] flex items-center justify-center hover:scale-105 transition-transform"
      title={theme === 'dark' ? '切换到浅色' : '切换到深色'}
    >
      {theme === 'dark' ? (
        <span className="text-lg" role="img" aria-label="浅色模式">☀️</span>
      ) : (
        <span className="text-lg" role="img" aria-label="深色模式">🌙</span>
      )}
    </button>
  )
}

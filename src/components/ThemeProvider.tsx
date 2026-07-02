'use client'

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { THEME_IDS } from '@/lib/themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider themes={THEME_IDS} {...props}>
      {children}
    </NextThemesProvider>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

const tabs = [
  { href: '/', label: '今日', icon: TodayIcon },
  { href: '/swipe', label: '卡片', icon: CardsIcon },
  { href: '/all', label: '全部', icon: ListIcon },
  { href: '/search', label: '搜索', icon: SearchIcon },
]

export function MobilePage({
  title,
  subtitle,
  actions,
  children,
  withBottomNav = true,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  withBottomNav?: boolean
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/frog-logo.png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-xl border border-[var(--border)] bg-white object-cover"
            />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold leading-tight">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-[var(--secondary)]">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className={withBottomNav ? 'pb-24' : undefined}>{children}</main>
      {withBottomNav && <BottomTabBar />}
    </div>
  )
}

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--background)]/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs transition-colors ${
                active
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'text-[var(--secondary)] hover:bg-[var(--card-hover)]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function TodayIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CardsIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-9 4h10m-8 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  )
}

function ListIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

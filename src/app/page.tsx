'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import diaryData from '@/data/diary.json'
import statsData from '@/data/stats.json'
import ShareCard from '@/components/ShareCard'
import ThemeToggle from '@/components/ThemeToggle'

// 高亮匹配文本
function highlightText(text: string, query: string): React.ReactNode {
  const q = query.trim()
  if (!q) return text
  const result: React.ReactNode[] = []
  const lower = text.toLowerCase()
  const qLower = q.toLowerCase()
  let i = 0
  let key = 0
  while (i < text.length) {
    const idx = lower.indexOf(qLower, i)
    if (idx === -1) {
      result.push(text.slice(i))
      break
    }
    if (idx > i) result.push(text.slice(i, idx))
    result.push(
      <mark
        key={key++}
        className="bg-yellow-200 dark:bg-yellow-500/40 text-[var(--foreground)] rounded px-0.5"
      >
        {text.slice(idx, idx + q.length)}
      </mark>
    )
    i = idx + q.length
  }
  return <>{result}</>
}

interface DiaryEntry {
  id: number
  num: number
  content: string
  date: string
  timestamp: string
  year: number
  month: number
  type: 'original' | 'repost' | 'reply'
  extraInfo: string
  tags: string[]
  tagsCount: number
}

// 标签映射
const tagClassMap: Record<string, string> = {
  '产品哲学': 'tag-product',
  '用户洞察': 'tag-insight',
  '互联网思考': 'tag-internet',
  '技术观点': 'tag-tech',
  '读书笔记': 'tag-book',
  '生活随笔': 'tag-life',
  '幽默段子': 'tag-humor',
  '转发引用': 'tag-repost',
  '饭否相关': 'tag-fanfou',
  '苹果相关': 'tag-apple',
  'Google': 'tag-google',
  '微信相关': 'tag-wechat',
  '哲学思考': 'tag-philosophy',
  '管理思考': 'tag-management',
}

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [shareEntry, setShareEntry] = useState<DiaryEntry | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const entryRefs = useRef<Record<number, HTMLElement | null>>({})
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  // 进入搜索模式后自动聚焦输入框
  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus()
    }
  }, [isMobileSearchOpen])

  // 按月分组
  const entriesByMonth = useMemo(() => {
    const grouped: Record<string, DiaryEntry[]> = {}
    ;(diaryData as DiaryEntry[]).forEach((entry) => {
      const key = `${entry.year}-${String(entry.month).padStart(2, '0')}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(entry)
    })
    return grouped
  }, [])

  // 所有月份列表
  const months = useMemo(() => {
    return Object.keys(entriesByMonth).sort().reverse()
  }, [entriesByMonth])

  // 所有标签
  const allTags = statsData.tags as string[]

  // 过滤后的条目
  const filteredEntries = useMemo(() => {
    let entries: DiaryEntry[] = diaryData as DiaryEntry[]

    // 按月份筛选
    if (selectedMonth !== 'all') {
      entries = entriesByMonth[selectedMonth] || []
    }

    // 按标签筛选
    if (selectedTags.size > 0) {
      entries = entries.filter(entry =>
        entry.tags.some(tag => selectedTags.has(tag))
      )
    }

    // 按搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      entries = entries.filter(entry =>
        entry.content.toLowerCase().includes(query)
      )
    }

    return entries
  }, [selectedMonth, selectedTags, searchQuery, entriesByMonth, diaryData])

  // 搜索/筛选变化时重置匹配索引
  useEffect(() => {
    setCurrentMatchIndex(0)
  }, [searchQuery, selectedMonth, selectedTags])

  // 当前匹配变化时滚动到对应条目（仅在搜索时）
  useEffect(() => {
    if (!searchQuery.trim()) return
    const entry = filteredEntries[currentMatchIndex]
    if (!entry) return
    const el = entryRefs.current[entry.id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentMatchIndex, searchQuery, filteredEntries])

  const gotoPrevMatch = () => {
    if (filteredEntries.length === 0) return
    setCurrentMatchIndex((i) => (i - 1 + filteredEntries.length) % filteredEntries.length)
  }

  const gotoNextMatch = () => {
    if (filteredEntries.length === 0) return
    setCurrentMatchIndex((i) => (i + 1) % filteredEntries.length)
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
    setSearchQuery('')
  }

  // 切换标签
  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags)
    if (newTags.has(tag)) {
      newTags.delete(tag)
    } else {
      newTags.add(tag)
    }
    setSelectedTags(newTags)
  }

  // 清除筛选
  const clearFilters = () => {
    setSelectedMonth('all')
    setSelectedTags(new Set())
    setSearchQuery('')
  }

  // 格式化日期显示
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    return `${year}年${parseInt(month)}月`
  }

  // 类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repost': return '🔄'
      case 'reply': return '↩️'
      default: return '✍️'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--secondary)]">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-14 sm:pt-16">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* 手机端搜索模式 - 仅在 sm 以下且开启搜索时显示 */}
          {isMobileSearchOpen && (
            <div className="flex sm:hidden items-center gap-2 h-14">
              <button
                onClick={closeMobileSearch}
                className="p-2 -ml-2 rounded-full hover:bg-[var(--card-hover)] transition-colors shrink-0"
                aria-label="关闭搜索"
              >
                <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="relative flex-1 min-w-0">
                <input
                  ref={mobileSearchInputRef}
                  type="search"
                  enterKeyHint="search"
                  placeholder="搜索日记..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-full bg-[var(--card-hover)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)]">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[var(--secondary)] hover:bg-[var(--border)]"
                    aria-label="清空"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 常规 header - 桌面总是显示；手机端搜索模式下隐藏 */}
          <div className={`${isMobileSearchOpen ? 'hidden sm:flex' : 'flex'} items-center justify-between h-14 sm:h-16`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="text-xl sm:text-2xl">📔</div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold truncate">张小龙饭否日记</h1>
                <p className="text-xs text-[var(--secondary)] hidden sm:block">
                  我所说的，都是错的
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* 桌面端搜索框 */}
              <div className="relative hidden sm:block">
                <input
                  type="search"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 rounded-full bg-[var(--card-hover)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)] text-sm">🔍</span>
              </div>

              {/* 手机端搜索图标按钮 */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg bg-[var(--card-hover)] border border-[var(--border)]"
                aria-label="搜索"
              >
                <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 卡片模式入口 */}
              <Link
                href="/swipe"
                className="p-2 rounded-lg bg-[var(--card-hover)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                title="卡片模式"
              >
                <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </Link>

              {/* 移动端筛选按钮 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 rounded-lg bg-[var(--card-hover)] border border-[var(--border)]"
                aria-label="筛选"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* 搜索结果导航条 - sticky 紧贴 header 下方 */}
      {searchQuery.trim() && (
        <div className="sticky top-14 sm:top-16 z-40 bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--secondary)] min-w-0 truncate">
              {filteredEntries.length > 0 ? (
                <>
                  找到 <b className="text-[var(--foreground)]">{filteredEntries.length}</b> 条 · 第{' '}
                  <b className="text-[var(--primary)]">{currentMatchIndex + 1}</b> 条
                </>
              ) : (
                <>无匹配结果</>
              )}
            </span>
            {filteredEntries.length > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={gotoPrevMatch}
                  className="p-2 rounded-lg text-[var(--secondary)] hover:bg-[var(--card-hover)] active:scale-95 transition-all"
                  aria-label="上一条"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={gotoNextMatch}
                  className="p-2 rounded-lg text-[var(--secondary)] hover:bg-[var(--card-hover)] active:scale-95 transition-all"
                  aria-label="下一条"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* 左侧边栏 - 桌面端显示 / 移动端抽屉 */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
            <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-6">
              {/* 时间轴 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span>📅</span> 时间轴
                </h3>
                <div className="space-y-1 max-h-48 lg:max-h-80 overflow-y-auto">
                  <button
                    onClick={() => setSelectedMonth('all')}
                    className={`month-item w-full text-left text-sm ${selectedMonth === 'all' ? 'active' : ''}`}
                  >
                    全部 ({diaryData.length})
                  </button>
                  {months.map(month => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`month-item w-full text-left text-sm ${selectedMonth === month ? 'active' : ''}`}
                    >
                      {formatMonth(month)} ({entriesByMonth[month].length})
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签筛选 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span>🏷️</span> 标签筛选
                  {selectedTags.size > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[var(--primary)] hover:underline"
                    >
                      清除
                    </button>
                  )}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`tag ${tagClassMap[tag] || 'tag-life'} text-xs ${selectedTags.has(tag) ? 'ring-2 ring-offset-1 ring-[var(--primary)]' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            {/* 状态栏 */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div className="text-[var(--secondary)] text-sm">
                显示 {filteredEntries.length} 条
                {selectedMonth !== 'all' && <span> · {formatMonth(selectedMonth)}</span>}
                {selectedTags.size > 0 && <span> · {selectedTags.size} 个标签</span>}
              </div>
              {(selectedMonth !== 'all' || selectedTags.size > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  清除筛选
                </button>
              )}
            </div>

            {/* 日记卡片流 - 移动端卡片布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              {filteredEntries.map((entry, index) => {
                const isCurrentMatch =
                  !!searchQuery.trim() &&
                  filteredEntries[currentMatchIndex]?.id === entry.id
                return (
                <article
                  key={entry.id}
                  ref={(el) => {
                    entryRefs.current[entry.id] = el
                  }}
                  className={`diary-card animate-fade-in group relative p-4 sm:p-6 scroll-mt-28 sm:scroll-mt-32 ${
                    isCurrentMatch ? 'ring-2 ring-[var(--primary)] border-[var(--primary)]' : ''
                  }`}
                  style={{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
                >
                  {/* 分享按钮 */}
                  <button
                    onClick={() => setShareEntry(entry)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="分享卡片"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>

                  {/* 移动端卡片布局 */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* 日期 - 移动端横向显示 */}
                    <div className="flex sm:flex-col items-center sm:w-16 gap-2 sm:gap-0">
                      <div className="text-base sm:text-xl font-bold text-[var(--primary)]">
                        {entry.month}/{entry.date.split('-')[2].replace(/^0/, '')}
                      </div>
                      <div className="text-xs text-[var(--secondary)]">
                        {entry.year}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-base" title={entry.type}>
                          {getTypeIcon(entry.type)}
                        </span>
                        <span className="text-xs text-[var(--secondary)] flex items-center gap-1 sm:gap-2 flex-wrap">
                          <span>#{entry.num}</span>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline">{entry.timestamp.split(' ')[1]}</span>
                          {entry.extraInfo && (
                            <>
                              <span>·</span>
                              <span className="text-[var(--primary)]">{entry.extraInfo}</span>
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed mb-3 break-words">
                        {highlightText(entry.content, searchQuery)}
                      </p>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className={`tag ${tagClassMap[tag] || 'tag-life'} text-xs cursor-pointer hover:opacity-80`}
                              onClick={() => toggleTag(tag)}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
                )
              })}
            </div>

            {/* 空状态 */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4">🍃</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">没有找到匹配的内容</h3>
                <p className="text-[var(--secondary)] mb-6 text-sm">试试调整筛选条件</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  清除筛选
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 底部 */}
      <footer className="border-t border-[var(--border)] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--secondary)]">
          <p>张小龙饭否日记 · {statsData.yearRange.start} - {statsData.yearRange.end}</p>
          <p className="mt-2">用优雅的方式阅读思考</p>
        </div>
      </footer>

      {/* 分享卡片弹窗 */}
      {shareEntry && (
        <ShareCard
          content={shareEntry.content}
          date={shareEntry.date}
          timestamp={shareEntry.timestamp}
          tags={shareEntry.tags}
          onClose={() => setShareEntry(null)}
        />
      )}
    </div>
  )
}

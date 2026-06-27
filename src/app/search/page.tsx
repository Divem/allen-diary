'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import diaryData from '@/data/diary.json'
import statsData from '@/data/stats.json'
import { DiaryFeedItem } from '@/components/DiaryEntryView'
import { MobilePage } from '@/components/MobileChrome'
import ShareCard from '@/components/ShareCard'
import { type DiaryEntry, filterEntries, tagClassMap } from '@/lib/diary'

const entries = diaryData as DiaryEntry[]
const hotTags = (statsData.tags as string[]).slice(0, 8)

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shareEntry, setShareEntry] = useState<DiaryEntry | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const entryRefs = useRef<Record<number, HTMLElement | null>>({})

  const results = useMemo(() => filterEntries(entries, query), [query])
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [query])

  useEffect(() => {
    if (!hasQuery || results.length === 0) return
    const entry = results[currentIndex]
    entryRefs.current[entry.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentIndex, hasQuery, results])

  const gotoPrev = () => {
    if (results.length === 0) return
    setCurrentIndex((i) => (i - 1 + results.length) % results.length)
  }

  const gotoNext = () => {
    if (results.length === 0) return
    setCurrentIndex((i) => (i + 1) % results.length)
  }

  return (
    <MobilePage title="搜索" subtitle="按关键词查找饭否日记">
      <div className="sticky top-14 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              enterKeyHint="search"
              placeholder="搜索日记内容、标签、日期..."
              className="w-full rounded-full border border-[var(--border)] bg-[var(--card-bg)] py-3 pl-11 pr-10 text-base outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary)]"
            />
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--secondary)] hover:bg-[var(--card-hover)]"
                aria-label="清空搜索"
              >
                ×
              </button>
            )}
          </div>

          {hasQuery && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="min-w-0 truncate text-[var(--secondary)]">
                {results.length > 0 ? (
                  <>
                    找到 <b className="text-[var(--foreground)]">{results.length}</b> 条 · 第{' '}
                    <b className="text-[var(--primary)]">{currentIndex + 1}</b> 条
                  </>
                ) : (
                  '没有匹配内容'
                )}
              </p>
              {results.length > 0 && (
                <div className="flex shrink-0 gap-1">
                  <button onClick={gotoPrev} className="rounded-lg px-2 py-1 text-[var(--secondary)]">上一条</button>
                  <button onClick={gotoNext} className="rounded-lg px-2 py-1 text-[var(--secondary)]">下一条</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {!hasQuery && (
          <section className="px-4 py-5">
            <p className="mb-3 text-sm text-[var(--secondary)]">热门标签</p>
            <div className="flex flex-wrap gap-2">
              {hotTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className={`tag ${tagClassMap[tag] || 'tag-life'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </section>
        )}

        {hasQuery && results.length === 0 && (
          <div className="px-4 py-16 text-center">
            <div className="mb-4 text-5xl">🍃</div>
            <h2 className="mb-2 text-lg font-semibold">没有找到匹配的内容</h2>
            <p className="mb-6 text-sm text-[var(--secondary)]">换个关键词试试</p>
            <button
              onClick={() => setQuery('')}
              className="rounded-full bg-[var(--primary)] px-5 py-2 font-medium text-white"
            >
              清空搜索
            </button>
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <section>
            {results.map((entry) => {
              const active = results[currentIndex]?.id === entry.id
              return (
                <div
                  key={entry.id}
                  ref={(el) => {
                    entryRefs.current[entry.id] = el
                  }}
                  className={active ? 'bg-[var(--primary)]/5 ring-1 ring-inset ring-[var(--primary)]/30' : undefined}
                >
                  <DiaryFeedItem
                    entry={entry}
                    query={query}
                    actions={
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/swipe?entry=${entry.id}`}
                          className="rounded-full px-3 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
                        >
                          进入卡片
                        </Link>
                        <button
                          onClick={() => setShareEntry(entry)}
                          className="rounded-full px-3 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
                        >
                          分享
                        </button>
                      </div>
                    }
                  />
                </div>
              )
            })}
          </section>
        )}
      </div>

      {shareEntry && (
        <ShareCard
          content={shareEntry.content}
          date={shareEntry.date}
          timestamp={shareEntry.timestamp}
          tags={shareEntry.tags}
          onClose={() => setShareEntry(null)}
        />
      )}
    </MobilePage>
  )
}

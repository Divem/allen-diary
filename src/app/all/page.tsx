'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import diaryData from '@/data/diary.json'
import statsData from '@/data/stats.json'
import { DiaryFeedItem } from '@/components/DiaryEntryView'
import { MobilePage } from '@/components/MobileChrome'
import ShareCard from '@/components/ShareCard'
import {
  type DiaryEntry,
  formatMonth,
  groupEntriesByMonth,
  tagClassMap,
} from '@/lib/diary'

const entries = diaryData as DiaryEntry[]
const allTags = statsData.tags as string[]

export default function AllPage() {
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [shareEntry, setShareEntry] = useState<DiaryEntry | null>(null)
  const entryRefs = useRef<Record<number, HTMLElement | null>>({})

  const entriesByMonth = useMemo(() => groupEntriesByMonth(entries), [])
  const months = useMemo(() => Object.keys(entriesByMonth).sort().reverse(), [entriesByMonth])

  const targetEntries = useMemo(() => {
    let targets = entries

    if (selectedMonth !== 'all') {
      targets = targets.filter(
        (entry) =>
          `${entry.year}-${String(entry.month).padStart(2, '0')}` === selectedMonth
      )
    }

    if (selectedTags.size > 0) {
      targets = targets.filter((entry) =>
        entry.tags.some((tag) => selectedTags.has(tag))
      )
    }

    return targets
  }, [selectedMonth, selectedTags])

  useEffect(() => {
    setCurrentTargetIndex(0)
  }, [selectedMonth, selectedTags])

  useEffect(() => {
    if (targetEntries.length === 0 || targetEntries.length === entries.length) return
    const entry = targetEntries[currentTargetIndex]
    const el = entryRefs.current[entry.id]
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentTargetIndex, targetEntries])

  useEffect(() => {
    if (!showFilters) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [showFilters])

  const hasLocator = selectedMonth !== 'all' || selectedTags.size > 0

  const clearFilters = () => {
    setSelectedMonth('all')
    setSelectedTags(new Set())
    setCurrentTargetIndex(0)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((tags) => {
      const next = new Set(tags)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const gotoPrevTarget = () => {
    if (targetEntries.length === 0) return
    setCurrentTargetIndex((i) => (i - 1 + targetEntries.length) % targetEntries.length)
  }

  const gotoNextTarget = () => {
    if (targetEntries.length === 0) return
    setCurrentTargetIndex((i) => (i + 1) % targetEntries.length)
  }

  return (
    <MobilePage
      title="全部"
      subtitle={`${entries.length} 条思考`}
      actions={
        <>
          <Link
            href="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--secondary)]"
            aria-label="搜索"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--secondary)]"
            aria-label="筛选"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </>
      }
    >
      {hasLocator && (
        <div className="sticky top-14 z-30 border-b border-[var(--border)] bg-[var(--background)]/92 px-4 py-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm text-[var(--secondary)]">
              定位 {targetEntries.length} 条
              {selectedMonth !== 'all' && ` · ${formatMonth(selectedMonth)}`}
              {selectedTags.size > 0 && ` · ${selectedTags.size} 个标签`}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button onClick={gotoPrevTarget} className="rounded-lg px-2 py-1 text-[var(--secondary)]">上一条</button>
              <button onClick={gotoNextTarget} className="rounded-lg px-2 py-1 text-[var(--secondary)]">下一条</button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--secondary)]">
            <span>{entries.length} 条思考</span>
            {hasLocator ? (
              <button onClick={clearFilters} className="font-medium text-[var(--primary)]">
                清除定位
              </button>
            ) : (
              <button onClick={() => setShowFilters(true)} className="font-medium text-[var(--primary)]">
                筛选
              </button>
            )}
          </div>
        </div>

        <section className="bg-[var(--background)]">
          {entries.map((entry) => {
            const isActive =
              hasLocator && targetEntries[currentTargetIndex]?.id === entry.id

            return (
              <div
                key={entry.id}
                ref={(el) => {
                  entryRefs.current[entry.id] = el
                }}
                className={`relative after:absolute after:bottom-0 after:left-[4.25rem] after:right-4 after:h-px after:bg-[var(--border)] after:opacity-45 last:after:hidden dark:after:opacity-35 ${
                  isActive ? 'bg-[var(--primary)]/5 ring-1 ring-inset ring-[var(--primary)]/30' : ''
                }`}
              >
                <DiaryFeedItem
                  entry={entry}
                  actions={
                    <button
                      onClick={() => setShareEntry(entry)}
                      className="rounded-full px-3 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
                    >
                      分享
                    </button>
                  }
                />
              </div>
            )
          })}
        </section>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <aside
            className="ml-auto h-full w-80 max-w-[86vw] overflow-y-auto border-l border-[var(--border)] bg-[var(--background)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur-xl">
              <h2 className="font-semibold">筛选定位</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-2 text-[var(--secondary)] hover:bg-[var(--card-hover)]"
                aria-label="关闭筛选"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-4">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium">时间</h3>
                  <button onClick={() => setSelectedMonth('all')} className="text-sm text-[var(--primary)]">
                    全部
                  </button>
                </div>
                <div className="space-y-1">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month)
                        setShowFilters(false)
                      }}
                      className={`month-item ${selectedMonth === month ? 'active' : ''}`}
                    >
                      {formatMonth(month)} ({entriesByMonth[month].length})
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium">标签</h3>
                  {selectedTags.size > 0 && (
                    <button onClick={() => setSelectedTags(new Set())} className="text-sm text-[var(--primary)]">
                      清除
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`tag ${tagClassMap[tag] || 'tag-life'} ${
                        selectedTags.has(tag) ? 'ring-2 ring-[var(--primary)]' : 'opacity-75'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}

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

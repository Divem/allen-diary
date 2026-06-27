'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import diaryData from '@/data/diary.json'
import statsData from '@/data/stats.json'
import { QuoteCard } from '@/components/DiaryEntryView'
import { MobilePage } from '@/components/MobileChrome'
import ShareCard from '@/components/ShareCard'
import {
  type DiaryEntry,
  getDailyEntry,
  getRandomEntry,
  formatEntryDate,
  formatTime,
  getTypeLabel,
} from '@/lib/diary'

const entries = diaryData as DiaryEntry[]

export default function TodayPage() {
  const fallbackEntry = entries[0]
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(fallbackEntry)
  const [seenIds, setSeenIds] = useState<Set<number>>(
    () => new Set(fallbackEntry ? [fallbackEntry.id] : [])
  )
  const [shareEntry, setShareEntry] = useState<DiaryEntry | null>(null)

  useEffect(() => {
    const dailyEntry = getDailyEntry(entries, new Date())
    if (!dailyEntry) return

    setCurrentEntry(dailyEntry)
    setSeenIds(new Set([dailyEntry.id]))
  }, [])

  const statsLabel = useMemo(() => {
    const yearRange = statsData.yearRange
    return `${statsData.totalEntries} 条思考 · ${yearRange.start}-${yearRange.end}`
  }, [])

  const handleNextEntry = () => {
    const next = getRandomEntry(entries, seenIds)
    if (!next) return

    setCurrentEntry(next)
    setSeenIds((ids) => {
      const nextIds = new Set(ids)
      if (nextIds.size >= entries.length - 1) {
        return new Set([next.id])
      }
      nextIds.add(next.id)
      return nextIds
    })
  }

  return (
    <MobilePage title="今日" subtitle={statsLabel}>
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-2xl flex-col px-4 py-5">
        {currentEntry ? (
          <>
            <section className="mb-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--primary)]">每日一条</p>
                  <p className="text-xs text-[var(--secondary)]">
                    {formatEntryDate(currentEntry)} {formatTime(currentEntry)}
                  </p>
                </div>
                <button
                  onClick={() => setShareEntry(currentEntry)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  aria-label="分享"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              <QuoteCard
                entry={currentEntry}
                eyebrow="张小龙饭否日记"
                metadata={`#${currentEntry.num} · ${getTypeLabel(currentEntry.type)}`}
              />
            </section>

            <div className="mt-auto grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleNextEntry}
                className="min-h-12 rounded-full bg-[var(--primary)] px-5 font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
              >
                换一条
              </button>
              <Link
                href={`/swipe?entry=${currentEntry.id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-5 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--primary)]"
                aria-label="从这条开始连续阅读前后内容"
              >
                从这条连读
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-[var(--secondary)]">
            暂无可阅读内容
          </div>
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

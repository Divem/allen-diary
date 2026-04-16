'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import diaryData from '@/data/diary.json'
import ShareCard from '@/components/ShareCard'
import ThemeToggle from '@/components/ThemeToggle'

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

const SWIPE_THRESHOLD = 80

function Card({
  entry,
  onShare,
}: {
  entry: DiaryEntry
  onShare: (e: React.MouseEvent) => void
}) {
  const formatDate = (entry: DiaryEntry) => {
    return `${entry.year}年${entry.month}月${entry.date.split('-')[2].replace(/^0/, '')}日`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'repost': return '转发'
      case 'reply': return '回复'
      default: return '原创'
    }
  }

  return (
    <div className="w-full max-w-md bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-xl p-6 sm:p-8 relative select-none h-full flex flex-col">
      <button
        onClick={onShare}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
      >
        <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      <div className="flex items-center gap-2 mb-6 text-sm text-[var(--secondary)]">
        <span>{formatDate(entry)}</span>
        <span>·</span>
        <span>#{entry.num}</span>
        <span>·</span>
        <span className="text-[var(--primary)]">{getTypeLabel(entry.type)}</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <p className="text-xl sm:text-2xl leading-relaxed mb-8 font-medium break-words">
          {entry.content}
        </p>
      </div>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {entry.tags.map(tag => (
            <span
              key={tag}
              className={`tag ${tagClassMap[tag] || 'tag-life'} text-xs`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {entry.extraInfo && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-sm text-[var(--secondary)]">
          {entry.extraInfo}
        </div>
      )}
    </div>
  )
}

export default function SwipePage() {
  const entries = useMemo(() => (diaryData as DiaryEntry[]).slice().reverse(), [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isVerticalScroll, setIsVerticalScroll] = useState(false)

  const [phase, setPhase] = useState<'idle' | 'exiting'>('idle')
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)

  const [shareEntry, setShareEntry] = useState<DiaryEntry | null>(null)

  const currentEntry = entries[currentIndex]
  const pendingEntry = pendingIndex !== null ? entries[pendingIndex] : null

  const ANIMATION_DURATION = 320

  const goNext = useCallback(() => {
    if (currentIndex < entries.length - 1 && phase === 'idle') {
      setPendingIndex(currentIndex + 1)
      setSlideDir('left')
      setPhase('exiting')
      setTimeout(() => {
        setCurrentIndex(i => i + 1)
        setPhase('idle')
        setPendingIndex(null)
        setOffsetX(0)
      }, ANIMATION_DURATION)
    } else {
      setOffsetX(0)
    }
  }, [currentIndex, entries.length, phase])

  const goPrev = useCallback(() => {
    if (currentIndex > 0 && phase === 'idle') {
      setPendingIndex(currentIndex - 1)
      setSlideDir('right')
      setPhase('exiting')
      setTimeout(() => {
        setCurrentIndex(i => i - 1)
        setPhase('idle')
        setPendingIndex(null)
        setOffsetX(0)
      }, ANIMATION_DURATION)
    } else {
      setOffsetX(0)
    }
  }, [currentIndex, phase])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (phase !== 'idle') return
    setIsDragging(true)
    setIsVerticalScroll(false)
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || phase !== 'idle') return
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY
    const deltaX = x - startX
    const deltaY = y - startY

    // If vertical movement dominates, cancel drag and allow scrolling
    if (!isVerticalScroll && Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsVerticalScroll(true)
      setIsDragging(false)
      setOffsetX(0)
      return
    }

    if (isVerticalScroll) return

    setOffsetX(deltaX)
  }

  const handleTouchEnd = () => {
    if (!isDragging || phase !== 'idle') return
    setIsDragging(false)
    if (offsetX > SWIPE_THRESHOLD) {
      goPrev()
    } else if (offsetX < -SWIPE_THRESHOLD) {
      goNext()
    } else {
      setOffsetX(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (phase !== 'idle') return
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || phase !== 'idle') return
    const delta = e.clientX - startX
    setOffsetX(delta)
  }

  const handleMouseUp = () => {
    if (!isDragging || phase !== 'idle') return
    setIsDragging(false)
    if (offsetX > SWIPE_THRESHOLD) {
      goPrev()
    } else if (offsetX < -SWIPE_THRESHOLD) {
      goNext()
    } else {
      setOffsetX(0)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const overlayOpacity = Math.min(Math.abs(offsetX) / SWIPE_THRESHOLD, 1)

  const currentCardStyle: React.CSSProperties = (() => {
    if (phase === 'idle') {
      return {
        transform: `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)`,
        transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    }
    // exiting phase: old card stays underneath, new card slides in on top
    return {
      transform: 'translateX(0) rotate(0deg)',
      opacity: 1,
      transition: 'transform 0.2s ease-out',
      zIndex: 0,
    }
  })()

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-[var(--card-hover)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-base font-semibold">卡片模式</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--secondary)]">
              {currentIndex + 1} / {entries.length}
            </span>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主卡片区 */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* 进度条 */}
        <div className="w-full h-1 bg-[var(--border)]">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / entries.length) * 100}%` }}
          />
        </div>

        {/* 卡片容器 */}
        <div
          className="flex-1 relative flex items-center justify-center px-4 py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 提示文字 */}
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none transition-opacity duration-200"
            style={{ opacity: offsetX > 20 ? overlayOpacity : 0 }}
          >
            <div className="border-4 border-green-500 text-green-500 rounded-xl px-4 py-2 font-bold text-xl rotate-[-12deg]">
              上一张
            </div>
          </div>
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none transition-opacity duration-200"
            style={{ opacity: offsetX < -20 ? overlayOpacity : 0 }}
          >
            <div className="border-4 border-red-500 text-red-500 rounded-xl px-4 py-2 font-bold text-xl rotate-[12deg]">
              下一张
            </div>
          </div>

          {/* 卡片堆叠 */}
          <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] max-h-[70vh]">
            {/* 入场卡片 */}
            {phase === 'exiting' && pendingEntry && (
              <div
                key={pendingEntry.id}
                className={`absolute inset-0 z-10 ${
                  slideDir === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                }`}
              >
                <Card
                  entry={pendingEntry}
                  onShare={(e) => {
                    e.stopPropagation()
                    setShareEntry(pendingEntry)
                  }}
                />
              </div>
            )}

            {/* 当前卡片 */}
            <div
              key={currentEntry.id}
              className="absolute inset-0 z-10"
              style={currentCardStyle}
            >
              <Card
                entry={currentEntry}
                onShare={(e) => {
                  e.stopPropagation()
                  setShareEntry(currentEntry)
                }}
              />
            </div>
          </div>
        </div>

        {/* 底部控制区 */}
        <div className="px-6 pb-8 pt-2">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0 || phase !== 'idle'}
              className="w-14 h-14 rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-xs text-[var(--secondary)] mb-1">左右滑动切换</div>
              <div className="text-sm font-medium">{currentIndex + 1} / {entries.length}</div>
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === entries.length - 1 || phase !== 'idle'}
              className="w-14 h-14 rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* 分享弹窗 */}
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

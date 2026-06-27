'use client'

import { type ReactNode } from 'react'
import {
  type DiaryEntry,
  formatEntryMetadata,
  tagClassMap,
} from '@/lib/diary'

export function HighlightText({
  text,
  query,
}: {
  text: string
  query: string
}) {
  const q = query.trim()
  if (!q) return <>{text}</>

  const result: ReactNode[] = []
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
        className="rounded bg-yellow-200 px-0.5 text-[var(--foreground)] dark:bg-yellow-500/35"
      >
        {text.slice(idx, idx + q.length)}
      </mark>
    )
    i = idx + q.length
  }

  return <>{result}</>
}

export function DiaryFeedItem({
  entry,
  query = '',
  actions,
}: {
  entry: DiaryEntry
  query?: string
  actions?: ReactNode
}) {
  return (
    <article className="group border-b border-[var(--border)] px-4 py-5 transition-colors last:border-b-0 hover:bg-[var(--card-hover)]/55">
      <div className="flex gap-3 sm:gap-4">
        <img
          src="/frog-logo.png"
          alt=""
          className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border border-[var(--border)] bg-white object-cover sm:h-11 sm:w-11"
        />

        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[15px] font-semibold leading-5 text-[#576b95] dark:text-[#8aa4d6]">
            张小龙
          </p>

          <p className="break-words text-[15px] font-medium leading-7 tracking-normal text-[var(--foreground)] sm:text-base sm:leading-8">
            <HighlightText text={entry.content} query={query} />
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs leading-5 text-[var(--secondary)]">
            <span className="min-w-0 break-words">{formatEntryMetadata(entry)}</span>
            {actions && (
              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                {actions}
              </div>
            )}
          </div>

          {entry.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className={`tag ${tagClassMap[tag] || 'tag-life'} opacity-75`}
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
}

export function QuoteCard({
  entry,
  eyebrow,
  metadata,
  actions,
}: {
  entry: DiaryEntry
  eyebrow?: string
  metadata?: string
  actions?: ReactNode
}) {
  return (
    <article className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-medium text-[var(--primary)]">{eyebrow}</p>
          )}
          <p className="text-sm text-[var(--secondary)]">
            {metadata ?? formatEntryMetadata(entry)}
          </p>
        </div>
        {actions}
      </div>

      <p className="text-2xl font-semibold leading-[1.75] tracking-normal sm:text-3xl">
        {entry.content}
      </p>

      {entry.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {entry.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={`tag ${tagClassMap[tag] || 'tag-life'}`}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export interface DiaryEntry {
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

export const tagClassMap: Record<string, string> = {
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

export function getTypeLabel(type: DiaryEntry['type']) {
  switch (type) {
    case 'repost':
      return '转发'
    case 'reply':
      return '回复'
    default:
      return '原创'
  }
}

export function getTypeIcon(type: DiaryEntry['type']) {
  switch (type) {
    case 'repost':
      return '转'
    case 'reply':
      return '回'
    default:
      return '原'
  }
}

export function formatEntryDate(entry: DiaryEntry) {
  const day = entry.date.split('-')[2]?.replace(/^0/, '') || ''
  return `${entry.year}年${entry.month}月${day}日`
}

export function formatCompactDate(entry: DiaryEntry) {
  const day = entry.date.split('-')[2] || '01'
  return `${entry.year}.${String(entry.month).padStart(2, '0')}.${day}`
}

export function formatTime(entry: DiaryEntry) {
  return entry.timestamp.split(' ')[1] || ''
}

export function formatEntryMetadata(entry: DiaryEntry) {
  const parts = [
    formatCompactDate(entry),
    `#${entry.num}`,
    getTypeLabel(entry.type),
    formatTime(entry),
  ].filter(Boolean)

  if (entry.extraInfo) {
    parts.push(entry.extraInfo)
  }

  return parts.join(' · ')
}

export function groupEntriesByMonth(entries: DiaryEntry[]) {
  return entries.reduce<Record<string, DiaryEntry[]>>((grouped, entry) => {
    const key = `${entry.year}-${String(entry.month).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
    return grouped
  }, {})
}

export function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split('-')
  return `${year}年${parseInt(month, 10)}月`
}

export function filterEntries(entries: DiaryEntry[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return entries

  return entries.filter((entry) =>
    [
      entry.content,
      entry.extraInfo,
      entry.date,
      entry.timestamp,
      entry.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
}

export function getDailyEntry(entries: DiaryEntry[], date: Date) {
  if (entries.length === 0) return null

  const validEntries = entries.filter((entry) => entry.content.trim())
  if (validEntries.length === 0) return entries[0]

  const dayKey = Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
      86_400_000
  )
  const index = Math.abs(dayKey * 97 + date.getFullYear()) % validEntries.length

  return validEntries[index]
}

export function getRandomEntry(entries: DiaryEntry[], excludeIds: Set<number>) {
  if (entries.length === 0) return null

  let candidates = entries.filter(
    (entry) => entry.content.trim() && !excludeIds.has(entry.id)
  )

  if (candidates.length === 0) {
    candidates = entries.filter((entry) => entry.content.trim())
  }

  if (candidates.length === 0) return entries[0]

  const index = Math.floor(Math.random() * candidates.length)
  return candidates[index]
}

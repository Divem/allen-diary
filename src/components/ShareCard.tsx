'use client'

import { useRef, useState } from 'react'

interface ShareCardProps {
  content: string
  date: string
  timestamp: string
  tags: string[]
  onClose: () => void
}

export default function ShareCard({ content, date, timestamp, tags, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split('-')
    const time = timeStr.split(' ')[1]
    return `${year}.${parseInt(month)}.${parseInt(day)} ${time}`
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      '产品哲学': '#FF6B6B',
      '用户洞察': '#4ECDC4',
      '互联网思考': '#45B7D1',
      '技术观点': '#96CEB4',
      '读书笔记': '#F59E0B',
      '生活随笔': '#DDA0DD',
      '幽默段子': '#FF8C94',
      '转发引用': '#60A5FA',
      '饭否相关': '#FB923C',
      '苹果相关': '#6B7280',
      'Google': '#EF4444',
      '微信相关': '#10B981',
      '哲学思考': '#8B5CF6',
      '管理思考': '#14B8A6',
    }
    return colors[tag] || '#6B7280'
  }

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)

    try {
      const html2canvas = (await import('html2canvas')).default

      if (typeof html2canvas !== 'function') {
        throw new Error('html2canvas 加载失败')
      }

      const element = cardRef.current
      await new Promise((resolve) => setTimeout(resolve, 300))

      const canvas = await html2canvas(element, {
        scale: 4,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const link = document.createElement('a')
      link.download = `allen-diary-${date}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsDownloading(false)
    } catch (error) {
      console.error('生成图片失败:', error)
      setIsDownloading(false)
      alert('生成图片失败: ' + (error as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">分享卡片</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--card-hover)] transition-colors text-[var(--secondary)]"
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Card Preview */}
        <div className="mb-6 flex justify-center">
          <div
            ref={cardRef}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              width: '360px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                height: '3px',
                width: '100%',
                background: 'linear-gradient(90deg, #F472B6, #FB923C)',
              }}
            />

            {/* Header */}
            <div style={{ padding: '28px 28px 20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F472B6, #FB923C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  龙
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>
                    张小龙
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.3, marginTop: '2px' }}>
                    饭否日记
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {formatDateTime(date, timestamp)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '0 28px 28px 28px' }}>
              <p
                style={{
                  fontSize: '17px',
                  lineHeight: 1.75,
                  fontWeight: 500,
                  color: '#1F2937',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  letterSpacing: '0.01em',
                  margin: 0,
                }}
              >
                {content}
              </p>

              {/* Tags */}
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px' }}>
                  {tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#ffffff',
                        backgroundColor: getTagColor(tag),
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '24px',
                }}
              >
                <div style={{ height: '1px', flex: 1, background: '#E5E7EB' }} />
                <div style={{ fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  @gzallen
                </div>
                <div style={{ height: '1px', flex: 1, background: '#E5E7EB' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isDownloading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                生成中...
              </>
            ) : (
              <>
                <span>⬇️</span>
                下载卡片
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

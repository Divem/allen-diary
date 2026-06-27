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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

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

  const handleCopy = async () => {
    const text = `${content}\n\n${formatDateTime(date, timestamp)} · 张小龙饭否日记`

    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 1600)
    } catch {
      setCopyStatus('failed')
      window.setTimeout(() => setCopyStatus('idle'), 1600)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm" onClick={onClose}>
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 text-white">
        <div>
          <h2 className="text-base font-semibold">分享预览</h2>
          <p className="text-xs text-white/60">长按图片也可保存</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
          aria-label="关闭"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 卡片预览 - 占据主要空间，方便截图 */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div
          ref={cardRef}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            width: '360px',
            maxWidth: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
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

      {/* 底部操作栏 */}
      <div className="px-4 pb-6 pt-2 grid grid-cols-3 gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="px-4 py-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          返回阅读
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copyStatus === 'copied'
            ? '已复制'
            : copyStatus === 'failed'
              ? '复制失败'
              : '复制文字'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-4 py-3 rounded-full bg-white text-gray-900 hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              生成中
            </>
          ) : (
            <>
              <span>⬇️</span>
              保存图片
            </>
          )}
        </button>
      </div>
    </div>
  )
}

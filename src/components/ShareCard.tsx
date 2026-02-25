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

  // 格式化日期和时间
  const formatDateTime = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split('-')
    const time = timeStr.split(' ')[1]
    return `${year}.${parseInt(month)}.${parseInt(day)} ${time}`
  }

  // 获取标签颜色
  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      '产品哲学': '#FF6B6B',
      '用户洞察': '#4ECDC4',
      '互联网思考': '#45B7D1',
      '技术观点': '#96CEB4',
      '读书笔记': '#FFEAA7',
      '生活随笔': '#DDA0DD',
      '幽默段子': '#FF8C94',
      '转发引用': '#87CEEB',
      '饭否相关': '#FFA07A',
      '苹果相关': '#6B7280',
      'Google': '#EF4444',
      '微信相关': '#10B981',
      '哲学思考': '#8B5CF6',
      '管理思考': '#14B8A6',
    }
    return colors[tag] || '#6B7280'
  }

  // 下载图片
  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)

    try {
      const html2canvas = (await import('html2canvas')).default

      if (typeof html2canvas !== 'function') {
        throw new Error('html2canvas 加载失败')
      }

      const element = cardRef.current
      await new Promise(resolve => setTimeout(resolve, 300))

      // 使用更高的 scale 提高清晰度
      const canvas = await html2canvas(element, {
        scale: 4, // 提高到 4 倍清晰度
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        letterRendering: true, // 更好的文字渲染
      })

      const link = document.createElement('a')
      link.download = `allen-diary-${date}.png`
      link.href = canvas.toDataURL('image/png', 1.0) // 最高质量
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">分享卡片</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 卡片预览 */}
        <div className="mb-4 flex justify-center">
          <div
            ref={cardRef}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              backgroundColor: '#ffffff',
              width: '360px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            {/* 顶部信息区 */}
            <div style={{ padding: '24px 24px 16px 24px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F472B6, #FB923C)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    龙
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', lineHeight: '1.2' }}>张小龙</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.2' }}>饭否日记</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {formatDateTime(date, timestamp)}
                </div>
              </div>
            </div>

            {/* 内容区 */}
            <div style={{ padding: '0 24px 20px 24px', backgroundColor: '#ffffff' }}>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  fontWeight: '500',
                  color: '#1F2937',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {content}
              </p>
            </div>

            {/* 底部信息 */}
            <div style={{ padding: '0 24px 20px 24px', backgroundColor: '#ffffff' }}>
              {/* 标签 */}
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: '#ffffff',
                        backgroundColor: getTagColor(tag),
                        whiteSpace: 'nowrap',
                        lineHeight: '1',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 分隔线和 @gzallen */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ height: '1px', flex: '1', background: 'linear-gradient(90deg, transparent, #E5E7EB)' }}></div>
                <div style={{ fontSize: '11px', color: '#D1D5DB', whiteSpace: 'nowrap', fontWeight: '500' }}>@gzallen</div>
                <div style={{ height: '1px', flex: '1', background: 'linear-gradient(90deg, #E5E7EB, transparent)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
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

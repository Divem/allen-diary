import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '张小龙饭否日记',
  description: '优雅地阅读张小龙的饭否思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}

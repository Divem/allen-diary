import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: '张小龙饭否日记',
  description: '优雅地阅读张小龙的饭否思考',
  manifest: '/manifest.webmanifest',
  applicationName: '张小龙饭否日记',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '饭否日记',
  },
  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

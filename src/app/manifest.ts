import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '张小龙饭否日记',
    short_name: '饭否日记',
    description: '移动友好的张小龙饭否日记阅读应用',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

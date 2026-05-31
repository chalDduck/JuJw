import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingCTA from '@/components/layout/FloatingCTA'
import { getSiteUrl } from '@/lib/env'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
})

const siteUrl = getSiteUrl().replace(/\/$/, '')
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION
const naverVerification = process.env.NAVER_SITE_VERIFICATION
const verification = {
  ...(googleVerification ? { google: googleVerification } : {}),
  ...(naverVerification ? { other: { 'naver-site-verification': naverVerification } } : {}),
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JU JEWELRY | 종로 귀금속 도매',
    template: '%s | JU JEWELRY',
  },
  description: '종로 종묘귀금속에 위치한 주얼리 도매 전문점. 반지, 목걸이, 귀걸이, 팔찌 등 다양한 귀금속 제품을 도매가로 제공합니다.',
  keywords: ['주얼리 도매', '귀금속 도매', '종로 귀금속', '반지 도매', '목걸이 도매'],
  openGraph: {
    title: 'JU JEWELRY | 종로 귀금속 도매',
    description:
      '종로 종묘귀금속에 위치한 주얼리 도매 전문점. 반지, 목걸이, 귀걸이, 팔찌 등 다양한 귀금속 제품을 제공합니다.',
    url: siteUrl,
    siteName: 'JU JEWELRY',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JU JEWELRY 주얼리 쇼룸',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JU JEWELRY | 종로 귀금속 도매',
    description:
      '종로 종묘귀금속에 위치한 주얼리 도매 전문점. 반지, 목걸이, 귀걸이, 팔찌 등 다양한 귀금속 제품을 제공합니다.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${display.variable} font-sans bg-bg-primary text-text-default`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}

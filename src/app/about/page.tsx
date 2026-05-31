import type { Metadata } from 'next'
import AboutBrandStoryPage from '@/components/about/AboutBrandStoryPage'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '브랜드 소개',
  description: 'JU JEWELRY의 브랜드 스토리와 제작 철학을 소개합니다.',
  path: '/about',
})

export default async function AboutPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return <AboutBrandStoryPage settings={settings} />
}

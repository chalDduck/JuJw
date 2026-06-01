import type { Metadata } from 'next'
import TradeInformationPage from '@/components/trade/TradeInformationPage'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '거래 안내',
  description: '주문, 결제, 배송, 교환과 A/S까지 JU JEWELRY의 거래 기준을 간단하게 확인할 수 있습니다.',
  path: '/trade',
  image: '/img/trade-generated/trade-hero-desktop.png',
  imageAlt: 'JU JEWELRY 거래 안내',
})

export default async function TradePage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '거래 안내', path: '/trade' }]} />
      <TradeInformationPage settings={settings} />
    </>
  )
}

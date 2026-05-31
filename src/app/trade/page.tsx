import type { Metadata } from 'next'
import TradeInformationPage from '@/components/trade/TradeInformationPage'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '거래 안내',
  description: '주문, 결제, 배송, 교환과 A/S까지 JU JEWELRY의 거래 기준을 간단하게 확인할 수 있습니다.',
  path: '/trade',
})

export default async function TradePage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return <TradeInformationPage settings={settings} />
}

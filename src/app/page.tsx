import { getProducts, getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import HomeView, { type HomeProduct } from '@/components/home/HomeView'
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/metadata'
import {
  buildJewelryStoreJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export const metadata = buildPageMetadata({
  title: 'JU JEWELRY',
  description:
    '종로 종묘귀금속에 위치한 주얼리 도매 전문점. 반지, 목걸이, 귀걸이, 팔찌 등 다양한 귀금속 제품을 도매가로 제공합니다.',
  path: '/',
})

export default async function Home() {
  const [settingsMap, featured] = await Promise.all([
    getPublicSettings(),
    getProducts({ featured: true, published: true, limit: 6 }),
  ])

  let products = featured
  if (products.length === 0) {
    products = await getProducts({ published: true, limit: 6 })
  }

  const settings = normalizeSiteSettings(settingsMap)
  const featuredProducts: HomeProduct[] = products.map((product) => ({
    id: product.id,
    categoryName: product.categoryName,
    categorySlug: product.categorySlug,
    imageUrl: product.imageUrl,
    name: product.name,
    slug: product.slug,
    spec: product.spec,
  }))

  return (
    <>
      <JsonLd id="organization-jsonld" data={buildOrganizationJsonLd(settings)} />
      <JsonLd id="website-jsonld" data={buildWebSiteJsonLd(settings)} />
      <JsonLd id="jewelry-store-jsonld" data={buildJewelryStoreJsonLd(settings)} />
      <HomeView settings={settings} featuredProducts={featuredProducts} />
    </>
  )
}

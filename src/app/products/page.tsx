import ProductsShowcasePage from '@/components/products/ProductsShowcasePage'
import { getCategories, getProducts, getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildPageMetadata({
  title: '주얼리 도매 컬렉션',
  description:
    '반지, 목걸이, 귀걸이, 팔찌 등 JU JEWELRY의 주얼리 도매 컬렉션과 추천 제품을 확인해 보세요.',
  path: '/products',
})

export default async function ProductsPage() {
  const [categories, products, rawSettings] = await Promise.all([
    getCategories(),
    getProducts({ published: true }),
    getPublicSettings(),
  ])

  return (
    <ProductsShowcasePage
      categories={categories}
      products={products}
      settings={normalizeSiteSettings(rawSettings)}
    />
  )
}

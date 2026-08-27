import ProductCatalog from '@/components/products/ProductCatalog'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { getCategories, getProducts } from '@/lib/public-data'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = buildPageMetadata({
  title: '주얼리 도매 컬렉션',
  description:
    '반지, 목걸이, 귀걸이, 팔찌 등 JU JEWELRY의 주얼리 도매 컬렉션을 카테고리별로 한 화면에서 둘러보세요.',
  path: '/products',
  image: '/img/products-generated/products-hero-desktop.png',
  imageAlt: 'JU JEWELRY 주얼리 도매 컬렉션',
})

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ published: true }),
  ])

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '제품', path: '/products' }]} />
      <ProductCatalog categories={categories} products={products} initialCategory="all" />
    </>
  )
}

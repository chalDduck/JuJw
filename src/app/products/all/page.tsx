import type { Metadata } from 'next'
import ProductsListPage from '@/components/products/ProductsListPage'
import { getCategories, getProducts } from '@/lib/db'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '전체 제품 목록',
  description: 'Ju 주얼리 컬렉션의 전체 제품을 카테고리별로 확인해 보세요.',
  path: '/products/all',
})

export default async function ProductsAllPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ published: true }),
  ])

  return <ProductsListPage categories={categories} products={products} />
}

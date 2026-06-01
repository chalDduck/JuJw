import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductCatalog from '@/components/products/ProductCatalog'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/db'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    return {
      title: '카테고리',
    }
  }

  const products = await getProducts({
    category: category.slug,
    published: true,
  })

  return buildPageMetadata({
    title: `${category.name} 도매`,
    description: `${category.name} 카테고리 라인업과 스펙을 확인하고 상담을 요청해 보세요.`,
    path: `/products/${category.slug}`,
    image: products[0]?.imageUrl || '/og-image.png',
    imageAlt: `${category.name} 도매 컬렉션`,
  })
}

export default async function ProductCategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(params.category),
    getCategories(),
    getProducts({ published: true }),
  ])

  if (!category) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '제품', path: '/products' },
          { name: category.name, path: `/products/${category.slug}` },
        ]}
      />
      <ProductCatalog categories={categories} products={products} initialCategory={category.slug} />
    </>
  )
}

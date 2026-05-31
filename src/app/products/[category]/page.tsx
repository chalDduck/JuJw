
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import JsonLd from '@/components/seo/JsonLd'
import { getCategoryBySlug, getProducts } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

const GENERIC_PRODUCT_PLACEHOLDER = '/img/hero/hero.png'

const categoryFallbackImages: Record<string, string[]> = {
  bracelets: ['/img/products-generated/category-bracelet-portrait.png'],
  earrings: ['/img/products-generated/category-earrings-portrait.png'],
  necklaces: ['/img/products-generated/category-necklace-portrait.png'],
  rings: ['/img/products-generated/category-ring-portrait.png'],
}

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

  return buildPageMetadata({
    title: `${category.name} 도매`,
    description: `${category.name} 카테고리 라인업과 스펙을 확인하고 상담을 요청해 보세요.`,
    path: `/products/${category.slug}`,
    image: categoryFallbackImages[category.slug]?.[0] ?? '/og-image.png',
    imageAlt: `${category.name} 도매 컬렉션`,
  })
}

export default async function ProductCategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  const products = await getProducts({
    category: category.slug,
    published: true,
  })

  const siteUrl = getSiteUrl().replace(/\/$/, '')

  const resolveProductImage = (imageUrl: string | null, index: number) => {
    if (
      imageUrl &&
      imageUrl !== GENERIC_PRODUCT_PLACEHOLDER &&
      !imageUrl.startsWith('products/')
    ) {
      return imageUrl
    }

    const candidates = categoryFallbackImages[category.slug] ?? ['/img/products-generated/category-necklace-portrait.png']
    return candidates[index % candidates.length]
  }

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <JsonLd
        id="breadcrumb-jsonld"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: '홈',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: '제품',
              item: `${siteUrl}/products`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: category.name,
              item: `${siteUrl}/products/${category.slug}`,
            },
          ],
        }}
      />

      <section className="public-hero px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Category</p>
          <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
            {category.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">해당 카테고리의 대표 라인업입니다.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${category.slug}/${product.slug}`}
                className="group block overflow-hidden border border-[#ded2c6] bg-[#fbf8f4] shadow-[0_18px_42px_-34px_rgba(72,46,31,0.42)] transition-transform duration-300 hover:-translate-y-1"
              >
                <ShowcaseImage
                  src={resolveProductImage(product.imageUrl, index)}
                  alt={product.name}
                  className="aspect-[3/4] overflow-hidden bg-[#efe5d9]"
                  imageClassName="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="border-t border-[#e6dacd] px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
                  <h2 className="text-[15px] font-semibold leading-6 text-[#2f241d] sm:text-[16px]">{product.name}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[#6b5c4f]">{product.spec || '상세 문의'}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#dfd0bf] py-12">
            <p className="text-[16px] font-semibold text-[#2f241d]">등록된 제품이 없습니다.</p>
            <p className="mt-3 text-[14px] leading-7 text-[#6b5c4f]">
              해당 카테고리 라인업은 상담을 통해 먼저 안내해 드릴 수 있습니다.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

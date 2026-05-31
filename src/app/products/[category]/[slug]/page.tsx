
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import JsonLd from '@/components/seo/JsonLd'
import { getProductBySlug, getProductImages } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

// 동적 경로 세그먼트가 퍼센트 인코딩(예: 한글 슬러그)된 채로 전달될 수 있어 안전하게 디코드합니다.
function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const GENERIC_PRODUCT_PLACEHOLDER = '/img/hero/hero.png'

const categoryFallbackImages: Record<string, string[]> = {
  bracelets: ['/img/products-generated/products-card-bracelet.png'],
  earrings: ['/img/products-generated/products-card-earrings.png'],
  necklaces: ['/img/products-generated/products-card-necklace.png'],
  rings: ['/img/products-generated/products-card-ring.png'],
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string }
}): Promise<Metadata> {
  const product = await getProductBySlug(decodeParam(params.category), decodeParam(params.slug))

  if (!product) {
    return {
      title: '제품 상세',
    }
  }

  const imageUrl =
    product.imageUrl &&
    product.imageUrl !== GENERIC_PRODUCT_PLACEHOLDER &&
    !product.imageUrl.startsWith('products/')
      ? product.imageUrl
      : categoryFallbackImages[decodeParam(params.category)]?.[0] ?? '/og-image.png'

  return buildPageMetadata({
    title: `${product.name} 도매`,
    description: product.spec || product.description || `${product.name} 상세 정보`,
    path: `/products/${params.category}/${params.slug}`,
    image: imageUrl,
    imageAlt: product.name,
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const category = decodeParam(params.category)
  const slug = decodeParam(params.slug)
  const product = await getProductBySlug(category, slug)

  if (!product) {
    notFound()
  }

  const images = await getProductImages(product.id)
  const primaryImage = images.find((image) => image.isPrimary)
  const fallbackCandidates = categoryFallbackImages[params.category] ?? ['/img/products-generated/products-card-necklace.png']
  const imageUrl =
    primaryImage?.url &&
    primaryImage.url !== GENERIC_PRODUCT_PLACEHOLDER &&
    !primaryImage.url.startsWith('products/')
      ? primaryImage.url
      : product.imageUrl &&
          product.imageUrl !== GENERIC_PRODUCT_PLACEHOLDER &&
          !product.imageUrl.startsWith('products/')
        ? product.imageUrl
        : fallbackCandidates[0]

  const siteUrl = getSiteUrl().replace(/\/$/, '')
  const productUrl = `${siteUrl}/products/${params.category}/${params.slug}`

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <JsonLd
        id="product-jsonld"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || product.spec || `${product.name} 제품 정보`,
          image: [
            imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
          ],
          sku: String(product.id),
          category: product.categoryName || params.category,
          brand: {
            '@type': 'Brand',
            name: 'JU JEWELRY',
          },
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'KRW',
            url: productUrl,
          },
        }}
      />
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
              name: product.categoryName || params.category,
              item: `${siteUrl}/products/${params.category}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: product.name,
              item: productUrl,
            },
          ],
        }}
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-[0.98fr_1.02fr] md:px-8 md:py-16">
        <ShowcaseImage
          src={imageUrl}
          alt={product.name}
          className="min-h-[340px] overflow-hidden border border-[#ded2c6] bg-[#fbf8f4] sm:min-h-[420px] md:min-h-[540px]"
          imageClassName="object-cover object-center"
        />

        <div className="border-y border-[#dfd0bf] py-7 sm:py-8 md:px-6 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">
            {product.categoryName || params.category}
          </p>
          <h1 className="mt-4 text-[1.9rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[2.8rem]">
            {product.name}
          </h1>
          <p className="mt-5 text-[15px] font-semibold text-[#4f3b2f]">{product.spec || '스펙 상담 가능'}</p>
          <p className="mt-5 whitespace-pre-line text-[14px] leading-7 text-[#6b5c4f]">
            {product.description || '제품 상세 정보는 상담을 통해 안내드립니다.'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-[48px] items-center justify-center bg-[#3d2d24] px-5 text-sm text-white">
              견적 문의
            </Link>
            <Link href={`/products/${params.category}`} className="inline-flex min-h-[48px] items-center justify-center border border-[#cdbba8] px-5 text-sm text-[#3d2d24]">
              카테고리로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

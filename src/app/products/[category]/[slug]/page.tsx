
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import ProductGallery from '@/components/products/ProductGallery'
import JsonLd from '@/components/seo/JsonLd'
import { getProductBySlug, getProductImages, getProducts } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'
import { buildPageMetadata } from '@/lib/metadata'
import { GENERIC_PRODUCT_PLACEHOLDER, resolveProductImage } from '@/lib/product-display'
import type { ProductImage } from '@/lib/models'

export const dynamic = 'force-dynamic'

// 동적 경로 세그먼트가 퍼센트 인코딩(예: 한글 슬러그)된 채로 전달될 수 있어 안전하게 디코드합니다.
function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

// 실제 등록된 이미지 URL인지(플레이스홀더·미업로드 키가 아닌지) 판별합니다.
function isUsableImage(url: string | null | undefined): url is string {
  return Boolean(url) && url !== GENERIC_PRODUCT_PLACEHOLDER && !url!.startsWith('products/')
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

  const imageUrl = isUsableImage(product.imageUrl)
    ? product.imageUrl
    : resolveProductImage(product, 0)

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

  const categorySlug = product.categorySlug || category
  const categoryName = product.categoryName || category

  const [images, categoryProducts] = await Promise.all([
    getProductImages(product.id),
    getProducts({ category: categorySlug, published: true }),
  ])

  // 대표 이미지를 먼저, 그다음 정렬 순서대로 정리합니다.
  const sortedImages = [...images].sort(
    (a: ProductImage, b: ProductImage) =>
      Number(b.isPrimary) - Number(a.isPrimary) || a.orderIndex - b.orderIndex || a.id - b.id
  )
  const usableImages = sortedImages.filter((image) => isUsableImage(image.url))
  const galleryImages =
    usableImages.length > 0
      ? usableImages.map((image) => ({ url: image.url, alt: image.altText || product.name }))
      : [{ url: resolveProductImage(product, 0), alt: product.name }]

  const relatedProducts = categoryProducts.filter((item) => item.id !== product.id).slice(0, 4)

  const siteUrl = getSiteUrl().replace(/\/$/, '')
  const productUrl = `${siteUrl}/products/${params.category}/${params.slug}`
  const primaryImage = galleryImages[0].url

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <JsonLd
        id="product-jsonld"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || product.spec || `${product.name} 제품 정보`,
          image: [primaryImage.startsWith('http') ? primaryImage : `${siteUrl}${primaryImage}`],
          sku: String(product.id),
          category: categoryName,
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
            { '@type': 'ListItem', position: 1, name: '홈', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: '제품', item: `${siteUrl}/products` },
            {
              '@type': 'ListItem',
              position: 3,
              name: categoryName,
              item: `${siteUrl}/products/${categorySlug}`,
            },
            { '@type': 'ListItem', position: 4, name: product.name, item: productUrl },
          ],
        }}
      />

      <nav
        aria-label="현재 위치"
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 pt-2 text-[12px] text-[#8a7566] sm:px-6 md:px-8"
      >
        <Link href="/products" className="transition-colors hover:text-[#5f4332]">
          제품
        </Link>
        <ChevronRight size={13} strokeWidth={1.7} className="text-[#bfae9d]" />
        <Link href={`/products/${categorySlug}`} className="transition-colors hover:text-[#5f4332]">
          {categoryName}
        </Link>
        <ChevronRight size={13} strokeWidth={1.7} className="text-[#bfae9d]" />
        <span className="font-semibold text-[#5f4332]">{product.name}</span>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:grid-cols-[0.98fr_1.02fr] md:px-8 md:py-12">
        <ProductGallery images={galleryImages} name={product.name} />

        <div className="flex flex-col border-y border-[#dfd0bf] py-7 sm:py-8 md:px-6 md:py-10">
          <Link
            href={`/products/${categorySlug}`}
            className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52] transition-colors hover:text-[#7a5a3c]"
          >
            {categoryName}
          </Link>
          <h1 className="mt-4 text-[1.9rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[2.8rem]">
            {product.name}
          </h1>
          <p className="mt-5 text-[15px] font-semibold text-[#4f3b2f]">
            {product.spec || '스펙 상담 가능'}
          </p>
          <p className="mt-5 whitespace-pre-line text-[14px] leading-7 text-[#6b5c4f]">
            {product.description || '제품 상세 정보는 상담을 통해 안내드립니다.'}
          </p>

          <div className="mt-6 border-t border-[#e9ded3] pt-5">
            <p className="text-[12px] tracking-[0.18em] text-[#a77c52]">PRICE</p>
            <p className="mt-1 text-[1.2rem] font-semibold text-[#3d2d24]">가격 문의</p>
            <p className="mt-1 text-[13px] leading-6 text-[#8a7566]">
              가격과 재고는 상담 시점 기준으로 정확히 안내됩니다.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-[#3d2d24] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5a4031]"
            >
              견적 문의
            </Link>
            <Link
              href={`/products/${categorySlug}`}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center border border-[#cdbba8] px-5 text-sm font-semibold text-[#3d2d24] transition-colors hover:bg-white"
            >
              목록으로
            </Link>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 md:px-8 md:pb-20">
          <div className="mb-5 flex items-end justify-between gap-4 border-t border-[#dfd0bf] pt-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">More from</p>
              <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[#2f241d]">
                {categoryName} 추천
              </h2>
            </div>
            <Link
              href={`/products/${categorySlug}`}
              className="hidden text-[14px] font-semibold text-[#8a6c59] transition-colors hover:text-[#5f4332] sm:inline-flex"
            >
              더 보기
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
            {relatedProducts.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

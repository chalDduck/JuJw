'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import ProductCard from './ProductCard'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/lib/models'

const ALL_CATEGORY = 'all'
const COLLECTION_HERO_IMAGE = '/img/ju-products-generated/ju-product-08-staged-v2.webp'
const COLLECTION_HERO_MOBILE_IMAGE = '/img/ju-products-generated/ju-product-08-staged-v2.webp'

type ProductCatalogProps = {
  categories: Category[]
  products: Product[]
  /** 처음 선택돼 있을 카테고리 slug. 미지정이면 "전체". */
  initialCategory?: string
}

/**
 * 컬렉션 카탈로그.
 * /products(전체) 와 /products/[category](해당 탭 선택) 가 동일한 화면을 공유하고,
 * 카테고리 탭은 페이지 이동 없이 그 자리에서 즉시 목록을 필터링합니다.
 */
export default function ProductCatalog({
  categories,
  products,
  initialCategory = ALL_CATEGORY,
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  // 다른 카테고리 URL로 직접 진입(딥링크)했을 때 선택 상태를 맞춰줍니다.
  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])

  const deferredCategory = useDeferredValue(activeCategory)

  const orderedCategories = useMemo(
    () => [...categories].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id),
    [categories]
  )

  const orderedProducts = useMemo(
    () =>
      [...products]
        .filter((product) => product.isPublished)
        .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id),
    [products]
  )

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of orderedProducts) {
      if (!product.categorySlug) continue
      counts.set(product.categorySlug, (counts.get(product.categorySlug) ?? 0) + 1)
    }
    return counts
  }, [orderedProducts])

  // 제품이 있는 카테고리만 노출하되, 현재 선택된 카테고리는 비어 있어도 유지합니다.
  const visibleCategories = useMemo(
    () =>
      orderedCategories.filter(
        (category) =>
          (countByCategory.get(category.slug) ?? 0) > 0 || category.slug === deferredCategory
      ),
    [orderedCategories, countByCategory, deferredCategory]
  )

  const isAll = deferredCategory === ALL_CATEGORY

  const activeCategoryObj = isAll
    ? null
    : orderedCategories.find((category) => category.slug === deferredCategory) ?? null

  const visibleProducts = useMemo(
    () =>
      isAll
        ? orderedProducts
        : orderedProducts.filter((product) => product.categorySlug === deferredCategory),
    [isAll, orderedProducts, deferredCategory]
  )

  const sectionLabel = activeCategoryObj ? activeCategoryObj.name : '전체 제품'

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#594233] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src={COLLECTION_HERO_IMAGE}
          mobileSrc={COLLECTION_HERO_MOBILE_IMAGE}
          alt="테디베어 팬던트 목걸이"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#594233]"
          imageClassName="object-cover object-[52%_68%] md:object-[52%_64%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(66,42,28,0.72)_0%,rgba(73,48,33,0.46)_48%,rgba(47,30,21,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(255,232,214,0.16),transparent_18%),radial-gradient(circle_at_38%_44%,rgba(255,238,220,0.12),transparent_22%)]" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-4 pb-16 pt-24 sm:min-h-[620px] sm:px-6 sm:pb-20 sm:pt-28 md:min-h-[760px] md:px-8 md:pt-32">
          <div className="max-w-[430px] text-white">
            <div className="mb-6 flex w-fit items-center gap-3 text-[#e6d1c0] md:mb-8">
              <span className="h-px w-6 bg-current/70" />
              <span className="text-[10px] tracking-[0.34em]">COLLECTION</span>
              <span className="h-px w-10 bg-current/40" />
            </div>
            <h1 className="text-[2.75rem] font-light leading-none tracking-[-0.05em] text-white sm:text-[4.2rem] md:text-[5.1rem]">
              컬렉션
            </h1>
            <p className="mt-6 text-[1.05rem] font-light leading-[1.8] tracking-[-0.02em] text-[#f1e3d7] sm:mt-8 md:text-[1.42rem]">
              섬세한 빛의 언어로 완성되는
              <br />
              당신만의 순간
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfd0bf] bg-[#f7f2eb] px-4 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto py-3 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={cn(
              'min-h-[44px] shrink-0 border px-5 text-[14px] font-semibold transition-colors active:translate-y-[1px]',
              activeCategory === ALL_CATEGORY
                ? 'border-[#4b3529] bg-[#4b3529] text-white'
                : 'border-[#d9c8b6] bg-[#fbf8f4] text-[#6b5c4f] hover:border-[#a98b70]'
            )}
          >
            전체 {orderedProducts.length}
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                'min-h-[44px] shrink-0 border px-5 text-[14px] font-semibold transition-colors active:translate-y-[1px]',
                activeCategory === category.slug
                  ? 'border-[#4b3529] bg-[#4b3529] text-white'
                  : 'border-[#d9c8b6] bg-[#fbf8f4] text-[#6b5c4f] hover:border-[#a98b70]'
              )}
            >
              {category.name} {countByCategory.get(category.slug) ?? 0}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-9 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-2 border-b border-[#dfd0bf] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#a77c52]">{sectionLabel}</p>
              <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-[#2f241d]">
                {visibleProducts.length}개 제품
              </h2>
            </div>
            <p className="text-[13px] leading-6 text-[#7b6a5e]">
              가격과 재고는 상담 시점 기준으로 정확히 안내됩니다.
            </p>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#dfd0bf] bg-[#fbf8f4] px-4 py-12 text-center sm:py-16">
              <p className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#2f241d]">
                등록된 제품이 없습니다
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[#6b5c4f]">
                선택한 카테고리는 상담을 통해 먼저 안내해 드릴 수 있습니다.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex min-h-[48px] items-center justify-center bg-[#3d2d24] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5a4031]"
              >
                상담 문의
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

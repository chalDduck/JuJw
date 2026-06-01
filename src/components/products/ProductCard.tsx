import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { resolveProductHref, resolveProductImage } from '@/lib/product-display'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/models'

type ProductCardProps = {
  product: Product
  index?: number
  badge?: string
  className?: string
}

/**
 * 컬렉션 전반에서 공통으로 쓰는 이미지 중심 그리드 카드.
 * 쇼케이스 미리보기 · 통합 카탈로그 · 상세 추천이 같은 디자인을 공유합니다.
 */
export default function ProductCard({ product, index = 0, badge, className }: ProductCardProps) {
  // spec → description 순으로 실제 정보를 우선 노출하고, 둘 다 없을 때만 안내 문구로 폴백합니다.
  // 잘림은 글자 수가 아니라 CSS line-clamp(줄 단위)로 처리합니다.
  const detailText =
    product.spec?.trim() || product.description?.trim() || '가격·스펙은 상담으로 안내해 드립니다.'

  return (
    <Link
      href={resolveProductHref(product)}
      className={cn(
        'group flex h-full flex-col overflow-hidden border border-[#ded2c6] bg-[#fbf8f4] shadow-[0_18px_42px_-34px_rgba(72,46,31,0.42)] transition-transform duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="relative overflow-hidden bg-[#efe5d9]">
        {badge ? (
          <span className="absolute left-3 top-3 z-10 bg-[#a88a6e] px-2.5 py-1 text-[10px] tracking-[0.2em] text-white">
            {badge}
          </span>
        ) : null}
        <ShowcaseImage
          src={resolveProductImage(product, index)}
          alt={product.name}
          className="aspect-[1/0.78]"
          imageClassName="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-[#e6dacd] px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4 md:px-5">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-[#a77c52]">
          {product.categoryName || '컬렉션'}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-[2.9rem] break-words text-[1.08rem] font-semibold leading-[1.35] tracking-[-0.04em] text-[#2f241d] sm:min-h-[3.2rem] sm:text-[1.18rem]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[3rem] break-words text-[13px] leading-6 text-[#6b5c4f]">
          {detailText}
        </p>
        <p className="mt-auto inline-flex items-center gap-2 pt-3 text-[13px] font-semibold text-[#5f4332]">
          상세 보기
          <ArrowRight size={15} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  )
}

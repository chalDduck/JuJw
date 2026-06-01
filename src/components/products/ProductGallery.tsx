'use client'

import { useState } from 'react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'

type GalleryImage = {
  url: string
  alt: string
}

type ProductGalleryProps = {
  images: GalleryImage[]
  name: string
}

/**
 * 상세 페이지 이미지 갤러리.
 * 이미지가 한 장이면 단일 이미지로, 여러 장이면 메인 + 썸네일 전환 UI로 표시합니다.
 */
export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.length > 0 ? images : [{ url: '', alt: name }]
  const active = safeImages[activeIndex] ?? safeImages[0]

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <ShowcaseImage
        src={active.url}
        alt={active.alt || name}
        className="min-h-[340px] overflow-hidden border border-[#ded2c6] bg-[#fbf8f4] sm:min-h-[420px] md:min-h-[540px]"
        imageClassName="object-cover object-center"
      />

      {safeImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
          {safeImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              aria-label={`${name} 이미지 ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'overflow-hidden border bg-[#fbf8f4] transition-colors',
                index === activeIndex
                  ? 'border-[#4b3529]'
                  : 'border-[#ded2c6] hover:border-[#a98b70]'
              )}
            >
              <ShowcaseImage
                src={image.url}
                alt={image.alt || `${name} ${index + 1}`}
                className="aspect-square"
                imageClassName="object-cover object-center"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

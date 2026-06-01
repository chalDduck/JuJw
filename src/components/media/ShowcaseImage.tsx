/* eslint-disable @next/next/no-img-element */

import { cn } from '@/lib/utils'

type ShowcaseImageProps = {
  src: string
  alt: string
  mobileSrc?: string
  className?: string
  overlayClassName?: string
  imageClassName?: string
  fit?: 'contain' | 'cover'
  loading?: 'eager' | 'lazy'
}

function toWebpSrc(src: string): string | null {
  if (!src.startsWith('/') || src.includes('?')) return null
  if (!/\.(png|jpe?g)$/i.test(src)) return null
  return src.replace(/\.(png|jpe?g)$/i, '.webp')
}

export default function ShowcaseImage({
  src,
  alt,
  mobileSrc,
  className,
  overlayClassName,
  imageClassName,
  fit = 'cover',
  loading = 'lazy',
}: ShowcaseImageProps) {
  const objectFitClass = fit === 'cover' ? 'object-cover' : 'object-contain'
  const webpSrc = toWebpSrc(src)
  const mobileWebpSrc = mobileSrc ? toWebpSrc(mobileSrc) : null

  return (
    <div className={cn('relative overflow-hidden bg-[#e8ddd2]', className)}>
      <picture className="block h-full w-full">
        {mobileWebpSrc ? (
          <source media="(max-width: 767px)" srcSet={mobileWebpSrc} type="image/webp" />
        ) : null}
        {mobileSrc ? <source media="(max-width: 767px)" srcSet={mobileSrc} /> : null}
        {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={loading === 'eager' ? 'high' : undefined}
          className={cn('h-full w-full', objectFitClass, imageClassName)}
        />
      </picture>
      {overlayClassName ? <div className={cn('absolute inset-0', overlayClassName)} /> : null}
    </div>
  )
}
